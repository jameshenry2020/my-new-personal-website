import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log: [
      { emit: "event", level: "error" },
      { emit: "event", level: "warn" },
    ],
  });

  // Filter out benign Neon/PgBouncer idle connection closure notices
  // (e.g., "Error in PostgreSQL connection: Error { kind: Closed, cause: None }")
  client.$on("error" as never, (e: { message?: string }) => {
    const msg = e.message || String(e);
    if (msg.includes("kind: Closed") || msg.includes("Closed, cause: None")) {
      // Benign pooler idle timeout; connection re-establishes transparently on next query
      return;
    }
    console.error("[Prisma Engine Error]:", msg);
  });

  client.$on("warn" as never, (e: { message?: string }) => {
    const msg = e.message || String(e);
    console.warn("[Prisma Engine Warning]:", msg);
  });

  return client;
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
