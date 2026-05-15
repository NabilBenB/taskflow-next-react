import { isAxiosError } from 'axios'

export function loginApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return "La requête a expiré. Vérifiez que l'API répond (npm run api, port 4000)."
    }
    if (!error.response) {
      return "Impossible de joindre l'API. Dans un autre terminal : npm run api"
    }
  }
  return 'Erreur serveur'
}
