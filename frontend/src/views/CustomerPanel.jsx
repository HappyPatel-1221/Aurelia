import React, { useState } from 'react'
import { CreditCard, ShoppingBag, MapPin, Truck, Sparkles, Check, CheckCircle2, Lock, ArrowRight, ArrowLeft } from 'lucide-react'

export default function CustomerPanel({ cartItems, orders, onCreateOrder, setRole, onClearCart }) {
  const [checkoutStep, setCheckoutStep] = useState(0) // 0 = Cart View/Empty, 1 = Details, 2 = Shipping, 3 = Payment, 4 = Success
  const [customerName, setCustomerName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [isPaying, setIsPaying] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)
  const [selectedOrderId, setSelectedOrderId] = useState(null)

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  // Format price in Indian Rupees
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleNextStep = () => {
    if (checkoutStep === 1 && (!customerName || !email || !phone)) {
      alert('Please fill out all contact details.')
      return
    }
    if (checkoutStep === 2 && !address) {
      alert('Please enter your shipping address.')
      return
    }
    setCheckoutStep(checkoutStep + 1)
  }

  const handlePrevStep = () => {
    setCheckoutStep(checkoutStep - 1)
  }

  const handleSimulatePayment = async () => {
    setIsPaying(true)
    // Simulate Razorpay processing delay
    setTimeout(async () => {
      setIsPaying(false)
      
      const orderPayload = {
        customerName,
        email,
        phone,
        address,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          material: item.customMetal || item.category,
          size: item.customSize || '7'
        })),
        total: cartTotal
      }

      const newOrder = await onCreateOrder(orderPayload)
      setPlacedOrder(newOrder)
      setSelectedOrderId(newOrder.id)
      onClearCart()
      setCheckoutStep(4) // success
    }, 2000)
  }

  // Stepper helper
  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'Paid': return 0
      case 'Packed': return 1
      case 'Out for Delivery': return 2
      case 'Delivered': return 3
      default: return 0
    }
  }

  const selectedOrder = orders.find(o => o.id === (selectedOrderId || (placedOrder && placedOrder.id)))

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>Customer Area</h1>
      <p style={styles.pageDesc}>Manage your artisanal orders, track active shipments, and complete checkout.</p>

      {/* Main Layout Grid */}
      <div style={styles.mainGrid}>
        
        {/* Left Side: Cart & Checkout Wizard */}
        <div style={styles.leftCol}>
          {checkoutStep === 0 && (
            <div style={styles.panel} className="glass-panel">
              <h3 style={styles.panelTitle}>Your Bag</h3>
              {cartItems.length === 0 ? (
                <div style={styles.emptyBag}>
                  <ShoppingBag size={40} style={styles.emptyIcon} />
                  <p>Your shopping bag is currently empty.</p>
                  <button onClick={() => setRole('storefront')} className="btn-gold" style={styles.shopBtn}>
                    Browse Collection
                  </button>
                </div>
              ) : (
                <div>
                  <div style={styles.cartHeader}>
                    <span>ITEM</span>
                    <span>SUBTOTAL</span>
                  </div>
                  {cartItems.map((item, idx) => (
                    <div key={idx} style={styles.cartItem}>
                      <div>
                        <h4 style={styles.itemName}>{item.name}</h4>
                        <span style={styles.itemMeta}>
                          {item.customMetal || item.category} / {item.customSize || '7'} (x{item.quantity})
                        </span>
                      </div>
                      <span style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div style={styles.summaryBox}>
                    <div style={styles.summaryRow}>
                      <span> complimentary Insured shipping</span>
                      <span>FREE</span>
                    </div>
                    <div style={{ ...styles.summaryRow, ...styles.summaryTotal }}>
                      <span>Total Value</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                  </div>
                  <button onClick={() => setCheckoutStep(1)} className="btn-gold" style={styles.wideBtn}>
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Checkout Steps 1, 2, 3 */}
          {checkoutStep > 0 && checkoutStep < 4 && (
            <div style={styles.panel} className="glass-panel">
              {/* Stepper indicator */}
              <div style={styles.miniStepper}>
                <span style={{ ...styles.stepperTab, ...(checkoutStep >= 1 ? styles.stepperTabActive : {}) }}>1. Contact</span>
                <span style={styles.stepperArrow}>→</span>
                <span style={{ ...styles.stepperTab, ...(checkoutStep >= 2 ? styles.stepperTabActive : {}) }}>2. Shipping</span>
                <span style={styles.stepperArrow}>→</span>
                <span style={{ ...styles.stepperTab, ...(checkoutStep >= 3 ? styles.stepperTabActive : {}) }}>3. Payment</span>
              </div>

              {/* Step 1: Details */}
              {checkoutStep === 1 && (
                <div style={styles.formContainer}>
                  <h3 style={styles.formTitle}>Contact Information</h3>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Full Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Priyanshu Mehta"
                      style={styles.textInput}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. priyanshu@mehta.com"
                      style={styles.textInput}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Mobile Phone (for delivery OTP)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      style={styles.textInput}
                    />
                  </div>
                  <div style={styles.btnRow}>
                    <button onClick={handlePrevStep} style={styles.backBtn}>
                      <ArrowLeft size={14} /> Back
                    </button>
                    <button onClick={handleNextStep} className="btn-gold">
                      Next Step <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping */}
              {checkoutStep === 2 && (
                <div style={styles.formContainer}>
                  <h3 style={styles.formTitle}>Shipping Address</h3>
                  <div style={styles.inputGroup}>
                    <label style={styles.inputLabel}>Delivery Address (India)</label>
                    <textarea
                      rows={4}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Villa 24, Gold Valley Estate, Bandra West, Mumbai, Maharashtra - 400050"
                      style={{ ...styles.textInput, ...styles.textArea }}
                    />
                  </div>
                  <div style={styles.btnRow}>
                    <button onClick={handlePrevStep} style={styles.backBtn}>
                      <ArrowLeft size={14} /> Back
                    </button>
                    <button onClick={handleNextStep} className="btn-gold">
                      Payment Setup <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {checkoutStep === 3 && (
                <div style={styles.formContainer}>
                  <h3 style={styles.formTitle}>Simulated Gateway</h3>
                  <p style={styles.gatewayDesc}>We use Razorpay secure checkout. Click below to simulate credit card / UPI verification.</p>

                  <div style={styles.cardContainer} className="glass-card-gold">
                    <div style={styles.cardHeader}>
                      <CreditCard size={20} style={{ color: 'var(--gold-primary)' }} />
                      <span style={styles.cardTitle}>Complimentary Cast checkout</span>
                    </div>
                    
                    <div style={styles.amountBox}>
                      <span style={styles.amountLabel}>Payable Total</span>
                      <span style={styles.amountValue}>{formatPrice(cartTotal)}</span>
                    </div>

                    <div style={styles.cardForm}>
                      <div style={styles.inputGroup}>
                        <label style={styles.inputLabel}>Simulated Card Number</label>
                        <input type="text" placeholder="4111 2222 3333 4444" disabled style={styles.textInputDisabled} />
                      </div>
                      <div style={styles.cardRow}>
                        <div style={{ flex: 1 }}>
                          <label style={styles.inputLabel}>Expiry</label>
                          <input type="text" placeholder="12 / 29" disabled style={styles.textInputDisabled} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={styles.inputLabel}>CVV</label>
                          <input type="password" placeholder="***" disabled style={styles.textInputDisabled} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={styles.btnRow}>
                    <button onClick={handlePrevStep} style={styles.backBtn} disabled={isPaying}>
                      <ArrowLeft size={14} /> Back
                    </button>
                    <button
                      onClick={handleSimulatePayment}
                      disabled={isPaying}
                      style={styles.payBtn}
                      className="btn-gold"
                    >
                      {isPaying ? (
                        <span style={styles.spinnerRow}>
                          <span style={styles.spinner}></span> Processing...
                        </span>
                      ) : (
                        <span style={styles.payLabel}>
                          <Lock size={13} style={{ marginRight: '6px' }} /> COMPLETED SECURE PAYMENT
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Checkout Success */}
          {checkoutStep === 4 && placedOrder && (
            <div style={styles.panel} className="glass-panel">
              <div style={styles.successBox}>
                <CheckCircle2 size={48} style={{ color: 'var(--gold-primary)', marginBottom: '16px' }} />
                <h3 style={styles.successTitle}>Order Cast Successfully!</h3>
                <p style={styles.successDesc}>Your order <strong>{placedOrder.id}</strong> has been created and verified. Our metalsmiths are preparing your selection.</p>

                <div style={styles.otpBox} className="glass-card-gold">
                  <span style={styles.otpLabel}>Delivery Verification Code (OTP)</span>
                  <div style={styles.otpVal}>{placedOrder.otp}</div>
                  <span style={styles.otpNotice}>Copy this code. You will need to provide it to the Delivery Rider (Vikram S.) in the <strong>Rider Panel</strong> to confirm delivery receipt.</span>
                </div>

                <button onClick={() => setCheckoutStep(0)} className="btn-outline" style={{ marginTop: '20px' }}>
                  Browse More Items
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Active Order Shipment Tracking */}
        <div style={styles.rightCol}>
          <div style={styles.panel} className="glass-panel">
            <h3 style={styles.panelTitle}>Shipment Tracking</h3>
            
            {orders.length === 0 ? (
              <p style={styles.noOrdersText}>You have no active orders to track.</p>
            ) : (
              <div>
                {/* Orders Selector List */}
                <div style={styles.orderSelectorList}>
                  {orders.map((ord) => (
                    <button
                      key={ord.id}
                      onClick={() => setSelectedOrderId(ord.id)}
                      style={{
                        ...styles.orderSelectorBtn,
                        ...(selectedOrder?.id === ord.id ? styles.orderSelectorBtnActive : {})
                      }}
                    >
                      <div style={styles.orderSelLeft}>
                        <span style={styles.orderSelId}>{ord.id}</span>
                        <span style={styles.orderSelDate}>{new Date(ord.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span style={{
                        ...styles.orderSelStatus,
                        ...(ord.status === 'Delivered' ? styles.statusDelivered : styles.statusPending)
                      }}>
                        {ord.status}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Track Details */}
                {selectedOrder && (
                  <div style={styles.trackingDetails}>
                    <div style={styles.trackDetailsHeader}>
                      <span style={styles.trackDetailsTitle}>ORDER SUMMARY</span>
                      <span style={styles.trackDetailsTotal}>Total: {formatPrice(selectedOrder.total)}</span>
                    </div>

                    <div style={styles.trackItems}>
                      {selectedOrder.items.map((item, i) => (
                        <div key={i} style={styles.trackItemRow}>
                          <span>{item.name} ({item.material || item.category}) x{item.quantity}</span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Horizontal Visual Stepper */}
                    <div style={styles.stepperWrapper}>
                      <div style={styles.stepperLineContainer}>
                        <div
                          className="stepper-progress"
                          style={{ width: `${(getStatusStepIndex(selectedOrder.status) / 3) * 100}%` }}
                        ></div>
                        <div className="stepper-container" style={{ margin: 0 }}>
                          <div className={`stepper-step ${getStatusStepIndex(selectedOrder.status) >= 0 ? 'completed' : ''} ${selectedOrder.status === 'Paid' ? 'active' : ''}`}>
                            <div className="stepper-circle">
                              {getStatusStepIndex(selectedOrder.status) > 0 ? <Check size={12} /> : '1'}
                            </div>
                            <div className="stepper-label">Paid</div>
                          </div>
                          <div className={`stepper-step ${getStatusStepIndex(selectedOrder.status) >= 1 ? 'completed' : ''} ${selectedOrder.status === 'Packed' ? 'active' : ''}`}>
                            <div className="stepper-circle">
                              {getStatusStepIndex(selectedOrder.status) > 1 ? <Check size={12} /> : '2'}
                            </div>
                            <div className="stepper-label">Packed</div>
                          </div>
                          <div className={`stepper-step ${getStatusStepIndex(selectedOrder.status) >= 2 ? 'completed' : ''} ${selectedOrder.status === 'Out for Delivery' ? 'active' : ''}`}>
                            <div className="stepper-circle">
                              {getStatusStepIndex(selectedOrder.status) > 2 ? <Check size={12} /> : '3'}
                            </div>
                            <div className="stepper-label">Out</div>
                          </div>
                          <div className={`stepper-step ${getStatusStepIndex(selectedOrder.status) >= 3 ? 'completed' : ''} ${selectedOrder.status === 'Delivered' ? 'active' : ''}`}>
                            <div className="stepper-circle">
                              {getStatusStepIndex(selectedOrder.status) >= 3 ? <Check size={12} /> : '4'}
                            </div>
                            <div className="stepper-label">Arrived</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Details */}
                    <div style={styles.addressBox}>
                      <div style={styles.addressRow}>
                        <MapPin size={14} style={{ color: 'var(--gold-primary)', marginTop: '2px' }} />
                        <div>
                          <span style={styles.addressLabel}>SHIPPING TO</span>
                          <p style={styles.addressText}>{selectedOrder.customerName}</p>
                          <p style={styles.addressVal}>{selectedOrder.address}</p>
                        </div>
                      </div>
                      <div style={styles.addressRow}>
                        <Truck size={14} style={{ color: 'var(--gold-primary)', marginTop: '2px' }} />
                        <div>
                          <span style={styles.addressLabel}>ASSIGNED RIDER</span>
                          <p style={styles.addressText}>{selectedOrder.rider || 'Allocating...'}</p>
                        </div>
                      </div>
                      {selectedOrder.status !== 'Delivered' && (
                        <div style={styles.otpNoticeBox} className="glass-card-gold">
                          <span style={{ fontWeight: '600', color: 'var(--gold-primary)' }}>Rider OTP Code: </span>
                          <strong style={{ fontSize: '0.9rem', color: '#fff', letterSpacing: '0.05em' }}>{selectedOrder.otp}</strong>
                          <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Provide this OTP code to the rider to verify delivery receipt.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
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
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
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
    minHeight: '380px',
  },
  panelTitle: {
    fontSize: '0.9rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--gold-primary)',
    marginBottom: '24px',
    fontWeight: '600',
    fontFamily: 'var(--font-sans)',
  },
  emptyBag: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0',
    textAlign: 'center',
    color: 'var(--text-secondary)',
  },
  emptyIcon: {
    color: 'var(--text-muted)',
    marginBottom: '16px',
  },
  shopBtn: {
    marginTop: '24px',
  },
  cartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border-muted)',
    paddingBottom: '10px',
    marginBottom: '16px',
    fontWeight: '600',
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    marginBottom: '16px',
    borderBottom: '1px solid var(--border-muted)',
  },
  itemName: {
    fontSize: '0.85rem',
    fontFamily: 'var(--font-serif)',
    fontWeight: '400',
  },
  itemMeta: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
  },
  itemPrice: {
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  summaryBox: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: '2px',
    border: '1px solid var(--border-muted)',
    marginBottom: '24px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  summaryTotal: {
    borderTop: '1px solid var(--border-muted)',
    paddingTop: '12px',
    marginBottom: 0,
    fontWeight: '600',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
  },
  wideBtn: {
    width: '100%',
    padding: '14px',
    textAlign: 'center',
  },
  miniStepper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '0.7rem',
    fontWeight: '600',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '30px',
    borderBottom: '1px solid var(--border-muted)',
    paddingBottom: '12px',
  },
  stepperTab: {
    color: 'var(--text-muted)',
  },
  stepperTabActive: {
    color: 'var(--gold-primary)',
  },
  stepperArrow: {
    color: 'var(--text-muted)',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  formTitle: {
    fontSize: '1.2rem',
    color: 'var(--text-primary)',
    marginBottom: '20px',
    fontFamily: 'var(--font-serif)',
  },
  inputGroup: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  inputLabel: {
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-muted)',
    color: 'var(--text-primary)',
    padding: '12px 16px',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    transition: 'var(--transition-fast)',
    borderRadius: '2px',
  },
  textArea: {
    resize: 'none',
  },
  btnRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  gatewayDesc: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginBottom: '20px',
  },
  cardContainer: {
    padding: '24px',
    borderRadius: '4px',
    marginBottom: '30px',
  },
  cardTitle: {
    fontSize: '0.7rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  amountBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '20px 0',
    padding: '12px 0',
    borderTop: '1px solid var(--border-muted)',
    borderBottom: '1px solid var(--border-muted)',
  },
  amountLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  amountValue: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  cardForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardRow: {
    display: 'flex',
    gap: '16px',
  },
  textInputDisabled: {
    backgroundColor: '#0a0a0c',
    border: '1px solid #222224',
    color: '#444446',
    padding: '10px 14px',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-sans)',
    borderRadius: '2px',
    width: '100%',
  },
  payBtn: {
    padding: '14px 28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  spinnerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  spinner: {
    width: '14px',
    height: '14px',
    border: '2px solid rgba(7,7,8,0.3)',
    borderTopColor: '#070708',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'shimmer 1.5s linear infinite', // simplified spinning animation via background
  },
  successBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 0',
    textAlign: 'center',
  },
  successTitle: {
    fontSize: '1.6rem',
    marginBottom: '8px',
    fontFamily: 'var(--font-serif)',
  },
  successDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    maxWidth: '440px',
    marginBottom: '30px',
  },
  otpBox: {
    padding: '24px',
    borderRadius: '4px',
    maxWidth: '360px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  otpLabel: {
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  otpVal: {
    fontSize: '2rem',
    fontWeight: '700',
    letterSpacing: '0.15em',
    color: 'var(--gold-primary)',
    margin: '10px 0',
  },
  otpNotice: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    lineHeight: '1.4',
  },
  noOrdersText: {
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
    textAlign: 'center',
    paddingTop: '60px',
  },
  orderSelectorList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '180px',
    overflowY: 'auto',
    marginBottom: '30px',
    borderBottom: '1px solid var(--border-muted)',
    paddingBottom: '16px',
  },
  orderSelectorBtn: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-muted)',
    padding: '12px 16px',
    borderRadius: '2px',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  orderSelectorBtnActive: {
    borderColor: 'var(--gold-primary)',
    backgroundColor: 'rgba(197,160,89,0.05)',
  },
  orderSelLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
  },
  orderSelId: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  orderSelDate: {
    fontSize: '0.6rem',
    color: 'var(--text-muted)',
  },
  orderSelStatus: {
    fontSize: '0.65rem',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '2px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statusDelivered: {
    backgroundColor: 'rgba(40,167,69,0.1)',
    color: '#28a745',
  },
  statusPending: {
    backgroundColor: 'rgba(212,175,55,0.1)',
    color: 'var(--gold-primary)',
  },
  trackingDetails: {
    borderTop: '1px solid var(--border-muted)',
    paddingTop: '20px',
  },
  trackDetailsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  trackDetailsTitle: {
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  trackDetailsTotal: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  trackItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '30px',
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: '16px',
    borderRadius: '2px',
    border: '1px solid var(--border-muted)',
  },
  trackItemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  stepperWrapper: {
    margin: '30px 0 40px 0',
  },
  stepperLineContainer: {
    position: 'relative',
    padding: '0 10px',
  },
  addressBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    backgroundColor: 'rgba(255,255,255,0.01)',
    padding: '20px',
    borderRadius: '2px',
    border: '1px solid var(--border-muted)',
  },
  addressRow: {
    display: 'flex',
    gap: '12px',
  },
  addressLabel: {
    fontSize: '0.55rem',
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
    fontWeight: '600',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '4px',
  },
  addressText: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  addressVal: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    marginTop: '2px',
    lineHeight: '1.4',
  },
  otpNoticeBox: {
    padding: '12px 16px',
    borderRadius: '2px',
    marginTop: '10px',
  },
}
