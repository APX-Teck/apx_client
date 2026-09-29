import React from 'react';
import { FieldErrors, UseFieldArrayReturn, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { InvoiceTotals } from '@/app/types/invoice.types';
import { InvoiceFormValues } from '../_schemas/invoice.schema';
import { GST_RATE_OPTIONS, formatINR } from '../_lib/invoice.constants';
import { SAC_SERVICES } from '../_lib/sacCodes';
import { Field, Section, inputClass } from './FormPrimitives';

interface Props {
  register: UseFormRegister<InvoiceFormValues>;
  errors: FieldErrors<InvoiceFormValues>;
  setValue: UseFormSetValue<InvoiceFormValues>;
  fields: UseFieldArrayReturn<InvoiceFormValues, 'lineItems'>;
  onAdd: () => void;
  totals: InvoiceTotals;
}

const selectOnFocus = (e: React.FocusEvent<HTMLInputElement>) => e.target.select();

export function LineItemsEditor({ register, errors, setValue, fields, onAdd, totals }: Props) {
  const intraState = totals.supplyType === 'INTRA_STATE';

  return (
    <Section
      title="Services Rendered"
      description="Line items with SAC code, quantity and rate"
      action={
        <button
          type="button"
          onClick={onAdd}
          disabled={fields.fields.length >= 30}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all disabled:opacity-50"
        >
          <Plus size={16} strokeWidth={2.5} /> Add Item
        </button>
      }
    >
      <div className="space-y-4">
        {fields.fields.map((field, index) => {
          const itemErrors = errors.lineItems?.[index];
          const computed = totals.lineItems[index];
          return (
            <div
              key={field.id}
              className="rounded-2xl border border-gray-200/80 dark:border-white/10 bg-gray-50/40 dark:bg-white/[0.02] p-4 sm:p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                  Item {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => fields.remove(index)}
                  disabled={fields.fields.length === 1}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                  title="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Description of Service" required error={itemErrors?.description?.message}>
                  <input
                    list="sac-services"
                    {...register(`lineItems.${index}.description`, {
                      onChange: (e) => {
                        const matched = SAC_SERVICES.find((s) => s.description === e.target.value);
                        if (matched) {
                          setValue(`lineItems.${index}.sac`, matched.sacCode, { shouldValidate: true });
                          setValue(`lineItems.${index}.gstRate`, matched.gstRate, { shouldValidate: true });
                        }
                      },
                    })}
                    placeholder="e.g. Website Design & Frontend Development"
                    className={inputClass(!!itemErrors?.description)}
                  />
                </Field>
                <Field label="Details" error={itemErrors?.details?.message} hint="Optional sub-line, shown in italics">
                  <input
                    {...register(`lineItems.${index}.details`)}
                    placeholder="e.g. Phase 1 of 2 — UI/UX Design, SEO Setup"
                    className={inputClass(!!itemErrors?.details)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-4">
                <Field label="SAC" required error={itemErrors?.sac?.message}>
                  <input
                    {...register(`lineItems.${index}.sac`)}
                    inputMode="numeric"
                    maxLength={6}
                    className={inputClass(!!itemErrors?.sac)}
                  />
                </Field>
                <Field label="Qty" required error={itemErrors?.quantity?.message}>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    onFocus={selectOnFocus}
                    {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })}
                    className={inputClass(!!itemErrors?.quantity)}
                  />
                </Field>
                <Field label="Rate (₹)" required error={itemErrors?.rate?.message}>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    onFocus={selectOnFocus}
                    {...register(`lineItems.${index}.rate`, { valueAsNumber: true })}
                    className={inputClass(!!itemErrors?.rate)}
                  />
                </Field>
                <Field label="GST %" required error={itemErrors?.gstRate?.message}>
                  <select
                    {...register(`lineItems.${index}.gstRate`, { valueAsNumber: true })}
                    className={inputClass(!!itemErrors?.gstRate)}
                  >
                    {GST_RATE_OPTIONS.map((rate) => (
                      <option key={rate} value={rate}>
                        {rate}%
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="col-span-2 sm:col-span-1 flex flex-col justify-end">
                  <div className="rounded-xl bg-white dark:bg-[#151515] border border-gray-200/80 dark:border-white/10 px-4 py-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Line Total</p>
                    <p className="text-[15px] font-black text-gray-900 dark:text-white">
                      {formatINR(computed?.total ?? 0)}
                    </p>
                  </div>
                </div>
              </div>

              {computed && computed.taxable > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Taxable {formatINR(computed.taxable)} ·{' '}
                  {intraState
                    ? `CGST ${formatINR(computed.cgst)} · SGST ${formatINR(computed.sgst)}`
                    : `IGST ${formatINR(computed.igst)}`}
                </p>
              )}
            </div>
          );
        })}
        {errors.lineItems?.root?.message && (
          <p className="text-xs font-semibold text-red-500">{errors.lineItems.root.message}</p>
        )}
      </div>

      <datalist id="sac-services">
        {SAC_SERVICES.map((service, idx) => (
          <option key={idx} value={service.description} />
        ))}
      </datalist>
    </Section>
  );
}
