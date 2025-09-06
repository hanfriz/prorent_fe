"use client";

import { Suspense } from "react";
import RoomGalleryManagement from "@/view/MyProperties/RoomGalleryManagement";

function RoomGalleryLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading room gallery...</p>
      </div>
    </div>
  );
}

export default function RoomGalleryPage() {
  return (
    <Suspense fallback={<RoomGalleryLoading />}>
      <RoomGalleryManagement />
    </Suspense>
  );
}
