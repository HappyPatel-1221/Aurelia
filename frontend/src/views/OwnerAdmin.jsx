import React, { useState } from 'react'
import { Plus, ShieldAlert, Sparkles, TrendingUp, ShoppingBag, Package, Trash2, Edit2, Save } from 'lucide-react'

export default function OwnerAdmin({ products, orders, onAddProduct, onUpdateProduct, onUpdateOrderStatus }) {
  const [activeSubTab, setActiveSubTab] = useState('overview') // overview, products, orders
  
  // Add product form states
  const [newProdName, setNewProdName] = useState('')
  const [newProdPrice, setNewProdPrice] = useState('')
  const [newProdCategory, setNewProdCategory] = useState('Gold')
  const [newProdMaterial, setNewProdMaterial] = useState('')
  const [newProdStock, setNewProdStock] = useState('5')
  const [newProdTag, setNewProdTag] = useState('New Cast')
  const [newProdDesc, setNewProdDesc] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  // Edit stock state
  const [editingProdId, setEditingProdId] = useState(null)
  const [editingStockVal, setEditingStockVal] = useState('')

  // Calculate metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0)
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered').length
  const lowStockProducts = products.filter(p => p.stock <= 3)

  // Format price in Indian Rupees
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    if (!newProdName || !newProdPrice || !newProdCategory) {
      alert('Product name, price, and category are required.')
      return
    }

    setIsAdding(true)
    const productPayload = {
      name: newProdName,
      price: Number(newProdPrice),
      category: newProdCategory,
      material: newProdMaterial || `${newProdCategory} Base`,
      stock: Number(newProdStock) || 5,
      tag: newProdTag,
      description: newProdDesc
    }

    await onAddProduct(productPayload)
    
    // Clear form
    setNewProdName('')
    setNewProdPrice('')
    setNewProdMaterial('')
    setNewProdStock('5')
    setNewProdTag('New Cast')
    setNewProdDesc('')
    setIsAdding(false)
    alert('New luxury product added to current castings catalog!')
  }

  const handleSaveStock = async (prodId) => {
    await onUpdateProduct(prodId, { stock: Number(editingStockVal) })
    setEditingProdId(null)
  }

  const handleStatusChange = async (orderId, newStatus) => {
    await onUpdateOrderStatus(orderId, newStatus)
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>Atelier Console</h1>
      <p style={styles.pageDesc}>Owner administrative dashboard. Manage castings, inventory levels, and orders queue.</p>

      {/* Sub tabs navigation */}
      <div style={styles.tabNav}>
        <button
          onClick={() => setActiveSubTab('overview')}
          style={{ ...styles.tabBtn, ...(activeSubTab === 'overview' ? styles.tabBtnActive : {}) }}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveSubTab('products')}
          style={{ ...styles.tabBtn, ...(activeSubTab === 'products' ? styles.tabBtnActive : {}) }}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setActiveSubTab('orders')}
          style={{ ...styles.tabBtn, ...(activeSubTab === 'orders' ? styles.tabBtnActive : {}) }}
        >
          Active Orders ({activeOrdersCount})
        </button>
      </div>

      {/* Overview Tab Content */}
      {activeSubTab === 'overview' && (
        <div style={styles.overviewGrid}>
          {/* Dashboard Stats */}
          <div style={styles.statsRow}>
            <div style={styles.statCard} className="glass-card-gold">
              <TrendingUp size={24} style={styles.statIcon} />
              <span style={styles.statLabel}>Total Revenue</span>
              <h2 style={styles.statVal}>{formatPrice(totalRevenue)}</h2>
            </div>
            <div style={styles.statCard} className="glass-card-gold">
              <ShoppingBag size={24} style={styles.statIcon} />
              <span style={styles.statLabel}>Active Orders</span>
              <h2 style={styles.statVal}>{activeOrdersCount}</h2>
            </div>
            <div style={styles.statCard} className="glass-card-gold">
              <Package size={24} style={styles.statIcon} />
              <span style={styles.statLabel}>Low Stock Items</span>
              <h2 style={{ ...styles.statVal, ...(lowStockProducts.length > 0 ? styles.alertText : {}) }}>
                {lowStockProducts.length}
              </h2>
            </div>
          </div>

          {/* SVG Sales Trend Chart */}
          <div style={styles.chartPanel} className="glass-panel">
            <h3 style={styles.panelTitle}>Atelier Revenue Projection (Simulated)</h3>
            <div style={styles.chartWrapper}>
              <svg viewBox="0 0 500 150" style={styles.svgChart}>
                {/* Grid Lines */}
                <line x1="40" y1="20" x2="460" y2="20" stroke="var(--border-muted)" strokeWidth="0.5" />
                <line x1="40" y1="60" x2="460" y2="60" stroke="var(--border-muted)" strokeWidth="0.5" />
                <line x1="40" y1="100" x2="460" y2="100" stroke="var(--border-muted)" strokeWidth="0.5" />
                <line x1="40" y1="130" x2="460" y2="130" stroke="var(--border-muted)" strokeWidth="0.5" />

                {/* Graph Path */}
                <path
                  d="M 40 120 Q 120 110 200 80 T 360 50 T 460 30"
                  fill="none"
                  stroke="var(--gold-primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                
                {/* Glowing area beneath path */}
                <path
                  d="M 40 120 Q 120 110 200 80 T 360 50 T 460 30 L 460 130 L 40 130 Z"
                  fill="url(#chartGrad)"
                  opacity="0.15"
                />

                {/* Plot Nodes */}
                <circle cx="40" cy="120" r="4" fill="#070708" stroke="var(--gold-primary)" strokeWidth="1.5" />
                <circle cx="120" cy="110" r="4" fill="#070708" stroke="var(--gold-primary)" strokeWidth="1.5" />
                <circle cx="200" cy="80" r="4" fill="#070708" stroke="var(--gold-primary)" strokeWidth="1.5" />
                <circle cx="280" cy="65" r="4" fill="#070708" stroke="var(--gold-primary)" strokeWidth="1.5" />
                <circle cx="360" cy="50" r="4" fill="#070708" stroke="var(--gold-primary)" strokeWidth="1.5" />
                <circle cx="460" cy="30" r="4" fill="var(--gold-primary)" />

                {/* Labels */}
                <text x="40" y="145" fill="var(--text-muted)" fontSize="8" textAnchor="middle">May</text>
                <text x="120" y="145" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Jun</text>
                <text x="200" y="145" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Jul</text>
                <text x="280" y="145" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Aug</text>
                <text x="360" y="145" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Sep</text>
                <text x="460" y="145" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Current</text>

                {/* Defs */}
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold-primary)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Low Stock Warnings */}
          {lowStockProducts.length > 0 && (
            <div style={styles.alertPanel} className="glass-card-gold">
              <div style={styles.alertHeader}>
                <ShieldAlert size={18} style={{ color: '#ff4d4d', marginRight: '8px' }} />
                <h4 style={{ color: '#ff4d4d', fontSize: '0.8rem', letterSpacing: '0.05em' }}>RESTOCK WARNINGS</h4>
              </div>
              <ul style={styles.alertList}>
                {lowStockProducts.map(p => (
                  <li key={p.id} style={styles.alertItem}>
                    <span>{p.name} ({p.material})</span>
                    <strong style={{ color: '#ff4d4d' }}>Only {p.stock} castings left in stock</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Products Tab Content */}
      {activeSubTab === 'products' && (
        <div style={styles.productsPanelLayout}>
          {/* Product Listing & Stock Modifier */}
          <div style={styles.tablePanel} className="glass-panel">
            <h3 style={styles.panelTitle}>Castings Catalogue</h3>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeadRow}>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Material</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} style={styles.tableBodyRow}>
                      <td style={{ ...styles.td, fontFamily: 'var(--font-serif)', fontSize: '0.85rem' }}>{p.name}</td>
                      <td style={styles.td}>{p.category}</td>
                      <td style={styles.td}>{p.material}</td>
                      <td style={styles.td}>{formatPrice(p.price)}</td>
                      <td style={styles.td}>
                        {editingProdId === p.id ? (
                          <input
                            type="number"
                            value={editingStockVal}
                            onChange={(e) => setEditingStockVal(e.target.value)}
                            style={styles.stockInput}
                          />
                        ) : (
                          <span style={p.stock <= 3 ? styles.lowStockText : styles.normalStockText}>{p.stock}</span>
                        )}
                      </td>
                      <td style={styles.td}>
                        {editingProdId === p.id ? (
                          <button onClick={() => handleSaveStock(p.id)} style={styles.iconActionBtn} title="Save">
                            <Save size={13} style={{ color: 'var(--gold-primary)' }} />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingProdId(p.id)
                              setEditingStockVal(p.stock.toString())
                            }}
                            style={styles.iconActionBtn}
                            title="Edit Stock"
                          >
                            <Edit2 size={13} style={{ color: 'var(--text-secondary)' }} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Product Sidebar Form */}
          <div style={styles.formPanel} className="glass-panel">
            <h3 style={styles.panelTitle}>List New Casting</h3>
            <form onSubmit={handleAddProduct} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Product Name</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Solis Ring"
                  style={styles.textInput}
                />
              </div>

              <div style={styles.row}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    style={styles.selectInput}
                  >
                    <option value="Gold">Gold</option>
                    <option value="Diamond">Diamond</option>
                    <option value="Silver">Silver</option>
                    <option value="Rose Gold">Rose Gold</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="e.g. 45000"
                    style={styles.textInput}
                  />
                </div>
              </div>

              <div style={styles.row}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Metal/Materials</label>
                  <input
                    type="text"
                    value={newProdMaterial}
                    onChange={(e) => setNewProdMaterial(e.target.value)}
                    placeholder="e.g. 18k Gold & Diamond"
                    style={styles.textInput}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Initial Stock</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    placeholder="5"
                    style={styles.textInput}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Tag Badge</label>
                <input
                  type="text"
                  value={newProdTag}
                  onChange={(e) => setNewProdTag(e.target.value)}
                  placeholder="e.g. Limited Edition"
                  style={styles.textInput}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Casting Details / Description</label>
                <textarea
                  rows={3}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Tell the client about the casting process..."
                  style={{ ...styles.textInput, resize: 'none' }}
                />
              </div>

              <button type="submit" disabled={isAdding} className="btn-gold" style={styles.submitBtn}>
                {isAdding ? 'Adding Cast...' : 'Cast Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Orders Tab Content */}
      {activeSubTab === 'orders' && (
        <div style={styles.tablePanel} className="glass-panel">
          <h3 style={styles.panelTitle}>Active Orders Queue</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeadRow}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Items Ordered</th>
                  <th style={styles.th}>Total Value</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={styles.emptyTableText}>No active orders placed yet.</td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord.id} style={styles.tableBodyRow}>
                      <td style={{ ...styles.td, fontWeight: '600', color: 'var(--gold-primary)' }}>{ord.id}</td>
                      <td style={styles.td}>
                        <div style={styles.custCell}>
                          <span style={styles.custName}>{ord.customerName}</span>
                          <span style={styles.custPhone}>{ord.phone}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.itemsListCell}>
                          {ord.items.map((item, index) => (
                            <div key={index} style={styles.itemBullet}>
                              • {item.name} x{item.quantity} ({item.material || item.category})
                            </div>
                          ))}
                        </div>
                      </td>
                      <td style={styles.td}>{formatPrice(ord.total)}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          ...(ord.status === 'Delivered' ? styles.statusBadgeDelivered :
                             ord.status === 'Out for Delivery' ? styles.statusBadgeOut : styles.statusBadgePaid)
                        }}>
                          {ord.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {ord.status === 'Paid' && (
                          <button
                            onClick={() => handleStatusChange(ord.id, 'Packed')}
                            className="btn-gold"
                            style={styles.actionBtn}
                          >
                            Mark Packed
                          </button>
                        )}
                        {ord.status === 'Packed' && (
                          <button
                            onClick={() => handleStatusChange(ord.id, 'Out for Delivery')}
                            className="btn-outline"
                            style={{ ...styles.actionBtn, padding: '6px 12px', fontSize: '0.55rem' }}
                          >
                            Send with Rider
                          </button>
                        )}
                        {ord.status === 'Out for Delivery' && (
                          <span style={styles.riderAssignedText}>Rider en route</span>
                        )}
                        {ord.status === 'Delivered' && (
                          <span style={styles.deliveredSuccessText}>Delivered</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    padding: '120px 80px 80px 80px',
    maxWidth: '1200px',
    margin: '0 auto',
    minHeight: '80vh',
  },
  pageTitle: {
    fontSize: '2rem',
    color: 'var(--text-primary)',
    marginBottom: '8px',
    fontFamily: 'var(--font-serif)',
  },
  pageDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginBottom: '40px',
  },
  tabNav: {
    display: 'flex',
    gap: '30px',
    borderBottom: '1px solid var(--border-muted)',
    paddingBottom: '12px',
    marginBottom: '45px',
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    fontWeight: '600',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    padding: '4px 0',
    position: 'relative',
    transition: 'var(--transition-fast)',
  },
  tabBtnActive: {
    color: 'var(--gold-primary)',
    borderBottom: '1px solid var(--gold-primary)',
  },
  overviewGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  statsRow: {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
  },
  statCard: {
    flex: '1 1 240px',
    padding: '24px',
    borderRadius: '4px',
    position: 'relative',
  },
  statIcon: {
    color: 'var(--gold-primary)',
    marginBottom: '16px',
  },
  statLabel: {
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--text-secondary)',
    display: 'block',
    marginBottom: '8px',
  },
  statVal: {
    fontSize: '1.8rem',
    fontWeight: '500',
    color: 'var(--text-primary)',
  },
  alertText: {
    color: '#ff4d4d',
  },
  chartPanel: {
    padding: '30px',
    borderRadius: '4px',
  },
  panelTitle: {
    fontSize: '0.8rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--gold-primary)',
    marginBottom: '24px',
    fontWeight: '600',
  },
  chartWrapper: {
    width: '100%',
    overflowX: 'auto',
  },
  svgChart: {
    width: '100%',
    height: 'auto',
    maxHeight: '160px',
  },
  alertPanel: {
    padding: '24px',
    borderRadius: '4px',
    borderColor: 'rgba(255, 77, 77, 0.3)',
    backgroundColor: 'rgba(255,77,77,0.02)',
  },
  alertHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
  },
  alertList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  alertItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    paddingBottom: '8px',
  },
  productsPanelLayout: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '40px',
    alignItems: 'start',
  },
  tablePanel: {
    padding: '30px',
    borderRadius: '4px',
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tableHeadRow: {
    borderBottom: '1px solid var(--border-muted)',
  },
  th: {
    padding: '12px 16px',
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  tableBodyRow: {
    borderBottom: '1px solid rgba(255,255,255,0.03)',
  },
  td: {
    padding: '16px',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    verticalAlign: 'middle',
  },
  stockInput: {
    width: '50px',
    padding: '4px 6px',
    backgroundColor: '#16161a',
    border: '1px solid var(--border-gold)',
    color: '#fff',
    outline: 'none',
    textAlign: 'center',
  },
  normalStockText: {
    color: '#fff',
  },
  lowStockText: {
    color: '#ff4d4d',
    fontWeight: '700',
  },
  iconActionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  formPanel: {
    padding: '30px',
    borderRadius: '4px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  label: {
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    display: 'block',
    marginBottom: '6px',
  },
  textInput: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-muted)',
    color: 'var(--text-primary)',
    padding: '10px 14px',
    fontSize: '0.75rem',
    outline: 'none',
    width: '100%',
    fontFamily: 'var(--font-sans)',
  },
  selectInput: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-muted)',
    color: 'var(--text-primary)',
    padding: '10px 14px',
    fontSize: '0.75rem',
    outline: 'none',
    width: '100%',
    fontFamily: 'var(--font-sans)',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    textAlign: 'center',
    marginTop: '10px',
  },
  custCell: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
  },
  custName: {
    fontWeight: '600',
    color: '#fff',
  },
  custPhone: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
  },
  itemsListCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  itemBullet: {
    fontSize: '0.7rem',
  },
  statusBadge: {
    fontSize: '0.6rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    padding: '4px 8px',
    borderRadius: '2px',
    letterSpacing: '0.05em',
  },
  statusBadgePaid: {
    backgroundColor: 'rgba(212,175,55,0.1)',
    color: 'var(--gold-primary)',
  },
  statusBadgeOut: {
    backgroundColor: 'rgba(0,123,255,0.1)',
    color: '#007bff',
  },
  statusBadgeDelivered: {
    backgroundColor: 'rgba(40,167,69,0.1)',
    color: '#28a745',
  },
  actionBtn: {
    padding: '6px 12px',
    fontSize: '0.55rem',
  },
  riderAssignedText: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  deliveredSuccessText: {
    fontSize: '0.65rem',
    color: '#28a745',
    fontWeight: '600',
  },
  emptyTableText: {
    textAlign: 'center',
    padding: '40px',
    color: 'var(--text-muted)',
  }
}
