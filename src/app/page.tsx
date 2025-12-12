"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plane, 
  Train, 
  Bus, 
  Ship, 
  Car, 
  Hotel, 
  Home, 
  Umbrella, 
  MapPin, 
  Calendar,
  Users,
  Mountain,
  Coffee,
  ShoppingBag,
  Heart,
  ChevronLeft,
  ChevronRight,
  Navigation,
  Compass,
  Globe,
  ChevronDown,
  DollarSign,
  Moon,
  Clock,
  Map,
  Building
} from "lucide-react";

type TransportInput = {
  from: string;
  to: string;
  mode: string;
  transportBudget: string;
  preference: string;
};

type StayInput = {
  stayType: string;
  budgetPerNight: string;
  locationPreference: string;
  nights: number;
  guests: number;
};

type TripInput = {
  styles: string[];
  activityBudget: string;
  days: number;
  pace: string;
};

const transportOptions = ["Pesawat", "Kereta", "Bus", "Kapal", "Kendaraan Pribadi", "Rental Mobil"];
const preferenceOptions = ["Murah", "Cepat", "Nyaman"];
const stayTypeOptions = ["Hotel", "Villa", "Homestay", "Hostel", "Resort", "Apartment"];
const locationOptions = ["Pusat Kota", "Dekat Pantai", "Dekat Wisata", "Daerah Tenang", "Dekat Bandara", "Pedesaan"];
const activityOptions = ["Alam", "Pantai", "Kuliner", "Budaya", "Belanja", "Petualangan", "Sejarah", "Religi"];
const paceOptions = ["Santai", "Normal", "Cepat"];
const cityOptions = [
  "Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar", 
  "Denpasar", "Yogyakarta", "Malang", "Bali", "Lombok", "Labuan Bajo",
  "Raja Ampat", "Belitung", "Wakatobi", "Bromo", "Dieng", "Puncak"
];

