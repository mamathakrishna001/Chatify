import { X, Globe, Video, PhoneOff } from "lucide-react"; // Import Video, PhoneOff
import { useAuthStore } from "../store/useAuthstore";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, startCall, endCall, isCalling } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  const handleStartCall = () => {
    if (!isOnline) {
      toast.error(`${selectedUser.fullName} is offline.`);
      return;
    }
    startCall(selectedUser._id);
  };

  const handleEndCall = () => {
      endCall();
  };

  return (
    <div className="p-4 border-b border-base-300 bg-base-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-12 rounded-full relative ring ring-primary ring-offset-base-200 ring-offset-1">
              <img 
                src={selectedUser.profilePic || "/avatar.png"} 
                alt={selectedUser.fullName} 
                className="object-cover"
              />
              {isOnline && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-success 
                  rounded-full ring-2 ring-base-200"
                />
              )}
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-semibold text-lg">{selectedUser.fullName}</h3>
            <div className={`text-sm flex items-center gap-1 ${isOnline ? "text-success" : "text-base-content/70"}`}>
                <Globe className="size-3"/>
                <p>{isOnline ? "Active Now" : "Offline"}</p>
            </div>
          </div>
        </div>

        {/* Call Controls */}
        <div className="flex items-center gap-3">
            {isCalling ? (
                // End Call Button
                <button 
                    className="btn btn-error btn-circle btn-sm shadow-md"
                    onClick={handleEndCall}
                    aria-label="End Call"
                >
                    <PhoneOff className="size-5" />
                </button>
            ) : (
                // Start Call Button
                <button 
                    className={`btn btn-info btn-circle btn-sm shadow-md ${!isOnline ? 'btn-disabled' : ''}`}
                    onClick={handleStartCall}
                    disabled={!isOnline}
                    aria-label="Start Video Call"
                >
                    <Video className="size-5" />
                </button>
            )}

            {/* Close Chat Button */}
            <button 
                onClick={() => setSelectedUser(null)} 
                className="btn btn-ghost btn-circle btn-sm"
                aria-label="Close Chat"
            >
              <X className="size-5" />
            </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;