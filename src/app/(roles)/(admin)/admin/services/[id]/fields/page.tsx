"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  PlusCircle, ArrowLeft, Layers, Edit, Trash2, CheckCircle2, 
  XCircle, GripVertical, ChevronUp, ChevronDown, ListTodo, X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { servicesAdminService } from "@/services/admin/services.service";
import { Service, ServiceField } from "@/app/types/service.types";

const FIELD_TYPES = [
  { value: "TEXT", label: "Short Text" },
  { value: "TEXTAREA", label: "Long Text (Paragraph)" },
  { value: "DROPDOWN", label: "Dropdown (Select)" },
  { value: "FILE", label: "File Upload" },
  { value: "NUMBER", label: "Number" },
  { value: "DATE", label: "Date" },
  { value: "EMAIL", label: "Email Address" },
  { value: "PHONE", label: "Phone Number" },
];

export default function ServiceFieldsBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [fields, setFields] = useState<ServiceField[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fieldLabel: "",
    fieldKey: "",
    fieldType: "TEXT",
    isRequired: true,
    isActive: true,
    placeholder: "",
    options: [] as string[],
  });
  const [newOption, setNewOption] = useState("");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [serviceData, fieldsData] = await Promise.all([
        servicesAdminService.getServiceById(serviceId),
        servicesAdminService.getServiceFields(serviceId)
      ]);
      setService(serviceData);
      
      // Sort fields by sortOrder
      const sortedFields = [...(fieldsData || [])].sort((a, b) => a.sortOrder - b.sortOrder);
      setFields(sortedFields);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      alert("Failed to load service fields.");
      router.push('/admin/services');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (serviceId) {
      fetchData();
    }
  }, [serviceId]);

  const openAddModal = () => {
    setFormData({
      fieldLabel: "",
      fieldKey: "",
      fieldType: "TEXT",
      isRequired: true,
      isActive: true,
      placeholder: "",
      options: [],
    });
    setEditingFieldId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (field: ServiceField) => {
    let parsedOptions: string[] = [];
    if (Array.isArray(field.options)) {
      parsedOptions = field.options;
    } else if (typeof field.options === 'string') {
      try { parsedOptions = JSON.parse(field.options); } catch(e) {}
    }

    setFormData({
      fieldLabel: field.fieldLabel,
      fieldKey: field.fieldKey,
      fieldType: field.fieldType,
      isRequired: field.isRequired,
      isActive: field.isActive,
      placeholder: field.placeholder || "",
      options: parsedOptions,
    });
    setEditingFieldId(field.id);
    setIsModalOpen(true);
  };

  const handleGenerateKey = (label: string) => {
    return label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      fieldLabel: val,
      // Only auto-generate key if we are creating a new field
      fieldKey: !editingFieldId ? handleGenerateKey(val) : prev.fieldKey
    }));
  };

  const addOption = () => {
    if (newOption.trim()) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, newOption.trim()]
      }));
      setNewOption("");
    }
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleSaveField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fieldType === "DROPDOWN" && formData.options.length === 0) {
      alert("Please add at least one option for the dropdown field.");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        sortOrder: editingFieldId ? undefined : fields.length,
      };

      if (editingFieldId) {
        await servicesAdminService.updateServiceField(editingFieldId, payload);
      } else {
        await servicesAdminService.createServiceField(serviceId, payload);
      }
      
      setIsModalOpen(false);
      await fetchData();
    } catch (error) {
      console.error("Failed to save field", error);
      alert("Failed to save field. Please check your inputs.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this field? This will remove it from the questionnaire.")) {
      try {
        await servicesAdminService.deleteServiceField(id);
        await fetchData();
      } catch (error) {
        console.error("Failed to delete field", error);
        alert("Failed to delete field.");
      }
    }
  };

  const moveField = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === fields.length - 1)
    ) return;

    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newFields[index];
    newFields[index] = newFields[targetIndex];
    newFields[targetIndex] = temp;

    // Update sortOrder locally
    newFields.forEach((f, i) => {
      f.sortOrder = i;
    });

    setFields(newFields);

    try {
      const payload = newFields.map(f => ({ id: f.id, sortOrder: f.sortOrder }));
      await servicesAdminService.reorderServiceFields(payload);
    } catch (error) {
      console.error("Failed to reorder fields", error);
      // Revert if fail
      await fetchData();
    }
  };

  if (isLoading && fields.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-gray-200 dark:border-white/10 border-t-[#39FF14] animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-20">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => router.push('/admin/services')}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={16} /> Back to Services
          </button>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-[#39FF14]">
              <ListTodo size={24} />
            </div>
            Questionnaire Builder
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
            Build the intake form for {service ? <span className="text-gray-900 dark:text-gray-100 font-bold">{service.name}</span> : 'this service'}.
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#39FF14] hover:bg-[#32e012] text-black px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2 shrink-0"
        >
          <PlusCircle size={18} />
          Add Field
        </button>
      </div>

      {/* Fields List */}
      <div className="bg-gray-50 dark:bg-[#111111] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Form Fields</h2>
        
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
            <ListTodo className="text-gray-300 dark:text-gray-700 mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No fields added yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
              Create the questionnaire that customers will fill out when requesting this service.
            </p>
            <button 
              onClick={openAddModal}
              className="bg-gray-900 dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2"
            >
              <PlusCircle size={18} /> Add Your First Field
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {fields.map((field, index) => (
                <motion.div 
                  key={field.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl group transition-all hover:border-emerald-500/30 dark:hover:border-[#39FF14]/30"
                >
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => moveField(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                    >
                      <ChevronUp size={18} />
                    </button>
                    <button 
                      onClick={() => moveField(index, 'down')}
                      disabled={index === fields.length - 1}
                      className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                    >
                      <ChevronDown size={18} />
                    </button>
                  </div>
                  
                  <div className="flex-1 min-w-0 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 dark:text-white text-base">
                          {field.fieldLabel}
                        </span>
                        {field.isRequired && (
                          <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md">Required</span>
                        )}
                        {!field.isActive && (
                          <span className="text-xs font-bold text-gray-500 bg-gray-500/10 px-2 py-0.5 rounded-md">Inactive</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-mono bg-gray-200 dark:bg-black/50 px-2 py-0.5 rounded text-[10px]">{field.fieldKey}</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> {field.fieldType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => openEditModal(field)}
                      className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-200 dark:hover:text-white dark:hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(field.id)}
                      className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-50 dark:bg-[#111111] rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10"
            >
              <div className="sticky top-0 z-10 bg-gray-50/80 dark:bg-[#111111]/80 backdrop-blur-md px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingFieldId ? "Edit Field" : "Create New Field"}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveField} className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Field Label */}
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Field Label</label>
                    <input 
                      type="text" 
                      required
                      value={formData.fieldLabel}
                      onChange={handleLabelChange}
                      placeholder="e.g. Business Name"
                      className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#39FF14]/50 focus:border-[#39FF14] transition-all outline-none"
                    />
                  </div>

                  {/* Field Key */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex justify-between">
                      Field Key
                      <span className="text-[10px] font-normal text-gray-400 normal-case">(Used in API)</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.fieldKey}
                      onChange={(e) => setFormData({...formData, fieldKey: e.target.value.toLowerCase().replace(/[^a-z0-9_]+/g, '')})}
                      placeholder="e.g. business_name"
                      className="w-full bg-gray-100 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-gray-900 dark:text-white focus:ring-2 focus:ring-[#39FF14]/50 focus:border-[#39FF14] transition-all outline-none"
                    />
                  </div>

                  {/* Field Type */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Field Type</label>
                    <select 
                      required
                      value={formData.fieldType}
                      onChange={(e) => setFormData({...formData, fieldType: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#39FF14]/50 focus:border-[#39FF14] transition-all outline-none appearance-none"
                    >
                      {FIELD_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Placeholder */}
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Placeholder Text (Optional)</label>
                    <input 
                      type="text" 
                      value={formData.placeholder}
                      onChange={(e) => setFormData({...formData, placeholder: e.target.value})}
                      placeholder="e.g. Enter your company's legal name"
                      className="w-full bg-gray-100 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-[#39FF14]/50 focus:border-[#39FF14] transition-all outline-none"
                    />
                  </div>

                  {/* Dropdown Options */}
                  {formData.fieldType === 'DROPDOWN' && (
                    <div className="space-y-4 sm:col-span-2 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                      <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Dropdown Options</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={newOption}
                          onChange={(e) => setNewOption(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOption(); } }}
                          placeholder="Type an option and press Add"
                          className="flex-1 bg-gray-100 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white focus:border-emerald-500 outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={addOption}
                          className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
                        >
                          Add
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.options.map((opt, i) => (
                          <div key={i} className="flex items-center gap-2 bg-gray-100 dark:bg-black border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                            {opt}
                            <button type="button" onClick={() => removeOption(i)} className="text-gray-400 hover:text-red-500">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        {formData.options.length === 0 && (
                          <div className="text-sm text-gray-500 italic">No options added yet.</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Toggles */}
                  <div className="sm:col-span-2 grid grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 cursor-pointer">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={formData.isRequired}
                          onChange={(e) => setFormData({...formData, isRequired: e.target.checked})}
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${formData.isRequired ? 'bg-[#39FF14]' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isRequired ? 'translate-x-4' : 'translate-x-0'}`}></div>
                      </div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">Required Field</div>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 cursor-pointer">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={formData.isActive}
                          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        />
                        <div className={`block w-10 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-[#39FF14]' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                      </div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">Active (Visible)</div>
                    </label>
                  </div>

                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 rounded-xl font-bold text-sm text-gray-600 dark:text-gray-400 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 rounded-xl font-bold text-sm text-black bg-[#39FF14] hover:bg-[#32e012] disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {isSaving ? (
                      <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div> Saving...</>
                    ) : (
                      "Save Field"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
