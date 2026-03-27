import React, { useState } from 'react';
import AdminRoomList from './AdminRoomList';
import AddRoom from './AddRoom';

export default function RoomManage() {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] relative">
      
      {/* Minimal, Space-Saving Navigation Tabs */}
      <div className="pt-6 pb-2 px-6 flex justify-center sticky top-0 z-20 bg-[#FAFAFA]/80 backdrop-blur-md border-b border-transparent transition-all">
        <div className="flex bg-slate-200/50 p-1.5 rounded-xl border border-slate-200/60 shadow-inner">
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-8 py-2.5 rounded-lg text-sm font-extrabold transition-all duration-300 ${
              activeTab === 'list' 
                ? 'bg-white text-blue-600 shadow-sm border border-slate-100 translate-y-0' 
                : 'bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            📋 View Inventory
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            className={`px-8 py-2.5 rounded-lg text-sm font-extrabold transition-all duration-300 ${
              activeTab === 'add' 
                ? 'bg-white text-blue-600 shadow-sm border border-slate-100 translate-y-0' 
                : 'bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            + Add New Unit
          </button>
        </div>
      </div>

      {/* Dynamic Content area */}
      <div className="flex-1 overflow-y-auto relative custom-scrollbar">
        {activeTab === 'list' ? <AdminRoomList /> : <AddRoom />}
      </div>
      
    </div>
  );
}