import { client } from './client'

export function loginRequest(email, password) {
  return client.post('/api/login', { email, password })
}
