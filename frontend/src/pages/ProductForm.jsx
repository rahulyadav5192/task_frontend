import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { createProduct, getProduct, updateProduct } from '../api/products'
import { fieldErrors, topMessage } from '../utils/apiErrors'
import { FieldHint } from '../components/FieldHint'
import { FlashAlert } from '../components/FlashAlert'
import { PageSpinner } from '../components/PageSpinner'

const empty = {
  name: '',
  description: '',
  price: '',
  stock: '',
}

export default function ProductForm() {
  const { id } = useParams()
  const editMode = Boolean(id)

  const [values, setValues] = useState(empty)
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(editMode)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [banner, setBanner] = useState({ type: '', text: '' })

  useEffect(() => {
    if (!editMode) return undefined
    let ignore = false
    const raf = requestAnimationFrame(() => {
      setLoading(true)
      setLoadError('')
      getProduct(id)
        .then(({ data }) => {
          if (ignore) return
          const p = data?.data?.item ?? data?.data
          if (!p) {
            setLoadError('Product not found')
            return
          }
          setValues({
            name: p.name ?? '',
            description: p.description ?? '',
            price: p.price != null ? String(p.price) : '',
            stock: p.stock != null ? String(p.stock) : '',
          })
        })
        .catch((err) => {
          if (!ignore) setLoadError(topMessage(err))
        })
        .finally(() => {
          if (!ignore) setLoading(false)
        })
    })
    return () => {
      cancelAnimationFrame(raf)
      ignore = true
    }
  }, [editMode, id])

  function setField(key, v) {
    setValues((prev) => ({ ...prev, [key]: v }))
  }

  function clientErrors() {
    const e = {}
    if (!values.name.trim()) e.name = 'Name is required'
    if (values.price === '' || Number.isNaN(Number(values.price))) {
      e.price = 'Valid price is required'
    }
    if (values.stock === '' || Number.isNaN(Number(values.stock))) {
      e.stock = 'Valid stock is required'
    }
    return e
  }

  async function onSubmit(e) {
    e.preventDefault()
    setBanner({ type: '', text: '' })
    const ce = clientErrors()
    if (Object.keys(ce).length) {
      setErrors(ce)
      return
    }
    setErrors({})
    setSaving(true)
    const payload = {
      name: values.name.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      stock: Number(values.stock),
    }
    try {
      if (editMode) {
        await updateProduct(id, payload)
        setBanner({ type: 'success', text: 'Product updated' })
      } else {
        await createProduct(payload)
        setBanner({ type: 'success', text: 'Product created' })
        setValues(empty)
      }
    } catch (err) {
      const fe = fieldErrors(err)
      if (fe) {
        setErrors(fe)
      } else {
        setBanner({ type: 'danger', text: topMessage(err) })
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <PageSpinner label="Loading product…" />
  }

  if (editMode && loadError) {
    return (
      <div className="app-surface-lg p-4 text-center">
        <FlashAlert type="danger" message={loadError} />
        <Link to="/" className="btn btn-primary mt-2">
          <i className="bi bi-arrow-left me-2" aria-hidden />
          Back to list
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="app-page-title h3 mb-1">
            {editMode ? (
              <>
                <i className="bi bi-pencil-square me-2 text-primary" aria-hidden />
                Edit product
              </>
            ) : (
              <>
                <i className="bi bi-plus-square me-2 text-primary" aria-hidden />
                New product
              </>
            )}
          </h1>
          <p className="text-secondary small mb-0">
            {editMode ? 'Update details and save when you are done.' : 'Fill in the fields below.'}
          </p>
        </div>
        <Link to="/" className="btn btn-outline-secondary align-self-start">
          <i className="bi bi-x-lg me-1" aria-hidden />
          Cancel
        </Link>
      </div>

      {banner.text && (
        <FlashAlert
          type={banner.type}
          message={banner.text}
          onClose={() => setBanner({ type: '', text: '' })}
        />
      )}

      <form onSubmit={onSubmit} className="app-surface-lg overflow-hidden" noValidate>
        <div className="border-bottom bg-light bg-opacity-50 px-4 py-3">
          <span className="small fw-semibold text-secondary text-uppercase" style={{ letterSpacing: '0.06em' }}>
            Details
          </span>
        </div>
        <div className="p-4">
          <div className="mb-3">
            <label className="form-label fw-medium" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className={`form-control${errors.name ? ' is-invalid' : ''}`}
              value={values.name}
              onChange={(e) => setField('name', e.target.value)}
            />
            <FieldHint message={errors.name} />
          </div>
          <div className="mb-3">
            <label className="form-label fw-medium" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className={`form-control${errors.description ? ' is-invalid' : ''}`}
              value={values.description}
              onChange={(e) => setField('description', e.target.value)}
            />
            <FieldHint message={errors.description} />
          </div>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-medium" htmlFor="price">
                Price
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className={`form-control${errors.price ? ' is-invalid' : ''}`}
                  value={values.price}
                  onChange={(e) => setField('price', e.target.value)}
                />
              </div>
              <FieldHint message={errors.price} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium" htmlFor="stock">
                Stock
              </label>
              <input
                id="stock"
                type="number"
                step="1"
                min="0"
                className={`form-control${errors.stock ? ' is-invalid' : ''}`}
                value={values.stock}
                onChange={(e) => setField('stock', e.target.value)}
              />
              <FieldHint message={errors.stock} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-top d-flex flex-wrap gap-2">
            <button type="submit" className="btn btn-primary px-4" disabled={saving}>
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Saving…
                </>
              ) : (
                <>
                  <i className="bi bi-check2 me-2" aria-hidden />
                  {editMode ? 'Save changes' : 'Create product'}
                </>
              )}
            </button>
            <Link to="/" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-2" aria-hidden />
              Back to list
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
