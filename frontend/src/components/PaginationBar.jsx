export function PaginationBar({ page, limit, total, onPageChange }) {
  const last = Math.max(1, Math.ceil(total / limit) || 1)
  const canPrev = page > 1
  const canNext = page < last

  if (total === 0) return null

  return (
    <nav className="app-surface d-flex flex-wrap align-items-center justify-content-between gap-3 mt-4 px-3 py-3">
      <div className="text-secondary small d-flex align-items-center gap-2">
        <i className="bi bi-file-earmark-text" aria-hidden />
        <span>
          Page <strong className="text-dark">{page}</strong> of <strong className="text-dark">{last}</strong>
          <span className="text-muted mx-1">·</span>
          {total} total
        </span>
      </div>
      <div className="btn-group shadow-sm">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
        >
          <i className="bi bi-chevron-left" aria-hidden />
          Prev
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <i className="bi bi-chevron-right" aria-hidden />
        </button>
      </div>
    </nav>
  )
}
