import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthstore";
import Peer from "simple-peer/simplepeer.min.js"; // Import simple-peer

export const useChatStore = create((set, get) => ({
    messages: [],
    // NOTE: Keep 'users' initialized as []
    users: [], 
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,

    // WebRTC State
    peer: null,
    localStream: null,
    remoteStream: null,
    isCalling: false,
    
    // NEW STATE for Incoming Call Modal/Popup
    isReceivingCall: false, // Tracks if a call is incoming and awaiting user input
    incomingCall: null, // Stores { from: userId, fromName: fullName, signalData: offer }

    // --- Core Chat Functions ---
    getUsers: async () => {
        set({ isUserLoading: true })
        try {
            const res = await axiosInstance.get("/messages/users")
            // CRITICAL FIX: Ensure we always set an array
            const usersData = Array.isArray(res.data) ? res.data : []
            set({ users: usersData })
        }
        catch (error) {
            // FIX: Suppress toast for 401/403 errors, as this is expected if a user is not logged in
            if (error.response?.status !== 401 && error.response?.status !== 403) {
                toast.error(error.response?.data?.message || "Failed to fetch users.");
            }
            set({ users: [] })
        }
        finally {
            set({ isUserLoading: false })
        }
    },
    // ... (getMessages, sendMessage functions remain unchanged)
    getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages.");
    } finally {
      set({ isMessagesLoading: false });
    }
    },
    sendMessage:async(messageData)=>{
        const {selectedUser,messages}=get()
        try{
            const res=await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData)
            set({messages:[...messages,res.data]})
        }
        catch(error){
            toast.error(error.response?.data?.message || "Failed to send message.");
        }

    },
    subscribeToMessages: () => {
        const { selectedUser } = get()
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on('newMessage', (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;

            set({ messages: [...get().messages, newMessage] })
        })

        // --- Added WebRTC Signal Receiver ---
        socket.on("signal", get().handleSignal);
        socket.on("incomingCall", get().handleIncomingCall);
        socket.on("callEnded", get().handleCallEnded);
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off('newMessage');
        // --- Clean up WebRTC listeners ---
        socket.off("signal");
        socket.off("incomingCall");
        socket.off("callEnded");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser, isCalling: false, remoteStream: null, localStream: null, peer: null }),


    // --- WebRTC Call Logic ---

    // 1. Initiate Call
    startCall: async (receiverId) => {
        if (get().isCalling) {
            toast.error("Already in a call.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            set({ localStream: stream, isCalling: true });

            // Create a new Peer (initiator: true)
            const peer = new Peer({
                initiator: true,
                trickle: false,
                stream: stream,
                config: {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' }
                    ]
                }
            });

            // Signaling event: send SDP offer/answer/candidates via Socket.IO
            peer.on('signal', data => {
                useAuthStore.getState().socket.emit('signal', {
                    to: receiverId,
                    signalData: data,
                });
            });

            // Stream event: remote stream received
            peer.on('stream', remoteStream => {
                set({ remoteStream });
                toast.success(`Connected to ${get().selectedUser.fullName}!`);
            });

            peer.on('close', get().endCall);
            peer.on('error', (err) => {
                console.error('Peer error', err);
                toast.error("Call failed or disconnected.");
                get().endCall();
            });

            set({ peer });

            // Notify the selected user about the incoming call
            useAuthStore.getState().socket.emit('callUser', {
                userToCall: receiverId,
                from: useAuthStore.getState().authUser._id,
                fromName: useAuthStore.getState().authUser.fullName,
            });

            toast.success(`Calling ${get().selectedUser.fullName}...`);

        } catch (error) {
            console.error("Error accessing media devices:", error);
            toast.error("Failed to access camera/microphone. Please check permissions.");
            set({ isCalling: false });
        }
    },

    // 2. Handle Incoming Call (Modified for UI Pop-up)
    handleIncomingCall: async ({ from, fromName }) => {
        if (get().isCalling || get().isReceivingCall) {
            // Busy or already receiving, implicitly reject new call by emitting endCall
            useAuthStore.getState().socket.emit('endCall', { to: from });
            return;
        }

        // CRITICAL: Set state to show the pop-up/notification
        set({
            isReceivingCall: true,
            // Only store essential info for the pop-up
            incomingCall: { from, fromName }, 
        });
        
        // No toast/window.confirm here, the UI will display the notification.
    },
    
    // 3. Answer Call (Modified to receive and use buffered offer)
    answerCall: async (callerId, initialSignalData) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            set({ localStream: stream, isCalling: true });

            // Create a new Peer (initiator: false)
            const peer = new Peer({
                initiator: false,
                trickle: false,
                stream: stream,
                config: {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' }
                    ]
                }
            });

            peer.on('signal', data => {
                useAuthStore.getState().socket.emit('signal', {
                    to: callerId,
                    signalData: data,
                });
            });

            peer.on('stream', remoteStream => {
                set({ remoteStream });
                toast.success("Call connected!");
            });

            peer.on('close', get().endCall);
            peer.on('error', (err) => {
                console.error('Peer error', err);
                toast.error("Call failed or disconnected.");
                get().endCall();
            });

            set({ peer });

            // CRITICAL FIX: Signal the peer with the initial offer received
            if (initialSignalData) {
                peer.signal(initialSignalData);
            }

        } catch (error) {
            console.error("Error accessing media devices:", error);
            toast.error("Failed to access camera/microphone. Check permissions.");
            get().endCall();
        }
    },

    // 4. Signal Exchange Handler (Modified to buffer/process signal)
    handleSignal: ({ from, signalData }) => {
        const { peer, selectedUser, isReceivingCall, incomingCall } = get();

        // 1. Always process signals for the existing peer
        if (peer && !peer.destroyed && from === selectedUser?._id) {
            peer.signal(signalData);
            return;
        }

        // 2. Handle initial OFFER for incoming call
        if (!peer && signalData.type === 'offer') {
            
            // If the call is incoming (awaiting user action), buffer the offer with the incomingCall state.
            if (isReceivingCall && incomingCall?.from === from) {
                set({
                    // Store the signal data with the incomingCall object for later processing
                    incomingCall: { ...incomingCall, signalData: signalData } 
                });
                // Do NOT call answerCall yet. Wait for user action.
                return;
            }
            
            // Fallback for implicit call/answer (shouldn't happen with the new UI flow)
            if (from === selectedUser?._id) {
                 get().answerCall(from, signalData);
            }
        }
    },
    
    // NEW ACTION: Called by UI when user clicks 'Accept'
    acceptCall: async () => {
        const { incomingCall } = get();
        if (!incomingCall) return;
        
        // 1. Select the caller's chat automatically
        const users = get().users;
        const caller = users.find(u => u._id === incomingCall.from);
        
        if (caller) {
            set({ selectedUser: caller });
        }
        
        // 2. Clear incoming state *before* starting media
        set({ isReceivingCall: false, incomingCall: null });

        // 3. Initiate the Answer Peer Connection using the buffered offer
        // If the signalData (the offer) is available, use it immediately.
        if (incomingCall.signalData) {
            get().answerCall(incomingCall.from, incomingCall.signalData);
        } else {
             // Fallback: This is a weak spot. It means the OFFER was missed. 
             // Ideally, the caller should re-send the offer after receiving a custom 'callAccepted' signal.
             toast.error("Call accepted, but signal offer was missed. Connection may fail.");
             get().answerCall(incomingCall.from);
        }
    },
    
    // NEW ACTION: Called by UI when user clicks 'Reject'
    rejectCall: () => {
        const { incomingCall } = get();
        if (!incomingCall) return;

        // Send a custom message/signal back to the caller to end their side
        // Using 'endCall' socket event is standard for simplicity.
        useAuthStore.getState().socket.emit('endCall', { to: incomingCall.from });
        
        // Clean up receiver state
        set({ isReceivingCall: false, incomingCall: null });
        toast.error(`Call from ${incomingCall.fromName} rejected.`);
    },


    // 5. End Call
    endCall: (sendSignal = true) => {
        const { peer, localStream, selectedUser } = get();
        
        if (peer && !peer.destroyed) {
            peer.destroy();
        }

        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }

        if (sendSignal && selectedUser) {
            useAuthStore.getState().socket.emit('endCall', { to: selectedUser._id });
        }
        
        set({ 
            peer: null, 
            localStream: null, 
            remoteStream: null, 
            isCalling: false,
            isReceivingCall: false, // Ensure this is cleared
            incomingCall: null, // Ensure this is cleared
        });
    },

    // 6. Handle Remote Call End
    handleCallEnded: () => {
        // Automatically end call when remote party hangs up
        get().endCall(false); // don't send endCall signal back
        toast.info(`${get().selectedUser?.fullName} ended the call.`);
    }

}));