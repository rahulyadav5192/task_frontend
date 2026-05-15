export function FlashAlert({ type, message, onClose }) {
  if (!message) return null
  const edge =
    type === 'success'
      ? 'success'
      : type === 'danger'
        ? 'danger'
        : type === 'warning'
          ? 'warning'
          : 'primary'
  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show border-0 border-start border-4 border-${edge} shadow-sm`}
      role="alert"
    >
      {message}
      {onClose && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        />
      )}
    </div>
  )
}
