import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Sprout, FileWarning, CheckCircle2, ChevronRight, Activity, ShieldCheck } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { apiService } from '../services/apiService';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    apiService.getDashboardStats().then((res) => {
      if (isMounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = data?.stats || {
    totalFarmers: 0,
    totalCrops: 0,
    pendingClaims: 0,
    approvedClaims: 0,
  };

  const recentClaims = data?.recentClaims || [];

  return (
    <div className="space-y-8">
      {/* Admin Panel Welcome / System Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-green-800 to-emerald-900 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
              <h2 className="text-xl font-bold tracking-tight">AgroShield Executive Admin Panel</h2>
            </div>
            <p className="text-xs text-emerald-100/90 font-medium">
              Real-time crop insurance monitoring, farmer management, and loss claim assessment
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/15 text-xs font-semibold shrink-0">
            <Activity className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            <span>Active Live Portal</span>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          value={loading ? '...' : stats.totalFarmers}
          label="Total farmers"
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={Sprout}
          value={loading ? '...' : stats.totalCrops}
          label="Registered crops"
          iconBg="bg-green-50"
          iconColor="text-[#15803D]"
        />
        <StatCard
          icon={FileWarning}
          value={loading ? '...' : stats.pendingClaims}
          label="Pending claims"
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          icon={CheckCircle2}
          value={loading ? '...' : stats.approvedClaims}
          label="Claims approved"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
      </div>

      {/* Recent Claims Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent claims</h2>
            <p className="text-sm text-gray-500 mt-0.5">Latest insurance claims requiring review</p>
          </div>
          <button
            onClick={() => navigate('/claims')}
            className="text-sm font-medium text-[#15803D] hover:text-[#166534] flex items-center space-x-1"
          >
            <span>View all</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-200 overflow-x-auto">
          {recentClaims.map((claim) => (
            <div
              key={claim.id || claim._id || claim.rawId}
              onClick={() => navigate('/claims')}
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-sm font-semibold text-gray-900">{claim.name}</h3>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Farmer: <strong className="font-medium text-gray-700">{claim.farmerName}</strong></span>
                  <span>•</span>
                  <span>Crop: <strong className="font-medium text-gray-700">{claim.cropName}</strong></span>
                </div>
              </div>

              <div className="flex items-center space-x-4 shrink-0 justify-between sm:justify-end">
                <Badge status={claim.status} />
                <span className="text-xs text-gray-500">{claim.submittedDate}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 hidden sm:block" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

