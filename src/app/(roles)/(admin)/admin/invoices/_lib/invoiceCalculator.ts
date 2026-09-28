import { InvoiceLineItemInput, InvoiceTotals } from '@/app/types/invoice.types';
import { COMPANY_STATE_CODE } from './invoice.constants';

// Live form totals. Mirrors BACKEND/src/modules/invoice/invoice.calculator.ts — the server
// recalculates everything on preview/generate and is authoritative.
const percentOf = (paise: number, rate: number) => Math.round((paise * rate) / 100 + 1e-9);

export function calculateInvoiceTotals(
  lineItems: Partial<InvoiceLineItemInput>[],
  placeOfSupplyCode: string,
  taxInclusive: boolean
): InvoiceTotals {
  const intraState = placeOfSupplyCode === COMPANY_STATE_CODE;
  const totals = { subtotal: 0, cgst: 0, sgst: 0, igst: 0 };

  const lines = lineItems.map((item) => {
    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const gstRate = Number(item.gstRate) || 0;
    const gross = Math.round(quantity * rate * 100);
    const taxBase = taxInclusive ? Math.round((gross * 100) / (100 + gstRate)) : gross;
    const cgst = intraState ? percentOf(taxBase, gstRate / 2) : 0;
    const sgst = intraState ? percentOf(taxBase, gstRate / 2) : 0;
    const igst = intraState ? 0 : percentOf(taxBase, gstRate);
    const taxable = taxInclusive ? gross - cgst - sgst - igst : gross;

    totals.subtotal += taxable;
    totals.cgst += cgst;
    totals.sgst += sgst;
    totals.igst += igst;

    return {
      description: item.description ?? '',
      sac: item.sac ?? '',
      quantity,
      rate,
      gstRate,
      taxable: taxable / 100,
      cgst: cgst / 100,
      sgst: sgst / 100,
      igst: igst / 100,
      total: (taxable + cgst + sgst + igst) / 100,
    };
  });

  const totalTax = totals.cgst + totals.sgst + totals.igst;
  return {
    supplyType: intraState ? 'INTRA_STATE' : 'INTER_STATE',
    lineItems: lines,
    subtotal: totals.subtotal / 100,
    cgst: totals.cgst / 100,
    sgst: totals.sgst / 100,
    igst: totals.igst / 100,
    totalTax: totalTax / 100,
    totalAmount: (totals.subtotal + totalTax) / 100,
  };
}
