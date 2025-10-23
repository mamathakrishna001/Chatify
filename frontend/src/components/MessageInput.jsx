import { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MessageInput = () => {
  const [text, setText]= useState("");
  const [imagePreview, setImagePreview]= useState(null)
  const fileInputRef= useRef(null)
  const {sendMessage}= useChatStore();

  const handleImageChange =(e)=>{
    const file= e.target.files[0]
    if( !file.type.startsWith('image/') ){
      toast.error('Please select an image file!')
      return;
    }
    // Limit file size to 2MB for a better chat experience
    if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB.');
        return;
    }
    const reader =new FileReader();
    reader.onloadend=()=>{
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  const removeImage=()=>{
    setImagePreview(null);
    if (fileInputRef.current){
      fileInputRef.current.value = null;
    }
  }

  const handleSendMessage=async(e)=>{
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    const messageData = {
      text: text.trim(),
      image: imagePreview ? imagePreview : null,
    };

    try {
      await sendMessage(messageData);
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      // Improved error handling
      toast.error(error.message || 'Failed to send message');
    }
  }

  return (
    <div className='p-4 w-full border-t border-base-300 bg-base-200'>
      {imagePreview && (
        <div className="mb-3 flex items-center gap-4 p-3 border-b border-base-300">
          <span className="text-sm font-medium opacity-70">Image Preview:</span>
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-lg ring-2 ring-primary/50"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 size-6 rounded-full bg-error text-error-content
              flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              type="button"
              aria-label="Remove image"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className='flex items-center gap-3'>
        <div className='flex-1 flex items-center gap-2'>
            <input
              type='file'
              accept='image/*'
              className='hidden'
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <button
              type='button'
              className={`btn btn-ghost btn-circle ${imagePreview ? 'text-primary' : 'text-base-content/60'}`}
              onClick={()=>fileInputRef.current?.click()}
              aria-label="Attach image"
            >
              <Image size={22}/>
            </button>
            <input
              type="text"
              className='w-full input input-bordered rounded-xl input-md bg-base-100 border-base-300'
              placeholder='Send a message...'
              value={text}
              onChange={(e)=>setText(e.target.value)}
            />
        </div>
        
        <button
          type='submit'
          className='btn btn-primary btn-circle btn-md shadow-lg'
          disabled={!text.trim() && !imagePreview}
          aria-label="Send message"
        >
          <Send size={22}/>
        </button>
      </form>
    </div>
  )
}

export default MessageInput