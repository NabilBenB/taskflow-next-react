import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, Card, CardContent, TextField, Button, Typography, Alert } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import api from '../../api/axios'
import type { AppDispatch, RootState } from '../../store'
import { loginStart, loginSuccess, loginFailure } from './authSlice'
import { loginApiErrorMessage } from './loginApiErrorMessage'

export default function LoginMUI() {
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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        bgcolor: '#f0f0f0',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4 }}>
          <Typography variant="h4" align="center" sx={{ color: '#1B8C3E', fontWeight: 700 }}>
            TaskFlow
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            Connectez-vous pour continuer
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ bgcolor: '#1B8C3E', '&:hover': { bgcolor: '#157a33' } }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
