import { useState } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { loginRequest } from '../api/auth'
import { getToken, setToken } from '../utils/storage'
import { fieldErrors, topMessage } from '../utils/apiErrors'
import { FieldHint } from '../components/FieldHint'
import { FlashAlert } from '../components/FlashAlert'

export default function Login() {
  const nav = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('demo@example.com')
  const [password, setPassword] = useState('password')
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')
  const [errors, setErrors] = useState({})

  if (getToken()) {
    return <Navigate to="/" replace />
  }

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setFormError('')
    setErrors({})
    try {
      const { data } = await loginRequest(email, password)
      const inner = data?.data
      const token =
        (typeof inner === 'object' && inner != null
          ? inner.token ?? inner.access_token ?? inner.accessToken
          : null) ??
        (typeof inner === 'string' ? inner : null) ??
        data?.token ??
        data?.access_token
      if (!token) {
        setFormError('No token in response')
        return
      }
      setToken(token)
      nav(from, { replace: true })
    } catch (err) {
      const fe = fieldErrors(err)
      if (fe) setErrors(fe)
      else setFormError(topMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-page min-vh-100 d-flex align-items-center py-4">
      <div className="container" style={{ maxWidth: 440 }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex rounded-3 bg-white shadow-sm p-3 mb-3">
            <i className="bi bi-box-seam text-primary display-6" aria-hidden />
          </div>
          <p className="text-secondary mb-0 small">Sign in to manage your catalog</p>
        </div>

        <div className="card login-card">
          <div className="card-header-custom">
            <h1 className="h4 mb-1 fw-semibold">Welcome back</h1>
            <p className="lead-in mb-0">Use your work email and password</p>
          </div>
          <div className="card-body">
            {formError && <FlashAlert type="danger" message={formError} />}
            <form onSubmit={onSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fw-medium" htmlFor="email">
                  Email
                </label>
                <div className="input-group">
                  <span className="input-group-text border-end-0 bg-white">
                    <i className="bi bi-envelope text-secondary" aria-hidden />
                  </span>
                  <input
                    id="email"
                    type="email"
                    className={`form-control border-start-0${errors.email ? ' is-invalid' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
                <FieldHint message={errors.email} />
              </div>
              <div className="mb-4">
                <label className="form-label fw-medium" htmlFor="password">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text border-end-0 bg-white">
                    <i className="bi bi-lock text-secondary" aria-hidden />
                  </span>
                  <input
                    id="password"
                    type="password"
                    className={`form-control border-start-0${errors.password ? ' is-invalid' : ''}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
                <FieldHint message={errors.password} />
              </div>
              <button type="submit" className="btn btn-primary w-100 py-2" disabled={busy}>
                {busy ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Signing in…
                  </>
                ) : (
                  <>
                    <i className="bi bi-arrow-right-circle me-2" aria-hidden />
                    Sign in
                  </>
                )}
              </button>
            </form>
            <div className="rounded-3 bg-light p-3 mt-4 small text-secondary">
              <i className="bi bi-info-circle me-1" aria-hidden />
              Demo: <span className="text-dark">demo@example.com</span> /{' '}
              <span className="text-dark">password</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
