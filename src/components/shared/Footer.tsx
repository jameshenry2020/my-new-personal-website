import React from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border-paper bg-bg-paper mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Logo & Copyright */}
          <div className="space-y-2">
            <span className="font-serif font-bold text-fg-ink">Henry A.</span>
            <p className="text-xs text-muted-paper max-w-xs font-sans leading-relaxed">
              Principal Systems Architect & Software Engineer. Building production-grade distributed systems and technical trainer.
            </p>
            <p className="text-[11px] font-mono text-muted-paper">
              © {currentYear} Henry A. All rights reserved.
            </p>
          </div>

          {/* Philosophy / Colophon */}
          <div className="space-y-2 border-t md:border-t-0 md:border-l border-border-paper pt-6 md:pt-0 md:pl-8">
            <span className="meta-mono block">Colophon</span>
            <p className="text-xs text-muted-paper leading-relaxed font-sans">
              This site is typography-first and set in Lora & Inter. Built with Next.js, Tailwind CSS, and Prisma. Hosted on Vercel.
            </p>
          </div>

          {/* Social Links */}
          <div className="space-y-2 border-t md:border-t-0 md:border-l border-border-paper pt-6 md:pt-0 md:pl-8">
            <span className="meta-mono block">Network</span>
            <div className="grid grid-cols-2 gap-2 text-xs font-sans">
              <a
                href="https://github.com/jameshenry2020"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-paper hover:text-copper transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/agbonlahorhenry/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-paper hover:text-copper transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://x.com/HeryDevAgb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-paper hover:text-copper transition-colors"
              >
                X / Twitter
              </a>
              <a
                href="https://www.youtube.com/@henrydev01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-paper hover:text-copper transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Status / Extra Detail */}
        <div className="border-t border-border-paper mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-muted-paper uppercase tracking-wider">
              Available for software development, Mobile apps, Web apps, AI Agents & training
            </span>
          </div>
          <div className="text-[10px] font-mono text-muted-paper uppercase tracking-wider">
            Latency: Optimistic • Architecture: Edge-First
          </div>
        </div>
      </div>
    </footer>
  );
}
