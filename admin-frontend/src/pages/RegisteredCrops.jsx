import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Ruler, Sprout, ChevronRight } from 'lucide-react';
import { apiService } from '../services/apiService';
import { Badge } from '../components/Badge';

export const RegisteredCrops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  const filterOptions = ['All', 'Active', 'Harvested', 'Claim filed', 'Pending'];

  useEffect(() => {
    let isMounted = true;
    apiService.getRegisteredCrops().then((res) => {
      if (isMounted) {
        setCrops(res);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCrops = useMemo(() => {
    if (statusFilter === 'All') return crops;
    return crops.filter((c) => (c.status || '').toLowerCase() === statusFilter.toLowerCase());
  }, [crops, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Subtitle */}
      <div>
        <p className="text-sm text-gray-500">Crops registered for insurance coverage this season</p>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.map((option) => {
          const isActive = statusFilter === option;
          const count =
            option === 'All'
              ? crops.length
              : crops.filter((c) => (c.status || '').toLowerCase() === option.toLowerCase()).length;

          return (
            <button
              key={option}
              onClick={() => setStatusFilter(option)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                isActive
                  ? 'bg-[#15803D] text-white border-[#15803D] shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {option} <span className="opacity-80 ml-1">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-sm text-gray-500">
          Loading registered crops...
        </div>
      ) : (
        /* Crops Cards Responsive Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <div
              key={crop.id || crop._id || crop.rawId}
              onClick={() => navigate(`/registered-crops/${crop.rawId || crop._id || crop.id}`)}
              className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-[#15803D] hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              {/* Header & Status */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#15803D] transition-colors">
                      {crop.name}
                    </h3>
                    {/* Farmer Name with User Icon */}
                    <div className="flex items-center space-x-1.5 mt-1 text-xs text-gray-500 font-medium">
                      <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{crop.farmerName}</span>
                    </div>
                  </div>
                  <Badge status={crop.status || 'Active'} />
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="space-y-0.5">
                  <span className="text-gray-400 flex items-center space-x-1">
                    <Ruler className="w-3 h-3" />
                    <span>Area Insured</span>
                  </span>
                  <p className="font-semibold text-gray-800">{crop.areaInsured}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-gray-400 flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Sowing Date</span>
                  </span>
                  <p className="font-semibold text-gray-800">{crop.sowingDate}</p>
                </div>
              </div>

              {/* Thumbnail Strip Placeholder */}
              <div>
                <p className="text-[11px] font-medium text-gray-400 mb-1.5">Baseline crop imagery</p>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className="w-10 h-10 rounded-md bg-[#DCFCE7] flex items-center justify-center border border-green-200"
                    >
                      <Sprout className="w-4 h-4 text-[#15803D]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Action Bar */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-[#15803D]">
                <span>View complete details</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredCrops.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-sm text-gray-500">
          No crops found for status "{statusFilter}".
        </div>
      )}
    </div>
  );
};
