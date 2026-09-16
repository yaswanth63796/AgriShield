import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Sprout, Calendar, AlertTriangle, ChevronRight, CloudRain } from 'lucide-react';
import { apiService } from '../services/apiService';
import { Badge } from '../components/Badge';

export const ClaimCrops = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  const filterOptions = ['All', 'Pending', 'Under review', 'Approved', 'Rejected'];

  useEffect(() => {
    let isMounted = true;
    apiService.getClaims().then((res) => {
      if (isMounted) {
        setClaims(res);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredClaims = useMemo(() => {
    if (statusFilter === 'All') return claims;
    return claims.filter((c) => (c.status || '').toLowerCase() === statusFilter.toLowerCase());
  }, [claims, statusFilter]);

  const handleQuickStatusChange = async (cId, newStatus) => {
    try {
      const res = await apiService.updateClaimStatus(cId, newStatus);
      if (res && res.success) {
        setClaims((prevClaims) =>
          prevClaims.map((c) =>
            c.id === cId || c.rawId === cId || c._id === cId ? { ...c, status: newStatus } : c
          )
        );
      }
    } catch (err) {
      console.error('Error updating status from list:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Subtitle */}
      <div>
        <p className="text-sm text-gray-500">Damage claims and complaints submitted by farmers</p>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.map((option) => {
          const isActive = statusFilter === option;
          const count =
            option === 'All'
              ? claims.length
              : claims.filter((c) => (c.status || '').toLowerCase() === option.toLowerCase()).length;

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

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-sm text-gray-500">
          Loading claims and complaints...
        </div>
      ) : (
        /* Vertical Stacked List of Claims */
        <div className="space-y-4">
          {filteredClaims.map((claim) => {
            const claimIdVal = claim.rawId || claim._id || claim.id;
            const cropNameVal = claim.cropType || claim.cropName || 'Paddy';
            const seasonVal = claim.season || 'Kharif';
            const damageVal = claim.damageType || claim.name || 'Heavy Rain';

            return (
              <div
                key={claim.id || claim._id || claim.rawId}
                className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm hover:border-[#15803D] hover:shadow-md transition-all"
              >
                {/* Top Header Row: Crop Name & Season & Damage Type & Status Changer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-4 flex-wrap gap-y-2">
                    <div className="flex items-center space-x-1.5 text-sm text-gray-900 font-bold">
                      <span className="text-xs text-gray-400 font-normal">Crop Name:</span>
                      <span className="text-[#15803D]">{cropNameVal}</span>
                    </div>

                    <span className="text-gray-300 hidden sm:inline">•</span>

                    <div className="flex items-center space-x-1.5 text-sm text-gray-900 font-bold">
                      <span className="text-xs text-gray-400 font-normal">Season:</span>
                      <span>{seasonVal}</span>
                    </div>

                    <span className="text-gray-300 hidden sm:inline">•</span>

                    <div className="flex items-center space-x-1.5 text-sm text-gray-900 font-bold">
                      <span className="text-xs text-gray-400 font-normal">Damage:</span>
                      <span className="text-amber-800">{damageVal}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge status={claim.status || 'Pending'} />

                    {/* Quick Status Select Dropdown for Admin */}
                    <select
                      value={claim.status || 'Pending'}
                      onChange={(e) => handleQuickStatusChange(claimIdVal, e.target.value)}
                      className="text-xs font-semibold bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#15803D] cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Under review">Under review</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Divider & Meta Bar Row (NO Description shown in List) */}
                <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-gray-500">
                  {/* Left Meta Information */}
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                    <div className="flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span>Farmer: <strong className="font-semibold text-gray-800">{claim.farmerName}</strong></span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>Submitted: <strong className="font-medium text-gray-800">{claim.submittedDate}</strong></span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200 text-sky-900 font-medium">
                      <CloudRain className="w-3.5 h-3.5 text-sky-600" />
                      <span>Upload Weather: <strong className="font-bold text-sky-900">{claim.uploadDateWeather?.weatherCondition || 'Heavy Rain (48.5mm)'}</strong></span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Est. Loss: <strong className="font-bold text-amber-700">{claim.estimatedLossPercent || 65}%</strong></span>
                    </div>
                  </div>

                  {/* Right Action Button -> Navigates to dedicated /claims/:claimId review tab */}
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => navigate(`/claims/${claim.rawId || claim._id || claim.id}`)}
                      className="inline-flex items-center space-x-1 px-4 py-2 text-xs font-bold text-white bg-[#15803D] hover:bg-[#166534] rounded-lg shadow-sm transition-all"
                    >
                      <span>Review Claim</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredClaims.length === 0 && (

            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-sm text-gray-500">
              No claims found for status "{statusFilter}".
            </div>
          )}
        </div>
      )}
    </div>
  );
};
