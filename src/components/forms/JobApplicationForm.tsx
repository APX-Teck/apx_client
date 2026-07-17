'use client';

import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useJobApplicationFormLogic } from '@/hooks/useJobApplicationFormLogic';
import { RecaptchaField } from '@/components/ui/RecaptchaField';

import { useEffect, useState } from 'react';
import { publicJobService } from '@/services/public/job.service';
import { JobListing } from '@/app/types/job.types';

export function JobApplicationForm() {
  const [jobs, setJobs] = useState<JobListing[]>([]);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await publicJobService.getPublicJobListings();
        if (response.data && response.data.data) {
          setJobs(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch jobs for form:', error);
      }
    }
    fetchJobs();
  }, []);

  const {
    form: {
      register,
      handleSubmit,
      control,
      formState: { errors },
    },
    onSubmit,
    isSubmitSuccess,
    errorMessage,
    isSubmitting,
  } = useJobApplicationFormLogic();

  return (
    <div className="w-full">
      {isSubmitSuccess && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center gap-3 text-sm font-semibold"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>Application submitted successfully! Our HR team will reach out to you shortly.</span>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center gap-3 text-sm font-semibold"
        >
          <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            {...register('website')}
            tabIndex={-1}
            autoComplete="off"
            placeholder="Leave blank"
          />
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-foreground/75">
            Full Name <span className="text-rose-500" aria-hidden="true">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            aria-invalid={errors.fullName ? 'true' : 'false'}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            {...register('fullName')}
            className={`w-full bg-foreground/[0.02] border rounded-xl px-4 py-3 min-h-[44px] sm:min-h-[48px] outline-none text-sm md:text-base transition-all focus:ring-2 focus:ring-accent/50 ${
              errors.fullName ? 'border-rose-500/50 focus:border-rose-500' : 'border-glass-border focus:border-accent'
            }`}
            placeholder="e.g. Rahul Deshmukh"
          />
          {errors.fullName && (
            <p id="fullName-error" className="text-xs text-rose-500 font-medium pl-1" role="alert">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full">
          {/* Email */}
          <div className="space-y-1.5 w-full">
            <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-foreground/75">
              Email Address <span className="text-rose-500" aria-hidden="true">*</span>
            </label>
            <input
              id="email"
              type="email"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              {...register('email')}
              className={`w-full bg-foreground/[0.02] border rounded-xl px-4 py-3 min-h-[44px] sm:min-h-[48px] outline-none text-sm md:text-base transition-all focus:ring-2 focus:ring-accent/50 ${
                errors.email ? 'border-rose-500/50 focus:border-rose-500' : 'border-glass-border focus:border-accent'
              }`}
              placeholder="name@company.com"
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-rose-500 font-medium pl-1" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5 w-full">
            <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-foreground/75">
              Mobile Number <span className="text-rose-500" aria-hidden="true">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              aria-invalid={errors.phone ? 'true' : 'false'}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              {...register('phone')}
              className={`w-full bg-foreground/[0.02] border rounded-xl px-4 py-3 min-h-[44px] sm:min-h-[48px] outline-none text-sm md:text-base transition-all focus:ring-2 focus:ring-accent/50 ${
                errors.phone ? 'border-rose-500/50 focus:border-rose-500' : 'border-glass-border focus:border-accent'
              }`}
              placeholder="10-digit mobile"
            />
            {errors.phone && (
              <p id="phone-error" className="text-xs text-rose-500 font-medium pl-1" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Role Applied For */}
        <div className="space-y-1.5">
          <label htmlFor="role" className="text-xs font-bold uppercase tracking-wider text-foreground/75">
            Role Applying For <span className="text-rose-500" aria-hidden="true">*</span>
          </label>
          <select
            id="role"
            {...register('role')}
            className={`w-full bg-foreground/[0.02] border rounded-xl px-4 py-3 min-h-[44px] sm:min-h-[48px] outline-none text-sm md:text-base focus:ring-2 focus:ring-accent/50 appearance-none relative cursor-pointer ${
              errors.role ? 'border-rose-500/50 focus:border-rose-500' : 'border-glass-border focus:border-accent'
            } text-foreground/80`}
          >
            <option value="" className="bg-background text-foreground">Select a role</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id.toString()} className="bg-background text-foreground">
                {job.title}
              </option>
            ))}
            <option value="1" className="bg-background text-foreground">Other / Open Application</option>
          </select>
          {errors.role && (
            <p className="text-xs text-rose-500 font-medium pl-1" role="alert">{errors.role.message}</p>
          )}
        </div>

        {/* Portfolio / Resume Link */}
        <div className="space-y-1.5">
          <label htmlFor="portfolio" className="text-xs font-bold uppercase tracking-wider text-foreground/75">
            Portfolio or Resume Link (Google Drive / GitHub / LinkedIn)
          </label>
          <input
            id="portfolio"
            type="url"
            aria-invalid={errors.portfolio ? 'true' : 'false'}
            {...register('portfolio')}
            className={`w-full bg-foreground/[0.02] border rounded-xl px-4 py-3 min-h-[44px] sm:min-h-[48px] outline-none text-sm md:text-base transition-all focus:ring-2 focus:ring-accent/50 ${
              errors.portfolio ? 'border-rose-500/50 focus:border-rose-500' : 'border-glass-border focus:border-accent'
            }`}
            placeholder="https://..."
          />
          {errors.portfolio && (
            <p className="text-xs text-rose-500 font-medium pl-1" role="alert">{errors.portfolio.message}</p>
          )}
        </div>

        {/* Message / Cover Letter */}
        <div className="space-y-1.5">
          <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-foreground/75">
            Brief Cover Letter <span className="text-rose-500" aria-hidden="true">*</span>
          </label>
          <textarea
            id="message"
            rows={5}
            aria-invalid={errors.message ? 'true' : 'false'}
            {...register('message')}
            className={`w-full bg-foreground/[0.02] border rounded-xl px-4 py-3 outline-none text-sm md:text-base transition-all resize-none focus:ring-2 focus:ring-accent/50 ${
              errors.message ? 'border-rose-500/50 focus:border-rose-500' : 'border-glass-border focus:border-accent'
            }`}
            placeholder="Tell us why you're a great fit for APXTeck..."
          />
          {errors.message && (
            <p className="text-xs text-rose-500 font-medium pl-1" role="alert">{errors.message.message}</p>
          )}
        </div>

        {/* reCAPTCHA */}
        <div className="pt-2">
          <RecaptchaField control={control} name={'recaptchaToken' as any} error={(errors as any).recaptchaToken?.message as string} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
          className="w-full group relative inline-flex min-h-[44px] sm:min-h-[56px] items-center justify-center gap-2 rounded-xl bg-accent text-white px-8 py-3 sm:py-0 text-sm md:text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/25"
        >
          <span className="relative z-10 flex items-center gap-2">
            {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
            {!isSubmitting && (
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" aria-hidden="true" />
            )}
          </span>
        </button>
      </form>
    </div>
  );
}
