const MessageSkeleton = () => {
  // Create an array of 6 items for skeleton messages
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, idx) => (
        <div key={idx} className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}>
          <div className="chat-image avatar">
            <div className="size-10 rounded-full">
              <div className="skeleton w-full h-full rounded-full" />
            </div>
          </div>

          <div className="chat-header mb-1">
            <div className="skeleton h-3 w-12" />
          </div>

          <div className={`chat-bubble p-0 ${idx % 2 === 0 ? 'bg-base-300' : 'chat-bubble-primary'}`}>
            <div className="skeleton h-12 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;