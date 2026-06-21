import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { deleteProject } from "@/actions/admin";
import { ProjectForm } from "@/components/shared/ProjectForm";
import { Edit, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

interface AdminProjectsPageProps {
  searchParams: Promise<{
    edit?: string;
  }>;
}

export default async function AdminProjectsPage({ searchParams }: AdminProjectsPageProps) {
  const resolvedParams = await searchParams;
  const editId = resolvedParams.edit || "";

  // Fetch all projects
  const projects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Fetch project being edited if editId is provided
  const projectToEdit = editId
    ? await db.project.findUnique({ where: { id: editId } })
    : null;

  return (
    <div className="space-y-8">
      {/* Header Block */}
      <section className="border-b border-border-paper pb-4">
        <span className="meta-mono">System Showcase Registry</span>
        <h1 className="font-serif text-3xl font-bold text-fg-ink mt-2">Manage Projects</h1>
      </section>

      {/* Dual Splitsheet Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Projects List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border-b border-border-paper pb-2 flex justify-between items-baseline">
            <h2 className="font-serif text-sm font-semibold italic text-fg-ink">Active Repositories</h2>
            <span className="font-mono text-[10px] text-muted-paper">[{projects.length} Total]</span>
          </div>

          {projects.length === 0 ? (
            <div className="p-8 border border-dashed border-border-paper text-center">
              <p className="font-serif italic text-xs text-muted-paper">No systems cataloged.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className={`border p-4 space-y-3 transition-colors ${
                    editId === proj.id ? "border-copper bg-card-paper/40" : "border-border-paper"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-fg-ink">{proj.title}</span>
                        {proj.featured && (
                          <span className="font-mono text-[8px] border border-copper text-copper px-1.5 py-0.2">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {proj.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="font-mono text-[8px] bg-bg-paper border border-border-paper px-1.5 py-0.2 text-muted-paper"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/projects?edit=${proj.id}`}
                        className="p-1.5 border border-border-paper text-muted-paper hover:text-copper hover:border-copper/40 transition-colors"
                        title="Edit Project"
                      >
                        <Edit size={11} />
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteProject(proj.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="p-1.5 border border-border-paper text-muted-paper hover:text-red-500 hover:border-red-500/40 transition-colors"
                          title="Purge Project"
                        >
                          <Trash2 size={11} />
                        </button>
                      </form>
                    </div>
                  </div>
                  <p className="text-xs text-muted-paper font-sans leading-relaxed line-clamp-2">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Project form (5 cols) */}
        <div className="lg:col-span-5">
          <ProjectForm initialData={projectToEdit} />
        </div>
      </section>
    </div>
  );
}
