import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { deleteBook } from "@/actions/admin";
import { BookForm } from "@/components/shared/BookForm";
import { Edit, Trash2, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

interface AdminBooksPageProps {
  searchParams: Promise<{
    edit?: string;
  }>;
}

export default async function AdminBooksPage({ searchParams }: AdminBooksPageProps) {
  const resolvedParams = await searchParams;
  const editId = resolvedParams.edit || "";

  // Fetch all books
  const books = await db.book.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Fetch book to edit
  const bookToEdit = editId
    ? await db.book.findUnique({ where: { id: editId } })
    : null;

  return (
    <div className="space-y-8">
      {/* Header Block */}
      <section className="border-b border-border-paper pb-4">
        <span className="meta-mono">Technical Literature Library Manager</span>
        <h1 className="font-serif text-3xl font-bold text-fg-ink mt-2">Manage Books</h1>
      </section>

      {/* Splitsheet Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Books List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border-b border-border-paper pb-2 flex justify-between items-baseline">
            <h2 className="font-serif text-sm font-semibold italic text-fg-ink">Active Publications Catalog</h2>
            <span className="font-mono text-[10px] text-muted-paper">[{books.length} Cataloged]</span>
          </div>

          {books.length === 0 ? (
            <div className="p-8 border border-dashed border-border-paper text-center">
              <p className="font-serif italic text-xs text-muted-paper">No books registered.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className={`border p-4 space-y-3 transition-colors ${
                    editId === book.id ? "border-copper bg-card-paper/40" : "border-border-paper"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-3 items-start">
                      {book.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-12 aspect-[3/4] object-cover border border-border-paper shrink-0 shadow-xs"
                        />
                      ) : (
                        <div className="p-2 border border-border-paper bg-bg-paper text-copper shrink-0">
                          <BookOpen size={16} />
                        </div>
                      )}
                      <div>
                        <span className="font-serif font-bold text-sm text-fg-ink block">{book.title}</span>
                        <a
                          href={book.purchaseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[9px] text-copper hover:underline"
                        >
                          Acquisition Coordinate
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/books?edit=${book.id}`}
                        className="p-1.5 border border-border-paper text-muted-paper hover:text-copper hover:border-copper/40 transition-colors"
                        title="Edit Book"
                      >
                        <Edit size={11} />
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteBook(book.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="p-1.5 border border-border-paper text-muted-paper hover:text-red-500 hover:border-red-500/40 transition-colors"
                          title="Purge Book"
                        >
                          <Trash2 size={11} />
                        </button>
                      </form>
                    </div>
                  </div>
                  <p className="text-xs text-muted-paper font-sans leading-relaxed line-clamp-2">
                    {book.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Book Form */}
        <div className="lg:col-span-5">
          <BookForm initialData={bookToEdit} />
        </div>
      </section>
    </div>
  );
}
