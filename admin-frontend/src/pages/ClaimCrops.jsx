import React, { useState, useEffect, useMemo } from 'react';
import { User, Sprout, Calendar, AlertTriangle, ChevronRight } from 'lucide-react';
import { apiService } from '../services/apiService';
import { Badge } from '../components/Badge';

export const ClaimCrops = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

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

  return (
    <div className="space-y-6">
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
        /* Vertical Stacked List of Claims (Full-Width Cards) */
        <div className="space-y-4">
          {filteredClaims.map((claim) => (
            <div
              key={claim.id || claim._id || claim.rawId}
              className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-sm hover:border-[#15803D] transition-all"
            >
              {/* Top Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-base font-semibold text-gray-900">{claim.name}</h3>
                  </div>
                </div>
                <div>
                  <Badge status={claim.status || 'Pending'} />
                </div>
              </div>

              {/* Claim Description — Main Paragraph Content */}
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/70 p-4 rounded-lg border border-gray-100 italic">
                "{claim.description}"
              </p>

              {/* Thin Divider & Meta Row */}
              <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-gray-500">
                {/* Left Meta Information */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                  <div className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>Farmer: <strong className="font-medium text-gray-800">{claim.farmerName}</strong></span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Sprout className="w-3.5 h-3.5 text-gray-400" />
                    <span>Crop: <strong className="font-medium text-gray-800">{claim.cropName}</strong></span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>Submitted: <strong className="font-medium text-gray-800">{claim.submittedDate}</strong></span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Est. Loss: <strong className="font-bold text-amber-700">{claim.estimatedLossPercent || 60}%</strong></span>
                  </div>
                </div>

                {/* Right Action Button */}
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => alert(`Reviewing claim for ${claim.farmerName}`)}
                    className="inline-flex items-center space-x-1 font-medium text-[#15803D] hover:text-[#166534] transition-colors"
                  >
                    <span>View details</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

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
