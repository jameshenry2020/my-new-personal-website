import React from "react";

export const metadata = {
  title: "About",
  description: "Biography, career journey, and core systems architecture philosophy of Henry A.",
};

const SKILLS = [
  { category: "Languages", items: ["Java", "Python", "Node.js (TypeScript)", "Go", "SQL", "HTML/CSS"] },
  { category: "Core Backend", items: ["NestJS", "Spring Boot", "Django", "gRPC", "REST APIs", "GraphQL", "Microservices"] },
  { category: "Databases & Cache", items: ["PostgreSQL", "Prisma ORM", "Redis", "Elasticsearch", "Neo4j", "Cassandra"] },
  { category: "Event Streaming", items: ["Kafka", "BullMQ", "RabbitMQ", "Event-Driven Architecture"] },
  { category: "Infrastructure", items: ["Docker", "Docker Compose", "Kubernetes", "AWS (S3, EC2, ECS)", "DigitalOcean", "Linux Systems"] },
  { category: "Frontend Integration", items: ["Next.js (App Router)", "React", "React Native", "Tailwind CSS", "Zustand", "React Query"] },
];

const TIMELINE = [
  {
    year: "Jan 2025 — April 2026",
    role: "Lead Software Engineer",
    company: "ABX (AfrobasketXpress)",
    desc: "Architected a multi-vendor e-commerce ecosystem from scratch. Engineered real-time delivery tracking using Django Channels and MQTT, automated vendor payouts with robust fund reconciliation, and optimized throughput using Celery + Redis.",
  },
  {
    year: "Jan 2024 — Dec 2024",
    role: "Lead Backend Engineer",
    company: "XstakUp",
    desc: "Directed the backend architecture for a multi-tenant SaaS platform with robust access control and data isolation. Established automated unit/integration test suites (reducing defects by 30%), optimized query performance, and mentored junior engineers.",
  },
  {
    year: "Jan 2023 — Dec 2023",
    role: "Software Developer",
    company: "DailyPayAfrica (Fintech)",
    desc: "Developed core MVP REST APIs enabling secure financial transactions and real-time balance updates. Accelerated release cycles by 40% through modular service design and automated CI/CD pipelines.",
  },
  {
    year: "Jan 2022 — Jun 2024",
    role: "Backend Developer Instructor",
    company: "Univelcity",
    desc: "Designed and executed a comprehensive backend curriculum, successfully training 500+ aspiring engineers in Python and Node.js. Standardized DevOps training with Docker workflows and GitHub Actions.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-20 md:space-y-28">
      {/* 1. Header Block */}
      <section className="border-b border-border-paper pb-12">
        <span className="meta-mono">Curriculum Vitae</span>
        <h1 className="font-serif text-4xl md:text-5xl font-extrabold tracking-tight text-fg-ink mt-2">
          Biography & Philosophy
        </h1>
      </section>

      {/* 2. Asymmetric Content Grid */}
      <section className="editorial-grid">
        {/* Left Side: Skills & Details Panel */}
        <div className="space-y-12">
          {/* Core Parameters */}
          <div className="space-y-4">
            <span className="meta-mono border-b border-border-paper pb-1.5 block">Core Parameters</span>
            <div className="text-xs font-mono space-y-2 text-muted-paper">
              <div className="flex justify-between">
                <span>Years of Practice:</span>
                <span className="text-fg-ink">6+ Years</span>
              </div>
              <div className="flex justify-between">
                <span>Specialization:</span>
                <span className="text-fg-ink">Distributed Systems</span>
              </div>
              <div className="flex justify-between">
                <span>Core Ecosystems:</span>
                <span className="text-fg-ink">JVM, Node, Python, Go</span>
              </div>
            </div>
          </div>

          {/* Skill Inventory */}
          <div className="space-y-6">
            <span className="meta-mono border-b border-border-paper pb-1.5 block">Technical Inventory</span>
            <div className="space-y-6">
              {SKILLS.map((skillGroup) => (
                <div key={skillGroup.category} className="space-y-1.5">
                  <h3 className="font-mono text-[10px] text-copper uppercase tracking-wider">
                    {skillGroup.category}
                  </h3>
                  <p className="text-xs text-muted-paper leading-relaxed">
                    {skillGroup.items.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Narrative */}
        <div className="space-y-16">
          {/* Narrative Biography */}
          <div className="space-y-6 max-w-3xl">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold italic text-fg-ink">
              The Journey
            </h2>
            <p className="text-sm text-muted-paper leading-relaxed font-sans">
              I&apos;m Henry, a Software Engineer with 6+ years of experience building high-concurrency, production-grade systems across Fintech, E-commerce, and SaaS. I specialize in Java, Python, and Node.js, with a strong focus on distributed systems, event-driven architectures, and scalable multi-tenant platforms.
            </p>
            <p className="text-sm text-muted-paper leading-relaxed font-sans">
              Over the course of my career, I have dedicated myself to the craft of backend architecture. I believe that engineering longevity is achieved by choosing simplicity over trendiness, maintaining strong type systems, and validating assumptions with real-world profiling.
            </p>
            <blockquote className="font-serif text-lg italic border-l-2 border-copper pl-6 py-2 my-8 text-muted-paper">
              &quot;Simple systems are easier to reason about, safer to refactor, and cheaper to maintain. Complexity is a debt that must be paid back with compounding interest.&quot;
            </blockquote>
          </div>

          {/* Engineering Philosophy */}
          <div className="space-y-6 max-w-3xl">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold italic text-fg-ink">
              System Architecture Philosophy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans leading-relaxed text-muted-paper">
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-copper uppercase block">01. Data Integrity First</span>
                <p>
                  No feature is worth database corruption or silent failure. Proper table constraints, foreign key relationships, and ACID boundary definitions form the bedrock of clean systems.
                </p>
              </div>
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-copper uppercase block">02. Observability over Magic</span>
                <p>
                  A system in production is only as good as its logs and metrics. I prefer explicit error propagation, descriptive telemetry logs, and microservice tracing over automated framework magic.
                </p>
              </div>
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-copper uppercase block">03. Type Safety at Boundaries</span>
                <p>
                  Every system boundary (API requests, database fetches, event payloads) should be statically typed and verified at runtime. Utilizing Zod and TypeScript prevents invalid payloads from corrupting state.
                </p>
              </div>
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-copper uppercase block">04. Pragmatic Orchestration</span>
                <p>
                  I choose the right tool for the job. While Kubernetes and global Kafka clusters are powerful, simple Docker Compose configs or serverless pipelines are often more suitable and maintainable for medium-scale operations.
                </p>
              </div>
            </div>
          </div>

          {/* Career Experience Timeline */}
          <div className="space-y-8">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold italic text-fg-ink">
              Chronology
            </h2>
            <div className="divide-y divide-border-paper border-t border-b border-border-paper">
              {TIMELINE.map((exp, idx) => (
                <div key={idx} className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
                  {/* Period */}
                  <span className="font-mono text-xs text-muted-paper md:col-span-3">{exp.year}</span>
                  {/* Role Details */}
                  <div className="md:col-span-9 space-y-2">
                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                      <h3 className="font-serif text-lg font-bold text-fg-ink">{exp.role}</h3>
                      <span className="font-mono text-xs text-copper">{exp.company}</span>
                    </div>
                    <p className="text-xs text-muted-paper leading-relaxed font-sans">{exp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
