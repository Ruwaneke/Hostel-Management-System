import React, { useState } from 'react';
import AdminRoomList from './AdminRoomList';
import AddRoom from './AddRoom';

export default function RoomManage() {
  // State to control whether the popup is open or closed
  const [isAddingRoom, setIsAddingRoom] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] relative">
      
      {/* Top Bar with Add Button */}
      <div className="pt-6 pb-4 px-6 flex justify-end sticky top-0 z-10 bg-[#FAFAFA]/90 backdrop-blur-md">
        <button 
          onClick={() => setIsAddingRoom(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-extrabold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          + Add New Unit
        </button>
      </div>

      {/* BACKGROUND: Always show the Room List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AdminRoomList />
      </div>

      {/* FOREGROUND POPUP: Only shows when isAddingRoom is true */}
      {isAddingRoom && (
        <div className="absolute inset-0 z-50">
          <AddRoom 
            // THESE ARE THE FIXES: They tell the Cancel and ✕ buttons what to do!
            onClose={() => setIsAddingRoom(false)} 
            onRoomAdded={() => setIsAddingRoom(false)} 
          />
        </div>
      )}
      
    </div>
  );
}