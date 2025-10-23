import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Use the VITE_API_URL environment variable set on Vercel.
// It should point to: https://pingitup-n54z.onrender.com
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers:[],
  socket:null,

  checkAuth: async () => {
    try { 
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      if (error.response?.status !== 401 && error.response?.status !== 403) {
          console.error("Error in checkAuth:", error);
      }
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
// ... (rest of signup is unchanged)
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      // console.error("Signup error:", error);
      toast.error(error.response.data.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },
  logout:async()=>{
// ... (rest of logout is unchanged)
    try{
        await axiosInstance.post("/auth/logout")
        set({authUser:null})
        toast.success("Log out successfully")
        get().disconnectSocket();
    }
    catch(error){
        toast.error(error.response.data.message || "Log out failed")
    }
  },
  login:async(data)=>{
    set({isLoggingIn:true})
    try{
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Login Successfull");
      get().connectSocket();
    }
    catch(error){
      // FIX: Robust error handling to prevent "Cannot read properties of undefined (reading 'data')"
      console.log("Login error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Log In failed (Network error or request blocked)";
      toast.error(errorMessage);
    }
    finally{
      set({isLoggingIn:false})
    }
  },
  updateProfile: async (data) => {
// ... (rest of updateProfile is unchanged)
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(
        error.response?.data?.message || error.message || "Profile update failed"
      );
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
