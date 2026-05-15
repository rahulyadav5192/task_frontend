import { Link, Outlet, useNavigate } from 'react-router-dom'
import { clearToken } from '../utils/storage'

export function MainLayout() {
  const nav = useNavigate()

  function logout() {
    clearToken()
    nav('/login', { replace: true })
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      <nav className="navbar navbar-expand-md navbar-dark app-navbar">
        <div className="container app-main">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <span className="rounded-2 bg-white bg-opacity-10 p-1 d-inline-flex">
              <i className="bi bi-box-seam fs-5" aria-hidden />
            </span>
            <span>Product admin</span>
          </Link>
          <div className="navbar-nav ms-auto align-items-center gap-1 flex-row">
            <Link className="nav-link text-white-50 d-flex align-items-center gap-1" to="/">
              <i className="bi bi-grid-3x2-gap" aria-hidden />
              <span className="d-none d-sm-inline">Catalog</span>
            </Link>
            <Link className="nav-link text-white-50 d-flex align-items-center gap-1" to="/products/new">
              <i className="bi bi-plus-lg" aria-hidden />
              <span className="d-none d-sm-inline">Add</span>
            </Link>
            <button
              type="button"
              className="btn btn-sm btn-light ms-1 ms-md-2"
              onClick={logout}
            >
              <i className="bi bi-box-arrow-right me-1" aria-hidden />
              Log out
            </button>
          </div>
        </div>
      </nav>
      <main className="container app-main py-4 py-md-5 flex-grow-1">
        <Outlet />
      </main>
      <footer className="border-top border-light bg-white bg-opacity-75 py-3 mt-auto">
        <div className="container app-main small text-secondary text-center">
          Product management
        </div>
      </footer>
    </div>
  )
}
