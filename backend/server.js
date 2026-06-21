import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import Razorpay from 'razorpay';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*', // Allow all for demo purposes, or adjust to frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Initialize Razorpay
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('Razorpay initialized in Test Mode successfully.');
  } catch (error) {
    console.error('Error initializing Razorpay:', error);
  }
} else {
  console.warn('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are missing. Operating in simulated payment mode.');
}

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dtc-access-secret-key-12345';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dtc-refresh-secret-key-67890';

// JWT helper functions
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_ACCESS_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Middleware: Authenticate User
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token missing' });

  jwt.verify(token, JWT_ACCESS_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token expired or invalid' });
    req.user = user;
    next();
  });
};

// Middleware: Require Admin Role
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin resource. Access denied.' });
  }
  next();
};

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role: 'CUSTOMER',
      },
    });

    // Create a Cart for the user
    await prisma.cart.create({
      data: {
        userId: user.id,
      },
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { addresses: true }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, addresses: user.addresses },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Refresh Token
app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err, payload) => {
    if (err) return res.status(403).json({ error: 'Invalid refresh token' });

    try {
      const user = await prisma.user.findUnique({ where: { id: payload.id } });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const newAccessToken = generateAccessToken(user);
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(500).json({ error: 'Server error refreshing token' });
    }
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Get current user profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, phone: true, role: true, addresses: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Profile & Addresses
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;

    // Update user profile fields
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || undefined,
        phone: phone || undefined,
      },
    });

    // Address sync if provided
    if (addresses && Array.isArray(addresses)) {
      for (const addr of addresses) {
        if (addr.id) {
          await prisma.address.update({
            where: { id: addr.id },
            data: {
              street: addr.street,
              city: addr.city,
              state: addr.state,
              postalCode: addr.postalCode,
              country: addr.country || 'India',
              isDefault: addr.isDefault || false,
            },
          });
        } else {
          await prisma.address.create({
            data: {
              street: addr.street,
              city: addr.city,
              state: addr.state,
              postalCode: addr.postalCode,
              country: addr.country || 'India',
              isDefault: addr.isDefault || false,
              userId: req.user.id,
            },
          });
        }
      }
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, phone: true, role: true, addresses: true },
    });

    res.json(fullUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

// ==========================================
// CATEGORY & PRODUCT ENDPOINTS
// ==========================================

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get products (with pagination, sort, search, filters)
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12, minPrice, maxPrice, brand } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build query conditions
    const where = {};

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { brand: { contains: search } }
      ];
    }

    // Price filters
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (brand) {
      where.brand = brand;
    }

    // Sorting
    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'name_asc') {
      orderBy = { name: 'asc' };
    } else if (sort === 'name_desc') {
      orderBy = { name: 'desc' };
    }

    const [products, totalCount] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          category: { select: { name: true, slug: true } },
          reviews: { select: { rating: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // Format products to parse spec & images JSON
    const formattedProducts = products.map(p => {
      let parsedSpecs = {};
      try {
        parsedSpecs = JSON.parse(p.specs);
      } catch (e) {
        parsedSpecs = p.specs;
      }
      return {
        ...p,
        images: p.images.split(','),
        specs: parsedSpecs,
        rating: p.reviews.length > 0
          ? parseFloat((p.reviews.reduce((acc, curr) => acc + curr.rating, 0) / p.reviews.length).toFixed(1))
          : 0,
      };
    });

    res.json({
      products: formattedProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product by slug
app.get('/api/products/:slug', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        reviews: {
          include: {
            user: { select: { name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) return res.status(404).json({ error: 'Product not found' });

    let parsedSpecs = {};
    try {
      parsedSpecs = JSON.parse(product.specs);
    } catch (e) {
      parsedSpecs = product.specs;
    }

    res.json({
      ...product,
      images: product.images.split(','),
      specs: parsedSpecs,
      rating: product.reviews.length > 0
        ? parseFloat((product.reviews.reduce((acc, curr) => acc + curr.rating, 0) / product.reviews.length).toFixed(1))
        : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

// ==========================================
// CART ENDPOINTS (JWT SECURED)
// ==========================================

// Get user cart
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
        include: { items: { include: { product: true } } },
      });
    }

    // Format item images & specs
    const formattedItems = cart.items.map((item) => {
      let parsedSpecs = {};
      try {
        parsedSpecs = JSON.parse(item.product.specs);
      } catch (e) {
        parsedSpecs = item.product.specs;
      }
      return {
        ...item,
        product: {
          ...item.product,
          images: item.product.images.split(','),
          specs: parsedSpecs,
        },
      };
    });

    res.json({ ...cart, items: formattedItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add item to cart
app.post('/api/cart/add', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) return res.status(400).json({ error: 'Product ID required' });

    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: req.user.id } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    // Fetch updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });

    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
app.put('/api/cart/update', authenticateToken, async (req, res) => {
  try {
    const { cartItemId, quantity } = req.body;

    if (!cartItemId || quantity === undefined) {
      return res.status(400).json({ error: 'Cart Item ID and quantity are required' });
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: cartItemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });

    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Remove item from cart
app.delete('/api/cart/remove', authenticateToken, async (req, res) => {
  try {
    const { cartItemId } = req.body;

    if (!cartItemId) return res.status(400).json({ error: 'Cart Item ID required' });

    await prisma.cartItem.delete({ where: { id: cartItemId } });

    const updatedCart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });

    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// ==========================================
// ORDER & PAYMENT ENDPOINTS
// ==========================================

// Create Order (And initialize Razorpay Order if configured)
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { addressId, items } = req.body; // items: [{ productId, quantity, price }]

    if (!addressId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Address and order items are required' });
    }

    // Verify Address belongs to User
    const address = await prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.userId !== req.user.id) {
      return res.status(400).json({ error: 'Invalid delivery address' });
    }

    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const dbProduct = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!dbProduct || dbProduct.stock < item.quantity) {
        return res.status(400).json({ error: `Product ${dbProduct?.name || item.productId} is out of stock or insufficient` });
      }
      const price = dbProduct.discountPrice || dbProduct.price;
      totalAmount += price * item.quantity;
    }

    // Create Order in pending status
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        addressId,
        totalAmount,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: true }
    });

    // Create Razorpay Order
    if (razorpay) {
      try {
        const rzpOrder = await razorpay.orders.create({
          amount: Math.round(totalAmount * 100), // in paise
          currency: 'INR',
          receipt: order.id,
        });

        // Save Razorpay Order ID to DB
        await prisma.order.update({
          where: { id: order.id },
          data: { razorpayOrderId: rzpOrder.id }
        });

        return res.status(201).json({
          orderId: order.id,
          razorpayOrderId: rzpOrder.id,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          keyId: process.env.RAZORPAY_KEY_ID,
          mode: 'RAZORPAY'
        });
      } catch (err) {
        console.error('Razorpay order creation failed. Falling back to simulation.', err);
      }
    }

    // Simulated Order Flow if Razorpay keys are not set
    const simOrderId = `rzp_sim_${crypto.randomBytes(8).toString('hex')}`;
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: simOrderId }
    });

    res.status(201).json({
      orderId: order.id,
      razorpayOrderId: simOrderId,
      amount: totalAmount * 100,
      currency: 'INR',
      keyId: 'rzp_test_simulated',
      mode: 'SIMULATED'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify Payment
app.post('/api/payments/verify', authenticateToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ error: 'Payment parameters missing' });
    }

    let isVerified = false;

    if (razorpay_order_id.startsWith('rzp_sim_')) {
      // Simulated payment verification always passes
      isVerified = true;
      console.log('Simulated payment verification passed.');
    } else if (razorpay && razorpay_signature) {
      // Validate Razorpay Signature
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
      const generated_signature = hmac.digest('hex');

      if (generated_signature === razorpay_signature) {
        isVerified = true;
      }
    }

    if (isVerified) {
      // Update Order Status to CONFIRMED and PAID
      const dbOrder = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true }
      });

      if (!dbOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }

      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          razorpayPaymentId: razorpay_payment_id
        }
      });

      // Deduct inventory stock
      for (const item of dbOrder.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      // Empty user's cart
      const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
      if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      }

      return res.json({ status: 'success', message: 'Payment verified and order confirmed.' });
    } else {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'FAILED' }
      });
      return res.status(400).json({ status: 'failure', error: 'Payment signature mismatch' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during payment verification' });
  }
});

