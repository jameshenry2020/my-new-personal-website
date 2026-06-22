import React from "react";
import { ContactForm } from "@/components/shared/ContactForm";
import { Mail, Github, Linkedin, Twitter, Youtube, Key } from "lucide-react";

export const metadata = {
  title: "Contact & Coordinates",
  description: "Initiate contact with Henry A. for consulting, speaking, or software architecture review inquiries.",
};

const SOCIAL_CHANNELS = [
  { icon: Github, label: "GitHub", href: "https://github.com", desc: "Open source repositories & ledgers" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com", desc: "Professional network chronology" },
  { icon: Twitter, label: "X / Twitter", href: "https://twitter.com", desc: "Short-form software architecture thoughts" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com", desc: "Technical system design lecture series" },
];

export default function ContactPage() {
  return (
    <div className="space-y-16">
      {/* 1. Header Block */}
      <section className="border-b border-border-paper pb-8 space-y-4">
        <div>
          <span className="meta-mono">Communications Terminal</span>
          <h1 className="font-serif text-4xl md:text-5xl font-extrabold tracking-tight text-fg-ink mt-2">
            Get In Touch
          </h1>
        </div>
        <p className="text-xs text-muted-paper max-w-xl font-sans leading-relaxed">
          Submit encrypted signals directly to my terminal dashboard or resolve social coordinates below. Response times are generally within 48 operational hours.
        </p>
      </section>

      {/* 2. Editorial Layout Grid */}
      <section className="editorial-grid">
        {/* Left Side: Coordinates & Cryptography (Smaller column) */}
        <div className="space-y-12">
          {/* Email Coordinate */}
          <div className="space-y-4">
            <span className="meta-mono border-b border-border-paper pb-1.5 block">Direct Coordinate</span>
            <a
              href="mailto:contact@henrydev.online"
              className="group flex items-center gap-3 text-xs font-mono hover:text-copper transition-colors"
            >
              <Mail size={14} className="text-muted-paper group-hover:text-copper" />
              <span>contact@henrydev.online</span>
            </a>
          </div>

          {/* Social Channels */}
          <div className="space-y-6">
            <span className="meta-mono border-b border-border-paper pb-1.5 block">Social Coordinates</span>
            <div className="space-y-6">
              {SOCIAL_CHANNELS.map((channel) => {
                const Icon = channel.icon;
                return (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block space-y-1 text-xs"
                  >
                    <div className="flex items-center gap-2 font-mono group-hover:text-copper transition-colors text-fg-ink">
                      <Icon size={14} className="text-muted-paper group-hover:text-copper" />
                      <span>{channel.label}</span>
                    </div>
                    <p className="text-[11px] text-muted-paper leading-normal pl-5">
                      {channel.desc}
                    </p>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Security & Cryptography */}
          <div className="space-y-4">
            <span className="meta-mono border-b border-border-paper pb-1.5 block">Security (GPG)</span>
            <div className="space-y-2 text-[10px] font-mono text-muted-paper leading-relaxed">
              <div className="flex items-center gap-2">
                <Key size={12} />
                <span className="text-fg-ink">Fingerprint</span>
              </div>
              <p className="bg-card-paper p-3 border border-border-paper break-all">
                8F9A D32B C5E1 F2A0 6C47 8E2D 1B4A 9F5C E620 7B3D
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form (Larger column) */}
        <div className="space-y-8">
          <h2 className="font-serif text-2xl font-semibold italic text-fg-ink">
            Direct Transmission
          </h2>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
