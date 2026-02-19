
import React from 'react';
import { ArrestRecord } from '../types';
import { MapPin, Calendar, Scale, User } from 'lucide-react';

interface IntelFeedProps {
  records: ArrestRecord[];
  onSelect: (record: ArrestRecord) => void;
}

const IntelFeed: React.FC<IntelFeedProps> = ({ records, onSelect }) => {
  return (
    <div className="h-full overflow-y-auto p-4 no-scrollbar">
      <h2 className="text-2xl font-bold mb-4 text-[#00ff41]">Intel Feed // Active Threats</h2>
      {records.length === 0 ? (
        <p className="text-gray-500">No active intel available.</p>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              className={`bg-gray-900 border p-4 rounded-lg shadow-lg cursor-pointer transition-colors duration-200
                ${record.threatLevel === 'CRITICAL' ? 'border-red-600 hover:bg-red-900/20' : 'border-[#00ff41]/20 hover:bg-[#00ff41]/10'}`}
              onClick={() => onSelect(record)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User size={18} className="text-gray-400" /> {record.name}
                </h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-full
                  ${record.threatLevel === 'CRITICAL' ? 'bg-red-700 text-white' : 'bg-[#00ff41]/30 text-[#00ff41]'}`}>
                  {record.threatLevel}
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-1 flex items-center gap-2">
                <Scale size={16} className="text-gray-500" /> <span className="font-medium">Charges:</span> {record.charges}
              </p>
              <p className="text-gray-400 text-xs flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" /> <span className="font-medium">Residence:</span> {record.residence}
              </p>
              <p className="text-gray-400 text-xs flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" /> <span className="font-medium">Incident Date:</span> {new Date(record.incidentDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IntelFeed;
