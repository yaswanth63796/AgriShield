import { mockFarmers } from '../data/farmers';
import { mockRegisteredCrops } from '../data/registeredCrops';
import { mockClaims } from '../data/claims';

const API_BASE_URL = 'http://localhost:5000/api/admin';

export const apiService = {
  // ── Fetch Admin Dashboard Stats ─────────────────────────────────────────────
  async getDashboardStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard-stats`, {
        signal: AbortSignal.timeout(4000),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return {
            stats: data.stats,
            dbDetails: data.dbDetails,
            recentClaims: data.recentClaims || [],
            isLiveDB: true,
          };
        }
      }
    } catch (e) {
      console.warn('Backend API offline or unreachable, using initial fallback:', e);
    }

    return {
      stats: {
        totalFarmers: mockFarmers.length,
        totalCrops: mockRegisteredCrops.length,
        pendingClaims: mockClaims.filter((c) => c.status === 'Pending').length,
        approvedClaims: mockClaims.filter((c) => c.status === 'Approved').length,
      },
      dbDetails: {
        status: 'Active Live System',
        databaseName: 'agriguard',
        host: 'localhost:27017',
        collections: {
          users: mockFarmers.length,
          registeredCrops: mockRegisteredCrops.length,
          claims: mockClaims.length,
          schemes: 5,
        }
      },
      recentClaims: mockClaims.slice(0, 5),
      isLiveDB: false,
    };
  },

  // ── Fetch All Farmers List ────────────────────────────────────────────────
  async getFarmers() {
    try {
      const response = await fetch(`${API_BASE_URL}/farmers`, {
        signal: AbortSignal.timeout(4000),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.farmers)) {
          return data.farmers;
        }
      }
    } catch (e) {
      console.warn('Backend API offline for farmers:', e);
    }
    return mockFarmers;
  },

  // ── Fetch All Registered Crops List ───────────────────────────────────────
  async getRegisteredCrops() {
    try {
      const response = await fetch(`${API_BASE_URL}/crops`, {
        signal: AbortSignal.timeout(4000),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.crops)) {
          return data.crops;
        }
      }
    } catch (e) {
      console.warn('Backend API offline for crops:', e);
    }
    return mockRegisteredCrops;
  },

  // ── Fetch Single Crop Details by ID ───────────────────────────────────────
  async getCropById(cropId) {
    try {
      const response = await fetch(`${API_BASE_URL}/crops/${cropId}`, {
        signal: AbortSignal.timeout(4000),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.crop) {
          return data.crop;
        }
      }
    } catch (e) {
      console.warn('Backend API offline for crop details:', e);
    }
    return mockRegisteredCrops.find((c) => c.id === cropId);
  },

  // ── Fetch All Claims / Complaints List ────────────────────────────────────
  async getClaims() {
    try {
      const response = await fetch(`${API_BASE_URL}/claims`, {
        signal: AbortSignal.timeout(4000),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.claims)) {
          return data.claims;
        }
      }
    } catch (e) {
      console.warn('Backend API offline for claims:', e);
    }
    return mockClaims;
  },
};
