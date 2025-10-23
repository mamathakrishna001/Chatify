import { useAuthStore } from "../store/useAuthstore";
import { LogOut, Settings, User } from "lucide-react"; // Importing missing icons for dropdown

const Navbar=()=>{
     const {logout,authUser}=useAuthStore()
    
    return(
        // Modern, glass-like navbar on the primary background
        <div className="navbar bg-base-100 sticky top-0 z-10 px-8 border-b border-base-300 shadow-md">
           <div className="flex-1 px-2 mx-2">
               <img alt="logo" src="./logo.png"  className="w-20 mr-2" />
           </div>
           
            {authUser  && (
                <div className="flex-none gap-2">
                    <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img
                            alt="profile pic"
                            src={ authUser.profilePic || "/avatar.png"} />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-200 rounded-box z-[1] mt-3 w-52 p-2 shadow-xl border border-base-300">
                        <li>
                            <a href="/profile">
                                <User className="size-5"/>
                                Profile
                            </a>
                        </li>
                        <li>
                            <a href="/settings">
                                <Settings className="size-5"/>
                                Settings
                            </a>
                        </li>
                        <li>
                            <a onClick={logout} className="text-error">
                                <LogOut className="size-5"/>
                                Logout
                            </a>
                        </li>
                    </ul>
                    </div>
                </div >
            )}
            {!authUser && (
                <div className="flex-none">
                    <a href="/login" className="btn btn-primary btn-sm">Sign In</a>
                </div>
            )}
        </div>
    )
}

export default Navbar;