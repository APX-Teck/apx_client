'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';
import { Service } from '@/app/types/service.types';

interface ServiceCategorySelectorProps {
  services: Service[];
  selectedServiceId: number | null;
  setSelectedServiceId: (id: number) => void;
}

export function ServiceCategorySelector({
  services,
  selectedServiceId,
  setSelectedServiceId,
}: ServiceCategorySelectorProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={item} className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center font-bold text-sm">
          1
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Service Category</h2>
      </div>

      <div className="pl-0 sm:pl-10">
        {services.length === 0 ? (
          <p className="text-gray-500">No active services available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {services.map((service) => {
              const isSelected = selectedServiceId === service.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl border text-left transition-all duration-300 flex flex-col items-start gap-3 sm:gap-4 overflow-hidden group
                    ${
                      isSelected
                        ? `border-cyan-500 bg-white dark:bg-[#151515] shadow-[0_0_20px_rgba(6,182,212,0.15)]`
                        : `border-gray-100 dark:border-white/5 bg-white dark:bg-[#111] hover:bg-gray-50 dark:hover:bg-[#151515] hover:border-gray-200 dark:hover:border-white/10`
                    }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeServiceGlow"
                      className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none"
                    />
                  )}

                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden transition-colors ${isSelected ? 'bg-cyan-500 text-black' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}
                  >
                    {service.thumbnailUrl ? (
                      <img
                        src={service.thumbnailUrl}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Code className="w-6 h-6" />
                    )}
                  </div>

                  <div>
                    <h3
                      className={`font-bold transition-colors ${isSelected ? 'text-cyan-500 dark:text-cyan-400' : 'text-gray-900 dark:text-white group-hover:text-cyan-500'}`}
                    >
                      {service.name}
                    </h3>
                    {service.price && (
                      <p className="text-xs text-gray-500 mt-1 font-medium">
                        Starting at ₹{service.price}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
