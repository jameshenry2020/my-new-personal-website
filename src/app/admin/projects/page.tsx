import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { deleteProject } from "@/actions/admin";
import { Edit, Trash2, Plus, ExternalLink, Star } from "lucide-react";
import { revalidatePath } from "next/cache";

const typeLabels: Record<string, string> = {
  FULL_STACK: "Full Stack",
  BACKEND_ONLY: "Backend Only",
  MOBILE: "Mobile",
};

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Header Block */}
      <section className="border-b border-border-paper pb-4 flex justify-between items-end">
        <div>
          <span className="meta-mono">System Showcase Registry</span>
          <h1 className="font-serif text-3xl font-bold text-fg-ink mt-2">Manage Projects</h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="border border-copper px-4 py-2 hover:bg-copper hover:text-bg-paper text-copper transition-all font-mono text-xs flex items-center gap-1.5"
        >
          <Plus size={14} /> Add Project
        </Link>
      </section>

      {/* Catalog Table */}
      {projects.length === 0 ? (
        <div className="p-12 border border-dashed border-border-paper text-center">
          <p className="font-serif italic text-sm text-muted-paper">No projects cataloged.</p>
          <Link
            href="/admin/projects/new"
            className="meta-mono text-copper hover:underline mt-2 inline-block"
          >
            Catalog First System Project
          </Link>
        </div>
      ) : (
        <div className="border border-border-paper overflow-x-auto bg-card-paper">
          <table className="w-full border-collapse text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-border-paper bg-bg-paper text-[10px] font-mono uppercase tracking-wider text-muted-paper">
                <th className="p-4 font-semibold">System Title</th>
                <th className="p-4 font-semibold">Category Type</th>
                <th className="p-4 font-semibold">Stack Technologies</th>
                <th className="p-4 font-semibold">Featured</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-paper">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-bg-paper/40 transition-colors">
                  <td className="p-4 font-serif font-bold text-sm text-fg-ink">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span>{proj.title}</span>
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-paper hover:text-copper"
                            title="Visit Live Site"
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                      <p className="font-sans text-xs text-muted-paper font-normal line-clamp-1 max-w-md">
                        {proj.description}
                      </p>
                    </div>
                  </td>

                  <td className="p-4 font-mono text-muted-paper whitespace-nowrap">
                    <span className="bg-copper/10 text-copper border border-copper/20 px-2 py-0.5 text-[10px] uppercase font-semibold">
                      {typeLabels[(proj as any).projectType] || "Full Stack"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {proj.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[9px] bg-bg-paper border border-border-paper px-1.5 py-0.2 text-muted-paper"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-4">
                    {/* Featured toggle */}
                    <form
                      action={async () => {
                        "use server";
                        await db.project.update({
                          where: { id: proj.id },
                          data: { featured: !proj.featured },
                        });
                        revalidatePath("/projects");
                        revalidatePath("/admin");
                        revalidatePath("/admin/projects");
                      }}
                    >
                      <button
                        type="submit"
                        className={`font-mono text-[10px] px-2 py-0.5 border flex items-center gap-1 ${proj.featured
                            ? "border-copper text-copper bg-copper/10 hover:bg-copper/20"
                            : "border-border-paper text-muted-paper hover:text-fg-ink bg-bg-paper"
                          }`}
                      >
                        <Star size={10} className={proj.featured ? "fill-copper" : ""} />
                        {proj.featured ? "Featured" : "Standard"}
                      </button>
                    </form>
                  </td>

                  <td className="p-4 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/projects/${proj.id}/edit`}
                        className="p-1.5 border border-border-paper text-muted-paper hover:text-copper hover:border-copper/40 transition-colors"
                        title="Edit Project"
                      >
                        <Edit size={12} />
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
                          <Trash2 size={12} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