// Get user's own orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        shippingAddress: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedOrders = orders.map(o => ({
      ...o,
      items: o.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          images: item.product.images.split(',')
        }
      }))
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order details by ID
app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        shippingAddress: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized view' });
    }

    const formattedOrder = {
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          images: item.product.images.split(',')
        }
      }))
    };

    res.json(formattedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});

// ==========================================
// ADMIN ENDPOINTS (ROLE & JWT SECURED)
// ==========================================

// Get all orders for Admin
app.get('/api/admin/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        shippingAddress: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedOrders = orders.map(o => ({
      ...o,
      items: o.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          images: item.product.images.split(',')
        }
      }))
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch admin orders' });
  }
});

// Update Order Status
app.patch('/api/admin/orders/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body; // PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Admin Product CRUD: Create
app.post('/api/admin/products', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, slug, description, price, discountPrice, stock, images, specs, brand, categoryId } = req.body;

    if (!name || !slug || !price || !categoryId || !images) {
      return res.status(400).json({ error: 'Missing required product fields' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || '',
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        stock: parseInt(stock) || 0,
        images: Array.isArray(images) ? images.join(',') : images,
        specs: typeof specs === 'string' ? specs : JSON.stringify(specs || {}),
        brand: brand || 'Generic',
        categoryId,
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Admin Product CRUD: Update
app.put('/api/admin/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, slug, description, price, discountPrice, stock, images, specs, brand, categoryId } = req.body;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        slug,
        description,
        price: price ? parseFloat(price) : undefined,
        discountPrice: discountPrice !== undefined ? (discountPrice ? parseFloat(discountPrice) : null) : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        images: Array.isArray(images) ? images.join(',') : images,
        specs: typeof specs === 'string' ? specs : (specs ? JSON.stringify(specs) : undefined),
        brand,
        categoryId,
      }
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Admin Product CRUD: Delete
app.delete('/api/admin/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Post a review
app.post('/api/products/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating) return res.status(400).json({ error: 'Rating is required' });

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        productId: req.params.id,
        userId: req.user.id,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to post review' });
  }
});

// Get Sales Metrics for Dashboard
app.get('/api/admin/metrics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalOrders = await prisma.order.count();
    const paidOrders = await prisma.order.findMany({
      where: { paymentStatus: 'PAID' }
    });

    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrdersCount = await prisma.order.count({ where: { status: 'PENDING' } });
    const shippedOrdersCount = await prisma.order.count({ where: { status: 'SHIPPED' } });
    const deliveredOrdersCount = await prisma.order.count({ where: { status: 'DELIVERED' } });
    const totalUsers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
    const totalProducts = await prisma.product.count();

    res.json({
      totalOrders,
      totalRevenue,
      pendingOrders: pendingOrdersCount,
      shippedOrders: shippedOrdersCount,
      deliveredOrders: deliveredOrdersCount,
      totalUsers,
      totalProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to calculate metrics' });
  }
});

// Post contact message
app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;
  console.log(`[CONTACT INQUIRY] Name: ${name}, Email: ${email}, Phone: ${phone}, Message: ${message}`);
  res.json({ status: 'success', message: 'Inquiry received successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
