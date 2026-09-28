import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { api } from '../services/api';
import { Bike, X, Phone, Lock, User, MapPin, ArrowRight, ShieldCheck, CreditCard, Sparkles, LogIn, UserPlus } from 'lucide-react';

interface RiderAuthModalProps {
  onSuccessRedirectToDashboard: () => void;
}

export const RiderAuthModal: React.FC<RiderAuthModalProps> = ({ onSuccessRedirectToDashboard }) => {
  const {
    isRiderAuthOpen,
    setIsRiderAuthOpen,
    riderAuthMode,
    setRiderAuthMode,
    riderLoginSuccess,
    showToast,
  } = useMarket();

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicle, setVehicle] = useState('Boda Boda Motorcycle (Bajaj Boxer 150)');
  const [plate, setPlate] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [currentZone, setCurrentZone] = useState('Voi Town Center');
  const [registerPassword, setRegisterPassword] = useState('');

  if (!isRiderAuthOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      showToast('Please enter your phone number / vehicle plate and password');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.riderLogin({
        identifier: loginIdentifier,
        password: loginPassword,
      });

      riderLoginSuccess(res.rider);
      onSuccessRedirectToDashboard();
    } catch (err: any) {
      showToast(err.message || 'Rider login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !plate.trim() || !registerPassword.trim()) {
      showToast('Please provide your name, phone number, vehicle plate, and password');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.riderRegister({
        name,
        phone,
        vehicle,
        plate,
        idNumber,
        currentZone,
        password: registerPassword,
      });

      riderLoginSuccess(res.rider);
      onSuccessRedirectToDashboard();
    } catch (err: any) {
      showToast(err.message || 'Rider registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 my-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1B4332] text-[#F4A261] flex items-center justify-center font-bold text-lg shadow-sm">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-stone-900 leading-tight">
                Boda Boda Rider Fleet Portal
              </h3>
              <p className="text-xs text-stone-500">
                Deliver consolidated Kikapu packages across Voi & Taita-Taveta
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsRiderAuthOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher (Login vs Sign Up) */}
        <div className="flex items-center p-1 bg-stone-100 rounded-2xl my-4">
          <button
            type="button"
            onClick={() => setRiderAuthMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              riderAuthMode === 'login'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Rider Log In</span>
          </button>

          <button
            type="button"
            onClick={() => setRiderAuthMode('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              riderAuthMode === 'register'
                ? 'bg-white text-[#1B4332] shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Join Rider Fleet (Sign Up)</span>
          </button>
        </div>

        {/* MODE 1: RIDER LOGIN */}
        {riderAuthMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>Phone Number or Number Plate</span>
              </label>
              <input
                type="text"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="e.g. 0712345010 or KMDF 452X"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#1B4332]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-stone-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your rider password"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#1B4332]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md active:scale-98 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Logging into Rider Console...' : 'Log In to Rider Dashboard'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="pt-3 border-t border-stone-100 text-center">
              <span className="text-xs text-stone-500">New Boda Boda or Tuk-Tuk rider in Voi? </span>
              <button
                type="button"
                onClick={() => setRiderAuthMode('register')}
                className="text-xs font-bold text-[#D95D39] hover:underline cursor-pointer ml-1"
              >
                Sign Up as Rider
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: RIDER REGISTRATION (SIGN UP) */}
        {riderAuthMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5 text-xs max-h-[60vh] overflow-y-auto pr-1">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong>Deliver in Voi & Taita-Taveta:</strong> Earn KES 100+ on every consolidated delivery. Pickup from market stalls and deliver straight to customer doorsteps with instant M-Pesa wallet credit!
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span>Full Legal Name *</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Peter Mwashumbe"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>M-Pesa Phone Number *</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712345678"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332] font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                  <span>National ID / Driving License</span>
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="e.g. 32849102"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332]"
                >
                  <option value="Boda Boda Motorcycle (Bajaj Boxer 150)">Boda Boda (Boxer 150)</option>
                  <option value="Boda Boda Motorcycle (TVS HLX 125)">Boda Boda (TVS HLX 125)</option>
                  <option value="Boda Boda Motorcycle (Honda Ace)">Boda Boda (Honda Ace)</option>
                  <option value="Tuk-Tuk Three-Wheeler">Tuk-Tuk (Passenger/Cargo)</option>
                  <option value="Bicycle Cargo Delivery">Bicycle Cargo Delivery</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Number Plate *
                </label>
                <input
                  type="text"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  placeholder="e.g. KMDF 452X"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332] font-mono uppercase"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D95D39]" />
                  <span>Primary Operating Base</span>
                </label>
                <select
                  value={currentZone}
                  onChange={(e) => setCurrentZone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332]"
                >
                  <option value="Voi Town Center">Voi Town Center & Market</option>
                  <option value="Sofia Market Stage">Sofia Market Stage</option>
                  <option value="Tsavo Commercial Plaza Stage">Tsavo Commercial Plaza Stage</option>
                  <option value="Taveta Border Stage">Taveta Border Stage</option>
                  <option value="Wundanyi Stage">Wundanyi Stage</option>
                  <option value="Mwatate Stage">Mwatate Stage</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-stone-400" />
                  <span>Password *</span>
                </label>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Create your password"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#1B4332]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#1B4332] hover:bg-[#143225] text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md active:scale-98 disabled:opacity-50 mt-2"
            >
              <span>{isSubmitting ? 'Registering Rider...' : 'Register & Enter Rider Dashboard'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
