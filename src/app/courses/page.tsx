import React from "react";
import { getCourses } from "@/services/db.service";

export const metadata = {
  title: "Lectures & Courses",
  description: "Free technical video series on distributed systems design, data systems implementation, and backend scaling architectures.",
};

// Helper to extract playlist ID from YouTube playlist URL
function getPlaylistId(url: string) {
  const reg = /[&?]list=([^#\&\?]+)/;
  const match = url.match(reg);
  return match ? match[1] : null;
}

export default async function CoursesPage() {
  const courses = await getCourses().catch(() => []);

  return (
    <div className="space-y-16">
      {/* 1. Header Block */}
      <section className="border-b border-border-paper pb-8 space-y-4">
        <div>
          <span className="meta-mono">Technical Video Series</span>
          <h1 className="font-serif text-4xl md:text-5xl font-extrabold tracking-tight text-fg-ink mt-2">
            Video Lectures
          </h1>
        </div>
        <p className="text-xs text-muted-paper max-w-xl font-sans leading-relaxed">
          Open-source lectures covering distributed consensus, networking protocols, system design interviews, and clean code paradigms.
        </p>
      </section>

      {/* 2. Course Showcase List */}
      <section className="space-y-24">
        {courses.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border-paper">
            <p className="font-serif italic text-muted-paper">No technical video lectures cataloged yet.</p>
          </div>
        ) : (
          courses.map((course, idx) => {
            const playlistId = getPlaylistId(course.playlistUrl);
            return (
              <div key={course.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Text Metadata (Left Panel) */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-copper font-semibold">
                      COURSE [{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}]
                    </span>
                    <span className="h-px bg-border-paper flex-grow" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold tracking-tight text-fg-ink">
                    {course.title}
                  </h2>
                  <p className="text-xs text-muted-paper leading-relaxed font-sans">
                    {course.description}
                  </p>
                  <div className="pt-2">
                    <a
                      href={course.playlistUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="meta-mono text-copper hover:underline text-[11px]"
                    >
                      View Playlist on YouTube →
                    </a>
                  </div>
                </div>

                {/* Embed Responsive Player (Right Panel) */}
                <div className="lg:col-span-8">
                  {playlistId ? (
                    <div className="relative aspect-video w-full border border-border-paper bg-card-paper shadow-sm">
                      <iframe
                        src={`https://www.youtube.com/embed/videoseries?list=${playlistId}`}
                        title={course.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full border-0"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-card-paper border border-border-paper flex flex-col items-center justify-center text-center p-6 space-y-2">
                      <span className="font-serif italic text-muted-paper">Embed Unavailable</span>
                      <p className="text-xs text-muted-paper/60 font-mono">
                        Invalid YouTube Playlist URL Configuration
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
