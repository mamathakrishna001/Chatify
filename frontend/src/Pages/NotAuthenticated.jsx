import { Link } from "react-router-dom";
import { Lock, MessageCircle } from "lucide-react"; // MessageCircle for a welcoming touch

const NotAuthenticated = () => {
  // Placeholder image path (you confirmed logo.png is available)
  const LOGO_URL = "/logo.png";
  
  return (
    <div className="bg-base-200 w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center bg-base-100 rounded-2xl shadow-2xl p-10 sm:p-16 border border-base-300">
        
        {/* Logo and Application Name */}
        <div className="flex flex-col items-center mb-10">
          <img 
            src={LOGO_URL} 
            alt="Chatify Logo" 
            className="w-24 h-24 sm:w-32 sm:h-32 mb-4 object-contain animate-bounce-slow" 
          />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
            Chatify
          </h1>
          <p className="text-sm text-base-content/70 font-medium mt-1">
            Chat. Connect. Collaborate
          </p>
        </div>

        {/* Welcome Message and Call to Action */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-base-content">
            Welcome Aboard!
          </h2>
          <p className="text-base text-base-content/80 max-w-md mx-auto">
            It looks like you haven't pinged us yet. Join the conversation and connect 
            with your contacts instantly. We keep your chats private and secure.
          </p>
          

          {/* Login Button */}
          <Link
            to="/login"
            className="btn btn-primary btn-lg w-full sm:w-2/3 shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:scale-[1.02]"
          >
            Go to Login
          </Link>
          
          {/* Small Note */}
          <p className="text-xs text-base-content/50 mt-4 flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            <span className="font-semibold">Your privacy is our priority.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotAuthenticated;
