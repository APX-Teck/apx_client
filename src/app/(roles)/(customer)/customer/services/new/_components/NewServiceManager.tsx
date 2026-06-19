'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Service } from '@/app/types/service.types';
import { useNewServiceLogic } from '../_hooks/useNewServiceLogic';
import { ServiceCategorySelector } from './ServiceCategorySelector';
import { ProjectDetailsForm } from './ProjectDetailsForm';
import { GenericAttachments } from './GenericAttachments';
import { SubmitSection } from './SubmitSection';

interface NewServiceManagerProps {
  initialServices: Service[];
}

export default function NewServiceManager({ initialServices }: NewServiceManagerProps) {
  const {
    services,
    selectedServiceId,
    setSelectedServiceId,
    serviceFields,
    loadingFields,
    genericFiles,
    isSubmitting,
    message,
    setMessage,
    handleInputChange,
    handleGenericFileUpload,
    removeGenericFile,
    handleSubmit,
  } = useNewServiceLogic(initialServices);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-4xl mx-auto space-y-8 px-4 sm:px-6 md:px-8 pt-4 pb-safe"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center gap-4">
        <Link
          href="/customer/services"
          className="p-2 rounded-xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 hover:border-cyan-500/30 text-gray-500 hover:text-cyan-500 transition-all flex items-center justify-center min-w-[44px] min-h-[48px]"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Request New Service</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Select a service and provide your project details.
          </p>
        </div>
      </motion.div>

      <form className="space-y-10" onSubmit={handleSubmit}>
        <ServiceCategorySelector
          services={services}
          selectedServiceId={selectedServiceId}
          setSelectedServiceId={setSelectedServiceId}
        />

        <AnimatePresence>
          {selectedServiceId && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6 overflow-hidden"
            >
              <ProjectDetailsForm
                serviceFields={serviceFields}
                loadingFields={loadingFields}
                setMessage={setMessage}
                handleInputChange={handleInputChange}
              />

              <GenericAttachments
                genericFiles={genericFiles}
                handleGenericFileUpload={handleGenericFileUpload}
                removeGenericFile={removeGenericFile}
              />

              <SubmitSection
                isSubmitting={isSubmitting}
                loadingFields={loadingFields}
                message={message}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}
