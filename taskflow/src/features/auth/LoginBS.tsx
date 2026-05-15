import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import api from '../../api/axios'
import type { AppDispatch, RootState } from '../../store'
import { loginStart, loginSuccess, loginFailure } from './authSlice'
import { loginApiErrorMessage } from './loginApiErrorMessage'

export default function LoginBS() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const { user, loading, error } = useSelector((state: RootState) => state.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true })
    }
  }, [user, navigate, from])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    dispatch(loginStart())
    try {
      const { data: users } = await api.get<Array<{ id: string; email: string; name: string; password: string }>>(
        '/users',
        { params: { email } },
      )
      if (users.length === 0 || users[0].password !== password) {
        dispatch(loginFailure('Email ou mot de passe incorrect'))
        return
      }
      const row = users[0]
      const userRow = { id: row.id, email: row.email, name: row.name }
      const fakeToken = btoa(
        JSON.stringify({
          userId: userRow.id,
          email: userRow.email,
          role: 'admin',
          exp: Date.now() + 3600000,
        }),
      )
      dispatch(loginSuccess({ user: userRow, token: fakeToken }))
    } catch (err) {
      dispatch(loginFailure(loginApiErrorMessage(err)))
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card style={{ maxWidth: 400, width: '100%' }}>
        <Card.Body>
          <Card.Title className="text-center" style={{ color: '#1B8C3E' }}>
            TaskFlow
          </Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" className="w-100" disabled={loading} variant="success">
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}
