"use client";

import { submitPublicForm, FormType } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { useMemo, useState } from "react";

const writerQuestions = [
  "What is the title of your project?",
  "Can you share the logline in 30 words or less?",
  "How many pages is your script?",
  "What genre does your script belong to?",
  "Can you list three films with similar concepts?",
  "What inspired you to start this script and how long have you been working on it?",
  "Exactly how many versions has this script been through?",
  "What is the most controversial or 'risky' element of your script?",
  "Narrative arc: How strong is this aspect of your script?",
  "Character development: How strong is this aspect of your script?",
  "Story structure: How strong is this aspect of your script?",
  "What do you feel your script needs to improve?",
  "Has this project received professional coverage or script doctoring? Please provide details.",
  "Do you personally own the IP, or is it optioned?",
  "Who do you see as your primary target audience?",
  "Why does your audience need to see this story in the next 18 months?",
  "Please share a link with a 3-Act Structure One Pager.",
  "Please share a link to the Pitch Deck.",
  "Please share your IMDB link/Linkedin/social media handles",
  "What kind of directors do you like and what's the vision you hope the person that comes in would bring to the project? tell us at least 3 directors",
  "I have read and agree to the Ravok Submission release agreement",
];

const directorQuestions = [
  "Primary Portfolio / Director’s Reel",
  "Professional Links",
  "The Superpower",
  "Budget Experience",
  "Technical Fluency",
  "Project Interest",
  "If project-specific",
  "The Dangerous Factor",
  "The Benchmark",
  "Narrative Integrity",
  "Collaborative Style",
  "Department Heads",
  "Crisis Management",
  "References",
  "Attached Talent",
  "Ideal Outcome",
  "Link to Materials",
  "Agreement",
];

const producerQuestions = [
  "Working title of the IP",
  "Logline in 30 words or less",
  "Why does the audience need to see this in the next 18 months",
  "Who is the audience, and how large is that demographic",
  "List 3 films with similar budgets/tones and their ROI data",
  "What made you interested in this particular project",
  "Is there an LLC or SPV already formed for this production",
  "Is the IP fully secured",
  "Has the script undergone professional coverage or legal vetting",
  "List any existing investors and their equity percentages",
  "Who is currently handling the bookkeeping/accounting for development spend",
  "What specific administrative or strategic resource do you lack",
  "Primary strength in production",
  "Greatest weakness in the production cycle",
  "Do you specialize in Raising Capital, Managing Capital, or Scaling Operations",
  "Discipline with paperwork, payroll, and reporting",
  "Describe a time you saved a project from total collapse",
  "Highest budget personally managed from start to finish",
  "Profitable exit details",
  "Most significant production failure and lesson",
  "List 3 strategic relationships",
  "One industry reference who can vouch for Business Integrity",
  "Floor and Ceiling budget numbers",
  "Secured hard or soft money",
  "Capital or equity you are seeking to raise",
  "Link to the Pitch Deck, Budget Top-sheet, and Production Timeline",
  "Why are you the producer who can execute this",
];

function titleForType(type: FormType) {
  if (type === "writer") return "WRITER";
  if (type === "director") return "DIRECTOR";
  return "PRODUCER";
}

function questionsForType(type: FormType) {
  if (type === "writer") return writerQuestions;
  if (type === "director") return directorQuestions;
  return producerQuestions;
}

