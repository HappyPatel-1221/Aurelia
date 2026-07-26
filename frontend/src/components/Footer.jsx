import React from 'react'

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.content}>
        <div style={styles.sectionBrand}>
          <h3 style={styles.brandTitle}>AURELIA</h3>
          <p style={styles.brandText}>
            Every piece is cast, filed, and set by hand in a two-person workshop.
            No two casts catch light exactly the same way — that's the point.
          </p>
        </div>
        
        <div style={styles.sectionLinks}>
          <h4 style={styles.linkTitle}>Collections</h4>
          <ul style={styles.list}>
            <li style={styles.listItem}>Gold Collections</li>
            <li style={styles.listItem}>Silver Collections</li>
            <li style={styles.listItem}>Fine Diamonds</li>
            <li style={styles.listItem}>Bespoke Castings</li>
          </ul>
        </div>
        
        <div style={styles.sectionLinks}>
          <h4 style={styles.linkTitle}>The Atelier</h4>
          <ul style={styles.list}>
            <li style={styles.listItem}>Our Philosophy</li>
            <li style={styles.listItem}>Ethical Sourcing</li>
            <li style={styles.listItem}>Artisanal Care</li>
            <li style={styles.listItem}>Sizing Guide</li>
          </ul>
        </div>
      </div>
      
      <div style={styles.copyright}>
        <span>© {new Date().getFullYear()} AURELIA Atelier. Created for demo representation. All rights reserved.</span>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    backgroundColor: '#070708',
    borderTop: '1px solid var(--border-muted)',
    padding: '60px 40px 30px 40px',
    marginTop: 'auto',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '40px',
  },
  sectionBrand: {
    flex: '1 1 300px',
  },
  brandTitle: {
    fontSize: '1.2rem',
    letterSpacing: '0.25em',
    color: 'var(--text-primary)',
    marginBottom: '20px',
  },
  brandText: {
    color: 'var(--text-secondary)',
    fontSize: '0.8rem',
    lineHeight: '1.8',
    maxWidth: '320px',
  },
  sectionLinks: {
    flex: '1 1 150px',
  },
  linkTitle: {
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--gold-primary)',
    marginBottom: '20px',
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  listItem: {
    color: 'var(--text-secondary)',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  copyright: {
    maxWidth: '1200px',
    margin: '40px auto 0 auto',
    paddingTop: '20px',
    borderTop: '1px solid var(--border-muted)',
    textAlign: 'center',
    fontSize: '0.65rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
  },
}
