import React, { useState } from 'react'
import { X, Sparkles, Truck, ShieldCheck, Ruler } from 'lucide-react'

export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null

  const [selectedMetal, setSelectedMetal] = useState(product.category || 'Gold')
  const [selectedSize, setSelectedSize] = useState('7') // ring default
  const [activeTab, setActiveTab] = useState('details')

  // Available metals based on selection
  const metals = ['Gold', 'Platinum', 'Rose Gold']
  
  // Available sizes based on category
  const getSizes = () => {
    if (product.name.toLowerCase().includes('ring') || product.name.toLowerCase().includes('solitaire')) {
      return ['5', '6', '7', '8', '9']
    }
    if (product.name.toLowerCase().includes('bracelet') || product.name.toLowerCase().includes('cuff')) {
      return ['S', 'M', 'L']
    }
    if (product.name.toLowerCase().includes('hoop') || product.name.toLowerCase().includes('studs') || product.name.toLowerCase().includes('earring')) {
      return ['One Size']
    }
    return ['16"', '18"', '20"'] // necklaces
  }

  const sizes = getSizes()

  // Format price in Indian Rupees
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleAdd = () => {
    const customizedItem = {
      ...product,
      customMetal: selectedMetal,
      customSize: selectedSize
    }
    onAddToCart(customizedItem)
    onClose()
  }

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} className="glass-panel animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button onClick={onClose} style={styles.closeButton}>
          <X size={20} />
        </button>

        {/* Modal Grid Layout */}
        <div style={styles.grid}>
          {/* Left Column: Image */}
          <div style={styles.imageColumn}>
            <img
              src={product.image}
              alt={product.name}
              style={styles.image}
              onError={(e) => {
                e.target.src = '/assets/placeholder_jewel.png'
              }}
            />
          </div>

          {/* Right Column: Customization Controls */}
          <div style={styles.detailsColumn}>
            <span style={styles.tag}>{product.tag || 'Handcrafted'}</span>
            <h2 style={styles.title}>{product.name}</h2>
            <div style={styles.price}>{formatPrice(product.price)}</div>
            
            <p style={styles.shortDesc}>{product.description}</p>

            {/* Customizer: Metal Choice */}
            <div style={styles.customizerSection}>
              <span style={styles.customizerLabel}>Metal Selection:</span>
              <div style={styles.optionsGrid}>
                {metals.map((metal) => (
                  <button
                    key={metal}
                    onClick={() => setSelectedMetal(metal)}
                    style={{
                      ...styles.optionButton,
                      ...(selectedMetal === metal ? styles.optionButtonActive : {})
                    }}
                  >
                    {metal}
                  </button>
                ))}
              </div>
            </div>

            {/* Customizer: Size Selection */}
            {sizes[0] !== 'One Size' && (
              <div style={styles.customizerSection}>
                <div style={styles.sizeHeader}>
                  <span style={styles.customizerLabel}>Select Size:</span>
                  <button style={styles.sizeGuideBtn}>
                    <Ruler size={12} />
                    <span>Size Guide</span>
                  </button>
                </div>
                <div style={styles.sizesRow}>
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        ...styles.sizeCircle,
                        ...(selectedSize === size ? styles.sizeCircleActive : {})
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Button */}
            <div style={styles.ctaRow}>
              <button
                onClick={handleAdd}
                disabled={product.stock === 0}
                style={{
                  ...styles.addToBagBtn,
                  ...(product.stock === 0 ? styles.disabledBtn : {})
                }}
                className={product.stock === 0 ? "" : "btn-gold"}
              >
                {product.stock === 0 ? 'SOLD OUT' : 'ADD TO BAG'}
              </button>
            </div>

            {/* Content Tabs (Details, Crafting, Care) */}
            <div style={styles.tabsContainer}>
              <div style={styles.tabsHeader}>
                <button
                  onClick={() => setActiveTab('details')}
                  style={{ ...styles.tabBtn, ...(activeTab === 'details' ? styles.tabBtnActive : {}) }}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('crafting')}
                  style={{ ...styles.tabBtn, ...(activeTab === 'crafting' ? styles.tabBtnActive : {}) }}
                >
                  The Atelier
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  style={{ ...styles.tabBtn, ...(activeTab === 'shipping' ? styles.tabBtnActive : {}) }}
                >
                  Delivery
                </button>
              </div>

              <div style={styles.tabContent}>
                {activeTab === 'details' && (
                  <ul style={styles.infoList}>
                    <li><Sparkles size={12} style={styles.infoIcon} /> Meticulously cast, filed, and set by hand</li>
                    <li><Sparkles size={12} style={styles.infoIcon} /> Materials: {product.material}</li>
                    <li><Sparkles size={12} style={styles.infoIcon} /> Finished with dynamic light-catching facets</li>
                  </ul>
                )}

                {activeTab === 'crafting' && (
                  <p style={styles.tabText}>
                    Our products are made in-house at our small two-person metal atelier. We melt, refine, cast and file raw precious metals using historical tools to guarantee a rich organic texture.
                  </p>
                )}

                {activeTab === 'shipping' && (
                  <ul style={styles.infoList}>
                    <li><Truck size={12} style={styles.infoIcon} /> Free insured delivery globally</li>
                    <li><ShieldCheck size={12} style={styles.infoIcon} /> Dispatched within 48 hours of casting</li>
                  </ul>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  modal: {
    width: '100%',
    maxWidth: '920px',
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative',
    border: '1px solid var(--border-gold)',
    boxShadow: '0 0 40px rgba(0,0,0,0.5)',
  },
  closeButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    zIndex: 10,
    transition: 'var(--transition-fast)',
    padding: '4px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.1fr',
    minHeight: '520px',
  },
  imageColumn: {
    backgroundColor: '#0d0d0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  detailsColumn: {
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    backgroundColor: '#0e0e10',
  },
  tag: {
    fontSize: '0.6rem',
    letterSpacing: '0.2em',
    color: 'var(--gold-primary)',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: '8px',
  },
  title: {
    fontSize: '1.8rem',
    lineHeight: '1.2',
    color: 'var(--text-primary)',
    marginBottom: '8px',
    fontFamily: 'var(--font-serif)',
  },
  price: {
    fontSize: '1.25rem',
    color: 'var(--text-primary)',
    fontWeight: '500',
    marginBottom: '20px',
    fontFamily: 'var(--font-sans)',
  },
  shortDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.7',
    marginBottom: '24px',
  },
  customizerSection: {
    marginBottom: '20px',
  },
  customizerLabel: {
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
  },
  optionsGrid: {
    display: 'flex',
    gap: '10px',
  },
  optionButton: {
    flex: 1,
    backgroundColor: 'transparent',
    border: '1px solid var(--border-muted)',
    color: 'var(--text-secondary)',
    padding: '8px 12px',
    fontSize: '0.7rem',
    fontWeight: '500',
    cursor: 'pointer',
    borderRadius: '2px',
    transition: 'var(--transition-fast)',
  },
  optionButtonActive: {
    borderColor: 'var(--gold-primary)',
    color: 'var(--gold-primary)',
    backgroundColor: 'rgba(197, 160, 89, 0.05)',
  },
  sizeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  sizeGuideBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--gold-primary)',
    fontSize: '0.65rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    textDecoration: 'underline',
  },
  sizesRow: {
    display: 'flex',
    gap: '8px',
  },
  sizeCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '1px solid var(--border-muted)',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '0.7rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition-fast)',
  },
  sizeCircleActive: {
    borderColor: 'var(--gold-primary)',
    color: 'var(--gold-primary)',
    backgroundColor: 'rgba(197, 160, 89, 0.05)',
  },
  ctaRow: {
    marginTop: '10px',
    marginBottom: '30px',
  },
  addToBagBtn: {
    width: '100%',
    textAlign: 'center',
  },
  disabledBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#222224',
    border: '1px solid #333336',
    color: '#555558',
    cursor: 'not-allowed',
  },
  tabsContainer: {
    borderTop: '1px solid var(--border-muted)',
    paddingTop: '20px',
  },
  tabsHeader: {
    display: 'flex',
    gap: '24px',
    borderBottom: '1px solid var(--border-muted)',
    paddingBottom: '8px',
    marginBottom: '12px',
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '0.65rem',
    fontWeight: '600',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    paddingBottom: '4px',
    position: 'relative',
  },
  tabBtnActive: {
    color: 'var(--gold-primary)',
  },
  tabContent: {
    minHeight: '60px',
  },
  infoList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  infoIcon: {
    color: 'var(--gold-primary)',
    marginRight: '6px',
    display: 'inline',
  },
  tabText: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },
}