export default function FormPage() {
  const params = useParams();
  const router = useRouter();
  const rawType = (params?.type as string | undefined)?.toLowerCase();
  const t = (rawType === "writer" || rawType === "director" || rawType === "producer" ? rawType : "writer") as FormType;
  const questions = useMemo(() => questionsForType(t), [t]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState<string[]>(() => questions.map(() => ""));
  const total = questions.length + 2;
  const completed = useMemo(() => {
    let c = 0;
    if (name.trim()) c++;
    if (email.trim()) c++;
    c += answers.filter((v) => v.trim().length > 0).length;
    return c;
  }, [name, email, answers]);
  const pct = Math.round((completed / total) * 100);
  function updateAnswer(i: number, v: string) {
    setAnswers((arr) => {
      const next = arr.slice();
      next[i] = v;
      return next;
    });
  }
  function renderField(q: string, i: number) {
    if (t === "director" && q === "The Superpower") {
      return (
        <select
          id={`q_${i}`}
          value={answers[i] || ""}
          onChange={(e) => updateAnswer(i, e.target.value)}
          className="mt-1 w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 font-sans text-sm text-white"
        >
          <option value="">Select an option</option>
          <option value="Visual World-Building">Visual World-Building</option>
          <option value="Actor Performance">Actor Performance</option>
          <option value="Technical Innovation/VFX">Technical Innovation/VFX</option>
        </select>
      );
    }
    if (t === "director" && q === "Link to Materials") {
      const val = answers[i] || "";
      const parts = val.split("::");
      const sel = parts[0] || "";
      const url = parts[1] || "";
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <select
              id={`q_${i}_type`}
              value={sel}
              onChange={(e) => updateAnswer(i, `${e.target.value}::${url}`)}
              className="mt-1 w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 font-sans text-sm text-white"
            >
              <option value="">Select type</option>
              <option value="Pitch Deck">Pitch Deck</option>
              <option value="Director Lookbook">Director Lookbook</option>
              <option value="Visual Treatment">Visual Treatment</option>
            </select>
          </div>
          <div>
            <Input
              id={`q_${i}_url`}
              placeholder="Add link"
              value={url}
              onChange={(e) => updateAnswer(i, `${sel}::${e.target.value}`)}
            />
          </div>
        </div>
      );
    }
    if (t === "director" && q === "Agreement") {
      const checked = (answers[i] || "") === "Agreed";
      return (
        <div className="flex items-center gap-2">
          <input
            id={`q_${i}`}
            type="checkbox"
            checked={checked}
            onChange={(e) => updateAnswer(i, e.target.checked ? "Agreed" : "")}
            className="h-4 w-4 accent-ravok-gold"
          />
          <span className="font-sans text-sm text-white/80">I agree</span>
        </div>
      );
    }
    if (t === "producer" && q === "Primary strength in production") {
      return (
        <select
          id={`q_${i}`}
          value={answers[i] || ""}
          onChange={(e) => updateAnswer(i, e.target.value)}
          className="mt-1 w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 font-sans text-sm text-white"
        >
          <option value="">Select an option</option>
          <option value="Financial Engineering">Financial Engineering</option>
          <option value="Creative Packaging">Creative Packaging</option>
          <option value="On-Set Execution">On-Set Execution</option>
        </select>
      );
    }
    if (t === "producer" && q === "Do you specialize in Raising Capital, Managing Capital, or Scaling Operations") {
      return (
        <select
          id={`q_${i}`}
          value={answers[i] || ""}
          onChange={(e) => updateAnswer(i, e.target.value)}
          className="mt-1 w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 font-sans text-sm text-white"
        >
          <option value="">Select an option</option>
          <option value="Raising Capital">Raising Capital</option>
          <option value="Managing Capital">Managing Capital</option>
          <option value="Scaling Operations">Scaling Operations</option>
        </select>
      );
    }
    return (
      <Textarea
        id={`q_${i}`}
        rows={3}
        value={answers[i] || ""}
        onChange={(e) => updateAnswer(i, e.target.value)}
      />
    );
  }
  async function submit() {
    const nm = name.trim();
    const em = email.trim();
    if (!nm || !em) {
      toast.error("Name and email are required");
      return;
    }
    const data: Record<string, any> = {};
    questions.forEach((q, i) => (data[q] = answers[i] || ""));
    try {
      await submitPublicForm(t, { name: nm, email: em, data });
      setName("");
      setEmail("");
      setAnswers(questions.map(() => ""));
      toast.success("Submitted");
      router.push("/form");
    } catch (e: any) {
      toast.error(e.message || "Submission failed");
    }
  }
  return (
    <main className="min-h-screen bg-black text-white selection:bg-ravok-gold selection:text-black">
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl font-heading font-thin text-ravok-gold leading-tight">
              {titleForType(t)} Form
            </h1>
            <p className="mt-2 font-sans text-sm text-ravok-slate">
              Name and email are required. All other fields are optional.
            </p>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-sans text-ravok-slate mb-2">
              <span>
                {completed}/{total} completed
              </span>
              <span>{pct}%</span>
            </div>
            <div className="h-2 w-full rounded bg-white/10 overflow-hidden">
              <div
                className="h-full bg-ravok-gold"
                style={{ width: `${pct}%` }}
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/40 shadow-lg p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-5">
              {questions.map((q, i) => (
                <div key={i} className="space-y-2">
                  <Label htmlFor={`q_${i}`}>{q}</Label>
                  {renderField(q, i)}
                </div>
              ))}
            </div>
            <div>
              <Button onClick={submit} className="bg-ravok-gold text-black hover:brightness-95">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
