"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, CheckCircle, Clock, Save, Trash2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { RatingScale } from "../_components/RatingScale";
import {
  writerQuestions,
  directorQuestions,
  producerQuestions,
  type FormQuestion,
} from "../_components/formQuestions";

// ─── Intake window configuration ────────────────────────────────────────────
const INTAKE_OPEN_DATE  = new Date("2026-05-12T00:00:00-07:00"); // May 12, PDT
const INTAKE_CLOSE_DATE = new Date("2026-06-12T23:59:59-07:00"); // June 12, PDT

function isIntakeOpen(): boolean {
  const now = new Date();
  return now >= INTAKE_OPEN_DATE && now <= INTAKE_CLOSE_DATE;
}
// ─────────────────────────────────────────────────────────────────────────────

type FormType = "writer" | "director" | "producer";

function questionsForType(t: FormType): FormQuestion[] {
  if (t === "writer") return writerQuestions;
  if (t === "director") return directorQuestions;
  return producerQuestions;
}

function titleForType(t: FormType) {
  if (t === "writer") return "Writer Submission";
  if (t === "director") return "Director Submission";
  return "Producer / Executive Submission";
}

function localStorageKey(t: FormType) {
  return `ravok_form_draft_${t}`;
}

export default function PitchFormPage() {
  const params = useParams();
  const router = useRouter();
  const rawType = (params?.type as string | undefined)?.toLowerCase();
  const t: FormType =
    rawType === "writer" || rawType === "director" || rawType === "producer"
      ? rawType
      : "writer";

  const intakeOpen = isIntakeOpen();
  const questions = useMemo(() => questionsForType(t), [t]);

  const [answers, setAnswers] = useState<Record<string, string | number | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  // ── Restore draft from localStorage on mount ────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(localStorageKey(t));
      if (saved) {
        const parsed = JSON.parse(saved);
        setAnswers(parsed);
        setHasDraft(true);
      }
    } catch {
      // ignore
    }
  }, [t]);

  // ── Auto-save draft to localStorage on change ───────────────────────────
  useEffect(() => {
    if (Object.keys(answers).length === 0) return;
    try {
      localStorage.setItem(localStorageKey(t), JSON.stringify(answers));
      setDraftSaved(true);
      const timer = setTimeout(() => setDraftSaved(false), 2000);
      return () => clearTimeout(timer);
    } catch {
      // ignore
    }
  }, [answers, t]);

  function clearDraft() {
    try {
      localStorage.removeItem(localStorageKey(t));
    } catch {
      // ignore
    }
    setAnswers({});
    setHasDraft(false);
  }

  function setValue(id: string, val: string | number | boolean) {
    setAnswers((prev) => ({ ...prev, [id]: val }));
    if (errors[id]) setErrors((prev) => { const n = { ...prev }; delete n[id]; return n; });
  }

  // Progress
  const filled = useMemo(() => {
    return questions.filter((q) => {
      const v = answers[q.id];
      if (v === undefined || v === "" || v === false) return false;
      return true;
    }).length;
  }, [answers, questions]);
  const pct = Math.round((filled / questions.length) * 100);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    for (const q of questions) {
      if (!q.required) continue;
      const v = answers[q.id];
      if (v === undefined || v === "" || v === false || v === 0) {
        errs[q.id] = "Required";
      }
      if (q.type === "email" && v && typeof v === "string" && !v.includes("@")) {
        errs[q.id] = "Invalid email";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!intakeOpen) return;
    if (!validate()) {
      const firstErr = Object.keys(errors)[0] || questions.find((q) => q.required && !answers[q.id])?.id;
      if (firstErr) {
        document.getElementById(`field-${firstErr}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setSubmitting(true);
    try {
      const name = (answers["name"] as string) || "";
      const email = (answers["email"] as string) || "";
      const data: Record<string, string | number | boolean> = {};
      for (const q of questions) {
        if (q.id !== "name" && q.id !== "email") {
          data[q.label] = answers[q.id] ?? "";
        }
      }

      const { submitPublicForm } = await import("@/lib/api/v1/forms");
      await submitPublicForm(t, { name, email, data: data as Record<string, any> });

      // Clear draft on successful submit
      try { localStorage.removeItem(localStorageKey(t)); } catch { /* ignore */ }
      setSubmitted(true);
    } catch {
      const name = (answers["name"] as string) || "Unknown";
      const subject = encodeURIComponent(`[${t.toUpperCase()} SUBMISSION] ${name}`);
      const bodyLines = questions.map((q) => `${q.label}: ${answers[q.id] ?? "(empty)"}`).join("\n\n");
      const body = encodeURIComponent(bodyLines);
      window.location.href = `mailto:contact@ravokstudios.com?subject=${subject}&body=${body}`;
    } finally {
      setSubmitting(false);
    }
  }

  function renderField(q: FormQuestion) {
    const val = answers[q.id];
    const hasError = !!errors[q.id];
    const baseInput = `w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder:text-ravok-slate/50 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-ravok-gold/50 focus:border-ravok-gold/50 transition-colors ${
      hasError ? "border-red-500/50" : "border-white/10"
    }`;

    switch (q.type) {
      case "text":
      case "url":
      case "email":
        return (
          <input
            type={q.type === "url" ? "url" : q.type === "email" ? "email" : "text"}
            value={(val as string) || ""}
            onChange={(e) => setValue(q.id, e.target.value)}
            placeholder={q.placeholder}
            className={baseInput}
          />
        );

      case "textarea":
        return (
          <textarea
            rows={3}
            value={(val as string) || ""}
            onChange={(e) => setValue(q.id, e.target.value)}
            placeholder={q.placeholder}
            className={`${baseInput} resize-none`}
          />
        );

      case "select":
        return (
          <select
            value={(val as string) || ""}
            onChange={(e) => setValue(q.id, e.target.value)}
            className={`${baseInput} bg-black/30`}
          >
            <option value="" className="bg-black">Select an option</option>
            {q.options?.map((opt) => (
              <option key={opt} value={opt} className="bg-black">{opt}</option>
            ))}
          </select>
        );

      case "rating5":
        return (
          <RatingScale
            max={5}
            value={(val as number) || 0}
            onChange={(v) => setValue(q.id, v)}
            lowLabel={q.lowLabel}
            highLabel={q.highLabel}
          />
        );

      case "rating10":
        return (
          <RatingScale
            max={10}
            value={(val as number) || 0}
            onChange={(v) => setValue(q.id, v)}
            lowLabel={q.lowLabel}
            highLabel={q.highLabel}
          />
        );

      case "yesno":
        return (
          <div className="flex gap-4">
            {["Yes", "No"].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setValue(q.id, opt)}
                className={`px-6 py-2 rounded-lg border font-sans text-sm transition-all ${
                  val === opt
                    ? "bg-ravok-gold border-ravok-gold text-black font-medium"
                    : "border-white/20 text-white/60 hover:border-ravok-gold/50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-4">
            <div className="max-h-64 overflow-y-auto rounded-lg border border-white/10 bg-white/[0.03] p-6 font-sans text-xs text-white/70 leading-relaxed space-y-4 scrollbar-thin">
              <p className="font-bold text-white text-sm uppercase tracking-wider">Script Submission Terms and Conditions</p>
              <p className="text-[10px] text-ravok-slate">Last Updated April 1, 2026</p>
              <p>PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE SUBMITTING ANY MATERIAL. BY SUBMITTING A SCRIPT, TREATMENT, SYNOPSIS, OR ANY RELATED MATERIAL (COLLECTIVELY, &ldquo;SUBMISSION&rdquo;) THROUGH THIS WEBSITE, YOU (&ldquo;SUBMITTER&rdquo;) ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS.</p>
              <p className="font-bold text-white/90">1. ELIGIBILITY</p>
              <p>The Submitter must be at least 18 years of age and legally authorized to enter into a binding agreement.</p>
              <p className="font-bold text-white/90">2. UNSOLICITED MATERIAL ACKNOWLEDGMENT</p>
              <p>The Submitter acknowledges that Ravok Studios receives numerous script submissions and that ideas, themes, story elements, and concepts contained within the Submission may be similar to material already under development, previously received from other sources, or independently created by Ravok Studios or its affiliates. No confidential or fiduciary relationship is established.</p>
              <p className="font-bold text-white/90">3. OWNERSHIP AND ORIGINALITY</p>
              <p>The Submitter represents and warrants that: (a) The Submission is original work or all necessary rights have been obtained; (b) The Submission does not infringe upon any intellectual property rights; (c) No prior agreement conflicts with the rights granted herein; (d) If based on pre-existing work, all necessary rights to underlying material have been obtained.</p>
              <p className="font-bold text-white/90">4. LIMITED LICENSE TO REVIEW</p>
              <p>By submitting material, the Submitter grants Ravok Studios a non-exclusive, royalty-free, worldwide license to read, evaluate, analyze (including through automated or AI-assisted means), and internally discuss the Submission.</p>
              <p className="font-bold text-white/90">5. NO OBLIGATION</p>
              <p>Ravok Studios is under no obligation to review, respond to, develop, produce, return, or enter into any agreement regarding any Submission.</p>
              <p className="font-bold text-white/90">6. COMPENSATION</p>
              <p>No compensation is owed for the act of submitting or for review thereof. Any compensation for development or production shall be subject to a separate written agreement.</p>
              <p className="font-bold text-white/90">7. DATA COLLECTION AND USE</p>
              <p>Ravok Studios may collect personal information and process Submissions using proprietary AI-powered analytical frameworks for script analysis, market assessment, audience evaluation, and concept validation. Anonymized, aggregated insights may be derived. The Submitter waives any right to additional compensation in connection with these uses.</p>
              <p className="font-bold text-white/90">8. INDEMNIFICATION</p>
              <p>The Submitter agrees to indemnify and hold harmless Ravok Studios from any claims arising from breach of representations or third-party IP disputes.</p>
              <p className="font-bold text-white/90">9. LIMITATION OF LIABILITY</p>
              <p>Ravok Studios shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from these Terms or any Submission.</p>
              <p className="font-bold text-white/90">10. NO WAIVER OF RIGHTS</p>
              <p>The Submitter retains ownership of the Submission. Nothing herein constitutes an assignment of copyright, except as expressly stated.</p>
              <p className="font-bold text-white/90">11-14. ADDITIONAL PROVISIONS</p>
              <p>Ravok Studios may modify these Terms at any time. Governed by California law (corporate matters by Delaware law). Exclusive jurisdiction in Los Angeles County courts. If any provision is invalid, remaining provisions continue. These Terms constitute the entire agreement.</p>
            </div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={!!val}
                onChange={(e) => setValue(q.id, e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-white/20 bg-white/5 accent-ravok-gold shrink-0"
              />
              <span className="font-sans text-sm text-white/80 group-hover:text-white transition-colors">
                I have read and agree to the Script Submission Terms and Conditions, including the use of my submission data for AI-assisted analysis as described in Section 7.
              </span>
            </label>
            {!val && errors[q.id] && (
              <p className="font-sans text-xs text-red-400">You must agree to the Terms and Conditions to submit.</p>
            )}
          </div>
        );

      default:
        return null;
    }
  }

  // ── Submitted state ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <main className="min-h-screen bg-black text-white selection:bg-ravok-gold selection:text-black">
        <Navbar />
        <div className="container mx-auto max-w-2xl px-6 pt-32 pb-24 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <CheckCircle className="w-16 h-16 text-ravok-gold mx-auto mb-6" />
            <h1 className="font-heading text-4xl text-white mb-4">Submission Received</h1>
            <p className="font-sans text-ravok-slate mb-8">
              Thank you for your {t} submission. Our team will review it and get back to you.
            </p>
            <Link
              href="/pitch-us"
              className="inline-block bg-ravok-gold text-black px-8 py-3 rounded-full font-sans font-bold text-sm tracking-widest uppercase hover:bg-ravok-beige transition-colors"
            >
              Back to Pitch Us
            </Link>
          </motion.div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-ravok-gold selection:text-black">
      <Navbar />

      <div className="container mx-auto max-w-3xl px-6 pt-32 pb-24">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link
            href="/pitch-us"
            className="inline-flex items-center gap-1.5 font-sans text-sm text-ravok-slate hover:text-ravok-gold transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Pitch Us
          </Link>

          <h1 className="text-4xl sm:text-5xl font-heading text-ravok-gold leading-tight mb-2">
            {titleForType(t)}
          </h1>
          <p className="font-sans text-sm text-ravok-slate mb-1">
            Fields marked with <span className="text-ravok-gold">*</span> are required.
          </p>
          <div className="mt-4 h-0.5 w-16 bg-ravok-gold mb-8" />
        </motion.div>

        {/* ── Intake Closed Banner ─────────────────────────────────────────── */}
        {!intakeOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 rounded-2xl border border-ravok-gold/30 bg-ravok-gold/5 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <div className="shrink-0 w-12 h-12 rounded-full bg-ravok-gold/10 border border-ravok-gold/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-ravok-gold" />
            </div>
            <div>
              <p className="font-heading text-lg text-white mb-0.5">Intake is currently closed</p>
              <p className="font-sans text-sm text-ravok-slate">
                The next submission window opens <span className="text-ravok-gold font-medium">May 12, 2026</span> and closes <span className="text-ravok-gold font-medium">June 12, 2026</span>.
                You can preview and fill out the form now — your draft is saved automatically.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Draft restored / save nudge ─────────────────────────────────── */}
        {hasDraft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <div className="flex items-center gap-2 font-sans text-sm text-ravok-slate">
              <Save className="w-4 h-4 text-ravok-gold shrink-0" />
              Draft restored from your last visit.
            </div>
            <button
              onClick={clearDraft}
              className="flex items-center gap-1.5 font-sans text-xs text-white/40 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear draft
            </button>
          </motion.div>
        )}

        {/* Progress bar */}
        <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-xl py-3 mb-6 -mx-6 px-6 border-b border-white/5">
          <div className="flex items-center justify-between font-sans text-xs text-ravok-slate mb-2">
            <span>{filled}/{questions.length} completed</span>
            <span className="flex items-center gap-2">
              <AnimatePresence>
                {draftSaved && (
                  <motion.span
                    key="saved"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1 text-ravok-gold/70"
                  >
                    <Save className="w-3 h-3" />
                    Draft saved
                  </motion.span>
                )}
              </AnimatePresence>
              {pct}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-ravok-gold rounded-full"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {questions.map((q, i) => (
            <motion.div
              key={q.id}
              id={`field-${q.id}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.3) }}
            >
              {q.type !== "checkbox" && (
                <label className="block font-sans text-sm font-medium text-white mb-2">
                  <span className="text-ravok-slate font-normal mr-2">{i + 1}.</span>
                  {q.label}
                  {q.required && <span className="text-ravok-gold ml-1">*</span>}
                  {!q.required && q.helperText && (
                    <span className="text-ravok-slate/60 font-normal ml-2 text-xs">({q.helperText})</span>
                  )}
                </label>
              )}
              {q.helperText && q.type !== "checkbox" && q.required && (
                <p className="font-sans text-xs text-ravok-slate/60 mb-2">{q.helperText}</p>
              )}
              {renderField(q)}
              {errors[q.id] && (
                <p className="font-sans text-xs text-red-400 mt-1">{errors[q.id]}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* ── Submit / Intake Closed CTA ───────────────────────────────────── */}
        <div className="mt-12 pt-8 border-t border-white/10">
          {intakeOpen ? (
            <>
              {!answers["agreement"] && (
                <p className="font-sans text-sm text-ravok-slate text-center mb-4">
                  You must agree to the Terms and Conditions to submit.
                </p>
              )}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !answers["agreement"]}
                className="w-full bg-ravok-gold text-black px-8 py-4 rounded-full font-sans font-bold text-sm tracking-widest uppercase hover:bg-ravok-beige transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
              <p className="font-sans text-xs text-ravok-slate/60 text-center mt-4">
                By submitting, your information will be reviewed by the RAVOK development team. We typically respond within 2–4 weeks.
              </p>
            </>
          ) : (
            /* Intake is closed — show gate + account CTA */
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Disabled submit */}
              <div className="w-full bg-white/5 border border-white/10 text-white/30 px-8 py-4 rounded-full font-sans font-bold text-sm tracking-widest uppercase text-center cursor-not-allowed select-none">
                Intake opens May 12, 2026
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="font-sans text-xs text-white/30 uppercase tracking-widest">In the meantime</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Account save nudge */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center space-y-3">
                <p className="font-heading text-lg text-white">Save your progress to your account</p>
                <p className="font-sans text-sm text-ravok-slate">
                  Create a free RAVOK account so your draft is safely stored and ready to submit when the window opens on May 12.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Link
                    href="/register"
                    className="inline-block bg-ravok-gold text-black px-6 py-3 rounded-full font-sans font-bold text-sm tracking-widest uppercase hover:bg-ravok-beige transition-colors"
                  >
                    Create account
                  </Link>
                  <Link
                    href="/login"
                    className="inline-block border border-white/20 text-white px-6 py-3 rounded-full font-sans text-sm tracking-widest uppercase hover:border-ravok-gold hover:text-ravok-gold transition-colors"
                  >
                    Sign in
                  </Link>
                </div>
              </div>

              <p className="font-sans text-xs text-ravok-slate/50 text-center">
                Your draft is also saved locally in your browser automatically.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
