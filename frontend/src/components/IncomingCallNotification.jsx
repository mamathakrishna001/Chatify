import { Phone, PhoneOff, Video } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthstore";

// NOTE: You must provide a valid audio file path for ringtone.
// For this example, we assume you have a /ringtone.mp3 file in your public directory.
const RINGTONE_PATH = "/ringtone.mp3"; 

const IncomingCallNotification = () => {
    const { isReceivingCall, incomingCall, users, acceptCall, rejectCall } = useChatStore();
    const audioRef = useRef(null);

    // Find the caller's full details (needed for profilePic)
    const callerDetails = users.find(u => u._id === incomingCall?.from);
    const callerName = incomingCall?.fromName || "Unknown Caller";
    const callerPic = callerDetails?.profilePic || "/avatar.png";

    // Effect to control the audio playback
    useEffect(() => {
        if (isReceivingCall) {
            if (audioRef.current) {
                audioRef.current.loop = true;
                // Use a non-promise approach for basic compatibility; 
                // A better approach would be to handle the returned Promise.
                audioRef.current.play().catch(e => console.log("Ringtone failed to play:", e)); 
            }
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }
        // Cleanup function
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, [isReceivingCall]);
    
    if (!isReceivingCall || !incomingCall) return null;

    return (
        <>
            {/* Audio Element for Ringtone */}
            <audio ref={audioRef} src={RINGTONE_PATH} preload="auto" />

            {/* Modal/Notification UI */}
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
                <div className="bg-base-100 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-primary/50 space-y-6 animate-pulse-slow">
                    <h2 className="text-3xl font-bold text-primary">Incoming Call</h2>
                    
                    <div className="flex justify-center">
                        <img
                            src={callerPic}
                            alt={callerName}
                            className="size-24 rounded-full object-cover border-4 border-accent shadow-lg"
                        />
                    </div>

                    <p className="text-xl font-semibold">{callerName}</p>
                    <p className="text-sm text-base-content/70">Tap Accept to start video chat.</p>

                    <div className="flex justify-center gap-6 mt-6">
                        {/* Reject Button */}
                        <button 
                            className="btn btn-circle btn-lg btn-error shadow-xl hover:scale-105"
                            onClick={rejectCall}
                            aria-label="Reject Call"
                        >
                            <PhoneOff className="size-6 text-error-content" />
                        </button>
                        
                        {/* Accept Button */}
                        <button 
                            className="btn btn-circle btn-lg btn-success shadow-xl hover:scale-105"
                            onClick={acceptCall}
                            aria-label="Accept Call"
                        >
                            <Video className="size-6 text-success-content" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default IncomingCallNotification;