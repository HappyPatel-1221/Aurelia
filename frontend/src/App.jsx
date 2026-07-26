import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import ProductModal from './components/ProductModal'
import Storefront from './views/Storefront'
import CustomerPanel from './views/CustomerPanel'
import OwnerAdmin from './views/OwnerAdmin'
import DeliveryAdmin from './views/DeliveryAdmin'

export default function App() {
  const [role, setRole] = useState('storefront') // storefront, customer, owner, delivery
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  
  // Load data on mount
  useEffect(() => {
    fetchProducts()
    fetchOrders()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
    }
  }

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data)
    } catch (err) {
      console.error('Error fetching orders:', err)
    }
  }

  // Cart operations
  const handleAddToCart = (item) => {
    setCart((prevCart) => {
      // Find if item with same custom options already in cart
      const existingIdx = prevCart.findIndex(
        (i) => i.id === item.id && 
               i.customMetal === item.customMetal && 
               i.customSize === item.customSize
      )

      if (existingIdx > -1) {
        const newCart = [...prevCart]
        newCart[existingIdx].quantity += 1
        return newCart
      } else {
        return [...prevCart, { ...item, quantity: 1 }]
      }
    })
    setIsCartOpen(true)
  }

  const handleUpdateCartQuantity = (item, quantity) => {
    if (quantity <= 0) {
      handleRemoveCartItem(item)
      return
    }
    setCart((prevCart) =>
      prevCart.map((i) =>
        i.id === item.id &&
        i.customMetal === item.customMetal &&
        i.customSize === item.customSize
          ? { ...i, quantity }
          : i
      )
    )
  }

  const handleRemoveCartItem = (item) => {
    setCart((prevCart) =>
      prevCart.filter(
        (i) =>
          !(i.id === item.id &&
            i.customMetal === item.customMetal &&
            i.customSize === item.customSize)
      )
    )
  }

  const handleClearCart = () => {
    setCart([])
  }

  // Place order API integration
  const handleCreateOrder = async (orderPayload) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      })
      const newOrder = await res.json()
      
      // Refresh local databases
      fetchOrders()
      fetchProducts()
      return newOrder
    } catch (err) {
      console.error('Error placing order:', err)
    }
  }

  // Update order status API integration (Owner/Rider)
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      // Refresh orders
      fetchOrders()
    } catch (err) {
      console.error('Error updating order status:', err)
    }
  }

  // Update product stock (Owner Admin)
  const handleUpdateProduct = async (prodId, payload) => {
    try {
      const res = await fetch(`/api/products/${prodId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      // Refresh products list
      fetchProducts()
    } catch (err) {
      console.error('Error updating product:', err)
    }
  }

  // Add new product (Owner Admin)
  const handleAddProduct = async (productPayload) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload)
      })
      
      // Refresh catalog
      fetchProducts()
    } catch (err) {
      console.error('Error listing product:', err)
    }
  }

  // Reset demo databases
  const handleResetDemo = async () => {
    try {
      await fetch('/api/reset', { method: 'POST' })
      fetchProducts()
      fetchOrders()
      setCart([])
      alert('Demo database reset to default castings and active routes.')
    } catch (err) {
      console.error('Error resetting database:', err)
    }
  }

  // Get total cart items count
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div style={styles.app}>
      {/* Dynamic Header */}
      <Header
        currentRole={role}
        setRole={setRole}
        cartCount={cartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        onResetDemo={handleResetDemo}
      />

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        {role === 'storefront' && (
          <Storefront
            products={products}
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {role === 'customer' && (
          <CustomerPanel
            cartItems={cart}
            orders={orders}
            onCreateOrder={handleCreateOrder}
            onClearCart={handleClearCart}
            setRole={setRole}
          />
        )}

        {role === 'owner' && (
          <OwnerAdmin
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {role === 'delivery' && (
          <DeliveryAdmin
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => setRole('customer')}
      />

      {/* Quick View Product Modal */}
      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  )
}

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary)',
  },
  mainContent: {
    flexGrow: 1,
  },
}
