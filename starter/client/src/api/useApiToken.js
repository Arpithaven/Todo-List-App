// src/api/useApiToken.js
import { useAuth0 } from '@auth0/auth0-react'

export function useApiToken() {
  const { getAccessTokenSilently } = useAuth0()

  const getToken = async () => {
    try {
      const token = await getAccessTokenSilently()
      return token
    } catch (err) {
      console.error('Failed to get API token', err)
      throw err
    }
  }

  return { getToken }
}
