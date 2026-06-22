import React from "react";
import Link from "next/link";
import { getProjects, getPosts, getCourses, getBooks } from "@/services/db.service";
import { MoveRight, Github, ExternalLink, ArrowUpRight, Video } from "lucide-react";

export const revalidate = 3600; // Revalidate home page every hour

export default async function HomePage() {
  // Fetch data on the server
  const { posts } = await getPosts({ limit: 3 }).catch(() => ({ posts: [] }));
  const projects = await getProjects({ featured: true }).catch(() => []);
  const courses = await getCourses().catch(() => []);
  const books = await getBooks().catch(() => []);

  return (
    <div className="space-y-24 md:space-y-36">
      {/* 1. Hero Section - Typography First, Editorial Asymmetry */}
      <section className="editorial-grid border-b border-border-paper pb-16 md:pb-24">
        {/* Left Column: Context & Metadata */}
        <div className="space-y-6 mb-8 md:mb-0">
          <div className="meta-mono">Status: Operating</div>
          <div className="space-y-1">
            <h1 className="font-serif text-4xl md:text-5xl font-extrabold tracking-tight text-fg-ink">
              Henry A.
            </h1>
            <p className="font-mono text-xs text-copper tracking-wide uppercase">
              Principal Systems Architect & Engineer
            </p>
          </div>
          <div className="text-xs text-muted-paper space-y-1 font-mono">
            <div>Focus: Scalable Backends, Fintech</div>
            <div>Location: London, UK / Remote</div>
          </div>
        </div>

        {/* Right Column: Large Introduction Statement */}
        <div className="flex flex-col justify-between">
          <p className="font-serif text-xl md:text-3xl font-light text-fg-ink/90 leading-relaxed max-w-3xl">
            Software Engineer specializing in distributed systems, event-driven architectures, and scalable backend platforms. I build production-grade software across Fintech, E-commerce, and SaaS.
          </p>
          <div className="mt-8 md:mt-16 flex flex-wrap gap-4 text-xs font-mono">
            <Link
              href="/projects"
              className="border border-fg-ink px-4 py-2 hover:bg-fg-ink hover:text-bg-paper transition-all flex items-center gap-2"
            >
              Examine Work <MoveRight size={14} />
            </Link>
            <Link
              href="/about"
              className="border border-border-paper px-4 py-2 hover:bg-card-paper transition-all"
            >
              Read Biography
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Featured Projects - Alternate Large Layouts */}
      <section className="space-y-12">
        <div className="flex justify-between items-baseline border-b border-border-paper pb-4">
          <h2 className="font-serif text-2xl font-semibold italic text-fg-ink">Selected Artifacts</h2>
          <Link href="/projects" className="meta-mono hover:text-copper flex items-center gap-1.5 transition-colors">
            All Work <ArrowUpRight size={12} />
          </Link>
        </div>

        {projects.length === 0 ? (
          <p className="text-sm text-muted-paper italic">No featured projects found. Check back soon.</p>
        ) : (
          <div className="space-y-20">
            {projects.map((project, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={project.id}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center ${
                    isEven ? "" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Text Details */}
                  <div className={`space-y-6 md:col-span-5 ${isEven ? "md:order-1" : "md:order-2"}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-copper">Project {idx + 1}</span>
                      <span className="h-px bg-border-paper flex-grow" />
                    </div>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-fg-ink">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-paper leading-relaxed font-sans">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[10px] bg-card-paper border border-border-paper px-2 py-0.5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono pt-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-copper flex items-center gap-1 transition-colors"
                        >
                          <Github size={14} /> Repository
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-copper flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink size={14} /> Live System
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Visual Space (Editorial Mockup / Image Placeholder) */}
                  <div className={`relative h-64 md:h-96 w-full bg-card-paper border border-border-paper md:col-span-7 flex items-center justify-center overflow-hidden ${
                    isEven ? "md:order-2" : "md:order-1"
                  }`}>
                    {project.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-90 hover:scale-102 transition-transform duration-700"
                      />
                    ) : (
                      <div className="text-center p-6 space-y-2">
                        <span className="font-serif italic text-lg text-muted-paper">Visual Representation</span>
                        <div className="meta-mono text-[10px] text-muted-paper/50">Asset Pipeline Configured</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Essays & Literature Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 border-t border-border-paper pt-16">
        {/* Left Column: Heading & Context */}
        <div className="md:col-span-4 space-y-4">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-fg-ink">
            Technical <br className="hidden md:inline" />
            Essays
          </h2>
          <p className="text-xs text-muted-paper font-sans leading-relaxed max-w-xs">
            Deep-dives into database query optimizations, distributed consensus mechanics, and microservice integration design patterns.
          </p>
          <Link href="/blog" className="meta-mono hover:text-copper inline-flex items-center gap-1.5 pt-2 transition-colors">
            All Articles <ArrowUpRight size={12} />
          </Link>
        </div>

        {/* Right Column: Listed articles with clean editorial border lines */}
        <div className="md:col-span-8 divide-y divide-border-paper border-t border-b border-border-paper">
          {posts.length === 0 ? (
            <p className="py-6 text-sm text-muted-paper italic">No publications released yet.</p>
          ) : (
            posts.map((post) => (
              <article key={post.id} className="py-8 group">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-baseline">
                  {/* Date */}
                  <span className="font-mono text-xs text-muted-paper">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {/* Title & Category */}
                  <div className="md:col-span-3 space-y-2">
                    <span className="font-mono text-[10px] text-copper tracking-wider uppercase">
                      {post.category.name}
                    </span>
                    <h3 className="font-serif text-lg md:text-xl font-bold text-fg-ink group-hover:text-copper transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* 4. Books and Courses - Split Layout */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 border-t border-border-paper pt-16">
        {/* Left Side: Video Courses */}
        <div className="space-y-8">
          <div className="border-b border-border-paper pb-4">
            <h2 className="font-serif text-2xl font-semibold italic text-fg-ink">Video Courses</h2>
          </div>
          {courses.length === 0 ? (
            <p className="text-sm text-muted-paper italic">No technical video lectures uploaded.</p>
          ) : (
            courses.slice(0, 1).map((course) => (
              <div key={course.id} className="space-y-4">
                <div className="relative aspect-video bg-card-paper border border-border-paper overflow-hidden">
                  {course.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover opacity-90"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-12 h-12 border border-white/80 rounded-full flex items-center justify-center text-white bg-black/40 backdrop-blur-xs">
                      <Video size={18} />
                    </div>
                  </div>
                </div>
                <h3 className="font-serif text-lg font-bold text-fg-ink">{course.title}</h3>
                <p className="text-xs text-muted-paper leading-relaxed font-sans">{course.description}</p>
                <Link
                  href="/courses"
                  className="meta-mono text-copper flex items-center gap-1.5 hover:text-copper-hover transition-colors"
                >
                  Launch Lectures <ArrowUpRight size={12} />
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Publications / Books */}
        <div className="space-y-8">
          <div className="border-b border-border-paper pb-4">
            <h2 className="font-serif text-2xl font-semibold italic text-fg-ink">Print Publications</h2>
          </div>
          {books.length === 0 ? (
            <p className="text-sm text-muted-paper italic">No technical literature cataloged yet.</p>
          ) : (
            books.slice(0, 1).map((book) => (
              <div key={book.id} className="grid grid-cols-3 gap-6 items-start">
                <div className="col-span-1 aspect-[3/4] bg-card-paper border border-border-paper shadow-sm overflow-hidden">
                  {book.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="col-span-2 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-fg-ink">{book.title}</h3>
                  <p className="text-xs text-muted-paper leading-relaxed font-sans line-clamp-4">
                    {book.description}
                  </p>
                  {book.reviews?.[0] && (
                    <div className="border-l-2 border-copper pl-3 py-0.5">
                      <p className="text-[11px] font-serif italic text-muted-paper">
                        &quot;{book.reviews[0].content}&quot;
                      </p>
                      <span className="text-[9px] font-mono uppercase text-muted-paper">
                        - {book.reviews[0].author}
                      </span>
                    </div>
                  )}
                  <Link
                    href="/books"
                    className="meta-mono text-copper flex items-center gap-1.5 hover:text-copper-hover transition-colors"
                  >
                    Examine Catalog <ArrowUpRight size={12} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 5. Contact CTA Section */}
      <section className="border-t border-b border-border-paper py-16 text-center space-y-6">
        <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-fg-ink">
          Initiate a Technical Dialogue
        </h2>
        <p className="text-sm text-muted-paper max-w-lg mx-auto font-sans leading-relaxed">
          Have a software architecture challenge or looking for consulting on distributed systems? Reach out via the contact form or view social coordinates.
        </p>
        <div className="pt-4">
          <Link
            href="/contact"
            className="border border-fg-ink px-6 py-3 font-mono text-xs hover:bg-fg-ink hover:text-bg-paper transition-all inline-flex items-center gap-2"
          >
            Open Transmission Terminal <MoveRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
