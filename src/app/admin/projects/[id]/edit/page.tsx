import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProjectForm } from "@/components/shared/ProjectForm";

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const resolvedParams = await params;
  const project = await db.project.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="py-4">
      <ProjectForm initialData={project} />
    </div>
  );
}
