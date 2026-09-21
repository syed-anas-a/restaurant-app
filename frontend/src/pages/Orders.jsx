import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const STATUS_STYLES = {
  'PLACED':           { bg: 'bg-gold/10',    border: 'border-gold/30',     text: 'text-gold',      label: 'Placed' },
  'PREPARING':        { bg: 'bg-gold/20',    border: 'border-gold/40',     text: 'text-gold-dark',  label: 'Preparing' },
  'OUT FOR DELIVERY': { bg: 'bg-teal/20',    border: 'border-teal',        text: 'text-teal-accent', label: 'Out for Delivery' },
  'DELIVERED':        { bg: 'bg-teal/30',    border: 'border-teal',        text: 'text-green-400', label: 'Delivered' },
  'CANCELLED':        { bg: 'bg-dark-card',  border: 'border-dark-border', text: 'text-text-muted', label: 'Cancelled' },
}

function Orders() {
  const [orders, setOrders] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/')
        setOrders(res.data)
      } catch (err) {
        console.error('Failed to load orders:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const toggle = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted text-sm">Loading orders…</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-gold italic mb-3">No Orders Yet</h1>
        <p className="text-text-muted text-sm mb-8">
          Once you place an order, it will appear here.
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

  console.log('orders:', orders)

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-gold italic mb-10">Your Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const style = STATUS_STYLES[order.status] || STATUS_STYLES['FAILED']
          const isExpanded = expandedId === order.id

          return (
            <div
              key={order.id}
              className="bg-dark-card border border-dark-border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggle(order.id)}
                className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-dark-light/50 transition-colors"
              >
                <span className="text-text-muted text-sm w-20 shrink-0">
                  #{String(order.id).padStart(4, '0')}
                </span>

                <span
                  className={`text-[11px] tracking-wide px-3 py-0.5 rounded-full border ${style.bg} ${style.border} ${style.text}`}
                >
                  {style.label}
                </span>

                <span className="flex-1" />

                <span className="text-gold font-display text-lg">
                  ₹{order.order_value}
                </span>

                <span
                  className={`text-text-muted text-sm transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                >
                  ▾
                </span>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-dark-border">
                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-text-secondary">
                          {item.menu_item.title} × {item.quantity}
                        </span>
                        <span className="text-text-primary">₹{item.price}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm pt-2 border-t border-dark-border">
                      <span className="text-text-secondary">Total</span>
                      <span className="text-gold font-medium">₹{order.order_value}</span>
                    </div>
                  </div>

                  {(order.status === 'PLACED' || order.status === 'PREPARING') && (
                    <p className="text-gold/60 text-xs mt-4 italic">
                      Your order is being prepared.
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Orders