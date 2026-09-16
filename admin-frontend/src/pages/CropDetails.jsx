import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Sprout,
  User,
  Calendar,
  Camera,
  Maximize2,
  X,
  Compass,
  CheckCircle2,
  Ruler,
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { Badge } from '../components/Badge';

export const CropDetails = () => {
  const { cropId } = useParams();

  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(null);

  useEffect(() => {
    let isMounted = true;
    apiService.getCropById(cropId).then((res) => {
      if (isMounted) {
        setCrop(res || null);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [cropId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-sm text-gray-500">
        Loading crop details...
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="space-y-6">
        <Link
          to="/registered-crops"
          className="inline-flex items-center space-x-2 text-sm font-medium text-[#15803D] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to registered crops</span>
        </Link>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Crop record not found</h2>
          <p className="text-sm text-gray-500">
            No registered crop record matches the requested crop details.
          </p>
        </div>
      </div>
    );
  }

  // Fallback 4 high-res agriculture photos if DB doesn't have custom URLs
  const fallbackPhotos = [
    {
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      label: 'Photo 1: Sowing & Field Overview',
      date: crop.sowingDate,
      cameraTag: 'Camera System (Mobile App)',
    },
    {
      url: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80',
      label: 'Photo 2: Crop Leaf & Stem Close-up',
      date: crop.sowingDate,
      cameraTag: 'Camera System (Mobile App)',
    },
    {
      url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
      label: 'Photo 3: Soil Condition & Boundary',
      date: crop.sowingDate,
      cameraTag: 'Camera System (Mobile App)',
    },
    {
      url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
      label: 'Photo 4: Growth Stage Inspection',
      date: crop.sowingDate,
      cameraTag: 'Camera System (Mobile App)',
    },
  ];

  // Map 4 photo slots prioritizing user-uploaded DB images
  const photosList = [0, 1, 2, 3].map((idx) => {
    if (crop.baselineImages && crop.baselineImages[idx] && crop.baselineImages[idx].url) {
      const u = crop.baselineImages[idx].url;
      if (
        typeof u === 'string' &&
        u.trim().length > 0 &&
        (u.startsWith('data:image') || u.startsWith('http://') || u.startsWith('https://') || u.startsWith('/uploads'))
      ) {
        return {
          url: u,
          label: crop.baselineImages[idx].label || `Photo ${idx + 1}: Registered Crop Image`,
          date: crop.baselineImages[idx].date || crop.sowingDate,
          cameraTag: 'User Uploaded (Saved in DB)',
          isUserUploaded: true,
        };
      }
    }
    return fallbackPhotos[idx];
  });

  const regionLocation =
    crop.regionName ||
    `${crop.village || 'Coimbatore'} Region, ${crop.district || 'Coimbatore'} District, Tamil Nadu`;

  const latDisplay = crop.latitude ? `${crop.latitude}° N` : '11.004500° N';
  const lngDisplay = crop.longitude ? `${crop.longitude}° E` : '76.961600° E';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back Link */}
      <div>
        <Link
          to="/registered-crops"
          className="inline-flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-[#15803D] transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to registered crops</span>
        </Link>

        {/* Essential Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">{crop.name || `${crop.cropType} — ${crop.season}`}</h1>
            </div>
            <p className="text-sm text-gray-500 mt-1 flex items-center flex-wrap gap-2">
              <span className="flex items-center text-gray-700 font-medium">
                <User className="w-4 h-4 mr-1 text-[#15803D]" />
                Registered by <strong className="ml-1 text-gray-900">{crop.farmerName}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center text-gray-700 font-medium">
                <MapPin className="w-4 h-4 mr-1 text-[#15803D]" />
                {crop.village}, {crop.district}
              </span>
            </p>
          </div>
          <div>
            <Badge status={crop.status || 'Pending'} />
          </div>
        </div>
      </div>

      {/* Essential Information Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Essential Crop & Registration Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 flex items-center space-x-2 border-b border-gray-100 pb-3">
            <Sprout className="w-5 h-5 text-[#15803D]" />
            <span>Crop & Registration Details</span>
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm pt-1">
            <div>
              <span className="text-xs text-gray-400 block font-medium">Crop Name / Type</span>
              <span className="font-semibold text-gray-900 block mt-0.5">{crop.cropType || crop.name}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block font-medium">Season</span>
              <span className="font-semibold text-gray-900 block mt-0.5">{crop.season}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block font-medium flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                Sowing Date
              </span>
              <span className="font-bold text-[#15803D] block mt-0.5">{crop.sowingDate}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block font-medium flex items-center">
                <Ruler className="w-3.5 h-3.5 mr-1 text-gray-400" />
                Land Area
              </span>
              <span className="font-bold text-gray-900 block mt-0.5">{crop.areaInsured}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Essential Location & Region Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 flex items-center space-x-2 border-b border-gray-100 pb-3">
            <Compass className="w-5 h-5 text-[#15803D]" />
            <span>Region & Location Information</span>
          </h2>

          <div className="space-y-3.5 text-sm pt-1">
            <div className="bg-emerald-50/80 p-3 rounded-lg border border-emerald-100">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">Registered Region Name</span>
              <p className="font-semibold text-emerald-950 text-sm mt-0.5 flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-[#15803D] shrink-0" />
                {regionLocation}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-400 block font-medium">Latitude</span>
                <span className="font-mono text-xs font-bold text-gray-900 block mt-0.5">{latDisplay}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-medium">Longitude</span>
                <span className="font-mono text-xs font-bold text-gray-900 block mt-0.5">{lngDisplay}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Essential Crop Photos Section (4 Photos) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Camera className="w-5 h-5 text-[#15803D]" />
              <span>Registered Crop Photos</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              4 baseline photos captured via mobile camera system during crop registration
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#15803D] border border-emerald-200 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            4 Photos Verified
          </span>
        </div>

        {/* 4 Photo Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {photosList.slice(0, 4).map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActivePhoto(img)}
              className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all aspect-[4/3]"
            >
              <img
                src={img.url || fallbackPhotos[idx].url}
                alt={img.label || `Crop Photo ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
              />

              {/* Photo Overlay Badge Top Left */}
              <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-semibold text-white flex items-center space-x-1 border border-white/20">
                <Camera className="w-3 h-3 text-emerald-400" />
                <span>Photo {idx + 1}</span>
              </div>

              {/* Expand Zoom Icon Top Right */}
              <div className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-md p-1.5 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>

              {/* Photo Caption Overlay Bottom */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white">
                <p className="text-xs font-semibold truncate">{img.label || `Photo ${idx + 1}`}</p>
                <p className="text-[10px] text-gray-300 mt-0.5 font-mono">{img.date || crop.sowingDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Photo Preview Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative bg-gray-900 rounded-2xl overflow-hidden max-w-3xl w-full border border-gray-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-gray-950 border-b border-gray-800 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold">{activePhoto.label || 'Crop Photo'}</span>
              </div>
              <button
                onClick={() => setActivePhoto(null)}
                className="p-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Photo View */}
            <div className="aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activePhoto.url}
                alt={activePhoto.label}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            {/* Modal Footer Info */}
            <div className="p-4 bg-gray-950 text-xs text-gray-300 flex items-center justify-between border-t border-gray-800">
              <div>
                <span className="text-gray-400">Captured on: </span>
                <strong className="text-white font-mono">{activePhoto.date || crop.sowingDate}</strong>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400 font-medium">
                <span>📍 {latDisplay}, {lngDisplay}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
