import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

// Placeholder image for items without one
const PLACEHOLDER =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'

function Menu() {

  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [addedItems, setAddedItems] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, itemRes] = await Promise.all([
          api.get('/menu/categories/'),
          api.get('/menu/'),
        ])
        setCategories(catRes.data)
        setItems(itemRes.data)
      } catch (err) {
        console.error('Failed to fetch menu:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredItems = activeCategory
    ? items.filter((item) => item.category === activeCategory)
    : items

  const handleAddToCart = async (item) => {
    try {
      console.log('Sending menu_item:', item.id)
      await api.post('/cart/', { menu_item: item.id, quantity: 1 })
      setAddedItems((prev) => ({ ...prev, [item.id]: true }))
      setTimeout(() => {
        setAddedItems((prev) => ({ ...prev, [item.id]: false }))
      }, 1500)
    } catch (err) {
      console.error('Add to cart failed:', err)
    }
  }

  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId)
    return cat?.name || 'Uncategorized'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted text-sm">Loading menu…</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-4xl text-gold italic mb-2">Our Menu</h1>
        <p className="text-text-secondary text-sm">
          Crafted with heritage spices and seasonal produce.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActiveCategory(null)}
          className={`text-xs tracking-wide px-4 py-2 rounded-full border transition-colors ${
            activeCategory === null
              ? 'bg-gold text-gold-text border-gold'
              : 'bg-transparent text-text-secondary border-dark-border hover:border-gold/40 hover:text-gold'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`text-xs tracking-wide px-4 py-2 rounded-full border transition-colors ${
              activeCategory === cat.id
                ? 'bg-gold text-gold-text border-gold'
                : 'bg-transparent text-text-secondary border-dark-border hover:border-gold/40 hover:text-gold'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-dark-card border border-dark-border rounded-lg overflow-hidden flex flex-col"
          >
            {/* Image */}
            <div className="h-48 overflow-hidden">
              <img
                src={item.image || PLACEHOLDER}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              {/* Category tag */}
              <span className="text-[10px] tracking-widest uppercase text-teal-light mb-2">
                {getCategoryName(item.category)}
              </span>

              <h3 className="text-text-primary font-medium text-lg mb-1">
                {item.title}
              </h3>

              <p className="text-text-muted text-sm leading-relaxed mb-4 flex-1">
                {item.description}
              </p>

              {/* Price + Add to Cart */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-dark-border">
                <span className="text-gold font-display text-xl">
                  ₹{item.price}
                </span>
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={addedItems[item.id]}
                  className={`text-xs tracking-wide font-medium px-4 py-2 rounded-md transition-colors ${
                    addedItems[item.id]
                      ? 'bg-teal text-gold border border-teal'
                      : 'bg-gold text-gold-text hover:bg-gold-dark'
                  }`}
                >
                  {addedItems[item.id] ? '✓ Added' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredItems.length === 0 && (
        <div className="text-center py-20">
          <p className="text-text-muted text-sm">No items in this category yet.</p>
        </div>
      )}
    </div>
  )
}

export default Menu
