import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, LocateFixed, Plus, Minus, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { AuthLogo } from '../../components/auth/AuthLogo';
import { AuthButton } from '../../components/auth/AuthButton';
import { WorkerOnboardingProgress } from '../../components/auth/WorkerOnboardingProgress';
import { onboardingService } from '../../services/onboardingService';

interface LocationSuggestion {
  id: string;
  title: string;
  subtitle: string;
  lat: number;
  lng: number;
}

const MOCK_SUGGESTIONS: LocationSuggestion[] = [
  { id: '1', title: 'Kapurthala', subtitle: 'Punjab, India', lat: 31.3802, lng: 75.3816 },
  { id: '2', title: 'Kapurthala Bus Stand', subtitle: 'Kapurthala, Punjab', lat: 31.3789, lng: 75.3852 },
  { id: '3', title: 'Jalandhar Road', subtitle: 'Kapurthala, Punjab', lat: 31.3855, lng: 75.3991 },
  { id: '4', title: 'Sultanpur Lodhi', subtitle: 'Kapurthala District, Punjab', lat: 31.2178, lng: 75.1978 },
  { id: '5', title: 'Model Town', subtitle: 'Jalandhar, Punjab', lat: 31.3129, lng: 75.5806 },
  { id: '6', title: 'Civil Lines', subtitle: 'Jalandhar, Punjab', lat: 31.3260, lng: 75.5762 },
  { id: '7', title: 'Sector 17', subtitle: 'Chandigarh, Punjab & Haryana', lat: 30.7398, lng: 76.7827 },
  { id: '8', title: 'Amritsar Cantt', subtitle: 'Amritsar, Punjab', lat: 31.6340, lng: 74.8723 },
  { id: '9', title: 'Ludhiana Central', subtitle: 'Ludhiana, Punjab', lat: 30.9010, lng: 75.8573 },
  { id: '10', title: 'Phagwara', subtitle: 'Kapurthala District, Punjab', lat: 31.2240, lng: 75.7708 },
];

