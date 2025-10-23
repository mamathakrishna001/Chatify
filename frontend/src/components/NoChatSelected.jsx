import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-primary/10">
            <MessageSquare className="w-10 h-10 text-primary " />
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-3xl font-extrabold text-base-content">
          Welcome to Chatify!
        </h2>
        <p className="text-lg text-base-content/70">
          Select a contact from the sidebar to start a new, secure conversation.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;