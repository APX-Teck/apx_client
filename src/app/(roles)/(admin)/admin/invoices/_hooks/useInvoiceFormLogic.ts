import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { invoicesService } from '@/services/admin/invoices.service';
import { GenerateInvoiceResult, InvoicePayload } from '@/app/types/invoice.types';
import {
  InvoiceFormValues,
  emptyLineItem,
  getDefaultInvoiceFormValues,
  invoiceFormSchema,
  toInvoicePayload,
} from '../_schemas/invoice.schema';
import { calculateInvoiceTotals } from '../_lib/invoiceCalculator';
import { GST_STATES } from '../_lib/invoice.constants';

interface PreviewState {
  html: string;
  invoiceNumber: string;
  isAutoNumber: boolean;
  payload: InvoicePayload;
}

const apiErrorMessage = (error: unknown, fallback: string) =>
  (isAxiosError(error) && error.response?.data?.message) || fallback;

export function useInvoiceFormLogic() {
  const router = useRouter();
  const [nextNumber, setNextNumber] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [generated, setGenerated] = useState<GenerateInvoiceResult | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    mode: 'onTouched',
    defaultValues: getDefaultInvoiceFormValues(),
  });

  const lineItemFields = useFieldArray({ control, name: 'lineItems' });

  const [lineItems, placeOfSupplyCode, taxInclusive, invoiceDate, clientStateCode, clientGSTIN] =
    useWatch({
      control,
      name: [
        'lineItems',
        'placeOfSupplyCode',
        'taxInclusive',
        'invoiceDate',
        'clientStateCode',
        'clientGSTIN',
      ],
    });

  const totals = useMemo(
    () => calculateInvoiceTotals(lineItems ?? [], placeOfSupplyCode, taxInclusive),
    [lineItems, placeOfSupplyCode, taxInclusive]
  );

  useEffect(() => {
    if (!invoiceDate) return;
    let cancelled = false;
    invoicesService.getNextNumber(invoiceDate).then((number) => {
      if (!cancelled) setNextNumber(number);
    });
    return () => {
      cancelled = true;
    };
  }, [invoiceDate]);

  // A GSTIN starts with the holder's state code, so use it to fill the client state
  useEffect(() => {
    const code = clientGSTIN?.trim().slice(0, 2);
    if (code?.length === 2 && GST_STATES[code] && code !== getValues('clientStateCode')) {
      setValue('clientStateCode', code, { shouldValidate: true });
    }
  }, [clientGSTIN, getValues, setValue]);

  // For services, place of supply defaults to the recipient's state (admin can still override)
  useEffect(() => {
    if (clientStateCode) setValue('placeOfSupplyCode', clientStateCode);
  }, [clientStateCode, setValue]);

  const onPreview = handleSubmit(
    async (values) => {
      const payload = toInvoicePayload(values);
      setIsPreviewing(true);
      try {
        const result = await invoicesService.preview(payload);
        setPreview({
          html: result.html,
          invoiceNumber: result.invoiceNumber,
          isAutoNumber: !payload.invoiceNumber,
          payload,
        });
      } catch (error) {
        toast.error(apiErrorMessage(error, 'Failed to generate preview'));
      } finally {
        setIsPreviewing(false);
      }
    },
    () => toast.error('Please fix the highlighted fields')
  );

  // Generates from the exact payload that was previewed, not the (possibly edited) form
  const confirmGenerate = async () => {
    if (!preview || isGenerating) return;
    setIsGenerating(true);
    const toastId = toast.loading('Generating invoice PDF...');
    try {
      const result = await invoicesService.generate(preview.payload);
      setGenerated(result);
      toast.success(`Invoice ${result.invoice.invoiceNumber} generated`, { id: toastId });
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Failed to generate invoice'), { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const closePreview = () => {
    if (isGenerating) return;
    if (generated) {
      router.push('/admin/invoices');
      router.refresh();
      return;
    }
    setPreview(null);
  };

  return {
    register,
    control,
    errors,
    lineItemFields,
    addLineItem: () => lineItemFields.append(emptyLineItem()),
    totals,
    nextNumber,
    onPreview,
    isPreviewing,
    preview,
    closePreview,
    confirmGenerate,
    isGenerating,
    generated,
  };
}

export type InvoiceFormLogic = ReturnType<typeof useInvoiceFormLogic>;
