import React from 'react'
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) {
  if (!isOpen) return null

  // Calculate total price
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  // Format price in Indian Rupees
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.drawer} className="glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <ShoppingBag size={18} style={styles.headerIcon} />
            <h3 style={styles.title}>SHOPPING BAG ({cartItems.length})</h3>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* Cart items list */}
        <div style={styles.itemsContainer}>
          {cartItems.length === 0 ? (
            <div style={styles.emptyState}>
              <ShoppingBag size={48} style={styles.emptyIcon} />
              <p style={styles.emptyText}>Your shopping bag is empty.</p>
              <button onClick={onClose} className="btn-outline" style={styles.continueBtn}>
                Continue Browsing
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={`${item.id}-${item.customMetal}-${item.customSize}-${index}`} style={styles.itemRow}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={styles.itemImage}
                  onError={(e) => {
                    e.target.src = '/assets/placeholder_jewel.png'
                  }}
                />
                <div style={styles.itemDetails}>
                  <h4 style={styles.itemName}>{item.name}</h4>
                  <span style={styles.itemMeta}>
                    {item.customMetal || item.category} / {item.customSize || '7'}
                  </span>
                  <div style={styles.itemQuantityRow}>
                    <div style={styles.quantityControls}>
                      <button
                        onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                        style={styles.quantityBtn}
                      >
                        <Minus size={10} />
                      </button>
                      <span style={styles.quantityVal}>{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                        style={styles.quantityBtn}
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                    <button onClick={() => onRemoveItem(item)} style={styles.removeBtn}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div style={styles.itemPrice}>
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.subtotalRow}>
              <span style={styles.subtotalLabel}>Subtotal</span>
              <span style={styles.subtotalVal}>{formatPrice(subtotal)}</span>
            </div>
            <p style={styles.taxNotice}>Duties and taxes calculated at checkout. Shipping is complimentary.</p>
            <button
              onClick={() => {
                onCheckout()
                onClose()
              }}
              className="btn-gold"
              style={styles.checkoutBtn}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 150,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  drawer: {
    width: '100%',
    maxWidth: '440px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
    borderLeft: '1px solid var(--border-gold)',
    backgroundColor: '#0a0a0c',
    animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 30px',
    borderBottom: '1px solid var(--border-muted)',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  headerIcon: {
    color: 'var(--gold-primary)',
  },
  title: {
    fontSize: '0.8rem',
    fontWeight: '600',
    letterSpacing: '0.15em',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '4px',
    transition: 'var(--transition-fast)',
  },
  itemsContainer: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '30px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60%',
    textAlign: 'center',
  },
  emptyIcon: {
    color: 'var(--text-muted)',
    marginBottom: '20px',
  },
  emptyText: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginBottom: '30px',
  },
  continueBtn: {
    fontSize: '0.7rem',
    padding: '10px 20px',
  },
  itemRow: {
    display: 'flex',
    gap: '16px',
    paddingBottom: '20px',
    marginBottom: '20px',
    borderBottom: '1px solid var(--border-muted)',
    alignItems: 'center',
  },
  itemImage: {
    width: '72px',
    height: '72px',
    objectFit: 'cover',
    borderRadius: '2px',
    backgroundColor: '#0d0d0f',
  },
  itemDetails: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  itemName: {
    fontSize: '0.85rem',
    fontFamily: 'var(--font-serif)',
    color: 'var(--text-primary)',
    fontWeight: '400',
  },
  itemMeta: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
  },
  itemQuantityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '6px',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--border-muted)',
    borderRadius: '2px',
  },
  quantityBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    padding: '6px 8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityVal: {
    fontSize: '0.7rem',
    color: 'var(--text-primary)',
    padding: '0 6px',
    minWidth: '16px',
    textAlign: 'center',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
    transition: 'var(--transition-fast)',
    display: 'flex',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    fontWeight: '500',
    fontFamily: 'var(--font-sans)',
  },
  footer: {
    padding: '30px',
    borderTop: '1px solid var(--border-muted)',
    backgroundColor: '#0c0c0e',
  },
  subtotalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  subtotalLabel: {
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'var(--text-secondary)',
  },
  subtotalVal: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  taxNotice: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    lineHeight: '1.4',
    marginBottom: '20px',
  },
  checkoutBtn: {
    width: '100%',
    textAlign: 'center',
    padding: '14px',
  },
}
