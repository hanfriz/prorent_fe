import Image from "next/image";
import { IoCloseSharp } from "react-icons/io5";

export const ImageModal = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  altText 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  imageUrl: string; 
  altText: string; 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
        >
          <IoCloseSharp className="w-6 h-6 text-gray-600" />
        </button>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-center">{altText}</h3>
          <div className="flex justify-center">
            <img 
              src={imageUrl} 
              alt={altText}
              className="max-h-[70vh] object-contain max-w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};