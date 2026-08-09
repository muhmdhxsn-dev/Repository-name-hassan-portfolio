"use client";

import { useState } from "react";
import { FiMail, FiGithub, FiLinkedin } from "react-icons/fi";
import RevealOnScroll from "../RevealOnScroll";
import MagneticButton from "../MagneticButton";
import { Card } from "../ui/card";

type Errors = { name?: boolean; email?: boolean; message?: boolean };

export default function Contact({ socialLinks, hero }: { socialLinks?: any[]; hero?: any }) {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const emailSocial = socialLinks?.find((s) => s.platform === "email");
  const githubSocial = socialLinks?.find((s) => s.platform === "github");
  const linkedinSocial = socialLinks?.find((s) => s.platform === "linkedin");

  const emailUrl = emailSocial?.url || "mailto:hello@muhammadhassan.dev";
  const emailText = emailUrl.replace("mailto:", "");

  const githubUrl = githubSocial?.url || "https://github.com/";
  const githubText = githubUrl.replace("https://", "").replace("www.", "") || "github.com/muhammadhassan";

  const linkedinUrl = linkedinSocial?.url || "https://linkedin.com/";
  const linkedinText = linkedinUrl.replace("https://", "").replace("www.", "") || "linkedin.com/in/muhammadhassan";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Errors = {
      name: values.name.trim().length === 0,
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email),
      message: values.message.trim().length === 0,
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      setSuccess(false);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          message: values.message,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to submit message");
      }

      setSuccess(true);
      setValues({ name: "", email: "", message: "" });
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative z-10 px-6 py-24 md:px-12">
      <div className="rule mb-20" aria-hidden="true" />
      <div className="mx-auto max-w-5xl">
        <div className="grid items-start gap-12 md:grid-cols-2">
        <RevealOnScroll>
          <div className="section-eyebrow mb-4">07 — CONTACT</div>
          <h2 className="section-title mb-6">
            LET&apos;S BUILD<br />
            SOMETHING<br />
            RELIABLE.
          </h2>
          <p className="mb-10 max-w-xs text-sm leading-relaxed text-muted">
            Open to backend, automation, and API-focused roles — and always happy to talk about
            early-stage AI engineering work.
          </p>
          <div className="flex flex-col gap-4">
            <a href={emailUrl} data-hover className="group flex items-center gap-4 transition-colors hover:text-accent">
              <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/[0.08] bg-white/[0.03] transition-colors group-hover:border-accent/30">
                <FiMail size={14} />
              </span>
              <span className="font-mono text-sm text-muted transition-colors group-hover:text-accent">{emailText}</span>
            </a>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" data-hover className="group flex items-center gap-4 transition-colors hover:text-accent">
              <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/[0.08] bg-white/[0.03] transition-colors group-hover:border-accent/30">
                <FiGithub size={14} />
              </span>
              <span className="font-mono text-sm text-muted transition-colors group-hover:text-accent">{githubText}</span>
            </a>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" data-hover className="group flex items-center gap-4 transition-colors hover:text-accent">
              <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/[0.08] bg-white/[0.03] transition-colors group-hover:border-accent/30">
                <FiLinkedin size={14} />
              </span>
              <span className="font-mono text-sm text-muted transition-colors group-hover:text-accent">{linkedinText}</span>
            </a>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <form onSubmit={onSubmit} className="space-y-5 rounded-sm border border-white/[0.06] bg-white/[0.02] p-7" noValidate>
            <div>
              <label htmlFor="cf-name" className="risen-text text-[9px] tracking-[0.2em] text-muted/70">NAME</label>
              <input
                id="cf-name"
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                className="mt-2 w-full rounded-sm border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-muted/40 transition-colors focus:border-accent/50 focus:outline-none"
                placeholder="Your name"
                style={errors.name ? { borderColor: "#f87171" } : undefined}
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">Please enter your name.</p>}
            </div>
            <div>
              <label htmlFor="cf-email" className="risen-text text-[9px] tracking-[0.2em] text-muted/70">EMAIL</label>
              <input
                id="cf-email"
                type="email"
                value={values.email}
                onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                className="mt-2 w-full rounded-sm border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-muted/40 transition-colors focus:border-accent/50 focus:outline-none"
                placeholder="you@company.com"
                style={errors.email ? { borderColor: "#f87171" } : undefined}
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">Please enter a valid email.</p>}
            </div>
            <div>
              <label htmlFor="cf-msg" className="risen-text text-[9px] tracking-[0.2em] text-muted/70">MESSAGE</label>
              <textarea
                id="cf-msg"
                rows={4}
                value={values.message}
                onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                className="mt-2 w-full rounded-sm border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-muted/40 transition-colors focus:border-accent/50 focus:outline-none resize-none"
                placeholder="Tell me about the role or project…"
                style={errors.message ? { borderColor: "#f87171" } : undefined}
              />
              {errors.message && <p className="mt-1 text-xs text-red-400">Please enter a message.</p>}
            </div>
            <MagneticButton className="w-full">
              <button
                type="submit"
                disabled={submitting}
                data-hover
                className="risen-text w-full rounded-sm bg-accent px-6 py-3.5 text-[11px] tracking-[0.2em] text-bg shadow-glow transition-all duration-300 hover:bg-accent-2 disabled:opacity-50 hover:shadow-[0_0_30px_-8px_rgba(79,195,161,0.8)]"
              >
                {submitting ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </MagneticButton>
            {success && (
              <p className="risen-text text-[10px] tracking-[0.15em] text-emerald-400">
                MESSAGE RECEIVED — TALK SOON.
              </p>
            )}
            {submitError && (
              <p className="text-sm text-red-400">
                {submitError}
              </p>
            )}
          </form>
        </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

