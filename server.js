const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Serve static assets from frontend/public/assets folder
app.use('/assets', express.static(path.join(__dirname, 'frontend/public/assets')));

// Mock Products Database
let products = [
  {
    id: 'prod-1',
    name: 'Meridian Gold Hoops',
    description: 'Handformed 18k gold hoop earrings, featuring a textured hammered finish that catches light beautifully. Small-batch crafted.',
    price: 36000,
    category: 'Gold',
    material: '18k Yellow Gold',
    stock: 5,
    tag: 'Best Seller',
    image: '/assets/meridian_hoops.png'
  },
  {
    id: 'prod-2',
    name: 'Solis Solitaire Pendant',
    description: 'Delicate 18k gold chain adorned with a brilliant-cut solitaire diamond (0.5ct). Hand-set with a bezel finish.',
    price: 84000,
    category: 'Diamond',
    material: '18k Yellow Gold & Diamond',
    stock: 2,
    tag: 'Signature',
    image: '/assets/solis_pendant.png'
  },
  {
    id: 'prod-3',
    name: 'Lunar Platinum Band',
    description: 'Textured matte platinum ring with embedded pavé-set diamonds. Organic, imperfect shape celebrating raw artisanal craft.',
    price: 68000,
    category: 'Silver', // Categorized by silver/white metal look
    material: 'Matte Platinum & Diamonds',
    stock: 3,
    tag: 'Only 3 Left',
    image: '/assets/lunar_band.png'
  },
  {
    id: 'prod-4',
    name: 'Nebula Cuff Bracelet',
    description: 'Artisanal sterling silver split-cuff bracelet inspired by organic celestial formations. Highly polished finish.',
    price: 24000,
    category: 'Silver',
    material: '925 Sterling Silver',
    stock: 8,
    tag: 'Limited Cast',
    image: '/assets/nebula_bracelet.png'
  },
  {
    id: 'prod-5',
    name: 'Eclipse Rose Studs',
    description: 'Hexagonal dark obsidian gems claw-set into raw 18k rose gold. Minimalist luxury for daily wear.',
    price: 28000,
    category: 'Rose Gold',
    material: '18k Rose Gold & Obsidian',
    stock: 1,
    tag: 'Rare Cast',
    image: '/assets/eclipse_studs.png'
  },
  {
    id: 'prod-6',
    name: 'Aurora Emerald Solitaire',
    description: 'Luminous cabochon-cut natural Colombian emerald set in hand-filed raw yellow gold. Elegant organic bezel.',
    price: 95000,
    category: 'Gold',
    material: '18k Yellow Gold & Emerald',
    stock: 4,
    tag: 'Artisan Special',
    image: '/assets/aurora_ring.png'
  }
];

// Mock Orders Database
let orders = [
  {
    id: 'ord-1001',
    customerName: 'Aditya Sen',
    email: 'aditya.sen@gmail.com',
    phone: '9876543210',
    address: 'Apt 4B, Silver Oak Residences, Golf Course Road, Gurgaon - 122002',
    items: [
      {
        id: 'prod-1',
        name: 'Meridian Gold Hoops',
        price: 36000,
        quantity: 1,
        material: '18k Yellow Gold'
      }
    ],
    total: 36000,
    status: 'Delivered', // Paid, Packed, Out for Delivery, Delivered
    rider: 'Vikram S.',
    otp: '4821',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: 'ord-1002',
    customerName: 'Priya Sharma',
    email: 'priya.sharma@yahoo.com',
    phone: '9812345678',
    address: 'B-702, Prestige Lakeside Habitat, Varthur, Bangalore - 560087',
    items: [
      {
        id: 'prod-3',
        name: 'Lunar Platinum Band',
        price: 68000,
        quantity: 1,
        material: 'Matte Platinum & Diamonds'
      }
    ],
    total: 68000,
    status: 'Out for Delivery',
    rider: 'Vikram S.',
    otp: '1234', // Easy default for demo verification
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
  }
];

// Helper to reset database to initial state
const initialProducts = JSON.parse(JSON.stringify(products));
const initialOrders = JSON.parse(JSON.stringify(orders));

// API Routes

// GET all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// POST list new product
app.post('/api/products', (req, res) => {
  const { name, description, price, category, material, stock, tag } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Missing required product information' });
  }

  const newProduct = {
    id: `prod-${products.length + 1}`,
    name,
    description: description || 'Artisanal handformed fine jewellery.',
    price: Number(price),
    category,
    material: material || `${category} Base`,
    stock: Number(stock) || 5,
    tag: tag || 'New Arrival',
    image: '/assets/placeholder_jewel.png' // Default fallback
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT update product (stock/details)
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products[index] = {
    ...products[index],
    ...req.body,
    price: req.body.price ? Number(req.body.price) : products[index].price,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : products[index].stock
  };

  res.json(products[index]);
});

// GET all orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// POST checkout/place order
app.post('/api/orders', (req, res) => {
  const { customerName, email, phone, address, items, total } = req.body;

  if (!customerName || !email || !address || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing customer details or cart items' });
  }

  // Create order
  const newOrder = {
    id: `ord-${1000 + orders.length + 1}`,
    customerName,
    email,
    phone: phone || '9999999999',
    address,
    items,
    total,
    status: 'Paid', // Starts at Paid/Packed
    rider: 'Vikram S.',
    otp: Math.floor(1000 + Math.random() * 9000).toString(),
    createdAt: new Date().toISOString()
  };

  // Adjust stock counts
  items.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
    }
  });

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// PUT update order status
app.put('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (status) {
    order.status = status;
  }

  res.json(order);
});

// POST reset demo database
app.post('/api/reset', (req, res) => {
  products = JSON.parse(JSON.stringify(initialProducts));
  orders = JSON.parse(JSON.stringify(initialOrders));
  res.json({ message: 'Database reset successfully' });
});

// Serve frontend in production (if built)
app.use(express.static(path.join(__dirname, 'frontend/dist')));
app.get('*', (req, res, next) => {
  // If it matches an API route, skip static index.html
  if (req.url.startsWith('/api')) return next();
  const indexPath = path.join(__dirname, 'frontend/dist/index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(500).send(`Aurelia Luxury Server Error. Attempted Path: ${indexPath} | Error: ${err.message}`);
    }
  });
});

app.listen(PORT, () => {
  console.log(`[SERVER] Aurelia Backend running on http://localhost:${PORT}`);
});
