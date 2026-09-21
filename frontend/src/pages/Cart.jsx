import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Cart() {

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [placingOrder, setPlacingOrder] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/cart/")
        const data = Array.isArray(res.data) ? res.data : []
        setItems(data)
      } catch(error) {
        console.error('Failed to fetch cart:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [])

  const cartTotal = items.reduce((sum, item) => sum + parseFloat(item.price), 0)

  const updateQuantity = async (itemId, delta) => {
    const item = items.find((i) => i.id === itemId)
    const newQty = item.quantity + delta

    if (newQty < 1) {
      removeItem(itemId)
      return
    }

    try {
        await api.put(`/cart/items/${itemId}/`, { quantity: newQty })
        // Refetch cart to get updated prices from backend
        const res = await api.get('/cart/')
        setItems(res.data)
    } catch (err) {
      console.error('Update quantity failed:', err)
    }
  }

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/items/${itemId}/`)
      setItems((prev) => prev.filter((item) => item.id !== itemId))
    } catch (err) {
      console.error('Remove item failed:', err)
    }
  }

  const placeOrder = async () => {
    setPlacingOrder(true)
    try {
      await api.post('/orders/')
      navigate('/orders')
    } catch (err) {
      console.error('Place order failed:', err)
    } finally {
      setPlacingOrder(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted text-sm">Loading cart…</p>
      </div>
    )
  }

  // ── Empty state ──
  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-gold italic mb-3">Your Cart is Empty</h1>
        <p className="text-text-muted text-sm mb-8">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/menu"
          className="inline-block bg-gold text-gold-text font-medium text-sm tracking-wide px-7 py-3 rounded-md hover:bg-gold-dark transition-colors"
        >
          Browse Menu
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <h1 className="font-display text-4xl text-gold italic mb-10">Your Cart</h1>

      {/* Cart Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-dark-card border border-dark-border rounded-lg px-5 py-4 flex items-center gap-5"
          >
            {/* Item info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-text-primary font-medium truncate">{item.menu_item.title}</h3>
              <p className="text-text-muted text-sm mt-0.5">
                ₹{item.menu_item.price} each
              </p>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(item.id, -1)}
                className="w-8 h-8 rounded-md border border-dark-border text-text-secondary hover:border-gold/40 hover:text-gold transition-colors text-sm"
              >
                −
              </button>
              <span className="text-text-primary text-sm w-6 text-center font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, 1)}
                className="w-8 h-8 rounded-md border border-dark-border text-text-secondary hover:border-gold/40 hover:text-gold transition-colors text-sm"
              >
                +
              </button>
            </div>

            {/* Subtotal */}
            <span className="text-gold font-display text-lg w-24 text-right">
              ₹{item.price}
            </span>

            {/* Remove */}
            <button
              onClick={() => removeItem(item.id)}
              className="text-text-muted hover:text-red-400 transition-colors text-lg ml-2"
              aria-label={`Remove ${item.menu_item.title}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 border-t border-dark-border pt-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-text-secondary text-sm tracking-wide uppercase">Total</span>
          <span className="text-gold font-display text-2xl">₹{cartTotal.toFixed(2)}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/menu"
            className="flex-1 text-center text-sm text-text-secondary border border-dark-border rounded-md py-2.5 hover:border-gold/40 hover:text-gold transition-colors"
          >
            Continue Browsing
          </Link>
          <button
            onClick={placeOrder}
            disabled={placingOrder}
            className="flex-1 bg-teal text-gold font-medium text-sm tracking-wide py-2.5 rounded-md border border-gold/30 hover:bg-teal-accent disabled:opacity-50 transition-colors"
          >
            {placingOrder ? 'Placing Order…' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart
