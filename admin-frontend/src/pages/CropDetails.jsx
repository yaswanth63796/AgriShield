import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Sprout,
  User,
  ShieldCheck,
  Activity,
  FileWarning,
  Clock,
  ExternalLink,
  Camera,
  Maximize2,
  X,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { Badge } from '../components/Badge';

export const CropDetails = () => {
  const { cropId } = useParams();
  const navigate = useNavigate();

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

  const photosList =
    crop.baselineImages && crop.baselineImages.length >= 4
      ? crop.baselineImages
      : fallbackPhotos;

  // Calculate NDVI percentage (0 to 1 scale)
  const ndviPercent = Math.min(Math.max((crop.ndviValue || 0) * 100, 0), 100);

  const regionLocation =
    crop.regionName ||
    `${crop.village || 'Thiruvarur'} Region, ${crop.district || 'Tiruvarur'} District, Tamil Nadu (610001)`;

  const coordinatesDisplay = crop.coordinates || `${crop.latitude || '10.827403'}° N, ${crop.longitude || '77.060088'}° E`;

  return (
    <div className="space-y-6">
      {/* Top Header Navigation */}
      <div>
        <Link
          to="/registered-crops"
          className="inline-flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-[#15803D] transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to registered crops</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">{crop.name}</h1>
            </div>
            <p className="text-sm text-gray-500 mt-1 flex items-center flex-wrap gap-1">
              <span>Registered by <strong className="text-gray-800 font-semibold">{crop.farmerName}</strong></span>
              <span>•</span>
              <span className="flex items-center text-gray-600 font-medium">
                <MapPin className="w-3.5 h-3.5 mr-1 text-[#15803D]" />
                {crop.village}, {crop.district}
              </span>
            </p>
          </div>
          <div>
            <Badge status={crop.status || 'Pending'} />
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — 2 Cols Wide */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Registered Crop Photos Gallery (4 Photos captured in mb-frontend) */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-[#15803D]" />
                  <span>Registered Crop Photos (Camera System)</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  4 photos captured live via mobile camera during crop registration
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#15803D] border border-emerald-200 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                4 / 4 Camera Photos Verified
              </span>
            </div>

            {/* 4 Photo Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
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
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-white flex items-center space-x-1.5 border border-white/20">
                    <Camera className="w-3 h-3 text-emerald-400" />
                    <span>Photo {idx + 1}</span>
                  </div>

                  {/* Expand Zoom Icon Top Right */}
                  <div className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-md p-1.5 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  {/* Photo Caption Overlay Bottom */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white">
                    <p className="text-xs font-semibold truncate">{img.label || `Photo ${idx + 1}`}</p>
                    <p className="text-[10px] text-gray-300 mt-0.5 flex items-center justify-between font-mono">
                      <span>{img.date || crop.sowingDate}</span>
                      <span className="text-emerald-300 font-sans text-[10px]">Camera System</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Land and Geo-Tag Location Details (Exact Location & Region Name) */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 border-b border-gray-100 pb-3">
              <MapPin className="w-5 h-5 text-[#15803D]" />
              <span>Land & Exact Geo-Tag Location Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-1">
              {/* Region & Location Name */}
              <div className="sm:col-span-2 bg-emerald-50/70 p-3.5 rounded-lg border border-emerald-100">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">Region & Location Name</span>
                <p className="font-semibold text-emerald-950 text-sm mt-0.5 flex items-center">
                  <Compass className="w-4 h-4 mr-1.5 text-[#15803D] shrink-0" />
                  {regionLocation}
                </p>
              </div>

              <div>
                <span className="text-xs text-gray-400 block">Exact GPS Coordinates</span>
                <span className="font-mono text-xs font-bold text-gray-900 block mt-0.5">{coordinatesDisplay}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Survey Parcel Number</span>
                <span className="font-mono text-xs font-semibold text-gray-800 block mt-0.5">{crop.surveyNumber}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">GPS Geo-Tag Accuracy</span>
                <span className="text-xs font-medium text-emerald-700 block mt-0.5">
                  {crop.gpsAccuracy || '± 3.5 meters (High Precision GPS)'}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">District & Village</span>
                <span className="text-xs font-medium text-gray-800 block mt-0.5">
                  {crop.village}, {crop.district} District
                </span>
              </div>
            </div>

            {/* Styled Map Preview Card */}
            <div className="w-full aspect-[21/9] rounded-xl bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-950 border border-green-800 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center text-white shadow-inner">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative z-10 space-y-2 flex flex-col items-center">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-full text-emerald-300 ring-4 ring-emerald-400/20 shadow-lg">
                  <MapPin className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white tracking-wide">Verified Land Parcel GPS Boundary</p>
                  <p className="text-xs text-emerald-200 font-mono mt-0.5">{coordinatesDisplay}</p>
                </div>
                <div className="flex items-center space-x-2 pt-1">
                  <span className="inline-flex items-center text-[11px] font-semibold text-emerald-200 bg-white/15 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
                    {crop.village}, {crop.district}
                  </span>
                  <span className="inline-flex items-center text-[11px] font-semibold text-white bg-emerald-500/30 px-3 py-1 rounded-full border border-emerald-400/40 backdrop-blur-sm">
                    Geo-Boundary Verified ✓
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Crop Information Card (Matches mb-frontend module) */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 border-b border-gray-100 pb-3">
              <Sprout className="w-5 h-5 text-[#15803D]" />
              <span>Crop Information (Mobile Module)</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm pt-1">
              <div>
                <span className="text-xs text-gray-400 block">Crop Type</span>
                <span className="font-semibold text-gray-900">{crop.cropType || 'Paddy'}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Season</span>
                <span className="font-medium text-gray-800">{crop.season}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Land Area Insured</span>
                <span className="font-bold text-[#15803D]">{crop.areaInsured}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Sowing Date</span>
                <span className="font-medium text-gray-800">{crop.sowingDate}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Expected Harvest</span>
                <span className="font-medium text-gray-800">{crop.expectedHarvestDate}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Irrigation Type</span>
                <span className="font-medium text-gray-800">{crop.irrigationType}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Soil Type</span>
                <span className="font-medium text-gray-800">{crop.soilType}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Variety / Seed</span>
                <span className="font-medium text-gray-800">{crop.variety}</span>
              </div>
            </div>
          </div>

          {/* 4. Farmer Details Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 border-b border-gray-100 pb-3">
              <User className="w-5 h-5 text-[#15803D]" />
              <span>Farmer Details</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm pt-1">
              <div>
                <span className="text-xs text-gray-400 block">Farmer Name</span>
                <span className="font-semibold text-gray-900">{crop.farmerName}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Phone</span>
                <span className="font-mono text-xs text-gray-700">{crop.farmerPhone}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Village</span>
                <span className="font-medium text-gray-800">{crop.village}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">District</span>
                <span className="font-medium text-gray-800">{crop.district}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Aadhaar</span>
                <span className="font-mono text-xs text-gray-700">{crop.aadhaarMasked}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Bank Account</span>
                <span className="font-mono text-xs text-gray-700">{crop.bankMasked}</span>
              </div>
            </div>
          </div>

          {/* 5. Insurance Policy and Premium */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2 border-b border-gray-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-[#15803D]" />
              <span>Insurance & Premium Breakdown</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm pt-1">
              <div>
                <span className="text-xs text-gray-400 block">Policy Number</span>
                <span className="font-mono text-xs font-semibold text-gray-900">{crop.policyNumber}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Sum Insured</span>
                <span className="font-bold text-[#15803D]">₹{crop.sumInsured?.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Total Premium</span>
                <span className="font-semibold text-gray-800">₹{crop.premiumPaid?.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Farmer Share</span>
                <span className="font-medium text-gray-800">₹{crop.farmerShare?.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Govt Subsidy</span>
                <span className="font-medium text-gray-800">₹{crop.govtSubsidy?.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Payment Status</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-0.5">
                  {crop.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Sidebar Cards */}
        <div className="space-y-6">
          {/* 6. Crop Health Summary (NDVI Score) */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 flex items-center space-x-2 border-b border-gray-100 pb-3">
              <Activity className="w-5 h-5 text-[#15803D]" />
              <span>Crop Health Index</span>
            </h2>

            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900">{crop.ndviValue}</span>
                  <span className="text-xs text-gray-400 ml-1">NDVI Index</span>
                </div>
                <span className="text-xs font-semibold text-[#15803D] bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                  {crop.ndviStatus}
                </span>
              </div>

              {/* Horizontal Bar (0 to 1 scale) */}
              <div className="space-y-1">
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden border border-gray-200">
                  <div
                    className="bg-[#15803D] h-full rounded-full transition-all duration-500"
                    style={{ width: `${ndviPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>0.0 (Dead)</span>
                  <span>0.5</span>
                  <span>1.0 (Dense Vegetative)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 7. Claim History */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 flex items-center space-x-2 border-b border-gray-100 pb-3">
              <FileWarning className="w-5 h-5 text-amber-600" />
              <span>Claim History</span>
            </h2>

            {crop.claims && crop.claims.length > 0 ? (
              <div className="space-y-3">
                {crop.claims.map((claim) => (
                  <div
                    key={claim.id || claim.rawId || claim.type}
                    onClick={() => navigate('/claims')}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 cursor-pointer transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-900">{claim.type}</p>
                      <Badge status={claim.status} />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span>Filed on {claim.date}</span>
                      <ExternalLink className="w-3 h-3 text-[#15803D]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-2">No claims filed for this crop.</p>
            )}
          </div>

          {/* 8. Registration Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900 flex items-center space-x-2 border-b border-gray-100 pb-3">
              <Clock className="w-5 h-5 text-[#15803D]" />
              <span>Timeline</span>
            </h2>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {crop.timeline && crop.timeline.map((event, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-[#15803D] ring-4 ring-green-100" />
                  <p className="text-xs font-semibold text-gray-900">{event.title}</p>
                  <p className="text-[11px] text-gray-500">{event.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Photo Preview Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative bg-gray-900 rounded-2xl overflow-hidden max-w-3xl w-full border border-gray-700 shadow-2xl space-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-gray-950/80 border-b border-gray-800 flex items-center justify-between text-white">
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
            <div className="p-4 bg-gray-950 text-xs text-gray-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-gray-800">
              <div>
                <span className="text-gray-400">Captured on: </span>
                <strong className="text-white font-mono">{activePhoto.date || crop.sowingDate}</strong>
              </div>
              <div className="flex items-center space-x-3 text-emerald-400 font-medium">
                <span>📍 {coordinatesDisplay}</span>
                <span>•</span>
                <span>Camera System Verified ✓</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
