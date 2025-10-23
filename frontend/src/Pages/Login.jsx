import { useAuthStore } from "../store/useAuthstore";
import { useState } from "react";
import { Eye, EyeOff, Mail, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
  const [showPassword, setShowpassword] = useState(false);
  const [formData, setFormData] = useState({
      email: "",
      password: "",
  });

  const {login,isLoggingIn}=useAuthStore();

  const validFormat=()=>{
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Email is invalid");
    if (!formData.password.trim()) return toast.error("Password is required");
    if (formData.password.length < 8) return toast.error("Password must be at least 8 characters");
    return true;
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if (validFormat()) {
      login(formData)
    }
  }

  return (
    // Centered, full-screen container
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-base-200">
      <div className="flex w-full max-w-4xl bg-base-100 rounded-xl shadow-2xl overflow-hidden">
        {/* Decorative side panel (Hidden on small screens) */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 p-10 bg-white text-primary-content">
         <img src="/logo.png" alt="Logo" className="w-28 h-28 opacity-80" />
          <h2 className="text-4xl font-extrabold mb-3">Welcome Back!</h2>
          <p className="text-center text-lg opacity-80">
            Sign in to access your secure chat conversations.
          </p>
        </div>

        {/* Login Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center items-center">
          <h2 className="font-bold text-3xl mb-8">Sign In</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-sm">
            
            <label className="input input-bordered flex items-center gap-3 bg-base-200">
              <Mail className="size-5 opacity-70" />
              <input
                type="text"
                className="grow"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </label>

            <div className="relative">
              <label className="input input-bordered flex items-center gap-3 w-full bg-base-200">
                <input
                  type={showPassword ? "text" : "password"}
                  className="grow pr-10"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowpassword(!showPassword)}
                  className="absolute right-0 p-3 flex items-center h-full"
                >
                  {showPassword ? (
                    <EyeOff className="size-5 opacity-70" />
                  ) : (
                    <Eye className="size-5 opacity-70" />
                  )}
                </button>
              </label>
            </div>

            <button 
                className="btn btn-primary w-full mt-4" 
                type="submit"
                disabled={isLoggingIn}
            >
              {isLoggingIn ? <span className="loading loading-spinner"></span> : "Login"}
            </button>
            
            <p className="text-center text-sm mt-4">
                Don&#39;t have an Account? 
                <a href="/signup" className="link link-primary ml-1 font-semibold">Sign Up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login