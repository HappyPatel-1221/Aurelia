import React, { useState } from 'react'
import VideoBackground from '../components/VideoBackground'
import ProductCard from '../components/ProductCard'
import { Sparkles, Compass, ShieldAlert } from 'lucide-react'

export default function Storefront({ products, onAddToCart, onQuickView }) {
  const [activeCategory, setActiveCategory] = useState('All')

  // Categories list with counts
  const categories = ['All', 'Gold', 'Diamond', 'Silver', 'Rose Gold']
  
  const getCount = (cat) => {
    if (cat === 'All') return products.length
    return products.filter(p => p.category === cat).length
  }

  // Filter products
  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory)

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero} id="top">
        <VideoBackground />
        <div style={styles.heroContent} className="animate-fade-in-up">
          <span style={styles.heroSub}>A T E L I E R   C O L L E C T I V E</span>
          <h1 style={styles.heroTitle}>Jewellery for the unfinished edges of a life.</h1>
          <p style={styles.heroDesc}>
            Every piece is cast, filed, and set by hand in a two-person studio. 
            No two Meridian Hoops catch light exactly the same way — that's the point.
          </p>
          <div style={styles.heroBtns}>
            <button
              onClick={() => {
                document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-gold"
            >
              Shop The Cast
            </button>
            <button
              onClick={() => {
                document.getElementById('atelier-story').scrollIntoView({ behavior: 'smooth' })
              }}
              className="btn-outline"
            >
              Our Philosophy
            </button>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="catalog" style={styles.catalog}>
        <div style={styles.catalogHeader}>
          <span style={styles.catalogSub}>ATELIER INVENTORY</span>
          <h2 style={styles.catalogTitle}>Current Castings</h2>
          <div style={styles.underline}></div>
        </div>

        {/* Filter Navigation */}
        <div style={styles.filterBar}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                ...styles.filterBtn,
                ...(activeCategory === cat ? styles.filterBtnActive : {})
              }}
            >
              <span>{cat.toUpperCase()}</span>
              <span style={{
                ...styles.filterCount,
                ...(activeCategory === cat ? styles.filterCountActive : {})
              }}>{getCount(cat)}</span>
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div style={styles.noResults}>
            <ShieldAlert size={36} style={{ color: 'var(--gold-primary)', marginBottom: '10px' }} />
            <p>No active casts in this collection at the moment.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </section>

      {/* Atelier Story / Philosophy Section */}
      <section id="atelier-story" style={styles.storySection} className="glass-panel">
        <div style={styles.storyGrid}>
          <div style={styles.storyImageContainer}>
            <img
              src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800"
              alt="Jewelry crafting process"
              style={styles.storyImage}
            />
            <div style={styles.storyImageOverlay}></div>
          </div>
          
          <div style={styles.storyDetails}>
            <Sparkles size={24} style={{ color: 'var(--gold-primary)', marginBottom: '16px' }} />
            <span style={styles.storySub}>THE ATELIER PHILOSOPHY</span>
            <h2 style={styles.storyTitle}>Slow Metal, Honest Work</h2>
            <p style={styles.storyText}>
              We believe in the character of metal. In a world of digital precision and mass duplication, we choose the path of deliberate friction. We melt our metals in small clay crucibles, pouring them into organic molds that give each casting its distinct, heavy, skin-like texture.
            </p>
            <p style={styles.storyText}>
              Every scratch, dimple, and grain on an Aurelia piece is a fingerprint of the fire. We do not polish away the evidence of the craft. When you wear our rings or cuffs, they carry the weight and warmth of human intention.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
  },
  hero: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    padding: '0 80px',
    position: 'relative',
  },
  heroContent: {
    maxWidth: '640px',
    position: 'relative',
    zIndex: 5,
  },
  heroSub: {
    fontSize: '0.7rem',
    letterSpacing: '0.3em',
    color: 'var(--gold-primary)',
    fontWeight: '600',
    display: 'block',
    marginBottom: '16px',
  },
  heroTitle: {
    fontSize: '3.2rem',
    lineHeight: '1.15',
    color: 'var(--text-primary)',
    marginBottom: '24px',
    fontFamily: 'var(--font-serif)',
  },
  heroDesc: {
    fontSize: '0.9rem',
    lineHeight: '1.8',
    color: 'var(--text-secondary)',
    marginBottom: '36px',
  },
  heroBtns: {
    display: 'flex',
    gap: '20px',
  },
  catalog: {
    padding: '100px 80px',
    backgroundColor: 'var(--bg-primary)',
  },
  catalogHeader: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  catalogSub: {
    fontSize: '0.65rem',
    letterSpacing: '0.25em',
    color: 'var(--text-muted)',
    fontWeight: '600',
    display: 'block',
    marginBottom: '8px',
  },
  catalogTitle: {
    fontSize: '2.2rem',
    color: 'var(--text-primary)',
    marginBottom: '16px',
    fontFamily: 'var(--font-serif)',
  },
  underline: {
    width: '60px',
    height: '1px',
    backgroundColor: 'var(--gold-primary)',
    margin: '0 auto',
  },
  filterBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginBottom: '50px',
    borderBottom: '1px solid var(--border-muted)',
    paddingBottom: '16px',
  },
  filterBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.7rem',
    fontWeight: '600',
    letterSpacing: '0.15em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 0',
    transition: 'var(--transition-fast)',
  },
  filterBtnActive: {
    color: 'var(--gold-primary)',
    borderBottom: '1px solid var(--gold-primary)',
  },
  filterCount: {
    fontSize: '0.6rem',
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-muted)',
    padding: '2px 6px',
    borderRadius: '10px',
    minWidth: '20px',
    textAlign: 'center',
  },
  filterCountActive: {
    backgroundColor: 'var(--gold-primary)',
    color: '#070708',
  },
  noResults: {
    textAlign: 'center',
    padding: '80px 0',
    color: 'var(--text-secondary)',
  },
  storySection: {
    padding: '80px',
    margin: '0 80px 100px 80px',
    borderRadius: '4px',
  },
  storyGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: '60px',
    alignItems: 'center',
  },
  storyImageContainer: {
    position: 'relative',
    height: '420px',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  storyImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to right, rgba(7,7,8,0.2), rgba(7,7,8,0.8))',
  },
  storyDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  storySub: {
    fontSize: '0.65rem',
    letterSpacing: '0.2em',
    color: 'var(--gold-primary)',
    fontWeight: '600',
    marginBottom: '8px',
  },
  storyTitle: {
    fontSize: '2.2rem',
    color: 'var(--text-primary)',
    marginBottom: '20px',
    fontFamily: 'var(--font-serif)',
  },
  storyText: {
    fontSize: '0.85rem',
    lineHeight: '1.8',
    color: 'var(--text-secondary)',
    marginBottom: '16px',
  },
}
