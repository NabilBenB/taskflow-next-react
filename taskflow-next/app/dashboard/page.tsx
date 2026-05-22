import { prisma } from '@/lib/prisma';
import AddProjectForm from "./AddProjectForm";
import { deleteProject, renameProject } from "../actions/projects";

export default async function DashboardPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="tf-main-inner">
      <div className="tf-card">
        <h1 className="tf-page-title">Dashboard</h1>
        <p className="tf-page-sub">
          <span className="tf-stat">{projects.length} projets</span>
        </p>

        <AddProjectForm />

        {projects.length === 0 ? (
          <p className="tf-empty">Aucun projet pour le moment. Créez-en un ci-dessus.</p>
        ) : (
          <ul className="tf-project-list">
            {projects.map((p) => (
              <li key={p.id} className="tf-project-row">
                <span
                  className="tf-dot"
                  style={{ background: p.color }}
                  title={`Couleur ${p.color}`}
                />
                <a href={`/projects/${p.id}`}>{p.name}</a>
                <form className="tf-form-row" style={{ margin: 0, flex: "1 1 auto" }} action={renameProject}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="color" value={p.color} />
                  <input
                    className="tf-input"
                    name="newName"
                    defaultValue={p.name}
                    required
                    aria-label={`Nouveau nom pour ${p.name}`}
                  />
                  <button className="tf-btn-primary tf-btn-sm" type="submit">
                    Renommer
                  </button>
                </form>
                <form action={deleteProject} style={{ margin: 0 }}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    className="tf-icon-btn"
                    type="submit"
                    aria-label="Supprimer le projet"
                  >
                    🗑
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
