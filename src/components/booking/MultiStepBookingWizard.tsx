import React, { useState } from 'react';
import { X, CheckCircle2, ChevronRight, ChevronLeft, Lock, Calendar as CalendarIcon, Clock, User, Zap, ShieldCheck, Sparkles, Tag, Check, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Service, Provider } from '../../types';

interface MultiStepBookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  providers: Provider[];
  initialService?: Service;
  onBookingConfirmed: (bookingData: {
    service: Service;
    provider: Provider;
    date: string;
    time: string;
    patientName: string;
    patientPhone: string;
    depositAmountCents: number;
    paymentMethod: 'stripe_card' | 'apple_pay' | 'cherry_financing';
  }) => void;
  promotions?: any[];
}

export const MultiStepBookingWizard: React.FC<MultiStepBookingWizardProps> = ({
  isOpen,
  onClose,
  services,
  providers,
  initialService,
  onBookingConfirmed,
  promotions: externalPromotions
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedService, setSelectedService] = useState<Service>(initialService || services[0]);
  const [selectedProvider, setSelectedProvider] = useState<Provider>(providers[0]);
  const [selectedDay, setSelectedDay] = useState<number>(15);
  const [selectedTime, setSelectedTime] = useState<string>('09:30 AM');
  const [patientName, setPatientName] = useState('Camilla Vance');
  const [patientEmail, setPatientEmail] = useState('camilla.vance@beverlyhills.io');
  const [patientPhone, setPatientPhone] = useState('(310) 844-1290');
  const [paymentMethod, setPaymentMethod] = useState<'stripe_card' | 'apple_pay' | 'cherry_financing'>('stripe_card');
  const [isSuccess, setIsSuccess] = useState(false);

  const [addonNeckDecollete, setAddonNeckDecollete] = useState(false);
  const [addonRecoveryCream, setAddonRecoveryCream] = useState(false);

  // Discount & Coupon State
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCheckingCoupons, setIsCheckingCoupons] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    description: string;
  } | null>(null);

  // Available practice promotion coupons (filtered by practice owner choice!)
  const defaultPromotions = [
    { code: 'VIPFALL20', type: 'percentage' as const, value: 20, description: '20% Off Full Aesthetic Treatment', showInAvailableList: true, status: 'active' },
    { code: 'WELCOME50', type: 'fixed' as const, value: 50, description: '$50 Off First Clinical Procedure', showInAvailableList: true, status: 'active' },
    { code: 'AURA100', type: 'fixed' as const, value: 100, description: '$100 Off Morpheus8 / Biostimulator Package', showInAvailableList: true, status: 'active' }
  ];

  const sourcePromotions = externalPromotions && externalPromotions.length > 0 ? externalPromotions : defaultPromotions;
  const AVAILABLE_PROMOTIONS = sourcePromotions
    .filter((p: any) => (p.showInAvailableList !== false && p.status === 'active'))
    .map((p: any) => ({
      code: p.code,
      type: (p.discountType || p.type || 'percentage') as 'percentage' | 'fixed',
      value: p.discountValue !== undefined ? p.discountValue : p.value,
      description: p.description || `${p.discountValue}% Off Treatment`
    }));

  if (!isOpen) return null;

  // Add-ons calculations
  const addOnTotalDollars = (addonNeckDecollete ? 250 : 0) + (addonRecoveryCream ? 85 : 0);
  const addOnDepositDollars = (addonNeckDecollete ? 50 : 0); // additional deposit for neck/decollete session

  const baseProcedureDollars = selectedService.retailPriceCents / 100;
  const totalProcedureDollars = baseProcedureDollars + addOnTotalDollars;
  const baseDepositDollars = selectedService.depositPriceCents / 100;
  // NOTE: Per user requirement, discount applies to full amount, deposit stays the same!
  const depositDollars = baseDepositDollars + addOnDepositDollars;

  // Coupon discount on full procedure
  let discountDollars = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountDollars = Math.round((totalProcedureDollars * appliedCoupon.value) / 100);
    } else {
      discountDollars = Math.min(appliedCoupon.value, totalProcedureDollars);
    }
  }

  const discountedProcedureDollars = Math.max(0, totalProcedureDollars - discountDollars);
  const balanceAtClinicDollars = Math.max(0, discountedProcedureDollars - depositDollars);
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleApplyCoupon = (codeToApply?: string) => {
    const rawCode = (codeToApply || couponCodeInput).trim().toUpperCase();
    if (!rawCode) {
      setCouponError('Please enter a promotion code.');
      return;
    }
    const match = AVAILABLE_PROMOTIONS.find((p) => p.code.toUpperCase() === rawCode);
    if (match) {
      setAppliedCoupon(match);
      setCouponCodeInput(match.code);
      setCouponError(null);
      setIsCheckingCoupons(false);
    } else {
      setCouponError(`Code "${rawCode}" not recognized or expired.`);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    setCouponError(null);
  };

  const handleCloseModal = () => {
    setStep(1);
    setIsSuccess(false);
    setAddonNeckDecollete(false);
    setAddonRecoveryCream(false);
    setAppliedCoupon(null);
    setCouponCodeInput('');
    setCouponError(null);
    setIsCheckingCoupons(false);
    onClose();
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    onBookingConfirmed({
      service: selectedService,
      provider: selectedProvider,
      date: `October ${selectedDay}, 2026`,
      time: selectedTime,
      patientName,
      patientPhone,
      depositAmountCents: depositDollars * 100,
      paymentMethod
    });
  };

  return (
    <div className="absolute inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92%] my-auto"
      >
        
        {/* Wizard Header with Step Indicator */}
        <div className="p-6 bg-[#1C1917] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#D4A373]">
              <span>STEP {step} OF 4</span>
              <span>•</span>
              <span className="uppercase">
                {step === 1 && 'Select Procedure & Add-ons'}
                {step === 2 && 'Choose Date & Physician'}
                {step === 3 && 'Select Time Slot'}
                {step === 4 && 'Authorize Deposit & Review'}
              </span>
            </div>
            <h3 className="font-serif text-xl font-normal mt-0.5">
              Priority Clinical Reservation
            </h3>
          </div>
          <button
            onClick={handleCloseModal}
            className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {!isSuccess ? (
            <div className="space-y-6">
              
              {/* STEP 1: PROCEDURE SELECTION & ADD-ONS */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">Select Signature Treatment</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">Choose your primary aesthetic or wellness clinical protocol.</p>
                  </div>

                  <div className="space-y-3">
                    {services.map((srv) => (
                      <div
                        key={srv.id}
                        onClick={() => setSelectedService(srv)}
                        className={`p-4 rounded-2xl border text-left flex items-center justify-between gap-4 cursor-pointer transition-all ${
                          selectedService.id === srv.id
                            ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900 shadow-xs'
                            : 'border-stone-200 hover:border-stone-400 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={srv.imageUrl}
                            alt={srv.name}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div>
                            <div className="font-bold text-stone-900 text-sm">{srv.name}</div>
                            <div className="text-stone-500 text-[11px]">{srv.durationMinutes} min • ${(srv.retailPriceCents / 100).toLocaleString()} retail</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-xs">
                            ${srv.depositPriceCents / 100} Deposit
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Adjustment 2: RECOMMENDED CLINICAL ADD-ONS SECTION */}
                  <div className="pt-2 border-t border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Recommended Clinical Add-ons for {selectedService.name}</span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">Optional Enhancement</span>
                    </div>

                    <div className="space-y-2">
                      {/* Checkbox 1: Neck & Décolleté Session */}
                      <label
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          addonNeckDecollete
                            ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300'
                            : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={addonNeckDecollete}
                            onChange={(e) => setAddonNeckDecollete(e.target.checked)}
                            className="w-4 h-4 text-stone-900 rounded-sm cursor-pointer accent-stone-900"
                          />
                          <div>
                            <span className="font-bold text-stone-900 text-xs block">
                              Add Neck &amp; Décolleté Session (+ $250.00)
                            </span>
                            <span className="text-[10px] text-stone-500">
                              Extend radiofrequency coagulation & collagen induction down to clavicle.
                            </span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-amber-900 text-xs shrink-0">+ $250.00</span>
                      </label>

                      {/* Checkbox 2: Medical Barrier Recovery Cream Dispensary */}
                      <label
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          addonRecoveryCream
                            ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300'
                            : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={addonRecoveryCream}
                            onChange={(e) => setAddonRecoveryCream(e.target.checked)}
                            className="w-4 h-4 text-stone-900 rounded-sm cursor-pointer accent-stone-900"
                          />
                          <div>
                            <span className="font-bold text-stone-900 text-xs block">
                              Add Medical Barrier Recovery Cream Dispensary (+ $85.00)
                            </span>
                            <span className="text-[10px] text-stone-500">
                              50ml hospital-grade post-procedure peptide barrier balm included at check-in.
                            </span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-amber-900 text-xs shrink-0">+ $85.00</span>
                      </label>
                    </div>

                    {/* Dynamic Calculation Live Breakdown Box */}
                    <div className="p-3.5 bg-stone-100/80 rounded-xl border border-stone-200/90 text-xs space-y-1.5 font-mono">
                      <div className="flex justify-between text-stone-600">
                        <span>Procedure Total:</span>
                        <span className="font-bold text-stone-900">
                          ${baseProcedureDollars.toLocaleString()} {addOnTotalDollars > 0 && `+ $${addOnTotalDollars} = $${totalProcedureDollars.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span>Deposit Due Today:</span>
                        <span className="font-bold text-emerald-700">
                          ${depositDollars}.00
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-600 pt-1 border-t border-stone-200 text-[11px]">
                        <span>Balance Payable at Clinic:</span>
                        <span className="font-bold text-stone-800">${balanceAtClinicDollars.toLocaleString()}.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: INTERACTIVE CALENDAR & PROVIDER SELECTION */}
              {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Calendar Grid (Untitled UI Style) */}
                  <div className="md:col-span-7 bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-stone-900">October 2026</span>
                      <span className="text-[10px] text-stone-500">Pacific Time (PT)</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-stone-400 font-medium">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                        <div key={d} className="py-1">{d}</div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center">
                      {[null, null, null].map((_, i) => (
                        <div key={`blank-${i}`} className="py-2" />
                      ))}
                      {daysInMonth.map((day) => (
                        <button
                          key={day}
                          onClick={() => setSelectedDay(day)}
                          className={`py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            selectedDay === day
                              ? 'bg-stone-900 text-white font-bold shadow-xs'
                              : 'text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Provider Selection */}
                  <div className="md:col-span-5 space-y-3">
                    <span className="font-bold text-stone-900 block text-xs">Attending Physician</span>
                    <div className="space-y-2">
                      {providers.map((prv) => (
                        <div
                          key={prv.id}
                          onClick={() => setSelectedProvider(prv)}
                          className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                            selectedProvider.id === prv.id
                              ? 'border-stone-900 bg-white ring-1 ring-stone-900'
                              : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                          }`}
                        >
                          <img
                            src={prv.avatarUrl}
                            alt={prv.name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <div className="truncate">
                            <div className="font-bold text-stone-900 text-xs truncate">{prv.name}</div>
                            <div className="text-[10px] text-stone-500 truncate">{prv.title.split('&')[0]}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: TIME SLOT CHIPS */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-stone-900">{selectedService.name}</div>
                      <div className="text-stone-500 text-[11px]">Thursday, Oct {selectedDay}, 2026 with {selectedProvider.name}</div>
                    </div>
                    <span className="font-bold text-emerald-800 text-sm">${depositDollars} Deposit</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="font-bold text-stone-700 block mb-2 text-xs uppercase tracking-wider">Morning Slots</span>
                      <div className="grid grid-cols-3 gap-2">
                        {['09:00 AM', '09:30 AM', '10:30 AM', '11:15 AM'].map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className={`py-2.5 rounded-xl text-center font-medium transition-all text-xs cursor-pointer ${
                              selectedTime === slot
                                ? 'bg-stone-900 text-white font-bold shadow-xs'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-stone-700 block mb-2 text-xs uppercase tracking-wider">Afternoon Slots</span>
                      <div className="grid grid-cols-3 gap-2">
                        {['01:30 PM', '02:30 PM', '03:45 PM', '04:30 PM'].map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className={`py-2.5 rounded-xl text-center font-medium transition-all text-xs cursor-pointer ${
                              selectedTime === slot
                                ? 'bg-stone-900 text-white font-bold shadow-xs'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: PATIENT CONTACT & DEPOSIT AUTHORIZATION */}
              {step === 4 && (
                <form onSubmit={handleFinish} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-stone-800 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-800 block mb-1">Mobile Phone (for SMS updates)</label>
                      <input
                        type="tel"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-bold text-stone-800 block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                        required
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <span className="font-bold text-stone-800 block text-xs">Payment Method for Deposit</span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('stripe_card')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          paymentMethod === 'stripe_card' ? 'border-stone-900 bg-stone-50 font-bold' : 'border-stone-200'
                        }`}
                      >
                        Credit Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('apple_pay')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          paymentMethod === 'apple_pay' ? 'border-stone-900 bg-stone-50 font-bold' : 'border-stone-200'
                        }`}
                      >
                        Apple Pay
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cherry_financing')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          paymentMethod === 'cherry_financing' ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-stone-200'
                        }`}
                      >
                        Cherry 0% APR
                      </button>
                    </div>
                  </div>

                  {/* PRACTICE DISCOUNT COUPON PROMOTION SECTION */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/90 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                        <Tag className="w-3.5 h-3.5 text-[#D4A373]" />
                        <span>Practice Promotion or Coupon Code</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCheckingCoupons(!isCheckingCoupons)}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                      >
                        {isCheckingCoupons ? 'Hide Available Coupons' : 'Check Available Coupons'}
                      </button>
                    </div>

                    {/* Applied Coupon Banner */}
                    {appliedCoupon ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                          <div>
                            <span className="font-mono font-bold text-emerald-900">{appliedCoupon.code}</span>
                            <span className="text-emerald-700 ml-1.5">
                              ({appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}% off` : `$${appliedCoupon.value} off`} full procedure)
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-[11px] text-stone-400 hover:text-stone-700 font-semibold cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      /* Coupon Input + Apply Button */
                      <div className="space-y-1.5">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponCodeInput}
                            onChange={(e) => {
                              setCouponCodeInput(e.target.value.toUpperCase());
                              setCouponError(null);
                            }}
                            placeholder="Enter promo code (e.g. VIPFALL20)"
                            className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono uppercase text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900"
                          />
                          <button
                            type="button"
                            onClick={() => handleApplyCoupon()}
                            className="px-4 py-2 bg-[#1C1917] hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                        {couponError && (
                          <div className="text-[11px] text-rose-600 font-medium">
                            {couponError}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Check Available Coupons Drawer / List */}
                    {isCheckingCoupons && (
                      <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2 mt-2 animate-in fade-in duration-100">
                        <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between border-b border-stone-100 pb-1">
                          <span>Practice Verified Active Promotions</span>
                          <span className="text-[10px] text-stone-400 font-normal">Click code to apply</span>
                        </div>
                        <div className="space-y-1.5">
                          {AVAILABLE_PROMOTIONS.map((promo) => {
                            const isCurrent = appliedCoupon?.code === promo.code;
                            return (
                              <div
                                key={promo.code}
                                className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                                  isCurrent
                                    ? 'bg-emerald-50 border-emerald-300'
                                    : 'bg-stone-50/70 border-stone-200 hover:bg-stone-100'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-bold text-stone-900">{promo.code}</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-900">
                                      {promo.type === 'percentage' ? `${promo.value}% OFF` : `$${promo.value} OFF`}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-stone-500 mt-0.5">{promo.description}</div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleApplyCoupon(promo.code)}
                                  className={`px-3 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                                    isCurrent
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-stone-900 text-white hover:bg-stone-800'
                                  }`}
                                >
                                  {isCurrent ? 'Applied' : 'Apply Code'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Financial Breakdown & Deposit Summary */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5 text-xs text-stone-700">
                    <div className="space-y-1 border-b border-stone-200 pb-2">
                      <div className="flex justify-between">
                        <span>Total Clinical Procedure Cost:</span>
                        <span className="font-mono text-stone-900">${totalProcedureDollars}.00</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-emerald-700 font-semibold">
                          <span>Promotion Discount ({appliedCoupon.code}):</span>
                          <span className="font-mono">-${discountDollars}.00</span>
                        </div>
                      )}
                      {appliedCoupon && (
                        <div className="flex justify-between font-bold text-stone-900 pt-0.5">
                          <span>Adjusted Procedure Balance:</span>
                          <span className="font-mono">${discountedProcedureDollars}.00</span>
                        </div>
                      )}
                    </div>

                    {/* Deposit Due Today (Unchanged per requirement!) */}
                    <div className="flex justify-between font-bold text-sm text-stone-900 pt-0.5">
                      <div className="space-y-0.5">
                        <span>Refundable Deposit Due Today</span>
                        <span className="block text-[10px] text-stone-500 font-normal">
                          (Locks clinical suite slot; deposit stays fixed)
                        </span>
                      </div>
                      <span className="font-mono text-base text-emerald-700">${depositDollars}.00</span>
                    </div>

                    <div className="flex justify-between text-stone-600 text-[11px] border-t border-stone-200 pt-2">
                      <span>Remaining Balance Due at Clinic Checkout:</span>
                      <span className="font-mono font-bold text-stone-900">${balanceAtClinicDollars}.00</span>
                    </div>

                    <p className="text-[10px] text-stone-500 leading-relaxed border-t border-stone-200/80 pt-2">
                      100% of your ${depositDollars}.00 deposit applies toward your procedure balance at check-out. Fully refundable with 48 hours notice.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1C1917] hover:bg-stone-800 text-white rounded-full py-3.5 text-xs uppercase tracking-widest font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Authorize ${depositDollars}.00 Deposit &amp; Lock Slot</span>
                  </button>
                </form>
              )}

              {/* Bottom Wizard Navigation Controls */}
              {step < 4 && (
                <div className="flex justify-between items-center pt-4 border-t border-stone-200">
                  {step > 1 ? (
                    <button
                      onClick={() => setStep((prev) => (prev - 1) as any)}
                      className="flex items-center gap-1 text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                  ) : <div />}

                  <button
                    onClick={() => setStep((prev) => (prev + 1) as any)}
                    className="bg-[#1C1917] text-white hover:bg-stone-800 px-6 py-2.5 rounded-full font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* SUCCESS CONFIRMATION RECEIPT */
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-2xl text-stone-900">Reservation Confirmed!</h4>
              <p className="text-stone-600 text-xs max-w-sm mx-auto leading-relaxed">
                Your appointment for <strong>{selectedService.name}</strong> on Thursday, Oct {selectedDay} at {selectedTime} with {selectedProvider.name} is locked.
              </p>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-sm mx-auto text-[11px] text-stone-600 space-y-1">
                <div>Deposit Paid: <strong>${depositDollars}.00</strong></div>
                <div>EMR Chart: <strong>#AR-9941 (Synced)</strong></div>
                <div>Confirmation SMS sent to: <strong>{patientPhone}</strong></div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleCloseModal}
                  className="bg-[#1C1917] text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest font-semibold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
