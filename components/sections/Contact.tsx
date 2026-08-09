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
    <section id="contact" className="relative z-10 px-6 py-28 md:px-12">
      <div className="mx-auto grid max-w-5xl items-start gap-12 md:grid-cols-2">
        <RevealOnScroll>
          <div className="section-eyebrow mb-3">07 — CONTACT</div>
          <h2 className="mb-6 font-display text-4xl font-semibold md:text-5xl">
            Let&apos;s build something reliable.
          </h2>
          <p className="mb-8 max-w-md leading-relaxed text-muted">
            Open to backend, automation, and API-focused roles — and always happy to talk about
            early-stage AI engineering work.
          </p>
          <div className="flex flex-col gap-4 text-sm">
            <a href={emailUrl} data-hover className="flex items-center gap-3 transition-colors hover:text-accent-2">
              <span className="glass flex h-9 w-9 items-center justify-center rounded-full"><FiMail /></span>
              {emailText}
            </a>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" data-hover className="flex items-center gap-3 transition-colors hover:text-accent-2">
              <span className="glass flex h-9 w-9 items-center justify-center rounded-full"><FiGithub /></span>
              {githubText}
            </a>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" data-hover className="flex items-center gap-3 transition-colors hover:text-accent-2">
              <span className="glass flex h-9 w-9 items-center justify-center rounded-full"><FiLinkedin /></span>
              {linkedinText}
            </a>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <Card as="form" onSubmit={onSubmit} className="space-y-5 p-8" noValidate>
            <div>
              <label htmlFor="cf-name" className="font-mono text-xs uppercase tracking-wider text-muted">Name</label>
              <input
                id="cf-name"
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm transition-colors focus:border-accent-2"
                placeholder="Your name"
                style={errors.name ? { borderColor: "#f87171" } : undefined}
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">Please enter your name.</p>}
            </div>
            <div>
              <label htmlFor="cf-email" className="font-mono text-xs uppercase tracking-wider text-muted">Email</label>
              <input
                id="cf-email"
                type="email"
                value={values.email}
                onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm transition-colors focus:border-accent-2"
                placeholder="you@company.com"
                style={errors.email ? { borderColor: "#f87171" } : undefined}
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">Please enter a valid email.</p>}
            </div>
            <div>
              <label htmlFor="cf-msg" className="font-mono text-xs uppercase tracking-wider text-muted">Message</label>
              <textarea
                id="cf-msg"
                rows={4}
                value={values.message}
                onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm transition-colors focus:border-accent-2"
                placeholder="Tell me about the role or project…"
                style={errors.message ? { borderColor: "#f87171" } : undefined}
              />
              {errors.message && <p className="mt-1 text-xs text-red-400">Please enter a message.</p>}
            </div>
            <MagneticButton className="w-full">
              <button type="submit" disabled={submitting} data-hover className="w-full rounded-full bg-accent px-6 py-3.5 text-sm font-medium transition-colors hover:bg-accent-2 disabled:opacity-50">
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </MagneticButton>
            {success && (
              <p className="text-sm text-emerald-400">
                Thanks — message captured in database.
              </p>
            )}
            {submitError && (
              <p className="text-sm text-red-400">
                {submitError}
              </p>
            )}
          </Card>
        </RevealOnScroll>
      </div>
    </section>
  );
}

