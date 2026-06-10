'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Code, Send, Sparkles, AlertCircle, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { Service, ServiceField } from '@/app/types/service.types';
import { useRouter } from 'next/navigation';

export default function AddNewServicePage() {
  const router = useRouter();
  
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [serviceFields, setServiceFields] = useState<ServiceField[]>([]);
  const [loadingFields, setLoadingFields] = useState(false);
  
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [genericFiles, setGenericFiles] = useState<File[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    async function loadServices() {
      const data = await api.fetchServices();
      setServices(data.filter(s => s.isActive));
      setLoadingServices(false);
    }
    loadServices();
  }, []);

  useEffect(() => {
    if (!selectedServiceId) {
      setServiceFields([]);
      setFormData({});
      return;
    }

    async function loadFields() {
      setLoadingFields(true);
      const fields = await api.fetchServiceFields(selectedServiceId!);
      setServiceFields(fields);
      setFormData({});
      setGenericFiles([]);
      setLoadingFields(false);
    }
    loadFields();
  }, [selectedServiceId]);

  const handleInputChange = (fieldKey: string, value: any, type: string) => {
    if (type === 'FILE') {
      setFormData(prev => ({ ...prev, [fieldKey]: value }));
    } else {
      setFormData(prev => ({ ...prev, [fieldKey]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId) return;

    setIsSubmitting(true);
    setMessage(null);

    const submissionData = new FormData();
    for (const field of serviceFields) {
      const val = formData[field.fieldKey];
      if (val !== undefined && val !== null) {
        submissionData.append(field.fieldKey, val);
      }
    }

    for (const file of genericFiles) {
      submissionData.append('attachments', file);
    }

    const res = await api.submitServiceRequest(selectedServiceId, submissionData);
    setIsSubmitting(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Service request submitted successfully!' });
      setTimeout(() => {
        router.push('/customer/services');
      }, 2000);
    } else {
      setMessage({ type: 'error', text: res.message || 'Failed to submit request' });
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <motion.div variants={item} className="flex items-center gap-4">
        <Link href="/customer/services" className="p-2 rounded-xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 hover:border-cyan-500/30 text-gray-500 hover:text-cyan-500 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Request New Service</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Select a service and provide your project details.</p>
        </div>
      </motion.div>

      <form className="space-y-10" onSubmit={handleSubmit}>
        {/* Step 1: Service Type */}
        <motion.div variants={item} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center font-bold text-sm">1</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Service Category</h2>
          </div>
          
          <div className="pl-10">
            {loadingServices ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading available services...</span>
              </div>
            ) : services.length === 0 ? (
              <p className="text-gray-500">No active services available at the moment.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {services.map((service) => {
                  const isSelected = selectedServiceId === service.id;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`relative p-6 rounded-3xl border text-left transition-all duration-300 flex flex-col items-start gap-4 overflow-hidden group
                        ${isSelected 
                          ? `border-cyan-500 bg-white dark:bg-[#151515] shadow-[0_0_20px_rgba(6,182,212,0.15)]` 
                          : `border-gray-100 dark:border-white/5 bg-white dark:bg-[#111] hover:bg-gray-50 dark:hover:bg-[#151515] hover:border-gray-200 dark:hover:border-white/10`
                        }`}
                    >
                      {isSelected && (
                        <motion.div layoutId="activeServiceGlow" className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none" />
                      )}
                      
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden transition-colors ${isSelected ? 'bg-cyan-500 text-black' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}>
                        {service.thumbnailUrl ? (
                          <img src={service.thumbnailUrl} alt={service.name} className="w-full h-full object-cover" />
                        ) : (
                          <Code className="w-6 h-6" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className={`font-bold transition-colors ${isSelected ? 'text-cyan-500 dark:text-cyan-400' : 'text-gray-900 dark:text-white group-hover:text-cyan-500'}`}>
                          {service.name}
                        </h3>
                        {service.price && (
                          <p className="text-xs text-gray-500 mt-1 font-medium">Starting at ${service.price}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Step 2: Dynamic Project Details */}
        <AnimatePresence>
          {selectedServiceId && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6 overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center font-bold text-sm">2</div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Details</h2>
              </div>
              
              <div className="pl-10">
                {loadingFields ? (
                  <div className="flex items-center gap-2 text-gray-500 py-8">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading service fields...</span>
                  </div>
                ) : serviceFields.length === 0 ? (
                  <p className="text-gray-500 py-4">No additional details required for this service. You can submit the request.</p>
                ) : (
                  <div className="space-y-6">
                    {serviceFields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {field.fieldLabel} {field.isRequired && <span className="text-red-500">*</span>}
                        </label>
                        
                        {field.fieldType === 'TEXT' || field.fieldType === 'NUMBER' || field.fieldType === 'DATE' || field.fieldType === 'EMAIL' || field.fieldType === 'PHONE' ? (
                          <input 
                            type={field.fieldType === 'PHONE' ? 'tel' : field.fieldType.toLowerCase()}
                            required={field.isRequired}
                            placeholder={field.placeholder || ''}
                            onChange={(e) => handleInputChange(field.fieldKey, e.target.value, field.fieldType)}
                            className="w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl px-5 py-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                          />
                        ) : field.fieldType === 'TEXTAREA' ? (
                          <textarea 
                            rows={4}
                            required={field.isRequired}
                            placeholder={field.placeholder || ''}
                            onChange={(e) => handleInputChange(field.fieldKey, e.target.value, field.fieldType)}
                            className="w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl px-5 py-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all resize-none"
                          />
                        ) : field.fieldType === 'DROPDOWN' ? (
                          <div className="relative">
                            <select 
                              required={field.isRequired}
                              onChange={(e) => handleInputChange(field.fieldKey, e.target.value, field.fieldType)}
                              className="w-full appearance-none bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                            >
                              <option value="">{field.placeholder || 'Select an option...'}</option>
                              {Array.isArray(field.options) && field.options.map((opt: string, idx: number) => (
                                <option key={idx} value={opt}>{opt}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-500">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                          </div>
                        ) : field.fieldType === 'FILE' ? (
                          <input 
                            type="file"
                            required={field.isRequired}
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                handleInputChange(field.fieldKey, e.target.files[0], field.fieldType);
                              }
                            }}
                            className="w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl px-5 py-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-500 hover:file:bg-cyan-500/20"
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Generic Attachments Section */}
              <div className="pl-10 pt-4 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Additional Attachments / Project Documents (Optional)
                  </label>
                  <div className="relative border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group text-center cursor-pointer">
                    <input 
                      type="file" 
                      multiple 
                      onChange={(e) => {
                        if (e.target.files) {
                          setGenericFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      </div>
                      <p className="text-sm font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-400">Any additional files (PDF, images, zips) that describe your project</p>
                    </div>
                  </div>
                  {genericFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {genericFiles.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{f.name}</span>
                          <button 
                            type="button" 
                            onClick={() => setGenericFiles(prev => prev.filter((_, idx) => idx !== i))}
                            className="text-red-500 hover:text-red-600 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Section */}
              <div className="pl-10 pt-8 mt-8 border-t border-gray-100 dark:border-white/5">
                {message && (
                  <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="font-medium">{message.text}</p>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isSubmitting || loadingFields}
                  className="group relative flex items-center justify-center gap-2 w-full md:w-auto bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-4 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <Sparkles className="w-5 h-5" />
                      <span>Submit Service Request</span>
                      <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center md:text-left">
                  By submitting, you agree to our terms of service. Our team will review your request and get back to you within 24 hours.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </form>
    </motion.div>
  );
}
