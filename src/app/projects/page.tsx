import React from "react";
import Link from "next/link";
import { getProjects } from "@/services/db.service";
import { ProjectFilters } from "@/components/shared/ProjectFilters";
import { Github, ExternalLink } from "lucide-react";

const typeLabels: Record<string, string> = {
  FULL_STACK: "Full Stack",
  BACKEND_ONLY: "Backend Only",
  MOBILE: "Mobile",
};

export const revalidate = 60; // Cache projects list page for 1 minute

interface ProjectsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const category = resolvedParams.category || "";

  // Fetch all projects to build filters and list
  const allProjects = await getProjects().catch(() => []);

  // Extract all unique technologies from seeded/created projects to act as categories
  const categoriesSet = new Set<string>();
  allProjects.forEach((proj) => {
    proj.technologies.forEach((tech) => categoriesSet.add(tech));
  });
  const uniqueTechnologies = Array.from(categoriesSet).sort();

  // Filter projects on the server based on query
  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch =
      !search ||
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      !category ||
      project.technologies.some((tech) => tech.toLowerCase() === category.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-16">
      {/* 1. Header Block */}
      <section className="border-b border-border-paper pb-8 space-y-4">
        <div className="flex justify-between items-baseline">
          <div>
            <span className="meta-mono">System Showcase</span>
            <h1 className="font-serif text-4xl md:text-5xl font-extrabold tracking-tight text-fg-ink mt-2">
              Engineering Projects
            </h1>
          </div>
          <span className="font-mono text-xs text-muted-paper">
            [{filteredProjects.length}] Active Systems
          </span>
        </div>
        <p className="text-xs text-muted-paper max-w-xl font-sans leading-relaxed">
          Explore software architectures, system designs, code repositories, and running deployments. Use search filters below to navigate by technology stack.
        </p>
      </section>

      {/* 2. Interactive Filters */}
      <section className="bg-card-paper p-6 border border-border-paper">
        <ProjectFilters categories={uniqueTechnologies} />
      </section>

      {/* 3. Projects Catalog - Print inspired layout */}
      <section className="space-y-16">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border-paper">
            <p className="font-serif italic text-muted-paper">No systems found matching the specified parameters.</p>
            <Link href="/projects" className="meta-mono text-copper hover:underline mt-2 inline-block">
              Clear All Filters
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border-paper border-b border-border-paper">
            {filteredProjects.map((project, idx) => (
              <div key={project.id} className="py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Index & Stack (Left panel) */}
                <div className="md:col-span-3 space-y-4">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="font-mono text-xs text-copper font-semibold">
                      SYSTEM [{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}]
                    </span>
                    {project.featured && (
                      <span className="font-mono text-[9px] border border-copper text-copper px-1.5 py-0.2">
                        Featured
                      </span>
                    )}
                    <span className="font-mono text-[9px] bg-copper/10 text-copper px-1.5 py-0.2 uppercase border border-copper/20">
                      {typeLabels[(project as any).projectType] || "Full Stack"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[9px] bg-card-paper border border-border-paper px-2 py-0.5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Core Description (Center panel) */}
                <div className="md:col-span-6 space-y-4">
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-fg-ink">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-paper leading-relaxed font-sans">
                    {project.description}
                  </p>
                  {project.content && (
                    <div className="text-xs text-muted-paper border-l border-border-paper pl-4 italic space-y-1">
                      <span className="font-mono text-[9px] not-italic block uppercase text-copper">System Architecture</span>
                      <p>{project.content}</p>
                    </div>
                  )}
                  {project.screenshots && project.screenshots.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="font-mono text-[9px] block uppercase text-copper">Project Assets & Interfaces</span>
                      <div className={`grid gap-2 ${
                        (project as any).projectType === "MOBILE" 
                          ? "grid-cols-3 sm:grid-cols-4" 
                          : "grid-cols-2 sm:grid-cols-3"
                      }`}>
                        {project.screenshots.map((screenshot, sIdx) => (
                          <div 
                            key={sIdx} 
                            className={`border border-border-paper overflow-hidden bg-card-paper hover:border-copper transition-colors ${
                              (project as any).projectType === "MOBILE" ? "aspect-[9/16]" : "aspect-video"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={screenshot}
                              alt={`${project.title} asset ${sIdx + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Visual / Screenshot and Links (Right panel) */}
                <div className="md:col-span-3 space-y-4 flex flex-col items-stretch md:items-end justify-between h-full min-h-[140px]">
                  {project.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full md:w-48 aspect-video object-cover border border-border-paper shadow-xs"
                    />
                  ) : (
                    <div className="w-full md:w-48 aspect-video bg-card-paper border border-border-paper flex items-center justify-center text-[10px] font-mono text-muted-paper/40">
                      Zero-Loss Ledger
                    </div>
                  )}
                  <div className="flex md:flex-col gap-4 md:gap-2 text-xs font-mono pt-4 md:text-right">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-copper flex items-center justify-start md:justify-end gap-1.5 transition-colors"
                      >
                        <Github size={14} /> Repository
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-copper flex items-center justify-start md:justify-end gap-1.5 transition-colors"
                      >
                        <ExternalLink size={14} /> Live Deployment
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
