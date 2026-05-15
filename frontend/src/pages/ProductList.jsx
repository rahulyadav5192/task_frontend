import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, removeProduct } from '../api/products'
import { topMessage } from '../utils/apiErrors'
import { FlashAlert } from '../components/FlashAlert'
import { PageSpinner } from '../components/PageSpinner'
import { PaginationBar } from '../components/PaginationBar'
import { ConfirmModal } from '../components/ConfirmModal'

const limit = 10

export default function ProductList() {
  const [q, setQ] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [refetchTick, setRefetchTick] = useState(0)

  const [delId, setDelId] = useState(null)
  const [delBusy, setDelBusy] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(q.trim())
      setPage(1)
    }, 400)
    return () => clearTimeout(t)
  }, [q])

  useEffect(() => {
    let ignore = false
    const raf = requestAnimationFrame(() => {
      setLoading(true)
      setError('')
      getProducts({ page, limit, search: search || undefined })
        .then(({ data }) => {
          if (ignore) return
          const block = data?.data
          setItems(block?.items ?? [])
          setTotal(block?.total ?? 0)
        })
        .catch((err) => {
          if (ignore) return
          setError(topMessage(err))
          setItems([])
          setTotal(0)
        })
        .finally(() => {
          if (!ignore) setLoading(false)
        })
    })
    return () => {
      cancelAnimationFrame(raf)
      ignore = true
    }
  }, [page, search, refetchTick])

  async function confirmDelete() {
    if (!delId) return
    setDelBusy(true)
    try {
      await removeProduct(delId)
      setToast('Product deleted')
      setDelId(null)
      setRefetchTick((n) => n + 1)
    } catch (err) {
      setToast(topMessage(err))
    } finally {
      setDelBusy(false)
    }
  }

  return (
    <div>
      <div className="app-surface-lg p-3 p-md-4 mb-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <h1 className="app-page-title h3 mb-1">Products</h1>
            <p className="text-secondary small mb-0">
              Search, edit, or remove items from your catalog
            </p>
          </div>
          <Link to="/products/new" className="btn btn-primary d-inline-flex align-items-center gap-2">
            <i className="bi bi-plus-lg" aria-hidden />
            Add product
          </Link>
        </div>
      </div>

      {toast && (
        <FlashAlert
          type={toast.includes('deleted') ? 'success' : 'danger'}
          message={toast}
          onClose={() => setToast('')}
        />
      )}

      <div className="search-wrap mb-4">
        <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden">
          <span className="input-group-text border-end-0">
            <i className="bi bi-search" aria-hidden />
          </span>
          <input
            type="search"
            className="form-control border-start-0"
            placeholder="Search by name…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search products"
          />
        </div>
      </div>

      {error && <FlashAlert type="danger" message={error} />}

      {loading && <PageSpinner />}

      {!loading && !error && items.length === 0 && (
        <div className="empty-state text-center">
          <i className="bi bi-inbox display-4 text-secondary d-block mb-3 opacity-50" aria-hidden />
          <p className="fw-medium text-secondary mb-1">No products found</p>
          <p className="small text-secondary mb-0">Try another search or add a new product.</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <>
          <div className="d-none d-md-block app-surface-lg overflow-hidden">
            <div className="table-responsive">
              <table className="table app-table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th className="ps-4">Product</th>
                    <th className="text-end">Price</th>
                    <th className="text-end">Stock</th>
                    <th className="text-end pe-4" style={{ width: 200 }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.id}>
                      <td className="ps-4">
                        <div className="fw-medium">{p.name}</div>
                        {p.description && (
                          <div
                            className="small text-secondary text-truncate mt-1"
                            style={{ maxWidth: 380 }}
                          >
                            {p.description}
                          </div>
                        )}
                      </td>
                      <td className="text-end app-price">{formatMoney(p.price)}</td>
                      <td className="text-end">
                        <span className="badge rounded-pill bg-light text-dark border px-2 py-1 fw-normal">
                          {p.stock ?? '—'}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <Link
                          to={`/products/${p.id}/edit`}
                          className="btn btn-sm btn-outline-primary me-1"
                        >
                          <i className="bi bi-pencil me-1" aria-hidden />
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setDelId(p.id)}
                        >
                          <i className="bi bi-trash3 me-1" aria-hidden />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-md-none vstack gap-3">
            {items.map((p) => (
              <div key={p.id} className="app-surface p-3">
                <div className="fw-semibold mb-1">{p.name}</div>
                {p.description && (
                  <div className="small text-secondary mb-2">{p.description}</div>
                )}
                <div className="d-flex flex-wrap align-items-center gap-2 small text-secondary mb-3">
                  <span className="app-price text-dark">{formatMoney(p.price)}</span>
                  <span className="text-muted">·</span>
                  <span>
                    Stock{' '}
                    <span className="badge rounded-pill bg-light text-dark border">
                      {p.stock ?? '—'}
                    </span>
                  </span>
                </div>
                <div className="d-flex gap-2">
                  <Link
                    to={`/products/${p.id}/edit`}
                    className="btn btn-sm btn-outline-primary flex-grow-1"
                  >
                    <i className="bi bi-pencil me-1" aria-hidden />
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger flex-grow-1"
                    onClick={() => setDelId(p.id)}
                  >
                    <i className="bi bi-trash3 me-1" aria-hidden />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <PaginationBar page={page} limit={limit} total={total} onPageChange={setPage} />
        </>
      )}

      <ConfirmModal
        open={delId != null}
        title="Delete product"
        body="This cannot be undone. Continue?"
        busy={delBusy}
        onCancel={() => !delBusy && setDelId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

function formatMoney(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return value ?? '—'
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}
