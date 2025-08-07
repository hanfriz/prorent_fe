// src/lib/stores/reservationStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware'; // Optional: for debugging and persistence
// Import interfaces if you have them defined
// import { Property, RoomType } from '@/interfaces'; // Adjust path

// Define the shape of the reservation state
interface ReservationState {
   // --- Selected Property ---
   selectedPropertyId: string | null;
   // selectedProperty: Property | null; // Optional: store full object

   // --- Selected Room Type ---
   selectedRoomTypeId: string | null;
   // selectedRoomType: RoomType | null; // Optional: store full object

   // --- Selected Dates ---
   checkInDate: Date | null;
   checkOutDate: Date | null;

   // --- Actions to update state ---
   setSelectedPropertyId: (id: string | null) => void;
   // setSelectedProperty: (property: Property | null) => void; // Optional action

   setSelectedRoomTypeId: (id: string | null) => void;
   // setSelectedRoomType: (roomType: RoomType | null) => void; // Optional action

   setCheckInDate: (date: Date | null) => void;
   setCheckOutDate: (date: Date | null) => void;
   swapDates: () => void; // Utility action

   // --- Action to reset/clear the entire reservation flow state ---
   clearReservationFlow: () => void;
}

// --- Initial State ---
const initialState = {
   selectedPropertyId: null,
   // selectedProperty: null,
   selectedRoomTypeId: null,
   // selectedRoomType: null,
   checkInDate: null,
   checkOutDate: null
};

// --- Create the Zustand store ---
export const useReservationStore = create<ReservationState>()(
   // Optional: Add middleware like devtools for browser extension debugging
   // and persist for local storage persistence
   devtools(
      // persist(
      (set, get) => ({
         // Initialize state
         ...initialState,

         // --- Action Implementations ---
         setSelectedPropertyId: id => set({ selectedPropertyId: id }),
         // setSelectedProperty: (property) => set({ selectedProperty: property }),

         setSelectedRoomTypeId: id => set({ selectedRoomTypeId: id }),
         // setSelectedRoomType: (roomType) => set({ selectedRoomType: roomType }),

         setCheckInDate: date => set({ checkInDate: date }),
         setCheckOutDate: date => set({ checkOutDate: date }),
         swapDates: () => {
            const { checkInDate, checkOutDate } = get();
            set({ checkInDate: checkOutDate, checkOutDate: checkInDate });
         },

         clearReservationFlow: () => set(initialState)
      }),
      //   {
      //     name: 'prorent-reservation-storage', // Unique name for localStorage key
      //     // partialize: (state) => ({ /* Define which parts of state to persist */ }),
      //   }
      // ),
      { name: 'ReservationStore' } // Name for devtools
   )
);

// --- Optional: Typed Selectors for easier access ---
// You can create custom hooks to select specific parts of the state
// This can improve performance slightly by preventing unnecessary re-renders
// if only a small part of the state changes.

// export const useSelectedPropertyId = () => useReservationStore((state) => state.selectedPropertyId);
// export const useSelectedRoomTypeId = () => useReservationStore((state) => state.selectedRoomTypeId);
// export const useCheckInDate = () => useReservationStore((state) => state.checkInDate);
// export const useCheckOutDate = () => useReservationStore((state) => state.checkOutDate);

// --- Optional: Combined Selector ---
// export const useReservationFlowData = () => useReservationStore((state) => ({
//   propertyId: state.selectedPropertyId,
//   roomTypeId: state.selectedRoomTypeId,
//   checkIn: state.checkInDate,
//   checkOut: state.checkOutDate,
// }));
