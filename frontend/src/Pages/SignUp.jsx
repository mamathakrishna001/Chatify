import { useState } from "react";
import { useAuthStore } from "../store/useAuthstore";
import { Eye, EyeOff, Mail, MessageSquare, User } from "lucide-react";
import toast from "react-hot-toast";

const SignUp = () => {
  const [showPassword, setShowpassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validFormat = () => {
    if (!formData.fullName.trim()) return toast.error("Full Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Email is invalid");
    if (!formData.password.trim()) return toast.error("Password is required");
    // Correcting a typo in the original file: 'must be less thanu 8 characters' should be 'at least 8 characters'
    if (formData.password.length < 8) return toast.error("Password must be at least 8 characters"); 
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validFormat()) {
      signup(formData);
    }
  };

  return (
    // Centered, full-screen container
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-base-200">
      <div className="flex w-full max-w-4xl bg-base-100 rounded-xl shadow-2xl overflow-hidden">
        {/* Sign Up Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center items-center order-2 md:order-1">
          <h2 className="font-bold text-3xl mb-8">Create Account</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-sm">
            
            <label className="input input-bordered flex items-center gap-3 bg-base-200">
              <User className="size-5 opacity-70" />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </label>
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
                  placeholder="Password (min. 8 characters)"
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
                disabled={isSigningUp}
            >
              {isSigningUp ? <span className="loading loading-spinner"></span> : "Sign Up"}
            </button>
            
            <p className="text-center text-sm mt-4">
                Already Have an Account? 
                <a href="/login" className="link link-primary ml-1 font-semibold">Sign In</a>
            </p>
          </form>
        </div>

        {/* Decorative side panel (Hidden on small screens) */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 p-10 bg-white text-secondary-content order-1 md:order-2">
          <img src="/logo.png" alt="Logo" className="w-32 h-32 opacity-80" />
          <h2 className="text-4xl font-extrabold mb-3">Join the Community!</h2>
          <p className="text-center text-lg opacity-80">
            Start connecting with friends instantly and securely.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;