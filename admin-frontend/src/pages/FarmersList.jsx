import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { apiService } from '../services/apiService';
import { DataTable } from '../components/DataTable';

export const FarmersList = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  useEffect(() => {
    let isMounted = true;
    apiService.getFarmers().then((res) => {
      if (isMounted) {
        setFarmers(res);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Unique list of districts for filter dropdown
  const districts = useMemo(() => {
    const unique = Array.from(new Set(farmers.map((f) => f.district)));
    return ['All', ...unique];
  }, [farmers]);

  // Filtered farmers
  const filteredFarmers = useMemo(() => {
    return farmers.filter((farmer) => {
      const matchesSearch =
        farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDistrict =
        selectedDistrict === 'All' || farmer.district === selectedDistrict;

      return matchesSearch && matchesDistrict;
    });
  }, [farmers, searchTerm, selectedDistrict]);

  const columns = [
    {
      header: 'Farmer Name',
      key: 'name',
      render: (row) => <span className="font-semibold text-gray-900">{row.name}</span>,
    },
    {
      header: 'Village',
      key: 'village',
    },
    {
      header: 'District',
      key: 'district',
    },
    {
      header: 'Phone',
      key: 'phone',
      render: (row) => <span className="text-gray-600 font-mono text-xs">{row.phone}</span>,
    },
    {
      header: 'Registered crops',
      key: 'registeredCropsCount',
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-[#15803D]">
          {row.registeredCropsCount} crops
        </span>
      ),
    },
    {
      header: 'Active claims',
      key: 'activeClaimsCount',
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            row.activeClaimsCount > 0
              ? 'bg-amber-100 text-amber-800'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {row.activeClaimsCount} {row.activeClaimsCount === 1 ? 'claim' : 'claims'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Subtitle */}
      <div>
        <p className="text-sm text-gray-500">All registered farmers under PMFBY coverage</p>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:bg-white"
          />
        </div>

        {/* District Filter Dropdown */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="text-xs font-medium text-gray-600 shrink-0">District:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#15803D]"
          >
            {districts.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Farmers Table Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-sm text-gray-500">Loading registered farmers...</div>
        ) : filteredFarmers.length > 0 ? (
          <DataTable columns={columns} rows={filteredFarmers} />
        ) : (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm text-gray-500 font-medium">No farmers match your search.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDistrict('All');
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-[#15803D] bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear search</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
