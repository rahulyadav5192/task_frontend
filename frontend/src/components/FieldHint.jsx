export function FieldHint({ message }) {
  if (!message) return null
  return <div className="invalid-feedback d-block">{message}</div>
}
