import React from "react";
import { db } from "@/lib/db";
import { markContactMessageRead, deleteContactMessage } from "@/actions/admin";
import { Mail, Trash2, Check, Inbox } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-8">
      {/* Header Block */}
      <section className="border-b border-border-paper pb-4 flex justify-between items-end">
        <div>
          <span className="meta-mono">Communications Log Terminal</span>
          <h1 className="font-serif text-3xl font-bold text-fg-ink mt-2">Inbox Messages</h1>
        </div>
        <span className="font-mono text-xs text-muted-paper">
          [{unreadCount}] Unread • [{messages.length}] Total Signals
        </span>
      </section>

      {/* Messages list */}
      {messages.length === 0 ? (
        <div className="p-16 border border-dashed border-border-paper text-center space-y-4">
          <div className="w-12 h-12 border border-border-paper text-muted-paper rounded-full flex items-center justify-center mx-auto bg-card-paper">
            <Inbox size={20} />
          </div>
          <div>
            <p className="font-serif italic text-sm text-fg-ink">Terminal is quiet.</p>
            <p className="text-[11px] font-mono text-muted-paper mt-1">
              All data ports are functioning correctly.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`border p-6 space-y-4 transition-colors ${
                msg.read
                  ? "bg-bg-paper border-border-paper/60 opacity-80"
                  : "bg-card-paper border-copper/35 shadow-xs"
              }`}
            >
              {/* Header Info */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base text-fg-ink">{msg.subject}</span>
                    {!msg.read && (
                      <span className="font-mono text-[8px] bg-copper/10 border border-copper/30 text-copper px-1.5 py-0.2 uppercase">
                        Unread Signal
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-[10px] text-muted-paper flex flex-wrap gap-x-3">
                    <span>
                      Sender: <strong className="text-fg-ink font-semibold">{msg.name}</strong>
                    </span>
                    <span>&lt;{msg.email}&gt;</span>
                    <span>•</span>
                    <span>{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Operations Actions Form */}
                <div className="flex items-center gap-2">
                  {!msg.read ? (
                    <form
                      action={async () => {
                        "use server";
                        await markContactMessageRead(msg.id, true);
                      }}
                    >
                      <button
                        type="submit"
                        className="p-2 border border-border-paper text-muted-paper hover:text-emerald-500 hover:border-emerald-500/35 transition-colors"
                        title="Mark Read"
                      >
                        <Check size={13} />
                      </button>
                    </form>
                  ) : (
                    <form
                      action={async () => {
                        "use server";
                        await markContactMessageRead(msg.id, false);
                      }}
                    >
                      <button
                        type="submit"
                        className="p-2 border border-border-paper text-muted-paper hover:text-copper hover:border-copper/35 transition-colors"
                        title="Mark Unread"
                      >
                        <Mail size={13} />
                      </button>
                    </form>
                  )}
                  <form
                    action={async () => {
                      "use server";
                      await deleteContactMessage(msg.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="p-2 border border-border-paper text-muted-paper hover:text-red-500 hover:border-red-500/35 transition-colors"
                      title="Purge Message"
                    >
                      <Trash2 size={13} />
                    </button>
                  </form>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-4 bg-bg-paper border border-border-paper/40 rounded-none text-xs font-mono whitespace-pre-wrap leading-relaxed text-fg-ink/80 select-all">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
