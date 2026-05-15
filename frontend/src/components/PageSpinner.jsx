export function PageSpinner({ label = 'Loading…' }) {
  return (
    <div className="app-surface-lg py-5 my-2">
      <div className="text-center text-secondary">
        <div className="spinner-border text-primary mb-3" role="status" />
        <div>{label}</div>
      </div>
    </div>
  )
}
