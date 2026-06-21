import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear DB first
  await prisma.contactMessage.deleteMany();
  await prisma.review.deleteMany();
  await prisma.book.deleteMany();
  await prisma.course.deleteMany();
  await prisma.project.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create Categories
  const categoryDS = await prisma.category.create({
    data: { name: "Distributed Systems", slug: "distributed-systems" },
  });
  const categoryDB = await prisma.category.create({
    data: { name: "Database Engineering", slug: "database-engineering" },
  });
  const categoryFT = await prisma.category.create({
    data: { name: "Fintech Architecture", slug: "fintech-architecture" },
  });

  // Create Tags
  const tagKafka = await prisma.tag.create({ data: { name: "Kafka", slug: "kafka" } });
  const tagRust = await prisma.tag.create({ data: { name: "Rust", slug: "rust" } });
  const tagPG = await prisma.tag.create({ data: { name: "PostgreSQL", slug: "postgresql" } });
  const tagGo = await prisma.tag.create({ data: { name: "Go Lang", slug: "go-lang" } });

  // Create Posts
  await prisma.post.create({
    data: {
      title: "Designing Event-Driven Transactions in High-Throughput Systems",
      slug: "event-driven-transactions-high-throughput",
      content: `
        <p class="dropcap">W</p>hen designing distributed financial platforms, transactional consistency becomes a prime challenge. Traditional two-phase commits (2PC) are notoriously slow and introduce synchronization bottlenecks that severely degrade system availability and performance. In this essay, we explore the Sagas pattern as a resilient, asynchronous alternative for distributed transactions.
        <h2>The Limitations of Two-Phase Commits</h2>
        <p>In a monolithic architecture, ACID transactions are simple to implement via standard database transactions. However, in modern microservices or event-driven systems, a business transaction often spans across multiple databases. Implementing 2PC locks resources across all participating microservices until the coordinator makes a decision. If one service is slow, the entire pipeline blocks, leading to massive latency spikes.</p>
        <blockquote>"Distributed locks are the enemy of high availability."</blockquote>
        <h2>The Saga Pattern: Choreography vs. Orchestration</h2>
        <p>A Saga is a sequence of local transactions. Each transaction updates data within a single service and publishes an event. Subsequent services listen and execute their local transaction. If a step fails, the Saga executes compensating transactions to undo the changes. We can implement Sagas via two models:</p>
        <ol>
          <li><strong>Choreography</strong>: Decoupled, event-driven, where services react to events from other services.</li>
          <li><strong>Orchestration</strong>: A central controller orchestrates the execution flow.</li>
        </ol>
        <p>For high-throughput systems, choreography is preferred as it eliminates the coordinator single point of failure and bottleneck, although it requires careful schema design and monitoring.</p>
      `,
      coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
      published: true,
      categoryId: categoryDS.id,
      tags: { connect: [{ id: tagKafka.id }, { id: tagRust.id }] },
    },
  });

  await prisma.post.create({
    data: {
      title: "PostgreSQL Indexing: The Fine Art of Partial and Composite Indexes",
      slug: "postgresql-indexing-fine-art",
      content: `
        <p class="dropcap">P</p>erformance engineering in SQL databases is often dominated by query plan optimization. While adding single-column indexes is a common first step, real-world workloads require deep optimization using partial and composite indexes.
        <h2>Composite Index Ordering (The Leftmost Rule)</h2>
        <p>A composite index covers multiple columns (e.g., <code>(tenant_id, created_at, status)</code>). The order of these columns is critical. Postgres can only utilize the index if you query on a prefix of the columns. Always place high-cardinality equality filter fields first, followed by range fields.</p>
      `,
      coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80",
      published: true,
      categoryId: categoryDB.id,
      tags: { connect: [{ id: tagPG.id }] },
    },
  });

  // Create Projects
  await prisma.project.create({
    data: {
      title: "Aegis: Low-Latency Distributed Ledger Gateways",
      description: "A high-performance transaction serialization engine designed for processing sub-millisecond fintech ledger events.",
      content: "Developed a custom event loop in Go utilizing memory-mapped buffers to bypass OS-level context switching, achieving a throughput of 250k tx/sec with p99 latencies under 2ms.",
      technologies: ["Go", "Kafka", "PostgreSQL", "gRPC", "Docker"],
      githubUrl: "https://github.com",
      liveUrl: "https://github.com",
      coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80",
      featured: true,
    },
  });

  await prisma.project.create({
    data: {
      title: "LogiFlow: High-Throughput Event Broker",
      description: "A lightweight, zero-dependency log broker written in Rust for streaming structured JSON logs in real-time.",
      content: "Engineered a custom binary index format for fast file seeks. Integrates seamlessly with cloud storage providers for automated long-term archiving.",
      technologies: ["Rust", "WASM", "Tokio", "AWS S3"],
      githubUrl: "https://github.com",
      liveUrl: "https://github.com",
      coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
      featured: true,
    },
  });

  // Create Courses
  await prisma.course.create({
    data: {
      title: "Distributed Systems Fundamentals: From Scratch",
      description: "An in-depth video course mapping out clock synchronization, consensus algorithms (Raft), and architectural partition recovery strategies.",
      playlistUrl: "https://www.youtube.com/playlist?list=PL230FA02A43E6327E",
      thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80",
    },
  });

  // Create Books
  const book = await prisma.book.create({
    data: {
      title: "Designing Distributed Ledger Applications",
      description: "A production guide for software engineers on data structures, transaction design patterns, and scaling state machines in microservice systems.",
      coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&auto=format&fit=crop&q=80",
      purchaseUrl: "https://amazon.com",
    },
  });

  // Add reviews
  await prisma.review.create({
    data: {
      bookId: book.id,
      author: "Dr. Elizabeth Stone, MIT",
      rating: 5,
      content: "An absolute masterclass in architectural engineering. Henry cuts through the noise and provides actionable, production-grade solutions.",
    },
  });

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
