import { useChatStore } from '../store/useChatStore'
import NoChatSelected from '../components/NoChatSelected'
import ChatContainer from '../components/ChatContainer'
import SideBar from '../components/SideBar'
import IncomingCallNotification from '../components/IncomingCallNotification' // Import new component

const Homepage = () => {
  const {selectedUser, isReceivingCall}=useChatStore() // Extract isReceivingCall
  
  return (
    // Removed outer wrapper styles to make the chat container full width/height
    <div className='min-h-[calc(100vh-4rem)] flex items-stretch justify-center'>
      <div className='w-full max-w-7xl mx-auto h-[calc(100vh-4rem)] border-x border-base-300'>
        <div className='flex h-full rounded overflow-hidden'>
          <SideBar/>
          {!selectedUser ? <NoChatSelected/> : <ChatContainer/>}
        </div>
      </div>
      
      {/* RENDER THE INCOMING CALL NOTIFICATION HERE */}
      {isReceivingCall && <IncomingCallNotification />}
    </div>
  )
}

export default Homepage