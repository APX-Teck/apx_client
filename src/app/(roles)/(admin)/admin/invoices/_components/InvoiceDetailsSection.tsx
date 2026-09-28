import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { InvoiceFormValues } from '../_schemas/invoice.schema';
import { GST_STATE_OPTIONS } from '../_lib/invoice.constants';
import { Field, Section, Toggle, inputClass } from './FormPrimitives';

interface Props {
  register: UseFormRegister<InvoiceFormValues>;
  errors: FieldErrors<InvoiceFormValues>;
  nextNumber: string | null;
}

export function InvoiceDetailsSection({ register, errors, nextNumber }: Props) {
  return (
    <Section title="Invoice Details" description="Numbering, dates and supply information">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field
          label="Invoice No."
          error={errors.invoiceNumber?.message}
          hint={nextNumber ? `Leave blank to auto-assign ${nextNumber}` : 'Leave blank to auto-assign'}
        >
          <input
            {...register('invoiceNumber')}
            placeholder={nextNumber ?? 'APX/YYYY-YY/XXX'}
            className={inputClass(!!errors.invoiceNumber)}
          />
        </Field>
        <Field label="Invoice Date" required error={errors.invoiceDate?.message}>
          <input type="date" {...register('invoiceDate')} className={inputClass(!!errors.invoiceDate)} />
        </Field>
        <Field label="Due Date" required error={errors.dueDate?.message}>
          <input type="date" {...register('dueDate')} className={inputClass(!!errors.dueDate)} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
        <Field
          label="Place of Supply"
          required
          error={errors.placeOfSupplyCode?.message}
          hint="Defaults to the client's state"
        >
          <select {...register('placeOfSupplyCode')} className={inputClass(!!errors.placeOfSupplyCode)}>
            {GST_STATE_OPTIONS.map((state) => (
              <option key={state.code} value={state.code}>
                {state.label}
              </option>
            ))}
          </select>
        </Field>
        <Toggle
          {...register('taxInclusive')}
          label="Rates include GST"
          description="Tax is backed out of the rate, e.g. ₹6000 → ₹5084.74 + GST"
        />
        <Toggle
          {...register('reverseCharge')}
          label="Reverse charge"
          description="Recipient pays the GST on this supply"
        />
      </div>
    </Section>
  );
}
