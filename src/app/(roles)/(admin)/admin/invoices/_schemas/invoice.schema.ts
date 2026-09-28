import { z } from 'zod';
import { InvoicePayload } from '@/app/types/invoice.types';
import {
  DEFAULT_DUE_DAYS,
  DEFAULT_GST_RATE,
  DEFAULT_SAC,
  GSTIN_REGEX,
  INVOICE_NUMBER_REGEX,
  addDays,
  financialYearOf,
  toIsoDate,
} from '../_lib/invoice.constants';

const positiveNumber = (label: string) =>
  z.number({ message: `${label} is required` }).positive(`${label} must be greater than 0`);

export const invoiceLineItemSchema = z.object({
  description: z.string().trim().min(1, 'Description is required').max(200, 'Max 200 characters'),
  details: z.string().trim().max(500, 'Max 500 characters'),
  sac: z.string().trim().regex(/^\d{6}$/, 'SAC must be 6 digits'),
  quantity: positiveNumber('Quantity'),
  rate: positiveNumber('Rate'),
  gstRate: z.number({ message: 'GST rate is required' }).min(0).max(40),
});

export const invoiceFormSchema = z
  .object({
    invoiceNumber: z.string().trim(),
    invoiceDate: z.string().min(1, 'Invoice date is required'),
    dueDate: z.string().min(1, 'Due date is required'),
    placeOfSupplyCode: z.string().min(1, 'Place of supply is required'),
    reverseCharge: z.boolean(),
    taxInclusive: z.boolean(),
    clientName: z.string().trim().min(1, 'Client name is required').max(200),
    clientGSTIN: z.string().trim().toUpperCase(),
    clientAddress: z.string().trim().min(1, 'Client address is required').max(500),
    clientStateCode: z.string().min(1, 'Client state is required'),
    lineItems: z.array(invoiceLineItemSchema).min(1, 'Add at least one line item').max(30),
  })
  .superRefine((data, ctx) => {
    if (data.dueDate && data.invoiceDate && data.dueDate < data.invoiceDate) {
      ctx.addIssue({ code: 'custom', path: ['dueDate'], message: 'Due date cannot be before invoice date' });
    }
    if (data.clientGSTIN) {
      if (!GSTIN_REGEX.test(data.clientGSTIN)) {
        ctx.addIssue({ code: 'custom', path: ['clientGSTIN'], message: 'Invalid GSTIN format' });
      } else if (data.clientGSTIN.slice(0, 2) !== data.clientStateCode) {
        ctx.addIssue({ code: 'custom', path: ['clientGSTIN'], message: 'GSTIN state code does not match client state' });
      }
    }
    if (data.invoiceNumber) {
      const match = INVOICE_NUMBER_REGEX.exec(data.invoiceNumber);
      if (!match) {
        ctx.addIssue({ code: 'custom', path: ['invoiceNumber'], message: 'Use the format APX/YYYY-YY/XXX' });
      } else if (data.invoiceDate && match[1] !== financialYearOf(data.invoiceDate)) {
        ctx.addIssue({
          code: 'custom',
          path: ['invoiceNumber'],
          message: `Must belong to FY ${financialYearOf(data.invoiceDate)}`,
        });
      }
    }
  });

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

export const emptyLineItem = (): InvoiceFormValues['lineItems'][number] => ({
  description: '',
  details: '',
  sac: DEFAULT_SAC,
  quantity: 1,
  rate: 0,
  gstRate: DEFAULT_GST_RATE,
});

export const getDefaultInvoiceFormValues = (): InvoiceFormValues => {
  const today = toIsoDate(new Date());
  return {
    invoiceNumber: '',
    invoiceDate: today,
    dueDate: addDays(today, DEFAULT_DUE_DAYS),
    placeOfSupplyCode: '27',
    reverseCharge: false,
    taxInclusive: false,
    clientName: '',
    clientGSTIN: '',
    clientAddress: '',
    clientStateCode: '27',
    lineItems: [emptyLineItem()],
  };
};

export const toInvoicePayload = (values: InvoiceFormValues): InvoicePayload => ({
  invoiceNumber: values.invoiceNumber || undefined,
  invoiceDate: values.invoiceDate,
  dueDate: values.dueDate,
  placeOfSupplyCode: values.placeOfSupplyCode,
  reverseCharge: values.reverseCharge,
  taxInclusive: values.taxInclusive,
  clientName: values.clientName,
  clientGSTIN: values.clientGSTIN || undefined,
  clientAddress: values.clientAddress,
  clientStateCode: values.clientStateCode,
  lineItems: values.lineItems.map((item) => ({
    description: item.description,
    details: item.details || undefined,
    sac: item.sac,
    quantity: item.quantity,
    rate: item.rate,
    gstRate: item.gstRate,
  })),
});
