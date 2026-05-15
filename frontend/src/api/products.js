import { client } from './client'

export function getProducts(params) {
  return client.get('/api/products', { params })
}

export function getProduct(id) {
  return client.get(`/api/products/${id}`)
}

export function createProduct(payload) {
  return client.post('/api/products', payload)
}

export function updateProduct(id, payload) {
  return client.put(`/api/products/${id}`, payload)
}

export function removeProduct(id) {
  return client.delete(`/api/products/${id}`)
}
