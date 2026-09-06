import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Check, AlertCircle } from 'lucide-react';
import { AuthLogo } from '../../components/auth/AuthLogo';
import { AuthButton } from '../../components/auth/AuthButton';
import { WorkerOnboardingProgress } from '../../components/auth/WorkerOnboardingProgress';
import { onboardingService } from '../../services/onboardingService';

interface ServiceItem {
  id: string;
  name: string;
  image: string;
}

interface ServiceGroup {
  category: string;
  items: ServiceItem[];
}

const SERVICE_CATALOG: ServiceGroup[] = [
  {
    category: 'HOME REPAIR & MAINTENANCE',
    items: [
      { id: 'electrician', name: 'Electrician', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=160&q=80' },
      { id: 'plumber', name: 'Plumber', image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=160&q=80' },
      { id: 'carpenter', name: 'Carpenter', image: 'https://images.unsplash.com/photo-1502005229762-ee1b2b93e08c?auto=format&fit=crop&w=160&q=80' },
      { id: 'painter', name: 'Painter', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=160&q=80' },
      { id: 'mason', name: 'Mason', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=160&q=80' },
      { id: 'tile-worker', name: 'Tile Worker', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=160&q=80' },
      { id: 'flooring-worker', name: 'Flooring Worker', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=160&q=80' },
      { id: 'welder', name: 'Welder', image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=160&q=80' },
      { id: 'fabricator', name: 'Fabricator', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=160&q=80' },
      { id: 'waterproofing', name: 'Waterproofing Worker', image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=160&q=80' },
      { id: 'handyman', name: 'Handyman', image: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?auto=format&fit=crop&w=160&q=80' },
      { id: 'furniture-repair', name: 'Furniture Repair', image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=160&q=80' },
      { id: 'furniture-assembly', name: 'Furniture Assembly', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=160&q=80' },
      { id: 'door-window-repair', name: 'Door & Window Repair', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=160&q=80' },
      { id: 'locksmith', name: 'Locksmith', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=160&q=80' },
      { id: 'curtain-installation', name: 'Curtain / Blind Installation', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=160&q=80' },
      { id: 'tv-wall-mounting', name: 'TV Wall Mounting', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=160&q=80' },
      { id: 'drilling-mounting', name: 'Drilling & Wall Mounting', image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=160&q=80' },
      { id: 'minor-home-repairs', name: 'Minor Home Repairs', image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=160&q=80' },
    ],
  },
  {
    category: 'APPLIANCE & ELECTRICAL SERVICES',
    items: [
      { id: 'ac-technician', name: 'AC Technician', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=160&q=80' },
      { id: 'ac-installation', name: 'AC Installation', image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=160&q=80' },
      { id: 'ac-repair', name: 'AC Repair', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=160&q=80' },
      { id: 'refrigerator-repair', name: 'Refrigerator Repair', image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=160&q=80' },
      { id: 'washing-machine-repair', name: 'Washing Machine Repair', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=160&q=80' },
      { id: 'microwave-repair', name: 'Microwave Repair', image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=160&q=80' },
      { id: 'geyser-repair', name: 'Geyser Repair', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=160&q=80' },
      { id: 'ro-repair', name: 'RO / Water Purifier Repair', image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=160&q=80' },
      { id: 'inverter-technician', name: 'Inverter / UPS Technician', image: 'https://images.unsplash.com/photo-1509390144018-eeaf6504a269?auto=format&fit=crop&w=160&q=80' },
      { id: 'fan-repair', name: 'Fan Installation & Repair', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=160&q=80' },
      { id: 'light-installation', name: 'Light Installation', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=160&q=80' },
      { id: 'switch-socket-repair', name: 'Switch & Socket Repair', image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=160&q=80' },
      { id: 'chimney-repair', name: 'Chimney Repair', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=160&q=80' },
      { id: 'water-heater-tech', name: 'Water Heater Technician', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=160&q=80' },
    ],
  },
  {
    category: 'CLEANING & HOUSEHOLD SERVICES',
    items: [
      { id: 'home-cleaning', name: 'Home Cleaning', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=160&q=80' },
      { id: 'deep-home-cleaning', name: 'Deep Home Cleaning', image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=160&q=80' },
      { id: 'bathroom-cleaning', name: 'Bathroom Cleaning', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=160&q=80' },
      { id: 'kitchen-cleaning', name: 'Kitchen Cleaning', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=160&q=80' },
      { id: 'sofa-cleaning', name: 'Sofa Cleaning', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=160&q=80' },
      { id: 'carpet-cleaning', name: 'Carpet Cleaning', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=160&q=80' },
      { id: 'mattress-cleaning', name: 'Mattress Cleaning', image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=160&q=80' },
      { id: 'window-cleaning', name: 'Window Cleaning', image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=160&q=80' },
      { id: 'water-tank-cleaning', name: 'Water Tank Cleaning', image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=160&q=80' },
      { id: 'vehicle-cleaning', name: 'Vehicle Cleaning', image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=160&q=80' },
      { id: 'laundry', name: 'Laundry', image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=160&q=80' },
      { id: 'ironing', name: 'Ironing', image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=160&q=80' },
      { id: 'pest-control', name: 'Pest Control', image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=160&q=80' },
      { id: 'housekeeping', name: 'Housekeeping', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=160&q=80' },
      { id: 'domestic-helper', name: 'Domestic Helper', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=160&q=80' },
    ],
  },
  {
    category: 'GARDENING & OUTDOOR SERVICES',
    items: [
      { id: 'gardener', name: 'Gardener', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=160&q=80' },
      { id: 'lawn-maintenance', name: 'Lawn Maintenance', image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=160&q=80' },
      { id: 'plant-care', name: 'Plant Care', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=160&q=80' },
      { id: 'landscaping-helper', name: 'Landscaping Helper', image: 'https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=160&q=80' },
    ],
  },
];

export const WorkerCategories: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  // Toggle selection
  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    if (errorMessage) setErrorMessage(undefined);
  };

  // Filter categories and items based on search
  const filteredCatalog = useMemo(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) return SERVICE_CATALOG;

    return SERVICE_CATALOG.map((group) => {
      const filteredItems = group.items.filter((item) =>
        item.name.toLowerCase().includes(trimmed)
      );
      return {
        ...group,
        items: filteredItems,
      };
    }).filter((group) => group.items.length > 0);
  }, [searchTerm]);

  const totalFilteredCount = useMemo(() => {
    return filteredCatalog.reduce((acc, curr) => acc + curr.items.length, 0);
  }, [filteredCatalog]);

  const handleContinue = () => {
    if (selectedIds.length === 0) {
      setErrorMessage('Please select at least one service.');
      return;
    }

    // Persist selected categories in session
    sessionStorage.setItem('gigsevak_worker_categories', JSON.stringify(selectedIds));
    onboardingService.updateState({ isCategoriesCompleted: true });
    navigate('/worker/location');
  };

  return (
    <main className="min-h-[100dvh] w-full bg-slate-50/60 sm:bg-slate-50/50 flex flex-col items-center p-4 sm:p-6 py-4 sm:py-6 antialiased">
      <div className="w-full max-w-[760px] mx-auto flex flex-col items-center">
        {/* Brand Logo & Progress Strip */}
        <header className="mb-2 sm:mb-3 flex flex-col items-center gap-1 w-full">
          <AuthLogo />
          <div className="w-full -mt-2 sm:-mt-3">
            <WorkerOnboardingProgress
              currentStep={3}
              step1Progress={100}
              step2Progress={100}
              step3Progress={0}
            />
          </div>
        </header>

        {/* Categories Card Box */}
        <div className="w-full bg-white rounded-2xl border border-slate-200/80 sm:border-slate-100 shadow-card p-5 sm:p-8 space-y-5">
          {/* Header Section */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#222222]">
              What work do you do?
            </h1>
            <p className="text-sm sm:text-base text-[#6B6B6B]">
              Select all the services you can provide.
            </p>
            <p className="text-xs text-[#A66666] font-semibold pt-0.5">
              You can choose more than one.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full pt-1">
            <Search className="w-5 h-5 text-[#6B6B6B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a service..."
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#D9D9D9] bg-white text-sm text-[#222222] placeholder:text-[#6B6B6B]/60 focus:outline-none focus:border-[#A66666] focus:ring-2 focus:ring-[#A66666]/20 transition-all"
            />
          </div>

          {/* Services List / Groups */}
          <div className="space-y-6 pt-2 max-h-[60vh] overflow-y-auto pr-1">
            {totalFilteredCount === 0 ? (
              <div className="text-center py-10 space-y-2">
                <p className="text-base font-semibold text-[#222222]">
                  No services found
                </p>
                <p className="text-xs text-[#6B6B6B]">
                  Try searching with a different keyword or browse the list
                </p>
              </div>
            ) : (
              filteredCatalog.map((group) => (
                <div key={group.category} className="space-y-2.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] px-1">
                    {group.category}
                  </h2>

                  {/* 1 column on mobile, exactly 2 columns on tablet/desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {group.items.map((service) => {
                      const isSelected = selectedIds.includes(service.id);

                      return (
                        <div
                          key={service.id}
                          onClick={() => handleToggle(service.id)}
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault();
                              handleToggle(service.id);
                            }
                          }}
                          className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all duration-150 cursor-pointer select-none text-left active:scale-[0.99] ${
                            isSelected
                              ? 'border-[#A66666] bg-[#A66666]/5 shadow-sm'
                              : 'border-[#D9D9D9] bg-white hover:border-slate-300 hover:bg-slate-50/50'
                          }`}
                        >
                          {/* Image on LEFT */}
                          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                            <img
                              src={service.image}
                              alt={service.name}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Service Name in CENTER */}
                          <span className="flex-1 mx-3 text-sm sm:text-[15px] font-semibold text-[#222222] truncate">
                            {service.name}
                          </span>

                          {/* Checkbox on RIGHT */}
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                              isSelected
                                ? 'border-[#A66666] bg-[#A66666] text-white'
                                : 'border-[#D9D9D9] bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-[#953638] font-medium pt-1 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Bottom Action Area */}
          <div className="pt-3 border-t border-slate-100">
            <AuthButton
              type="button"
              variant="outline"
              onClick={handleContinue}
            >
              Continue {selectedIds.length > 0 ? `(${selectedIds.length} selected)` : ''}
            </AuthButton>
          </div>
        </div>
      </div>
    </main>
  );
};

