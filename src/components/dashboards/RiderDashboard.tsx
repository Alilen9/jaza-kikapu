import React, { useState, useEffect } from 'react';
import { useMarket } from '../../context/MarketContext';
import { api } from '../../services/api';
import { Rider, DeliveryJob } from '../../types';
import { Bike, MapPin, CheckCircle, Clock, DollarSign, ToggleLeft, ToggleRight, Phone, Navigation, LogOut } from 'lucide-react';

export const RiderDashboard: React.FC = () => {
  const { showToast, currentRider, riderLogout } = useMarket();
  const [rider, setRider] = useState<Rider | null>(null);
  const [deliveries, setDeliveries] = useState<DeliveryJob[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  const loadData = async () => {
    try {
      const ridersList = await api.getRiders();
      const targetRider = currentRider || ridersList[0];
      setRider(targetRider);
      setIsOnline(targetRider.isOnline);

      const delList = await api.getDeliveries();
      setDeliveries(delList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentRider]);

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    showToast(!isOnline ? 'You are now ONLINE to receive Voi delivery jobs!' : 'You went OFFLINE');
  };

  const handleAcceptJob = async (jobId: string) => {
    if (!rider) return;
    try {
      await api.acceptDelivery(jobId, rider.id);
      showToast('Delivery Job Accepted! Proceed to stalls for package collection.');
      loadData();
    } catch {
      showToast('Error accepting job');
    }
  };

  const handleUpdateStatus = async (jobId: string, status: string) => {
    try {
      await api.updateDeliveryStatus(jobId, status);
      showToast(`Status updated to ${status}`);
      loadData();
    } catch {
      showToast('Error updating status');
    }
  };

  if (!rider) {
    return <div className="p-8 text-center text-xs text-stone-500">Loading Rider Console...</div>;
  }

  const pendingJobs = deliveries.filter(d => d.status === 'PENDING');
  const myActiveJobs = deliveries.filter(d => d.riderId === rider.id && d.status !== 'DELIVERED');
  const completedJobs = deliveries.filter(d => d.status === 'DELIVERED');

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6">
      {/* Rider Header */}
      <div className="bg-white rounded-3xl border border-[#E6E0D4] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1B4332] text-[#F4A261] flex items-center justify-center font-bold text-xl">
            <Bike className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-stone-900">
              {rider.name}
            </h2>
            <div className="text-xs text-stone-500 mt-0.5">
              {rider.vehicle} · Plate: <strong>{rider.plate}</strong> · Zone: <strong>{rider.currentZone}</strong>
            </div>
          </div>
        </div>

        {/* Online Toggle & Wallet */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-stone-400 font-semibold uppercase">Wallet Balance</div>
            <div className="font-mono text-base font-bold text-emerald-700">
              KES {rider.walletBalance.toLocaleString()}
            </div>
          </div>

          <button
            onClick={handleToggleOnline}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border ${
              isOnline
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-stone-100 text-stone-600 border-stone-300'
            }`}
          >
            {isOnline ? <ToggleRight className="w-5 h-5 text-emerald-600" /> : <ToggleLeft className="w-5 h-5 text-stone-400" />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </button>

          <button
            onClick={riderLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 text-xs font-semibold cursor-pointer border border-stone-200 transition-colors"
            title="Log out of rider console"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Active Jobs for this Rider */}
      <div className="bg-white rounded-3xl border border-[#E6E0D4] p-6 shadow-sm space-y-4">
        <h3 className="font-display font-bold text-lg text-stone-900 flex items-center gap-2">
          <Navigation className="w-5 h-5 text-[#D95D39]" />
          <span>My Active Deliveries ({myActiveJobs.length})</span>
        </h3>

        {myActiveJobs.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-400">
            No active deliveries right now. Check available jobs below!
          </div>
        ) : (
          <div className="space-y-3">
            {myActiveJobs.map(job => (
              <div key={job.id} className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900">Job #{job.id}</span>
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Payout: KES {job.riderEarnings.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-stone-700">
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-stone-900 shrink-0">Pickup Stalls:</span>
                    <span>{job.pickupStalls.join(' ➔ ')}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-stone-900 shrink-0">Dropoff Address:</span>
                    <span>{job.dropoffAddress}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-200/60">
                  <span className="text-xs font-semibold text-amber-900">
                    Current Status: {job.status}
                  </span>

                  <div className="flex items-center gap-2">
                    {job.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleUpdateStatus(job.id, 'PICKED_UP')}
                        className="px-3 py-1.5 rounded-xl bg-[#1B4332] text-white text-xs font-semibold hover:bg-[#143225] cursor-pointer"
                      >
                        Confirm Picked Up from Stalls
                      </button>
                    )}
                    {job.status === 'PICKED_UP' && (
                      <button
                        onClick={() => handleUpdateStatus(job.id, 'IN_TRANSIT')}
                        className="px-3 py-1.5 rounded-xl bg-[#D95D39] text-white text-xs font-semibold hover:bg-[#C24E2C] cursor-pointer"
                      >
                        Start Transit to Customer
                      </button>
                    )}
                    {job.status === 'IN_TRANSIT' && (
                      <button
                        onClick={() => handleUpdateStatus(job.id, 'DELIVERED')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 cursor-pointer"
                      >
                        Confirm Handover & Complete Delivery
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Delivery Requests */}
      <div className="bg-white rounded-3xl border border-[#E6E0D4] p-6 shadow-sm space-y-4">
        <h3 className="font-display font-bold text-lg text-stone-900">
          Available Jobs in Voi ({pendingJobs.length})
        </h3>

        {pendingJobs.length === 0 ? (
          <div className="py-6 text-center text-xs text-stone-400">
            No unassigned delivery jobs in Voi right now. Orders will appear as buyers check out!
          </div>
        ) : (
          <div className="space-y-3">
            {pendingJobs.map(job => (
              <div key={job.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-semibold text-stone-900">
                    Delivery Job #{job.id} · <span className="text-stone-500">{job.pickupStalls.length} pickup stalls</span>
                  </div>
                  <div className="text-stone-600 mt-1">
                    Pickup: {job.pickupStalls.join(', ')}
                  </div>
                  <div className="text-stone-500 mt-0.5">
                    Dropoff: {job.dropoffAddress}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <div className="font-mono font-bold text-emerald-800 text-sm">
                      KES {job.riderEarnings.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-stone-400">Net Boda Payout</div>
                  </div>

                  <button
                    onClick={() => handleAcceptJob(job.id)}
                    className="px-4 py-2 rounded-xl bg-[#1B4332] text-white font-semibold text-xs hover:bg-[#143225] cursor-pointer"
                  >
                    Accept Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
