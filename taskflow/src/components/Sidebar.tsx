import { NavLink } from 'react-router-dom'
import styles from './Sidebar.module.css'
import type { Project } from '../hooks/useProjects'

interface SidebarProps {
  projects: Project[]
  isOpen: boolean
  onRenameProject?: (p: Project) => void
  onDeleteProject?: (id: string) => void
}

export default function Sidebar({ projects, isOpen, onRenameProject, onDeleteProject }: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <h2 className={styles.title}>Mes Projets</h2>
      <ul className={styles.list}>
        {projects.map((p) => (
          <li key={p.id} className={styles.row}>
            <NavLink
              to={`/projects/${p.id}`}
              className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.dot} style={{ background: p.color }} />
              {p.name}
            </NavLink>
            {(onRenameProject || onDeleteProject) && (
              <span className={styles.actions}>
                {onRenameProject && (
                  <button
                    type="button"
                    className={styles.iconBtn}
                    title="Renommer"
                    aria-label={`Renommer ${p.name}`}
                    onClick={() => onRenameProject(p)}
                  >
                    ✎
                  </button>
                )}
                {onDeleteProject && (
                  <button
                    type="button"
                    className={styles.iconBtn}
                    title="Supprimer"
                    aria-label={`Supprimer ${p.name}`}
                    onClick={() => onDeleteProject(p.id)}
                  >
                    ×
                  </button>
                )}
              </span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  )
}
