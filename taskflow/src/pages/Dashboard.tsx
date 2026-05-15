import { memo, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../store'
import { logout } from '../features/auth/authSlice'
import Header from '../components/Header'
import HeaderMUI from '../components/HeaderMUI'
import HeaderBS from '../components/HeaderBS'
import Sidebar from '../components/Sidebar'
import MainContent from '../components/MainContent'
import ProjectForm from '../components/ProjectForm'
import useProjects, { type Project } from '../hooks/useProjects'
import styles from './Dashboard.module.css'

const MemoizedSidebar = memo(Sidebar)

/** PDF Séance 4 : remplacez par 'mui' ou 'bs' pour comparer les headers. */
const HEADER_VARIANT = 'css' as 'css' | 'mui' | 'bs'

const HeaderCmp = HEADER_VARIANT === 'mui' ? HeaderMUI : HEADER_VARIANT === 'bs' ? HeaderBS : Header

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const authState = useSelector((state: RootState) => state.auth)
  const { projects, columns, loading, error, addProject, renameProject, deleteProject } = useProjects()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleRenameProject = useCallback(
    (p: Project) => {
      void renameProject(p)
    },
    [renameProject],
  )

  async function handleAddProject(name: string, color: string) {
    setSaving(true)
    try {
      await addProject(name, color)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Chargement...</div>
  }

  return (
    <div className={styles.layout}>
      <HeaderCmp
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen((p) => !p)}
        userName={authState.user?.name}
        onLogout={() => dispatch(logout())}
      />
      <div className={styles.body}>
        <MemoizedSidebar
          projects={projects}
          isOpen={sidebarOpen}
          onRenameProject={handleRenameProject}
          onDeleteProject={(id) => void deleteProject(id)}
        />
        <div className={styles.content}>
          <div className={styles.toolbar}>
            {error && <div className={styles.error}>{error}</div>}
            {!showForm ? (
              <button type="button" className={styles.addBtn} disabled={saving} onClick={() => setShowForm(true)}>
                + Nouveau projet
              </button>
            ) : (
              <ProjectForm
                submitLabel="Créer"
                onSubmit={(name, color) => {
                  void handleAddProject(name, color)
                  setShowForm(false)
                }}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>
          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  )
}
