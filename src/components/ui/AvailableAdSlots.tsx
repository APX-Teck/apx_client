'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, Tag, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/axios';
import { GlassCard } from './GlassCard';

interface PricingSlot {
  id: number;
  placement: string;
  label: string | null;
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  isActive: boolean;
}

interface AvailableAdSlotsProps {
  layout?: 'vertical' | 'horizontal';
}

export function AvailableAdSlots({ layout = 'vertical' }: AvailableAdSlotsProps) {
  const [slots, setSlots] = useState<PricingSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const data = await api.fetchPricingSlots();
        const safeData = Array.isArray(data) ? data : ((data as any)?.data || []);
        const validSlots = Array.isArray(safeData) ? safeData : [];
        // Only show active slots that have valid prices
        setSlots(
          validSlots.filter(
            (s: PricingSlot) =>
              s.isActive && (s.pricePerDay > 0 || s.pricePerWeek > 0 || s.pricePerMonth > 0)
          )
        );
      } catch (error) {
        console.error('Failed to fetch pricing slots', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, []);

  if (loading || slots.length === 0) {
    return null;
  }

  return (
    <GlassCard
      className={`p-6 border border-glass-border ${layout === 'horizontal' ? 'w-full' : ''}`}
    >
      <div
        className={`flex items-center gap-3 mb-4 ${layout === 'horizontal' ? 'justify-center mb-6' : ''}`}
      >
        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
          <Tag size={18} className="text-indigo-500" />
        </div>
        <div>
          <h4 className="font-bold text-sm">Advertise With Us</h4>
          <p className="text-[10px] text-foreground/50">Available Premium Slots</p>
        </div>
      </div>

      <div
        className={layout === 'horizontal' ? 'grid grid-cols-1 md:grid-cols-3 gap-6' : 'space-y-4'}
      >
        {slots.slice(0, 3).map((slot) => (
          <div
            key={slot.id}
            className="p-3 rounded-xl bg-foreground/[0.02] border border-glass-border"
          >
            <h5 className="font-bold text-xs text-foreground mb-2">
              {slot.label || slot.placement.replace(/_/g, ' ')}
            </h5>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-foreground/60 flex items-center gap-1">
                <CheckCircle2 size={12} className="text-emerald-500" /> Daily
              </span>
              <span className="font-bold text-foreground">₹{slot.pricePerDay}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] mt-1">
              <span className="text-foreground/60 flex items-center gap-1">
                <CheckCircle2 size={12} className="text-emerald-500" /> Weekly
              </span>
              <span className="font-bold text-foreground">₹{slot.pricePerWeek}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] mt-1 border-t border-glass-border pt-1">
              <span className="text-foreground/60 flex items-center gap-1">
                <CheckCircle2 size={12} className="text-indigo-500" /> Monthly
              </span>
              <span className="font-extrabold text-indigo-500">₹{slot.pricePerMonth}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={`mt-4 ${layout === 'horizontal' ? 'flex justify-center mt-8' : ''}`}>
        <button
          className={`${layout === 'horizontal' ? 'w-auto px-8' : 'w-full'} bg-accent/10 hover:bg-accent/20 text-accent py-2.5 rounded-xl text-xs font-bold transition-colors`}
        >
          Contact for Booking
        </button>
      </div>
    </GlassCard>
  );
}
