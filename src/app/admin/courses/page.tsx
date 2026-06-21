import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { deleteCourse } from "@/actions/admin";
import { CourseForm } from "@/components/shared/CourseForm";
import { Edit, Trash2, Video } from "lucide-react";

export const dynamic = "force-dynamic";

interface AdminCoursesPageProps {
  searchParams: Promise<{
    edit?: string;
  }>;
}

export default async function AdminCoursesPage({ searchParams }: AdminCoursesPageProps) {
  const resolvedParams = await searchParams;
  const editId = resolvedParams.edit || "";

  // Fetch all courses
  const courses = await db.course.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Fetch course to edit
  const courseToEdit = editId
    ? await db.course.findUnique({ where: { id: editId } })
    : null;

  return (
    <div className="space-y-8">
      {/* Header Block */}
      <section className="border-b border-border-paper pb-4">
        <span className="meta-mono">Curriculum Syllabus Manager</span>
        <h1 className="font-serif text-3xl font-bold text-fg-ink mt-2">Manage Video Lectures</h1>
      </section>

      {/* Splitsheet Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Courses List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border-b border-border-paper pb-2 flex justify-between items-baseline">
            <h2 className="font-serif text-sm font-semibold italic text-fg-ink">Active Syllabus playlists</h2>
            <span className="font-mono text-[10px] text-muted-paper">[{courses.length} Playlists]</span>
          </div>

          {courses.length === 0 ? (
            <div className="p-8 border border-dashed border-border-paper text-center">
              <p className="font-serif italic text-xs text-muted-paper">No video courses registered.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`border p-4 space-y-3 transition-colors ${
                    editId === course.id ? "border-copper bg-card-paper/40" : "border-border-paper"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-3 items-start">
                      <div className="p-2 border border-border-paper bg-bg-paper text-copper shrink-0">
                        <Video size={16} />
                      </div>
                      <div>
                        <span className="font-serif font-bold text-sm text-fg-ink block">{course.title}</span>
                        <a
                          href={course.playlistUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[9px] text-copper hover:underline"
                        >
                          Playlist Coordinate
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/courses?edit=${course.id}`}
                        className="p-1.5 border border-border-paper text-muted-paper hover:text-copper hover:border-copper/40 transition-colors"
                        title="Edit Course"
                      >
                        <Edit size={11} />
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteCourse(course.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="p-1.5 border border-border-paper text-muted-paper hover:text-red-500 hover:border-red-500/40 transition-colors"
                          title="Purge Course"
                        >
                          <Trash2 size={11} />
                        </button>
                      </form>
                    </div>
                  </div>
                  <p className="text-xs text-muted-paper font-sans leading-relaxed line-clamp-2">
                    {course.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Course Form */}
        <div className="lg:col-span-5">
          <CourseForm initialData={courseToEdit} />
        </div>
      </section>
    </div>
  );
}
