import React, { useState, useEffect } from 'react'
import { MapPin, Phone, Clipboard, CheckCircle2, ChevronRight, Navigation, Compass } from 'lucide-react'

export default function DeliveryAdmin({ orders, onUpdateOrderStatus }) {
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [otpInput, setOtpInput] = useState('')
  const [otpError, setOtpError] = useState(false)
  const [isOtpSuccess, setIsOtpSuccess] = useState(false)
  
  // GPS simulation states
  const [gpsProgress, setGpsProgress] = useState(0) // 0 to 100%
  const [isGpsActive, setIsGpsActive] = useState(false)

  // Find active orders for delivery rider Vikram S.
  // Shows packed (ready for pickup), out for delivery, and delivered (for records)
  const riderOrders = orders.filter(o => o.rider === 'Vikram S.')

  // Selected Order
  const activeOrder = riderOrders.find(o => o.id === selectedOrderId) || riderOrders[0]

  useEffect(() => {
    if (activeOrder) {
      setSelectedOrderId(activeOrder.id)
    }
  }, [orders])

  // Handle GPS route animation
  useEffect(() => {
    let interval
    if (isGpsActive && gpsProgress < 100) {
      interval = setInterval(() => {
        setGpsProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsGpsActive(false)
            return 100
          }
          return prev + 2 // increment progress
        })
      }, 300)
    }
    return () => clearInterval(interval)
  }, [isGpsActive, gpsProgress])

  // Trigger GPS route when order status changes to "Out for Delivery"
  useEffect(() => {
    if (activeOrder) {
      if (activeOrder.status === 'Out for Delivery') {
        setIsGpsActive(true)
        setGpsProgress(0)
      } else if (activeOrder.status === 'Delivered') {
        setGpsProgress(100)
        setIsGpsActive(false)
      } else {
        setGpsProgress(0)
        setIsGpsActive(false)
      }
    }
  }, [activeOrder?.status])

  const handlePickUp = async () => {
    if (!activeOrder) return
    await onUpdateOrderStatus(activeOrder.id, 'Out for Delivery')
    setGpsProgress(0)
    setIsGpsActive(true)
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!activeOrder) return

    // Allow simulated 1234 or actual order OTP code
    if (otpInput === '1234' || otpInput === activeOrder.otp) {
      setOtpError(false)
      setIsOtpSuccess(true)
      setTimeout(async () => {
        await onUpdateOrderStatus(activeOrder.id, 'Delivered')
        setIsOtpSuccess(false)
        setOtpInput('')
      }, 1500)
    } else {
      setOtpError(true)
      setTimeout(() => setOtpError(false), 2000)
    }
  }

  // Calculate coordinates for the animated GPS icon
  const getGpsCoords = () => {
    // Basic route SVG path math
    // Path goes from (50, 110) -> (150, 40) -> (300, 100) -> (450, 50)
    const t = gpsProgress / 100
    if (t <= 0.33) {
      // Line 1: (50, 110) to (150, 40)
      const ratio = t / 0.33
      return { x: 50 + 100 * ratio, y: 110 - 70 * ratio }
    } else if (t <= 0.66) {
      // Line 2: (150, 40) to (300, 100)
      const ratio = (t - 0.33) / 0.33
      return { x: 150 + 150 * ratio, y: 40 + 60 * ratio }
    } else {
      // Line 3: (300, 100) to (450, 50)
      const ratio = (t - 0.66) / 0.34
      return { x: 300 + 150 * ratio, y: 100 - 50 * ratio }
    }
  }

  const riderPos = getGpsCoords()

  // Format price in Indian Rupees
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>Rider Panel</h1>
      <p style={styles.pageDesc}>Vikram S. active deliveries route sheet, mock GPS positioning and customer OTP verification.</p>

      {riderOrders.length === 0 ? (
        <div style={styles.emptyPanel} className="glass-panel">
          <Compass size={40} style={{ color: 'var(--gold-primary)', marginBottom: '16px' }} />
          <h3>No assigned runs</h3>
          <p>Deliveries queue is currently empty. Orders must be marked "Packed" and assigned from the Atelier Console.</p>
        </div>
      ) : (
        <div style={styles.mainGrid}>
          
          {/* Left Column: Orders list */}
          <div style={styles.leftCol}>
            <div style={styles.panel} className="glass-panel">
              <h3 style={styles.panelTitle}>Your Run Sheet</h3>
              
              <div style={styles.ordersList}>
                {riderOrders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => {
                      setSelectedOrderId(ord.id)
                      setOtpInput('')
                    }}
                    style={{
                      ...styles.orderCard,
                      ...(activeOrder?.id === ord.id ? styles.orderCardActive : {})
                    }}
                  >
                    <div style={styles.orderLeft}>
                      <span style={styles.orderId}>{ord.id}</span>
                      <span style={styles.orderItemsCount}>{ord.items.length} castings</span>
                    </div>
                    
                    <div style={styles.orderRight}>
                      <span style={{
                        ...styles.statusLabel,
                        ...(ord.status === 'Delivered' ? styles.statusDelivered :
                           ord.status === 'Out for Delivery' ? styles.statusOut : styles.statusPacked)
                      }}>
                        {ord.status}
                      </span>
                      <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Active Delivery Details & GPS Route */}
          {activeOrder && (
            <div style={styles.rightCol}>
              <div style={styles.panel} className="glass-panel">
                
                {/* Header */}
                <div style={styles.activeHeader}>
                  <div>
                    <h3 style={styles.activeTitle}>Delivery Summary — {activeOrder.id}</h3>
                    <span style={styles.activeCustomer}>{activeOrder.customerName}</span>
                  </div>
                  <span style={styles.activePrice}>{formatPrice(activeOrder.total)}</span>
                </div>

                {/* Details list */}
                <div style={styles.detailsList}>
                  <div style={styles.detailRow}>
                    <MapPin size={15} style={styles.detailIcon} />
                    <div>
                      <span style={styles.detailTitle}>SHIPPING ADDRESS</span>
                      <p style={styles.detailVal}>{activeOrder.address}</p>
                    </div>
                  </div>
                  <div style={styles.detailRow}>
                    <Phone size={15} style={styles.detailIcon} />
                    <div>
                      <span style={styles.detailTitle}>CUSTOMER CONTACT</span>
                      <p style={styles.detailVal}>{activeOrder.phone} (Simulate Call)</p>
                    </div>
                  </div>
                  <div style={styles.detailRow}>
                    <Clipboard size={15} style={styles.detailIcon} />
                    <div>
                      <span style={styles.detailTitle}>CASTINGS DETAILS</span>
                      <div style={styles.itemsBlock}>
                        {activeOrder.items.map((item, i) => (
                          <span key={i} style={styles.itemBullet}>
                            • {item.name} x{item.quantity} ({item.material || item.category})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* GPS Routing Animation Map */}
                <div style={styles.mapContainer} className="glass-card-gold">
                  <span style={styles.mapBadge}>
                    <Navigation size={10} style={{ marginRight: '4px' }} />
                    {activeOrder.status === 'Paid' || activeOrder.status === 'Packed' ? 'Awaiting Dispatch' :
                     gpsProgress < 100 ? 'GPS Route Active' : 'Arrived at Address'}
                  </span>

                  <svg viewBox="0 0 500 160" style={styles.mapSvg}>
                    {/* Background Grid Roads */}
                    <path d="M 10 30 L 490 30 M 10 80 L 490 80 M 10 130 L 490 130" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                    <path d="M 50 10 L 50 150 M 200 10 L 200 150 M 350 10 L 350 150" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />

                    {/* Active Delivery Path (Golden Road) */}
                    <path
                      d="M 50 110 L 150 40 L 300 100 L 450 50"
                      fill="none"
                      stroke="rgba(197, 160, 89, 0.15)"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    
                    {/* Driven Path (Active Gold) */}
                    <path
                      d={`M 50 110 L 150 40 L 300 100 L 450 50`}
                      fill="none"
                      stroke="var(--gold-primary)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="500"
                      strokeDashoffset={500 - (gpsProgress / 100) * 500} // dynamic offset matching percentage
                      style={{ transition: 'stroke-dashoffset 0.3s linear' }}
                    />

                    {/* Start Pin */}
                    <circle cx="50" cy="110" r="5" fill="#444" stroke="#fff" strokeWidth="1.5" />
                    <text x="50" y="125" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Atelier</text>

                    {/* Destination Pin (House) */}
                    <circle cx="450" cy="50" r="5" fill="var(--gold-primary)" />
                    <text x="450" y="65" fill="var(--text-primary)" fontSize="8" textAnchor="middle" fontWeight="600">Client</text>

                    {/* Moving Rider Icon */}
                    {activeOrder.status === 'Out for Delivery' && (
                      <g transform={`translate(${riderPos.x}, ${riderPos.y})`}>
                        <circle cx="0" cy="0" r="8" fill="var(--gold-primary)" style={{ filter: 'drop-shadow(0 0 5px var(--gold-primary))' }} />
                        <circle cx="0" cy="0" r="3" fill="#070708" />
                      </g>
                    )}
                  </svg>

                  {/* Route Progress HUD */}
                  <div style={styles.gpsHud}>
                    <span>Complimentary Insured Delivery route</span>
                    <span>{gpsProgress}% Completed</span>
                  </div>
                </div>

                {/* Rider Actions Panel */}
                <div style={styles.actionsPanel}>
                  {activeOrder.status === 'Packed' && (
                    <button onClick={handlePickUp} className="btn-gold" style={styles.actionBtnWide}>
                      DISPATCH & INITIATE RUN
                    </button>
                  )}

                  {activeOrder.status === 'Paid' && (
                    <div style={styles.awaitingText}>
                      Awaiting packaging inside Atelier Console before dispatch.
                    </div>
                  )}

                  {activeOrder.status === 'Out for Delivery' && gpsProgress < 100 && (
                    <div style={styles.gpsRunningText}>
                      Rider Vikram S. is moving along the secure route. Please wait for delivery to arrive...
                    </div>
                  )}

                  {activeOrder.status === 'Out for Delivery' && gpsProgress === 100 && (
                    <div style={styles.otpSection}>
                      <div style={styles.arrivedHeading}>
                        <CheckCircle2 size={16} style={{ color: 'var(--gold-primary)' }} />
                        <span>Rider Arrived at Destination</span>
                      </div>
                      
                      <form onSubmit={handleVerifyOtp} style={styles.otpForm}>
                        <input
                          type="text"
                          required
                          maxLength={4}
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                          placeholder="ENTER CUSTOMER OTP CODE (e.g. 1234)"
                          style={{
                            ...styles.otpInputBox,
                            ...(otpError ? styles.otpInputError : {}),
                            ...(isOtpSuccess ? styles.otpInputSuccess : {})
                          }}
                        />
                        <button type="submit" disabled={isOtpSuccess} className="btn-gold" style={styles.verifyBtn}>
                          {isOtpSuccess ? 'VERIFIED' : 'CONFIRM DELIVERY'}
                        </button>
                      </form>
                      
                      {otpError && (
                        <p style={styles.errorText}>Invalid OTP code. Please match code from Customer Area.</p>
                      )}
                    </div>
                  )}

                  {activeOrder.status === 'Delivered' && (
                    <div style={styles.completedBlock}>
                      <CheckCircle2 size={36} style={{ color: '#28a745', marginBottom: '10px' }} />
                      <h4 style={{ color: '#28a745' }}>Casting Delivered Successfully</h4>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Verification hand-off finalized via OTP signature.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

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
  emptyPanel: {
    padding: '80px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.6fr',
    gap: '40px',
    alignItems: 'start',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  panel: {
    padding: '30px',
    borderRadius: '4px',
    minHeight: '440px',
  },
  panelTitle: {
    fontSize: '0.8rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--gold-primary)',
    marginBottom: '24px',
    fontWeight: '600',
    fontFamily: 'var(--font-sans)',
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  orderCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-muted)',
    padding: '16px',
    borderRadius: '2px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'var(--transition-fast)',
  },
  orderCardActive: {
    borderColor: 'var(--gold-primary)',
    backgroundColor: 'rgba(197,160,89,0.05)',
  },
  orderLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  orderId: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#fff',
  },
  orderItemsCount: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
  },
  orderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statusLabel: {
    fontSize: '0.55rem',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '2px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statusPacked: {
    backgroundColor: 'rgba(212,175,55,0.1)',
    color: 'var(--gold-primary)',
  },
  statusOut: {
    backgroundColor: 'rgba(0,123,255,0.1)',
    color: '#007bff',
  },
  statusDelivered: {
    backgroundColor: 'rgba(40,167,69,0.1)',
    color: '#28a745',
  },
  activeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid var(--border-muted)',
    paddingBottom: '20px',
    marginBottom: '24px',
  },
  activeTitle: {
    fontSize: '1rem',
    color: '#fff',
    fontFamily: 'var(--font-serif)',
  },
  activeCustomer: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginTop: '4px',
    display: 'block',
  },
  activePrice: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--gold-primary)',
  },
  detailsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '30px',
  },
  detailRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  detailIcon: {
    color: 'var(--gold-primary)',
    marginTop: '2px',
  },
  detailTitle: {
    fontSize: '0.55rem',
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
    fontWeight: '600',
    display: 'block',
    marginBottom: '4px',
    textTransform: 'uppercase',
  },
  detailVal: {
    fontSize: '0.75rem',
    color: 'var(--text-primary)',
    lineHeight: '1.4',
  },
  itemsBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  itemBullet: {
    fontSize: '0.75rem',
    color: 'var(--text-primary)',
  },
  mapContainer: {
    padding: '20px',
    borderRadius: '4px',
    position: 'relative',
    marginBottom: '30px',
    backgroundColor: '#0a0a0c',
  },
  mapBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    fontSize: '0.55rem',
    fontWeight: '600',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--gold-primary)',
    border: '1px solid var(--border-gold)',
    padding: '3px 8px',
    borderRadius: '2px',
    backgroundColor: '#070708',
    display: 'flex',
    alignItems: 'center',
    zIndex: 5,
  },
  mapSvg: {
    width: '100%',
    height: 'auto',
    maxHeight: '150px',
  },
  gpsHud: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.6rem',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginTop: '10px',
    fontWeight: '600',
  },
  actionsPanel: {
    borderTop: '1px solid var(--border-muted)',
    paddingTop: '24px',
  },
  actionBtnWide: {
    width: '100%',
    padding: '14px',
    textAlign: 'center',
  },
  awaitingText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  gpsRunningText: {
    fontSize: '0.75rem',
    color: 'var(--gold-primary)',
    textAlign: 'center',
    animation: 'shimmer 2s linear infinite',
  },
  otpSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  arrivedHeading: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.75rem',
    color: '#fff',
    fontWeight: '600',
  },
  otpForm: {
    display: 'flex',
    gap: '12px',
  },
  otpInputBox: {
    flexGrow: 1,
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-muted)',
    color: '#fff',
    padding: '12px',
    fontSize: '0.8rem',
    textAlign: 'center',
    letterSpacing: '0.15em',
    outline: 'none',
    transition: 'var(--transition-fast)',
    borderRadius: '2px',
  },
  otpInputError: {
    borderColor: '#ff4d4d',
    color: '#ff4d4d',
  },
  otpInputSuccess: {
    borderColor: '#28a745',
    color: '#28a745',
  },
  verifyBtn: {
    padding: '12px 24px',
  },
  errorText: {
    fontSize: '0.65rem',
    color: '#ff4d4d',
    textAlign: 'center',
    marginTop: '4px',
  },
  completedBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 0',
  },
}
