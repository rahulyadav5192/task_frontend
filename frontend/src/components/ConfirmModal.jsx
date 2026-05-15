export function ConfirmModal({ open, title, body, busy, onCancel, onConfirm }) {
  if (!open) return null

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      style={{ backgroundColor: 'rgba(21, 34, 56, 0.45)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 border-0 shadow-lg">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <span className="text-danger">
                <i className="bi bi-exclamation-triangle-fill" aria-hidden />
              </span>
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              disabled={busy}
              onClick={onCancel}
            />
          </div>
          <div className="modal-body text-secondary pt-2">{body}</div>
          <div className="modal-footer border-0 pt-0">
            <button
              type="button"
              className="btn btn-light border"
              disabled={busy}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger px-3"
              disabled={busy}
              onClick={onConfirm}
            >
              {busy ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Deleting…
                </>
              ) : (
                <>
                  <i className="bi bi-trash3 me-2" aria-hidden />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
