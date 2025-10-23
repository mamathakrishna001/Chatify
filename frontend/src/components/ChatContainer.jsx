import { useEffect,useRef } from "react";
import {useChatStore} from "../store/useChatStore";
import ChatHeader from "./ChatHeader"
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthstore";
import { Check, CheckCheck } from "lucide-react"; 

// Component to handle video stream display
const VideoStream = ({ stream, isLocal, name }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    if (!stream) return null;

    return (
        <div className={`relative ${isLocal ? 'w-1/3 h-48 self-end' : 'flex-1 h-full'}`}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isLocal} // Mute local stream to prevent echo
                className="w-full h-full object-cover rounded-xl shadow-lg border-2 border-primary"
            />
            <span className={`absolute top-2 left-2 badge ${isLocal ? 'badge-primary' : 'badge-secondary'}`}>
                {isLocal ? 'You' : name}
            </span>
        </div>
    );
};


const ChatContainer = () => {
  const {
      messages,getMessages,isMessagesLoading,selectedUser,
      subscribeToMessages,unsubscribeFromMessages,
      localStream, remoteStream, isCalling
    }=useChatStore()

  const {authUser}=useAuthStore();
  const messageEndRef=useRef(null);
  
  useEffect(()=>{
    getMessages(selectedUser._id);
    subscribeToMessages();
    return ()=>unsubscribeFromMessages()
  },[selectedUser._id,getMessages,subscribeToMessages,unsubscribeFromMessages]
  )

  useEffect(()=>{
    // Scroll to bottom whenever messages array changes
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  },[messages])

  if(isMessagesLoading) {
    return (
    <div className="flex-1 flex flex-col overflow-auto bg-base-100">
      <ChatHeader/>
      <MessageSkeleton/>
      <MessageInput/>
    </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-base-100">
      <ChatHeader/>
      
      {/* Video Call Interface (Conditionally Rendered) */}
      {isCalling && (localStream || remoteStream) ? (
        <div className="p-4 flex flex-col sm:flex-row gap-4 bg-base-200">
            {remoteStream ? (
                <VideoStream stream={remoteStream} isLocal={false} name={selectedUser.fullName} />
            ) : (
                <div className="flex-1 h-48 flex items-center justify-center bg-base-300 rounded-xl text-lg font-semibold">
                    {/* Display when waiting for remote peer to connect */}
                    Connecting...
                </div>
            )}
            {localStream && <VideoStream stream={localStream} isLocal={true} name="You" />}
        </div>
      ) : null}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index)=>{
          const isSent = message.senderId === authUser._id;
          const isLastMessage = index === messages.length - 1;
          const time = new Date(message.createdAt).toLocaleTimeString("en-US", {
            hour: '2-digit',
            minute: '2-digit',
            hour12:true
          });

          return(
            <div key={message._id} 
                 className={`chat ${isSent ? 'chat-end' : 'chat-start'}`} 
                 ref={isLastMessage ? messageEndRef : null} // Only set ref on the last message
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border border-base-300">
                  <img src={isSent ? 
                    authUser.profilePic || "/avatar.png" : 
                    selectedUser.profilePic || "/avatar.png"}
                    alt="Profile Pic"
                    className="object-cover"
                    />
                </div>
              </div>
              <div className="chat-header text-sm opacity-80 mb-1">
                <time className="text-xs">
                  {time}
                </time>
              </div>
              <div className={`chat-bubble flex flex-col max-w-xs sm:max-w-md ${isSent ? 'chat-bubble-primary' : 'bg-base-300 text-base-content'}`}>
                  {message.image && (
                    <img src={message.image}
                    alt="attachment"
                    className="w-full max-h-64 object-cover rounded-md mb-2 cursor-pointer"
                    onClick={() => window.open(message.image, '_blank')} // Added for full image view
                    />
                  )}
                  {message.text && <p className="text-sm break-words">{message.text}</p>}
              </div>
              {isSent && (
                <div className="chat-footer text-xs opacity-50 flex items-center mt-1">
                    {/* Simplified status visualization */}
                    <CheckCheck className="size-3 text-success"/>
                </div>
              )}
            </div>
        )})}
      </div>
      <MessageInput/>
    </div>
  )
}

export default ChatContainer