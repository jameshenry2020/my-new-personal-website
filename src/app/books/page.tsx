import React from "react";
import { getBooks } from "@/services/db.service";
import { Star } from "lucide-react";

export const metadata = {
  title: "Literature & Books",
  description: "Technical print publications and books authored by Henry A. on backend scalability and systems design.",
};

export default async function BooksPage() {
  const books = await getBooks().catch(() => []);

  return (
    <div className="space-y-16">
      {/* 1. Header Block */}
      <section className="border-b border-border-paper pb-8 space-y-4">
        <div>
          <span className="meta-mono">Digital & Print Publications</span>
          <h1 className="font-serif text-4xl md:text-5xl font-extrabold tracking-tight text-fg-ink mt-2">
            Technical Books
          </h1>
        </div>
        <p className="text-xs text-muted-paper max-w-xl font-sans leading-relaxed">
          Comprehensive guides and manuals designed for engineers looking to deep-dive into scalable architecture patterns, database designs, and transaction engines.
        </p>
      </section>

      {/* 2. Books Shelf Grid */}
      <section className="space-y-24">
        {books.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border-paper">
            <p className="font-serif italic text-muted-paper">No technical literature catalogs found.</p>
          </div>
        ) : (
          books.map((book, idx) => (
            <div key={book.id} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
              {/* Cover Book (Left Panel) */}
              <div className="md:col-span-4 flex justify-center">
                <div className="relative aspect-[3/4] w-64 bg-card-paper border border-border-paper shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  {book.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-2">
                      <span className="font-serif italic text-lg text-muted-paper">Systems Design Blueprint</span>
                      <span className="meta-mono text-[9px] text-muted-paper/40">Publication Pipeline</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Details & Reviews (Right Panel) */}
              <div className="md:col-span-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-copper font-semibold">
                      VOLUME [{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}]
                    </span>
                    <span className="h-px bg-border-paper flex-grow" />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-fg-ink">
                    {book.title}
                  </h2>
                  <p className="text-sm text-muted-paper leading-relaxed font-sans">
                    {book.description}
                  </p>
                  <div className="pt-2">
                    <a
                      href={book.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-fg-ink bg-fg-ink text-bg-paper px-6 py-2.5 font-mono text-xs hover:bg-copper hover:border-copper transition-all inline-block"
                    >
                      Acquire Publication
                    </a>
                  </div>
                </div>

                {/* Reviews */}
                {book.reviews && book.reviews.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-border-paper">
                    <span className="meta-mono block">Peer Critical Review</span>
                    <div className="space-y-6">
                      {book.reviews.map((review) => (
                        <div key={review.id} className="space-y-2">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} size={11} className="fill-copper text-copper" />
                            ))}
                          </div>
                          <p className="font-serif italic text-xs leading-relaxed text-muted-paper">
                            &quot;{review.content}&quot;
                          </p>
                          <span className="font-mono text-[10px] uppercase text-muted-paper block">
                            — {review.author}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
