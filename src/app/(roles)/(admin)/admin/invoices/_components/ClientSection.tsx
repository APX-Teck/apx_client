import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { InvoiceFormValues } from '../_schemas/invoice.schema';
import { GST_STATE_OPTIONS } from '../_lib/invoice.constants';
import { Field, Section, inputClass } from './FormPrimitives';

interface Props {
  register: UseFormRegister<InvoiceFormValues>;
  errors: FieldErrors<InvoiceFormValues>;
}

export function ClientSection({ register, errors }: Props) {
  return (
    <Section title="Bill To (Recipient)" description="Client billing details as they should appear on the invoice">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Client Name" required error={errors.clientName?.message}>
          <input
            {...register('clientName')}
            placeholder="e.g. Phoenix Infotainment"
            className={inputClass(!!errors.clientName)}
          />
        </Field>
        <Field
          label="Client GSTIN"
          error={errors.clientGSTIN?.message}
          hint="Optional — printed as N/A for unregistered clients"
        >
          <input
            {...register('clientGSTIN')}
            placeholder="27ABCDE1234F1Z5"
            maxLength={15}
            className={`${inputClass(!!errors.clientGSTIN)} uppercase`}
          />
        </Field>
        <Field label="Client Address" required error={errors.clientAddress?.message} className="sm:col-span-2">
          <textarea
            {...register('clientAddress')}
            rows={3}
            placeholder="Street, area, city - PIN, state"
            className={`${inputClass(!!errors.clientAddress)} resize-none`}
          />
        </Field>
        <Field label="Client State" required error={errors.clientStateCode?.message}>
          <select {...register('clientStateCode')} className={inputClass(!!errors.clientStateCode)}>
            {GST_STATE_OPTIONS.map((state) => (
              <option key={state.code} value={state.code}>
                {state.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </Section>
  );
}
