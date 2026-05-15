import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import api from '../api/axios'

export interface Project {
  id: string
  name: string
  color: string
}

export interface Column {
  id: string
  title: string
  tasks: string[]
}

export default function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [columns, setColumns] = useState<Column[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, colRes] = await Promise.all([api.get<Project[]>('/projects'), api.get<Column[]>('/columns')])
        setProjects(projRes.data)
        setColumns(colRes.data)
      } catch {
        setError('Erreur chargement')
      } finally {
        setLoading(false)
      }
    }
    void fetchData()
  }, [])

  const addProject = useCallback(async (name: string, color: string) => {
    setError(null)
    try {
      const { data } = await api.post<Project>('/projects', { name, color })
      setProjects((prev) => [...prev, data])
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? `Erreur ${err.response?.status}`)
      } else {
        setError('Erreur inconnue')
      }
    }
  }, [])

  const renameProject = useCallback(async (project: Project) => {
    const newName = window.prompt('Nouveau nom :', project.name)
    if (!newName || newName === project.name) return
    setError(null)
    try {
      const { data } = await api.put<Project>(`/projects/${project.id}`, {
        ...project,
        name: newName,
      })
      setProjects((prev) => prev.map((p) => (p.id === data.id ? data : p)))
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? `Erreur ${err.response?.status}`)
      } else {
        setError('Erreur inconnue')
      }
    }
  }, [])

  const deleteProject = useCallback(async (id: string) => {
    if (!window.confirm('Êtes-vous sûr ?')) return
    setError(null)
    try {
      await api.delete(`/projects/${id}`)
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? `Erreur ${err.response?.status}`)
      } else {
        setError('Erreur inconnue')
      }
    }
  }, [])

  return { projects, columns, loading, error, addProject, renameProject, deleteProject }
}