export default function TravelPlanner() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [transport, setTransport] = useState<TransportInput>({
    from: "",
    to: "",
    mode: "Pesawat",
    transportBudget: "",
    preference: "Murah",
  });

  const [stay, setStay] = useState<StayInput>({
    stayType: "Hotel",
    budgetPerNight: "",
    locationPreference: "Pusat Kota",
    nights: 1,
    guests: 1,
  });

  const [trip, setTrip] = useState<TripInput>({
    styles: ["Alam"],
    activityBudget: "",
    days: 1,
    pace: "Normal",
  });

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const finish = () => {
    const payload = { transportation: transport, accommodation: stay, trip };
    sessionStorage.setItem("trip_payload", JSON.stringify(payload));
    router.push("/itinerary");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-r from-blue-400/10 to-cyan-400/10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 rounded-full blur-3xl"></div>
      
      <div className="absolute top-20 left-20 opacity-5">
        <Globe className="w-96 h-96 text-blue-300" />
      </div>

      <div className="relative z-10 flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-2xl shadow-xl mb-4">
              <Compass className="w-7 h-7" />
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                AI Travel Planner
              </h1>
            </div>
            <p className="text-gray-700 text-lg font-medium">
              Rencanakan perjalananmu dengan mudah dan cepat
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            {/* Progress bar */}
            <div className="h-2 bg-gradient-to-r from-blue-200 via-cyan-300 to-emerald-400">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 transition-all duration-500"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>

            <div className="p-6 md:p-8">
              <StepIndicator step={step} />
              
              <div className="mt-8">
                {step === 1 && (
                  <TransportStep 
                    transport={transport} 
                    setTransport={setTransport} 
                  />
                )}
                {step === 2 && (
                  <StayStep 
                    stay={stay} 
                    setStay={setStay} 
                  />
                )}
                {step === 3 && (
                  <TripStep 
                    trip={trip} 
                    setTrip={setTrip} 
                  />
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200/50">
                <button
                  onClick={back}
                  disabled={step === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    step === 1
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 shadow-md hover:shadow-lg transform hover:-translate-x-1"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Kembali
                </button>

                {step < 3 ? (
                  <button
                    onClick={next}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
                    style={{ background: "linear-gradient(135deg, #0EA5E9, #06B6D4)" }}
                  >
                    Lanjut
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    onClick={finish}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
                    style={{ background: "linear-gradient(135deg, #06B6D4, #10B981)" }}
                  >
                    <Compass className="w-5 h-5" />
                    Lihat Itinerary
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Footer info */}
          <div className="text-center mt-6 text-gray-500 text-sm">
            <p>✨ Rencanakan perjalanan impianmu dalam 3 langkah mudah</p>
          </div>
        </div>
      </div>
    </main>
  );
}

function StepIndicator({ step }: { step: number }) {
  const steps = [
    { number: 1, label: "Transportasi", icon: <Plane className="w-5 h-5" /> },
    { number: 2, label: "Penginapan", icon: <Hotel className="w-5 h-5" /> },
    { number: 3, label: "Aktivitas", icon: <Heart className="w-5 h-5" /> },
  ];

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8">
      {steps.map(({ number, label, icon }) => {
        const isActive = number === step;
        const isCompleted = number < step;

        return (
          <div key={number} className="flex flex-col items-center">
            <div className="relative">
              <div className={`absolute -inset-2 rounded-full ${isActive ? 'bg-blue-100 animate-pulse' : ''}`}></div>
              <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                isActive 
                  ? "border-blue-500 bg-white scale-110 shadow-lg"
                  : isCompleted 
                  ? "border-blue-500 bg-blue-500 text-white shadow-md"
                  : "border-gray-300 bg-white"
              }`}>
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <>
                    <div className={`${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {icon}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <span className={`mt-2 font-semibold text-sm ${
              isActive ? 'text-blue-600' : isCompleted ? 'text-blue-500' : 'text-gray-500'
            }`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Custom Dropdown Component
function Dropdown({ 
  label, 
  value, 
  onChange, 
  options, 
  icon: Icon,
  placeholder = "Pilih..."
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void; 
  options: string[];
  icon?: React.ElementType;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {Icon && <Icon className="inline w-4 h-4 mr-2 text-blue-600" />}
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-left flex items-center justify-between hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
      >
        <span className={value ? "text-gray-800" : "text-gray-500"}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                  value === option ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                } ${option !== options[0] ? 'border-t border-gray-100' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Custom Input Component dengan styling yang konsisten
function BudgetInput({ 
  label, 
  value, 
  onChange, 
  placeholder = "Masukkan budget...",
  icon: Icon = DollarSign
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void; 
  placeholder?: string;
  icon?: React.ElementType;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        <Icon className="inline w-4 h-4 mr-2 text-blue-600" />
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-3 text-gray-500">Rp</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

// Transport Step dengan dropdown
function TransportStep({ transport, setTransport }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-6 py-3 rounded-xl mb-2">
          <Plane className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Transportasi</h2>
        </div>
        <p className="text-gray-600">Tentukan cara perjalanan Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-1 rounded-xl">
            <div className="bg-white p-5 rounded-xl border border-blue-100">
              <Dropdown
                label="Kota Keberangkatan"
                value={transport.from}
                onChange={(value) => setTransport({...transport, from: value})}
                options={cityOptions}
                icon={MapPin}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-1 rounded-xl">
            <div className="bg-white p-5 rounded-xl border border-blue-100">
              <Dropdown
                label="Kota Tujuan"
                value={transport.to}
                onChange={(value) => setTransport({...transport, to: value})}
                options={cityOptions}
                icon={MapPin}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-1 rounded-xl">
            <div className="bg-white p-5 rounded-xl border border-blue-100">
              <BudgetInput
                label="Budget Transportasi (total)"
                value={transport.transportBudget}
                onChange={(value) => setTransport({...transport, transportBudget: value})}
                placeholder="Contoh: 500.000 - 1.000.000"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-1 rounded-xl">
            <div className="bg-white p-5 rounded-xl border border-blue-100">
              <Dropdown
                label="Jenis Transportasi"
                value={transport.mode}
                onChange={(value) => setTransport({...transport, mode: value})}
                options={transportOptions}
                icon={Plane}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-1 rounded-xl">
            <div className="bg-white p-5 rounded-xl border border-blue-100">
              <Dropdown
                label="Preferensi Perjalanan"
                value={transport.preference}
                onChange={(value) => setTransport({...transport, preference: value})}
                options={preferenceOptions}
                icon={Clock}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-1 rounded-xl">
            <div className="bg-white p-5 rounded-xl border border-blue-100">
              <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  Rangkuman Transportasi
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Dari: <span className="font-medium">{transport.from || "-"}</span></p>
                  <p>Ke: <span className="font-medium">{transport.to || "-"}</span></p>
                  <p>Transportasi: <span className="font-medium">{transport.mode}</span></p>
                  <p>Prioritas: <span className="font-medium">{transport.preference}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stay Step dengan dropdown
function StayStep({ stay, setStay }: any) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-6 py-3 rounded-xl mb-2">
          <Hotel className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Penginapan</h2>
        </div>
        <p className="text-gray-600">Pilih tempat menginap yang nyaman</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-1 rounded-xl">
            <div className="bg-white p-5 rounded-xl border border-blue-100">
              <Dropdown
                label="Tipe Penginapan"
                value={stay.stayType}
                onChange={(value) => setStay({...stay, stayType: value})}
                options={stayTypeOptions}
                icon={Building}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-1 rounded-xl">
            <div className="bg-white p-5 rounded-xl border border-blue-100">
              <BudgetInput
                label="Budget per Malam"
                value={stay.budgetPerNight}
                onChange={(value) => setStay({...stay, budgetPerNight: value})}
                placeholder="Contoh: 200.000 - 500.000"
                icon={DollarSign}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-1 rounded-xl">
            <div className="bg-white p-5 rounded-xl border border-blue-100">
              <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  Durasi Menginap
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Jumlah Malam</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setStay({...stay, nights: Math.max(1, stay.nights - 1)})}
                        className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                      >
                        -
                      </button>
                      <div className="flex-1 text-center">
                        <span className="text-2xl font-bold text-blue-600">{stay.nights}</span>
                        <div className="text-sm text-gray-500">malam</div>
                      </div>
                      <button
                        onClick={() => setStay({...stay, nights: stay.nights + 1})}
                        className="w-10 h-10 rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Jumlah Tamu</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setStay({...stay, guests: Math.max(1, stay.guests - 1)})}
                        className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                      >
                        -
                      </button>
                      <div className="flex-1 text-center">
                        <span className="text-2xl font-bold text-blue-600">{stay.guests}</span>
                        <div className="text-sm text-gray-500">orang</div>
                      </div>
                      <button
                        onClick={() => setStay({...stay, guests: stay.guests + 1})}
                        className="w-10 h-10 rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-1 rounded-xl">
            <div className="bg-white p-5 rounded-xl border border-blue-100">
              <Dropdown
                label="Lokasi Preferensi"
                value={stay.locationPreference}
                onChange={(value) => setStay({...stay, locationPreference: value})}
                options={locationOptions}
                icon={Map}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-1 rounded-xl">
            <div className="bg-white p-5 rounded-xl border border-blue-100">
              <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Rangkuman Penginapan
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Tipe: <span className="font-medium">{stay.stayType}</span></p>
                  <p>Lokasi: <span className="font-medium">{stay.locationPreference}</span></p>
                  <p>Durasi: <span className="font-medium">{stay.nights} malam</span></p>
                  <p>Tamu: <span className="font-medium">{stay.guests} orang</span></p>
                  {stay.budgetPerNight && (
                    <p>Budget: <span className="font-medium">Rp {stay.budgetPerNight}/malam</span></p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-1 rounded-xl">
            <div className="bg-white p-5 rounded-xl border border-blue-100">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Tips</span>
                </div>
                <p className="text-sm text-gray-600">
                  Pilih lokasi yang strategis untuk menghemat waktu perjalanan ke destinasi wisata.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Trip Step dengan dropdown
function TripStep({ trip, setTrip }: any) {
  const toggleActivity = (opt: string) => {
    const has = trip.styles.includes(opt);
    const next = has 
      ? trip.styles.filter((s: string) => s !== opt)
      : [...trip.styles, opt];
    setTrip({...trip, styles: next});
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 px-6 py-3 rounded-xl mb-2">
          <Compass className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Aktivitas Wisata</h2>
        </div>
        <p className="text-gray-600">Pilih aktivitas yang sesuai dengan minat Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-1 rounded-xl">
            <div className="bg-white p-5 rounded-xl border border-blue-100">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Heart className="inline w-4 h-4 mr-2 text-blue-600" />
                  Jenis Aktivitas Favorit
                </label>
                <div className="space-y-2">
                  {activityOptions.map((opt) => {
                    const isSelected = trip.styles.includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => toggleActivity(opt)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                          isSelected 
                            ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-400 text-blue-700' 
                            : 'bg-white border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {opt === "Alam" && <Mountain className="w-4 h-4" />}
                            {opt === "Pantai" && <Umbrella className="w-4 h-4" />}
                            {opt === "Kuliner" && <Coffee className="w-4 h-4" />}
                            {opt === "Budaya" && <Compass className="w-4 h-4" />}
                            {opt === "Belanja" && <ShoppingBag className="w-4 h-4" />}
                            {opt === "Petualangan" && <Navigation className="w-4 h-4" />}
                            {opt === "Sejarah" && <Building className="w-4 h-4" />}
                            {opt === "Religi" && <Compass className="w-4 h-4" />}
                          </div>
                          <span className="font-medium">{opt}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-1 rounded-xl">
            <div className="bg-white p-5 rounded-xl border border-blue-100">
              <BudgetInput
                label="Budget Aktivitas"
                value={trip.activityBudget}
                onChange={(value) => setTrip({...trip, activityBudget: value})}
                placeholder="Contoh: 300.000 - 700.000 per hari"
                icon={DollarSign}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-1 rounded-xl">
            <div className="bg-white p-5 rounded-xl border border-blue-100">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2 text-blue-600" />
                  Jumlah Hari
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setTrip({...trip, days: Math.max(1, trip.days - 1)})}
                    className="w-12 h-12 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-3xl font-bold text-blue-600">{trip.days}</span>
                    <div className="text-sm text-gray-500">hari perjalanan</div>
                  </div>
                  <button
                    onClick={() => setTrip({...trip, days: trip.days + 1})}
                    className="w-12 h-12 rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-600"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-1 rounded-xl">
            <div className="bg-white p-5 rounded-xl border border-blue-100">
              <Dropdown
                label="Kecepatan Perjalanan"
                value={trip.pace}
                onChange={(value) => setTrip({...trip, pace: value})}
                options={paceOptions}
                icon={Clock}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-1 rounded-xl">
            <div className="bg-white p-5 rounded-xl border border-blue-100">
              <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  Rangkuman Aktivitas
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Durasi: <span className="font-medium">{trip.days} hari</span></p>
                  <p>Tempo: <span className="font-medium">{trip.pace}</span></p>
                  <p>Aktivitas: 
                    <span className="font-medium ml-2">
                      {trip.styles.length > 0 ? trip.styles.join(", ") : "Belum dipilih"}
                    </span>
                  </p>
                  {trip.activityBudget && (
                    <p>Budget: <span className="font-medium">Rp {trip.activityBudget}/hari</span></p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}