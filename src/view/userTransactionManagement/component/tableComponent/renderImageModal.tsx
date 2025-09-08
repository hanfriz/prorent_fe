const renderImageModal = (
  isModalOpen: boolean,
  selectedImage: any,
  closeImageModal: () => void
) => {
  if (!isModalOpen || !selectedImage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={closeImageModal} />
      <div className="relative max-w-3xl w-full mx-4">
        <div className="bg-white rounded-xl p-4 shadow-xl">
          <div className="flex justify-end">
            <button
              onClick={closeImageModal}
              className="text-pr-mid font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="mt-2">
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="w-full h-auto rounded-md max-h-[75vh] object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default renderImageModal;
