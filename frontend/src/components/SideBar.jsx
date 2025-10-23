import { useEffect, useState } from 'react'
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { useChatStore } from '../store/useChatStore';
import { Users, Filter } from 'lucide-react'; 
import { useAuthStore } from '../store/useAuthstore';

const SideBar = () => {
  const {getUsers, users, selectedUser, setSelectedUser, isUserLoading}=useChatStore()

  // Fetch both onlineUsers and authUser
  const {onlineUsers, authUser}=useAuthStore();
  
  // FIX: Only call getUsers when the user is authenticated (authUser exists)
  useEffect(()=>{
    if (authUser) {
        getUsers();
    }
    // Dependency on authUser ensures this runs when the user logs in/out
  }, [getUsers, authUser]) 
  
  // Keeping state for component structure, but it's now ignored for filtering
  const [showOnlineOnly, setShowOnlineOnly] = useState(false); 

  // FIX: Force filteredUsers to always be the full user list
  // 1. Ensure 'users' is an array with (users || []) to prevent the crash.
  const userList = (users || []);
  
  // RETAIN ALL USERS by setting filteredUsers directly to userList, ignoring showOnlineOnly state.
  const filteredUsers = userList; 
    
  // 2. Sort the list: Online users always appear first
  filteredUsers.sort((a, b) => {
    const aOnline = onlineUsers.includes(a._id);
    const bOnline = onlineUsers.includes(b._id);
    
    // Put online users first (-1)
    if (aOnline && !bOnline) return -1;
    // Put offline users later (1)
    if (!aOnline && bOnline) return 1;
    // Maintain relative order if status is the same
    return 0;
  });


  if(isUserLoading) return <SidebarSkeleton/>
  return (
    <aside className='h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 bg-base-200'>
      {/* Header */}
      <div className='w-full p-4 border-b border-base-300 lg:p-5'>
        <div className='flex items-center gap-2'>
          <Users className='size-6 text-primary'/>
          <span className='font-bold hidden lg:block text-lg'>Contacts</span>
        </div>
        
        {/* Filter Section - COMMENTED OUT TO ALWAYS SHOW ALL USERS */}
        <div className="mt-4 hidden lg:flex items-center justify-between p-2 rounded-lg bg-base-300">
          <label className="cursor-pointer flex items-center gap-2">
            <Filter className="size-4 opacity-70"/>
            <span className="text-sm font-medium">Show online only</span>
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-xs checkbox-primary"
            />
          </label>
          <span className="text-xs text-primary font-bold">({onlineUsers.length - 1})</span>
        </div>
      </div>
      
      {/* Contact List */}
      <div className='overflow-y-auto w-full flex-1'>
      {filteredUsers.map((user) => {
        const isOnline = onlineUsers.includes(user._id);
        return (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              transition-colors duration-150 border-l-4 border-transparent
              ${selectedUser?._id === user._id ? "bg-base-300 border-primary" : "hover:bg-base-300/70"}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full ring-2 ring-base-content/10"
              />
              {isOnline && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-success 
                  rounded-full ring-2 ring-base-200"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="font-semibold truncate text-base">{user.fullName}</div>
              <div className={`text-sm ${isOnline ? "text-success" : "text-base-content/60"}`}>
                {isOnline ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        )})}

        {filteredUsers.length === 0 && (
          <div className="text-center text-base-content/50 py-4 p-3 lg:px-4 text-sm">
            No active chats or online users.
          </div>
        )}
      </div>
    </aside>
  )
}

export default SideBar