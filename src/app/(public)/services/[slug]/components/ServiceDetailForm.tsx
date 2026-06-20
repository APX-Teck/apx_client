'use client';

import { Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ServiceField } from '@/app/types/service.types';
import { useServiceRequestLogic } from '@/hooks/useServiceRequestLogic';
import { RecaptchaField } from '@/components/ui/RecaptchaField';

interface Props {
  serviceId: number;
  serviceSlug: string;
  fields: ServiceField[];
  formRef: React.RefObject<HTMLDivElement | null>;
}

export function ServiceDetailForm({ serviceId, serviceSlug, fields, formRef }: Props) {
  const { isSubmitSuccess, isSubmitting, errorMessage, form, onSubmit } = useServiceRequestLogic(
    serviceId,
    serviceSlug
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  return (
    <section ref={formRef} className="max-w-3xl mx-auto px-4 sm:px-6 w-full">
      <GlassCard className="p-6 sm:p-8 md:p-12 border border-glass-border relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5 pointer-events-none" />

        <div className="text-center mb-8 space-y-2 relative z-10">
          <h2 className="text-3xl font-extrabold tracking-tight">Submit Requirements</h2>
          <p className="text-foreground/60 text-sm">
            Submit your request parameters. Authentic login is required to process requests.
          </p>
        </div>

        {isSubmitSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center gap-3 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Request registered successfully! Check your user panel for updates.</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center gap-3 text-sm font-semibold">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {fields.length === 0 ? (
          <div className="text-center text-foreground/50 py-6 text-sm">
            No additional configuration fields requested. Ready to build custom modules? Contact us!
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
            {fields.map((field) => {
              const requiredSymbol = field.isRequired ? ' *' : '';

              return (
                <div key={field.id} className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">
                    {field.fieldLabel} {requiredSymbol}
                  </label>

                  {field.fieldType === 'TEXT' && (
                    <input
                      type="text"
                      {...register(field.fieldKey, { required: field.isRequired })}
                      placeholder={field.placeholder || ''}
                      className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 min-h-[44px] outline-none text-sm sm:text-base focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    />
                  )}

                  {field.fieldType === 'TEXTAREA' && (
                    <textarea
                      rows={4}
                      {...register(field.fieldKey, { required: field.isRequired })}
                      placeholder={field.placeholder || ''}
                      className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 min-h-[44px] outline-none text-sm sm:text-base resize-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    />
                  )}

                  {field.fieldType === 'DROPDOWN' && (
                    <select
                      {...register(field.fieldKey, { required: field.isRequired })}
                      className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 min-h-[44px] outline-none text-sm sm:text-base focus:ring-2 focus:ring-accent/50 focus:border-accent"
                    >
                      <option value="" className="bg-background text-foreground">
                        {field.placeholder || 'Select option'}
                      </option>
                      {Array.isArray(field.options) &&
                        field.options.map((opt: string, oIdx: number) => (
                          <option key={oIdx} value={opt} className="bg-background text-foreground">
                            {opt}
                          </option>
                        ))}
                    </select>
                  )}

                  {field.fieldType === 'FILE' && (
                    <input
                      type="file"
                      {...register(field.fieldKey, { required: field.isRequired })}
                      className="w-full text-sm sm:text-base text-foreground/70 min-h-[44px] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 file:cursor-pointer"
                    />
                  )}

                  {field.fieldType === 'NUMBER' && (
                    <input
                      type="number"
                      {...register(field.fieldKey, { required: field.isRequired })}
                      placeholder={field.placeholder || ''}
                      className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 min-h-[44px] outline-none text-sm sm:text-base focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                    />
                  )}

                  {field.fieldType === 'DATE' && (
                    <input
                      type="date"
                      {...register(field.fieldKey, { required: field.isRequired })}
                      className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 min-h-[44px] outline-none text-sm sm:text-base focus:ring-2 focus:ring-accent/50 focus:border-accent"
                    />
                  )}

                  {errors[field.fieldKey] && (
                    <p className="text-xs text-rose-500 font-medium pl-1">This field is required</p>
                  )}
                </div>
              );
            })}

            <RecaptchaField control={control} name="recaptchaToken" error={errors.recaptchaToken?.message as string} />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full group relative inline-flex h-14 min-h-[44px] sm:min-h-[56px] items-center justify-center gap-2 rounded-xl bg-accent text-white px-8 text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/25"
            >
              <Send className="w-4 h-4" />
              <span>
                {isSubmitting ? 'Submitting requirements...' : 'Submit Project Requirements'}
              </span>
            </button>
          </form>
        )}
      </GlassCard>
    </section>
  );
}
