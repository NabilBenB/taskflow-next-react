import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const projects = await prisma.project.findMany();
  return projects.map(p => ({ id: String(p.id) }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  
  const project = await prisma.project.findUnique({
    where: { id: Number(id) }
  });

  if (!project) notFound();

  return (
    <div className="tf-main-inner">
      <div className="tf-card" style={{ marginTop: "1.5rem" }}>
        <h1 className="tf-detail-title">
          <span
            className="tf-dot tf-dot--lg"
            style={{ background: project.color }}
            aria-hidden
          />
          {project.name}
        </h1>
        <p className="tf-muted-id">Créé le : {project.createdAt.toLocaleDateString('fr-FR')}</p>
        <a className="tf-link-back" href="/dashboard">
          ← Retour au Dashboard
        </a>
      </div>
    </div>
  );
}
