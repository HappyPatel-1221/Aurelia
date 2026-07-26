import React from 'react'
import { ShoppingBag, RefreshCw, Shield, Truck, User, Compass } from 'lucide-react'

export default function Header({ currentRole, setRole, cartCount, onOpenCart, onResetDemo }) {
  const roles = [
    { id: 'storefront', label: 'Storefront', icon: Compass },
    { id: 'customer', label: 'Customer Area', icon: User },
    { id: 'owner', label: 'Owner Panel', icon: Shield },
    { id: 'delivery', label: 'Rider Panel', icon: Truck },
  ]

  return (
    <header style={styles.header} className="glass-panel">
      {/* Top Role Selector Bar */}
      <div style={styles.roleBar}>
        <div style={styles.roleContainer}>
          {roles.map((role) => {
            const Icon = role.icon
            const isActive = currentRole === role.id
            return (
              <button
                key={role.id}
                onClick={() => setRole(role.id)}
                style={{
                  ...styles.roleButton,
                  ...(isActive ? styles.roleButtonActive : {}),
                }}
              >
                <Icon size={13} style={styles.roleIcon} />
                <span style={styles.roleText}>{role.label}</span>
              </button>
            )
          })}
        </div>

        <button onClick={onResetDemo} style={styles.resetButton} title="Reset Demo Data">
          <RefreshCw size={13} style={styles.resetIcon} />
          <span>Reset Demo</span>
        </button>
      </div>

      {/* Main Branding & Action Header */}
      <div style={styles.mainNav}>
        <div style={styles.logoContainer} onClick={() => setRole('storefront')}>
          <h2 style={styles.logo}>A U R E L I A</h2>
          <span style={styles.subtitle}>Fine Jewellery</span>
        </div>

        <div style={styles.actionContainer}>
          <button onClick={onOpenCart} style={styles.cartButton} id="cart-toggle-btn">
            <ShoppingBag size={20} style={styles.cartIcon} />
            <span style={styles.cartLabel}>BAG</span>
            {cartCount > 0 && (
              <div style={styles.badge} className="animate-fade-in-up">
                {cartCount}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '1px solid var(--border-muted)',
  },
  roleBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 40px',
    height: '34px',
    backgroundColor: '#070708',
    borderBottom: '1px solid var(--border-muted)',
  },
  roleContainer: {
    display: 'flex',
    gap: '24px',
    height: '100%',
  },
  roleButton: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.65rem',
    fontWeight: '600',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    height: '100%',
    padding: '0 4px',
    opacity: 0.7,
    transition: 'var(--transition-fast)',
  },
  roleButtonActive: {
    color: 'var(--gold-primary)',
    opacity: 1,
    borderBottom: '1px solid var(--gold-primary)',
  },
  roleIcon: {
    marginTop: '-1px',
  },
  roleText: {
    display: 'inline-block',
  },
  resetButton: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.6rem',
    fontWeight: '500',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'var(--transition-fast)',
  },
  resetIcon: {
    transition: 'transform 0.4s ease',
  },
  mainNav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 40px',
    height: '56px',
  },
  logoContainer: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  logo: {
    fontSize: '1.25rem',
    letterSpacing: '0.35em',
    color: 'var(--text-primary)',
    lineHeight: 1,
  },
  subtitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.5rem',
    letterSpacing: '0.45em',
    textTransform: 'uppercase',
    color: 'var(--gold-primary)',
    marginTop: '4px',
    paddingLeft: '2px',
  },
  actionContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  cartButton: {
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.7rem',
    fontWeight: '600',
    letterSpacing: '0.2em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
    padding: '6px 12px',
    transition: 'var(--transition-fast)',
  },
  cartButtonActive: {
    color: 'var(--gold-primary)',
  },
  cartIcon: {
    color: 'var(--text-primary)',
  },
  cartLabel: {
    marginTop: '2px',
  },
  badge: {
    position: 'absolute',
    top: '-3px',
    right: '-3px',
    backgroundColor: 'var(--gold-primary)',
    color: '#070708',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    fontSize: '0.65rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 8px var(--gold-glow)',
  },
}
