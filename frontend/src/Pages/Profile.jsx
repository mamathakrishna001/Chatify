import { ArrowLeft, Camera, Mail, User, X } from 'lucide-react'
import { useAuthStore } from '../store/useAuthstore'
import { useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import Cropper from 'react-easy-crop' // Import the Cropper component
import getCroppedImg from '../utils/cropImage' // Helper function to get the cropped image
import toast from 'react-hot-toast'

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null); // The original image selected
  const [imageToCrop, setImageToCrop] = useState(null); // Image shown in cropper
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef(null); // Ref for the hidden file input

  // Callback when crop area changes
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Handler for image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file!');
        return;
    }
    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB.');
        return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageToCrop(reader.result); // Set image to be cropped
      // Open the modal
      document.getElementById('crop_modal').showModal();
    });
    reader.readAsDataURL(file);
    // Clear the file input after reading to allow selecting the same file again
    e.target.value = null;
  };

  // Handle cropping and updating profile
  const handleCropAndUpload = async () => {
    try {
      if (!imageToCrop || !croppedAreaPixels) {
        toast.error("No image or crop area defined.");
        return;
      }
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setSelectedImg(croppedImage); // Update immediate preview
      await updateProfile({ profilePic: croppedImage }); // Send cropped image to backend
      closeCropperModal();
    } catch (e) {
      toast.error("Failed to crop image: " + e.message);
      console.error(e);
    }
  };

  const closeCropperModal = () => {
    document.getElementById('crop_modal').close();
    setImageToCrop(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  return (
    <div className="bg-base-200 min-h-[calc(100vh-4rem)] pb-10">
      <div className='m-4 absolute rounded-xl p-2 bg-base-100 hover:bg-base-300 transition-colors shadow-lg z-10'>
        <Link to='/'><ArrowLeft className='size-6' /></Link>
      </div>
      <div className='flex flex-col items-center pt-8 px-4'>
        <div className='w-full max-w-2xl bg-base-100 rounded-xl shadow-2xl border border-base-300'>
          
          {/* Header & Avatar */}
          <div className='flex flex-col items-center p-8 border-b border-base-300 relative'>
            <h1 className='text-3xl font-bold mb-10'>My Profile</h1>
            <div className='relative'>
              <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 border-primary shadow-xl"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                    absolute bottom-0 right-0
                    bg-primary hover:bg-primary-focus
                    p-2 rounded-full cursor-pointer 
                    transition-all duration-200
                    ${isUpdatingProfile ? "animate-pulse pointer-events-none" : "hover:scale-110"}
                  `}
                >
                  <Camera className="w-5 h-5 text-primary-content" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange} // Use new handler
                    disabled={isUpdatingProfile}
                    ref={fileInputRef} // Assign ref
                  />
                </label>
            </div>
            <p className='text-xl font-semibold mt-4'>{authUser.fullName}</p>
            <p className='text-sm text-base-content/70'>{authUser.email}</p>
          </div>

          {/* User Details */}
          <div className='p-8 space-y-6'>
            <div className='space-y-4'>
              <h2 className='text-xl font-bold border-b pb-2 text-primary'>User Details</h2>
              <div className='flex flex-col sm:flex-row justify-between items-center sm:items-start p-3 bg-base-200 rounded-lg'>
                <div className='flex items-center gap-3 w-full sm:w-1/2 mb-2 sm:mb-0'>
                    <User className="size-5 text-primary opacity-80"/>
                    <span className="font-medium">Full Name</span>
                </div>
                <div className='text-lg font-semibold w-full sm:w-1/2 text-right truncate'>{authUser.fullName}</div>
              </div>

              <div className='flex flex-col sm:flex-row justify-between items-center sm:items-start p-3 bg-base-200 rounded-lg'>
                <div className='flex items-center gap-3 w-full sm:w-1/2 mb-2 sm:mb-0'>
                    <Mail className="size-5 text-primary opacity-80"/> 
                    <span className="font-medium">Email Address</span>
                </div>
                <div className='text-lg font-semibold w-full sm:w-1/2 text-right truncate'>{authUser.email}</div>
              </div>
            </div>

            <div className='space-y-4'>
              <h2 className='text-xl font-bold border-b pb-2 text-secondary'>Account Status</h2>
              
              <div className='flex justify-between items-center p-3 bg-base-200 rounded-lg'>
                <span className="font-medium">Member Since</span>
                <span className='font-mono text-success'>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              
              <div className='flex justify-between items-center p-3 bg-base-200 rounded-lg'>
                <span className="font-medium">Account Status</span>
                <span className='badge badge-lg badge-success font-bold'>Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cropper Modal */}
      <dialog id="crop_modal" className="modal modal-middle">
        <div className="modal-box w-11/12 max-w-xl bg-base-100 p-0 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-base-300">
            <h3 className="font-bold text-lg">Crop Profile Picture</h3>
            <button 
                className="btn btn-ghost btn-circle btn-sm" 
                onClick={closeCropperModal}
                aria-label="Close"
            >
                <X className="size-5" />
            </button>
          </div>

          <div className="relative w-full aspect-square bg-base-300 my-4">
            {imageToCrop && (
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1} // Square aspect ratio for profile pic
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round" // Circular crop area
                showGrid={false} // Clean look
                objectFit="contain" // Ensures image fits
              />
            )}
          </div>

          <div className="p-4 flex flex-col gap-4 border-t border-base-300">
            <div className="flex items-center gap-3">
              <span className="label-text">Zoom:</span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="range range-primary"
              />
            </div>
            <div className="modal-action mt-0">
              <button 
                className="btn btn-neutral" 
                onClick={closeCropperModal}
                disabled={isUpdatingProfile}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleCropAndUpload}
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? <span className="loading loading-spinner"></span> : "Save"}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default Profile