export const WorkerLocation: React.FC = () => {
  const navigate = useNavigate();

  // Location State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocationName, setSelectedLocationName] = useState<string>('');
  const [locationSource, setLocationSource] = useState<'searched_location' | 'current_location' | 'map_pin' | null>(null);
  const [coordinates, setCoordinates] = useState({ lat: 31.3802, lng: 75.3816 });

  // UI state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [zoomLevel, setZoomLevel] = useState(14);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialOffsetX: 0, initialOffsetY: 0 });

  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter dynamic suggestions based on search query
  const filteredSuggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return MOCK_SUGGESTIONS.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Handle suggestion selection
  const handleSelectSuggestion = (item: LocationSuggestion) => {
    const fullName = `${item.title}, ${item.subtitle}`;
    setSelectedLocationName(fullName);
    setSearchQuery(fullName);
    setLocationSource('searched_location');
    setCoordinates({ lat: item.lat, lng: item.lng });
    setMapOffset({ x: 0, y: 0 });
    setIsDropdownOpen(false);
    if (errorMessage) setErrorMessage(undefined);
  };

  // Handle "Use Current Location" button
  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if (errorMessage) setErrorMessage(undefined);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoordinates({ lat, lng });
          const detectedName = 'Current Location (Kapurthala, Punjab)';
          setSelectedLocationName(detectedName);
          setSearchQuery(detectedName);
          setLocationSource('current_location');
          setMapOffset({ x: 0, y: 0 });
          setIsLocating(false);
        },
        () => {
          // Fallback simulation if permission denied/desktop
          setTimeout(() => {
            const fallbackName = 'Kapurthala, Punjab (Current Location)';
            setSelectedLocationName(fallbackName);
            setSearchQuery(fallbackName);
            setLocationSource('current_location');
            setCoordinates({ lat: 31.3802, lng: 75.3816 });
            setMapOffset({ x: 0, y: 0 });
            setIsLocating(false);
          }, 600);
        },
        { timeout: 5000 }
      );
    } else {
      setTimeout(() => {
        const fallbackName = 'Kapurthala, Punjab (Current Location)';
        setSelectedLocationName(fallbackName);
        setSearchQuery(fallbackName);
        setLocationSource('current_location');
        setCoordinates({ lat: 31.3802, lng: 75.3816 });
        setMapOffset({ x: 0, y: 0 });
        setIsLocating(false);
      }, 500);
    }
  };

  // Map pan/drag interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialOffsetX: mapOffset.x,
      initialOffsetY: mapOffset.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    setMapOffset({
      x: dragStartRef.current.initialOffsetX + deltaX,
      y: dragStartRef.current.initialOffsetY + deltaY,
    });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setLocationSource('map_pin');
      if (!selectedLocationName) {
        setSelectedLocationName('Pinned Location (Kapurthala Service Area)');
      }
      if (errorMessage) setErrorMessage(undefined);
    }
  };

  // Touch handlers for mobile map dragging
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        initialOffsetX: mapOffset.x,
        initialOffsetY: mapOffset.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStartRef.current.x;
    const deltaY = e.touches[0].clientY - dragStartRef.current.y;
    setMapOffset({
      x: dragStartRef.current.initialOffsetX + deltaX,
      y: dragStartRef.current.initialOffsetY + deltaY,
    });
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      setLocationSource('map_pin');
      if (!selectedLocationName) {
        setSelectedLocationName('Pinned Location (Kapurthala Service Area)');
      }
      if (errorMessage) setErrorMessage(undefined);
    }
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 1, 18));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 1, 10));

  // Continue to next onboarding / dashboard
  const handleContinue = () => {
    if (!selectedLocationName.trim() && !locationSource) {
      setErrorMessage('Please select your service location.');
      return;
    }

    const locationData = {
      name: selectedLocationName || 'Kapurthala Service Area',
      source: locationSource || 'map_pin',
      coordinates,
    };

    sessionStorage.setItem('gigsevak_worker_location', JSON.stringify(locationData));
    onboardingService.updateState({ isLocationCompleted: true });
    navigate('/worker/dashboard');
  };

  return (
    <main className="min-h-[100dvh] w-full bg-slate-50/60 sm:bg-slate-50/50 flex flex-col items-center p-4 sm:p-6 py-4 sm:py-6 antialiased">
      <div className="w-full max-w-[560px] mx-auto flex flex-col items-center">
        {/* Brand Logo & Progress Strip */}
        <header className="mb-2 sm:mb-3 flex flex-col items-center gap-1 w-full">
          <AuthLogo />
          <div className="w-full -mt-2 sm:-mt-3">
            <WorkerOnboardingProgress
              currentStep={3}
              step1Progress={100}
              step2Progress={100}
              step3Progress={50}
            />
          </div>
        </header>

        {/* Location Box Container */}
        <div className="w-full bg-white rounded-2xl border border-slate-200/80 sm:border-slate-100 shadow-card p-5 sm:p-8 space-y-5">
          {/* Header Section */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-[#222222]">
              Where do you provide your services?
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B6B6B] leading-relaxed max-w-[380px] mx-auto">
              Choose your location so customers near you can find you.
            </p>
          </div>

          {/* ========================================================================= */}
          {/* OPTION 1: SEARCH LOCATION INPUT & DROPDOWN */}
          {/* ========================================================================= */}
          <div ref={searchContainerRef} className="relative w-full space-y-1">
            <label className="block text-xs font-semibold text-[#222222]">
              Enter your location
            </label>
            <div className="relative">
              <Search className="w-5 h-5 text-[#6B6B6B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                  if (errorMessage) setErrorMessage(undefined);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) setIsDropdownOpen(true);
                }}
                placeholder="Enter your location"
                className="w-full h-12 sm:h-13 pl-11 pr-4 rounded-xl border border-[#D9D9D9] bg-white text-sm sm:text-[15px] text-[#222222] placeholder:text-[#6B6B6B]/60 focus:outline-none focus:border-[#A66666] focus:ring-2 focus:ring-[#A66666]/20 transition-all"
              />
            </div>

            {/* Suggestions Dropdown */}
            {isDropdownOpen && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#D9D9D9] rounded-xl shadow-lg z-30 max-h-56 overflow-y-auto divide-y divide-slate-100">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectSuggestion(item)}
                      className="w-full px-4 py-3 text-left hover:bg-slate-50 flex items-start gap-3 transition-colors group cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-[#A66666] flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#222222] truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-[#6B6B6B] truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-[#6B6B6B]">
                    No locations matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* OR DIVIDER */}
          {/* ========================================================================= */}
          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider absolute">
              OR
            </span>
          </div>

          {/* ========================================================================= */}
          {/* OPTION 2: USE CURRENT LOCATION BUTTON */}
          {/* ========================================================================= */}
          <div>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="w-full h-13 sm:h-14 rounded-xl font-semibold text-[15px] sm:text-base border border-[#A66666] text-[#A66666] bg-white hover:bg-[#A66666]/5 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 shadow-sm disabled:opacity-60 cursor-pointer"
            >
              {isLocating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-[#A66666]" />
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <LocateFixed className="w-5 h-5 text-[#A66666]" />
                  <span>Use Current Location</span>
                </>
              )}
            </button>
          </div>

          {/* ========================================================================= */}
          {/* INTERACTIVE MAP COMPONENT */}
          {/* ========================================================================= */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-semibold text-[#222222]">
                Pinpoint your exact service location on the map.
              </p>
              {selectedLocationName && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#A66666] bg-[#A66666]/10 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-[#A66666]" />
                  Selected
                </span>
              )}
            </div>

            {/* Map Canvas / Viewport */}
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-full h-[220px] sm:h-[260px] rounded-xl overflow-hidden border border-[#D9D9D9] bg-[#E5E9EC] select-none cursor-grab active:cursor-grabbing shadow-inner"
            >
              {/* Styled Mock Map Vector Background */}
              <svg
                className="w-full h-full absolute inset-0 pointer-events-none"
                style={{
                  transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${zoomLevel / 14})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                }}
                viewBox="0 0 600 400"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background Terrain */}
                <rect width="600" height="400" fill="#F4F3F0" />
                {/* Parks / Greenery */}
                <path d="M 50 40 Q 120 20 180 60 T 220 160 T 120 220 T 40 120 Z" fill="#E2EED9" />
                <path d="M 400 240 Q 480 200 540 260 T 560 360 T 460 380 T 380 300 Z" fill="#E2EED9" />
                {/* Water Body / Canal */}
                <path d="M 0 320 C 150 300 250 370 420 330 C 500 310 550 340 600 320 L 600 400 L 0 400 Z" fill="#CDE3F5" />
                {/* Secondary Roads */}
                <path d="M 0 80 L 600 80 M 0 200 L 600 200 M 0 290 L 600 290 M 120 0 L 120 400 M 340 0 L 340 400 M 480 0 L 480 400" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
                <path d="M 0 80 L 600 80 M 0 200 L 600 200 M 0 290 L 600 290 M 120 0 L 120 400 M 340 0 L 340 400 M 480 0 L 480 400" stroke="#E6E3DB" strokeWidth="4" strokeLinecap="round" />
                {/* Main Arterial Road (GT Road / Highway) */}
                <path d="M 0 140 C 200 130 350 170 600 120" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" fill="none" />
                <path d="M 0 140 C 200 130 350 170 600 120" stroke="#FBD79F" strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M 260 0 C 270 150 250 250 280 400" stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" fill="none" />
                <path d="M 260 0 C 270 150 250 250 280 400" stroke="#FBD79F" strokeWidth="6" strokeLinecap="round" fill="none" />
                {/* City Landmark labels */}
                <text x="210" y="115" fill="#888075" fontSize="11" fontWeight="600" fontFamily="sans-serif">Kapurthala City</text>
                <text x="360" y="70" fill="#999187" fontSize="10" fontFamily="sans-serif">Shalimar Garden</text>
                <text x="140" y="270" fill="#999187" fontSize="10" fontFamily="sans-serif">Sultanpur Rd</text>
                <text x="410" y="230" fill="#999187" fontSize="10" fontFamily="sans-serif">Jalandhar Bypass</text>
              </svg>

              {/* Fixed Pin Marker in Center of Map */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="relative flex flex-col items-center -translate-y-4">
                  {/* Pin Icon */}
                  <div className="w-10 h-10 rounded-full bg-[#A66666] flex items-center justify-center text-white shadow-lg border-2 border-white animate-bounce-subtle">
                    <MapPin className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  {/* Pin Shadow on Ground */}
                  <div className="w-3.5 h-1.5 bg-black/30 rounded-full blur-[1px] mt-0.5" />
                </div>
              </div>

              {/* Zoom Controls */}
              <div className="absolute right-3 bottom-3 flex flex-col bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden z-20">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  aria-label="Zoom in"
                  className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 border-b border-slate-100 text-[#222222] active:bg-slate-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  aria-label="Zoom out"
                  className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 text-[#222222] active:bg-slate-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>

              {/* Pan Drag Indicator Hint */}
              <div className="absolute left-3 bottom-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-medium text-[#6B6B6B] border border-slate-200/80 pointer-events-none">
                Drag map to pinpoint
              </div>
            </div>

            {/* Selected Location Summary Banner */}
            {selectedLocationName && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 text-xs text-[#222222]">
                <MapPin className="w-4 h-4 text-[#A66666] flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{selectedLocationName}</p>
                  <p className="text-[11px] text-[#6B6B6B]">
                    Coordinates: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-[#953638] font-medium pt-1 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CONTINUE BUTTON */}
          {/* ========================================================================= */}
          <div className="pt-2 border-t border-slate-100">
            <AuthButton
              type="button"
              variant="outline"
              onClick={handleContinue}
            >
              Continue
            </AuthButton>
          </div>
        </div>
      </div>
    </main>
  );
};

