export function fieldErrors(err) {
  const errors = err.response?.data?.data?.errors
  if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
    return errors
  }
  return null
}

export function topMessage(err) {
  return err.response?.data?.message || err.message || 'Something went wrong'
}
