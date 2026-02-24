import React from 'react';
import { CalendarEventI } from '@/src/types/calendar.types';
// import { Clock, ChevronRight } from 'lucide-react'; // Icone per pulizia

interface AgendaItemProps {
  event: CalendarEventI;
}

export const AgendaItem = ({ event }: AgendaItemProps) => {
  const isBooking = event.type === 'booking';
  
  const dateObj = new Date(event.start || '');
  const dayName = dateObj.toLocaleDateString('it-IT', { weekday: 'short' }).toUpperCase();
  const dayNumber = dateObj.getDate();
  
  const startTime = event.start ? new Date(event.start).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : '--:--';
  const endTime = event.end ? new Date(event.end).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : '--:--';

  return (
    <div className="flex items-stretch gap-0 mb-4 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      
      {/* 1. BLOCCO DATA A SINISTRA */}
      <div className={`flex flex-col items-center justify-center min-w-[70px] py-3 text-white ${
        isBooking ? 'bg-[#E14D2A]' : 'bg-gray-400' 
      }`}>
        <span className="text-[10px] font-bold opacity-80 uppercase leading-none mb-1">
          {dayName}
        </span>
        <span className="text-2xl font-black leading-none">
          {dayNumber}
        </span>
      </div>

      {/* 2. CONTENUTO DETTAGLIATO */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-1">
          {/* Orario e Info Servizio */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-semibold">
              {/* <Clock size={12} className="text-gray-300" /> */}
              <span>{startTime} - {endTime}</span>
            </div>
            
            <h3 className="text-sm font-bold text-gray-800 leading-tight">
              {event.title}
            </h3>
            
            <p className="text-[11px] text-gray-400 font-medium">
              {event.metadata?.description || 'Alut mobility, Somministraz...'}
            </p>
          </div>

          {/* Badge Stato (Angolo Alto Destra) */}
          {isBooking && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold border ${
              event.status === 'confirmed' 
                ? 'bg-green-50 text-green-500 border-green-100' 
                : 'bg-blue-50 text-blue-500 border-blue-100'
            }`}>
              <div className={`w-1 h-1 rounded-full ${event.status === 'confirmed' ? 'bg-green-500' : 'bg-blue-500'}`} />
              {event.status === 'confirmed' ? 'Confermata' : 'In corso'}
            </div>
          )}
        </div>

        {/* Footer Card: Dettagli */}
        <div className="flex justify-end mt-2">
          <button className="flex items-center text-[10px] font-bold text-[#E14D2A] hover:opacity-70 transition-opacity">
            {/* Dettagli <ChevronRight size={12} /> */}
          </button>
        </div>
      </div>
    </div>
  );
};