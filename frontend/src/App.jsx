import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Settings from "./Pages/Settings";
import Profile from "./Pages/Profile";
import Homepage from "./Pages/Homepage";
import NotAuthenticated from "./Pages/NotAuthenticated"; // ← new page
import { useAuthStore } from "./store/useAuthstore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <Homepage /> : <NotAuthenticated />} />
        <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/settings" element={authUser ? <Settings /> : <NotAuthenticated />} />
        <Route path="/profile" element={authUser ? <Profile /> : <NotAuthenticated />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
