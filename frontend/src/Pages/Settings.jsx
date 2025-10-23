import { useThemeStore } from "../store/useThemeStore"
import {THEMES} from "../constants"
import { ArrowLeft, Send } from "lucide-react"
import { Link } from "react-router-dom"

const PREVIEW_MSG=[
  {id:1,content:"Hey! How's it going?", isSent:false},
  {id:2,content:"I'm doing great! Just working on some new features", isSent:true}
]

const Settings = () => {
  const {theme,setTheme}=useThemeStore()
  return (
    <div className="bg-base-200 min-h-[calc(100vh-4rem)] pb-10">
      <div className='m-4 absolute border rounded-xl p-2 bg-base-100 hover:bg-base-300 transition-colors shadow-lg z-10'>
        <Link to='/'><ArrowLeft className='size-6' /></Link>
      </div>
      <div className="container mx-auto px-4 pt-16 max-w-4xl">
        <div className="flex flex-col items-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-base-content/70">Customize your Chatify experience</p>
        </div>

        {/* Theme Section */}
        <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-base-300 space-y-6">
          <div className="flex flex-col gap-1 border-b pb-4">
            <h2 className="text-xl font-semibold">Chat Theme</h2>
            <p className="text-sm text-base-content/70">Choose a theme for your entire application.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {THEMES.map((t)=>(
              <button
                key={t}
                className={`
                  group flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 
                  transition-all duration-200 text-sm font-medium
                  ${theme === t ? "border-primary shadow-xl ring-2 ring-primary" : "border-base-300 hover:border-primary/50"}
                `}
                onClick={() => setTheme(t)}
              >
                <div className="relative h-10 w-full rounded-md overflow-hidden mb-2 shadow-inner" data-theme={t}>
                  <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                    <div className="rounded bg-primary"></div>
                    <div className="rounded bg-secondary"></div>
                    <div className="rounded bg-accent"></div>
                    <div className="rounded bg-neutral"></div>
                  </div>
                </div>
                <span className="truncate w-full text-center">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-8 bg-base-100 p-6 rounded-xl shadow-lg border border-base-300 space-y-6">
          <h3 className="text-xl font-semibold border-b pb-4">Theme Preview</h3>
          <div className="max-w-lg mx-auto" data-theme={theme}>
            <div className="bg-base-100 rounded-xl shadow-xl border border-base-300">
              
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-base-300 bg-base-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold">
                    JD
                  </div>
                  <div>
                    <h3 className="font-medium text-base">John Doe</h3>
                    <p className="text-xs text-base-content/70">Online</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-4 space-y-4 min-h-[160px] max-h-[200px] overflow-y-auto bg-base-100">
                {PREVIEW_MSG.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`
                        max-w-[80%] rounded-2xl p-3 shadow-md
                        ${message.isSent ? "bg-primary text-primary-content" : "bg-base-300 text-base-content"}
                      `}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`
                          text-[10px] mt-1.5 opacity-60
                        `}
                      >
                        12:00 PM
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-base-300 bg-base-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input input-bordered flex-1 text-sm h-10 bg-base-200"
                    placeholder="Type a message..."
                    value="This is a preview"
                    readOnly
                  />
                  <button className="btn btn-primary h-10 min-h-0 px-4">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings