import React from 'react'
import { Plus, Eye } from 'lucide-react'

export default function ProductCard({ product, onAddToCart, onQuickView }) {
  // Utility to format price in Indian Rupees
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const isLowStock = product.stock <= 3 && product.stock > 0
  const isOutOfStock = product.stock === 0

  return (
    <div style={styles.card} className="glass-card-gold animate-fade-in-up">
      {/* Product Image Section */}
      <div style={styles.imageContainer} onClick={() => onQuickView(product)}>
        <img
          src={product.image}
          alt={product.name}
          style={styles.image}
          onError={(e) => {
            e.target.src = '/assets/placeholder_jewel.png'
          }}
        />
        {product.tag && <div style={styles.tagBadge}>{product.tag}</div>}
        {isLowStock && <div style={styles.stockBadge}>ONLY {product.stock} LEFT</div>}
        {isOutOfStock && <div style={styles.outBadge}>OUT OF CAST</div>}
        
        {/* Hover Overlay */}
        <div style={styles.hoverOverlay} className="overlay-actions">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onQuickView(product)
            }}
            style={styles.overlayButton}
            title="Quick View"
          >
            <Eye size={16} />
            <span>QUICK VIEW</span>
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div style={styles.details}>
        <div style={styles.categoryRow}>
          <span style={styles.category}>{product.category}</span>
          <span style={styles.material}>{product.material}</span>
        </div>
        
        <h3 style={styles.title} onClick={() => onQuickView(product)}>
          {product.name}
        </h3>
        
        <div style={styles.footerRow}>
          <span style={styles.price}>{formatPrice(product.price)}</span>
          <button
            onClick={() => !isOutOfStock && onAddToCart(product)}
            disabled={isOutOfStock}
            style={{
              ...styles.addButton,
              ...(isOutOfStock ? styles.disabledButton : {})
            }}
            className={isOutOfStock ? "" : "btn-gold"}
          >
            {isOutOfStock ? 'SOLD OUT' : 'ADD TO BAG'}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    height: '100%',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    paddingTop: '100%', /* 1:1 Aspect Ratio */
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: '#0d0d0f',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  tagBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: '#070708',
    color: 'var(--gold-primary)',
    border: '1px solid var(--border-gold)',
    padding: '4px 8px',
    fontSize: '0.55rem',
    fontWeight: '600',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    borderRadius: '2px',
  },
  stockBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#8c2d2d',
    color: '#fff',
    padding: '4px 8px',
    fontSize: '0.55rem',
    fontWeight: '700',
    letterSpacing: '0.1em',
    borderRadius: '2px',
  },
  outBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#333333',
    color: '#999999',
    padding: '4px 8px',
    fontSize: '0.55rem',
    fontWeight: '700',
    letterSpacing: '0.1em',
    borderRadius: '2px',
  },
  hoverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(7, 7, 8, 0.4)',
    opacity: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'opacity 0.4s ease',
  },
  overlayButton: {
    backgroundColor: 'var(--bg-glass)',
    backdropFilter: 'blur(8px)',
    border: '1px solid var(--border-gold)',
    color: 'var(--text-primary)',
    padding: '10px 20px',
    fontSize: '0.65rem',
    fontWeight: '600',
    letterSpacing: '0.15em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '2px',
    transition: 'var(--transition-smooth)',
  },
  details: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    backgroundColor: 'rgba(14,14,16,0.3)',
  },
  categoryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  category: {
    fontSize: '0.6rem',
    color: 'var(--gold-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    fontWeight: '600',
  },
  material: {
    fontSize: '0.6rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.05em',
  },
  title: {
    fontSize: '1.1rem',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    marginBottom: '16px',
    transition: 'color 0.2s ease',
    fontFamily: 'var(--font-serif)',
  },
  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  price: {
    fontSize: '1rem',
    color: 'var(--text-primary)',
    fontWeight: '500',
    fontFamily: 'var(--font-sans)',
  },
  addButton: {
    padding: '8px 16px',
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    cursor: 'pointer',
  },
  disabledButton: {
    backgroundColor: '#222224',
    border: '1px solid #333336',
    color: '#555558',
    cursor: 'not-allowed',
  }
}
