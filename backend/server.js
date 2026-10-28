
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error("ERROR: Set JWT_SECRET to a random secret of at least 32 characters in .env");
  process.exit(1);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cantine_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true,
});

// ---------------- HELPERS ----------------

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const positiveNumber = (value) =>
  value !== undefined && value !== null &&
  value !== "" && Number.isFinite(Number(value)) &&
  Number(value) > 0;

const nonNegativeNumber = (value) =>
  value !== undefined && value !== null &&
  value !== "" && Number.isFinite(Number(value)) &&
  Number(value) >= 0;

function makeToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      status: user.status,
    },
    JWT_SECRET,
    { expiresIn: "12h" }
  );
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
    status: user.status,
    created_at: user.created_at,
  };
}

async function getUserById(id) {
  const [rows] = await pool.execute(
    "SELECT id, name, username, role, status, created_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

async function recordStockMovement(
  connection,
  productId,
  quantity,
  movementType,
  employeeId
) {
  await connection.execute(
    `INSERT INTO stock_movements
     (product_id, quantity, movement_type, employee_id)
     VALUES (?, ?, ?, ?)`,
    [productId, quantity, movementType, employeeId || null]
  );
}

async function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin permission required." });
  }
  next();
}

// ---------------- AUTHENTICATION ----------------

async function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Please log in first." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    if (user.status !== "approved") {
      return res.status(403).json({
        message: `Your account status is ${user.status}. Contact the administrator.`,
        status: user.status,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Cantine API is running." });
});

// Register: first account becomes admin; later accounts await approval.
app.post("/api/auth/register", asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const username = String(req.body.username || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (name.length < 2 || username.length < 3 || password.length < 8) {
    return res.status(400).json({
      message: "Name must have at least 2 characters, username 3, and password 8.",
    });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [existing] = await connection.execute(
      "SELECT id FROM users WHERE username = ? LIMIT 1",
      [username]
    );

    if (existing.length) {
      await connection.rollback();
      return res.status(409).json({ message: "Username already exists." });
    }

    const [countRows] = await connection.execute(
      "SELECT COUNT(*) AS total FROM users"
    );

    const isFirstUser = Number(countRows[0].total) === 0;
    const role = isFirstUser ? "admin" : "user";
    const status = isFirstUser ? "approved" : "pending";
    const passwordHash = await bcrypt.hash(password, 12);

    const [result] = await connection.execute(
      `INSERT INTO users (name, username, password, role, status)
       VALUES (?, ?, ?, ?, ?)`,
      [name, username, passwordHash, role, status]
    );

    await connection.commit();

    const user = await getUserById(result.insertId);

    if (status !== "approved") {
      return res.status(201).json({
        message: "Registration successful. Wait for admin approval.",
        user,
      });
    }

    return res.status(201).json({
      message: "First account created as administrator.",
      user,
      token: makeToken(user),
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}));

app.post("/api/auth/login", asyncHandler(async (req, res) => {
  const username = String(req.body.username || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!username || !password) {
    return res.status(400).json({ message: "Enter username and password." });
  }

  const [rows] = await pool.execute(
    `SELECT id, name, username, password, role, status, created_at
     FROM users WHERE username = ? LIMIT 1`,
    [username]
  );

  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  if (user.status !== "approved") {
    return res.status(403).json({
      message: `Your account is ${user.status}. Contact the administrator.`,
      status: user.status,
    });
  }

  res.json({
    message: "Login successful.",
    user: publicUser(user),
    token: makeToken(user),
  });
}));

app.get("/api/auth/me", authenticate, asyncHandler(async (req, res) => {
  res.json({ user: req.user });
}));

// ---------------- USERS: ADMIN ----------------

app.get("/api/users", authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const [users] = await pool.execute(
    `SELECT id, name, username, role, status, created_at
     FROM users ORDER BY id DESC`
  );
  res.json(users);
}));

app.patch("/api/users/:id/status", authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const status = String(req.body.status || "");

  if (!Number.isInteger(id) || id < 1 ||
      !["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid user ID or status." });
  }

  if (id === req.user.id && status !== "approved") {
    return res.status(400).json({ message: "You cannot suspend your own account." });
  }

  const [result] = await pool.execute(
    "UPDATE users SET status = ? WHERE id = ?",
    [status, id]
  );

  if (!result.affectedRows) {
    return res.status(404).json({ message: "User not found." });
  }

  res.json({ message: "User status updated.", user: await getUserById(id) });
}));

app.patch("/api/users/:id/role", authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const role = String(req.body.role || "");

  if (!Number.isInteger(id) || id < 1 || !["admin", "user"].includes(role)) {
    return res.status(400).json({ message: "Invalid user ID or role." });
  }

  if (id === req.user.id && role !== "admin") {
    return res.status(400).json({ message: "You cannot remove your own admin role." });
  }

  const [result] = await pool.execute(
    "UPDATE users SET role = ? WHERE id = ?",
    [role, id]
  );

  if (!result.affectedRows) {
    return res.status(404).json({ message: "User not found." });
  }

  res.json({ message: "User role updated.", user: await getUserById(id) });
}));

// ---------------- PRODUCTS ----------------

app.get("/api/products", authenticate, asyncHandler(async (req, res) => {
  const [products] = await pool.execute(
    `SELECT id, name, opening_stock, stock, purchase_price, selling_price, created_at
     FROM products ORDER BY name ASC`
  );
  res.json(products);
}));

app.post("/api/products", authenticate, asyncHandler(async (req, res) => {
  const name = String(req.body.name || "").trim();
  const openingStock = req.body.opening_stock ?? req.body.openingStock;
  const purchasePrice = req.body.purchase_price ?? req.body.purchasePrice;
  const sellingPrice = req.body.selling_price ?? req.body.sellingPrice;

  if (
    name.length < 1 ||
    !nonNegativeNumber(openingStock) ||
    !nonNegativeNumber(purchasePrice) ||
    !positiveNumber(sellingPrice) ||
    !Number.isInteger(Number(openingStock))
  ) {
    return res.status(400).json({
      message: "Enter product name, valid opening stock, purchase price and selling price.",
    });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO products
       (name, opening_stock, stock, purchase_price, selling_price)
       VALUES (?, ?, ?, ?, ?)`,
      [name, Number(openingStock), Number(openingStock),
       Number(purchasePrice), Number(sellingPrice)]
    );

    if (Number(openingStock) > 0) {
      await recordStockMovement(
        connection, result.insertId, Number(openingStock), "opening", req.user.id
      );
    }

    await connection.commit();

    const [rows] = await pool.execute(
      "SELECT * FROM products WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({ message: "Product registered.", product: rows[0] });
  } catch (error) {
    await connection.rollback();

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "A product with that name already exists." });
    }
    throw error;
  } finally {
    connection.release();
  }
}));

app.put("/api/products/:id", authenticate, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const name = String(req.body.name || "").trim();
  const purchasePrice = req.body.purchase_price ?? req.body.purchasePrice;
  const sellingPrice = req.body.selling_price ?? req.body.sellingPrice;

  if (!Number.isInteger(id) || id < 1 || !name ||
      !nonNegativeNumber(purchasePrice) || !positiveNumber(sellingPrice)) {
    return res.status(400).json({ message: "Invalid product information." });
  }

  try {
    const [result] = await pool.execute(
      `UPDATE products
       SET name = ?, purchase_price = ?, selling_price = ?
       WHERE id = ?`,
      [name, Number(purchasePrice), Number(sellingPrice), id]
    );

    if (!result.affectedRows) {
      const [check] = await pool.execute("SELECT id FROM products WHERE id = ?", [id]);
      if (!check.length) return res.status(404).json({ message: "Product not found." });
    }

    const [rows] = await pool.execute("SELECT * FROM products WHERE id = ?", [id]);
    res.json({ message: "Product updated.", product: rows[0] });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Another product has that name." });
    }
    throw error;
  }
}));

app.delete("/api/products/:id", authenticate, requireAdmin, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  try {
    const [result] = await pool.execute("DELETE FROM products WHERE id = ?", [id]);

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json({ message: "Product deleted." });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message: "This product has sales or stock history and cannot be deleted. Keep it for reporting.",
      });
    }
    throw error;
  }
}));

// ---------------- STOCK / PURCHASES ----------------

// Add purchased bottles to stock.
app.post("/api/stock/purchase", authenticate, asyncHandler(async (req, res) => {
  const productId = Number(req.body.product_id ?? req.body.productId);
  const quantity = Number(req.body.quantity);

  if (!Number.isInteger(productId) || productId < 1 ||
      !Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: "Product ID and positive whole-number quantity are required." });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [products] = await connection.execute(
      "SELECT id, stock FROM products WHERE id = ? FOR UPDATE",
      [productId]
    );

    if (!products.length) {
      await connection.rollback();
      return res.status(404).json({ message: "Product not found." });
    }

    await connection.execute(
      "UPDATE products SET stock = stock + ? WHERE id = ?",
      [quantity, productId]
    );

    await recordStockMovement(
      connection, productId, quantity, "purchase", req.user.id
    );

    await connection.commit();

    const [updated] = await pool.execute(
      "SELECT * FROM products WHERE id = ?", [productId]
    );

    res.status(201).json({
      message: "Stock added successfully.",
      product: updated[0],
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}));

app.get("/api/stock/movements", authenticate, asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT sm.id, sm.product_id, p.name AS product_name,
            sm.quantity, sm.movement_type, sm.employee_id,
            u.name AS employee_name, sm.created_at
     FROM stock_movements sm
     JOIN products p ON p.id = sm.product_id
     LEFT JOIN users u ON u.id = sm.employee_id
     ORDER BY sm.created_at DESC
     LIMIT 1000`
  );
  res.json(rows);
}));

// ---------------- SALES ----------------

// Sale request: { product_id, quantity }
// Stock decrement and sale insert happen in one DB transaction.
app.post("/api/sales", authenticate, asyncHandler(async (req, res) => {
  const productId = Number(req.body.product_id ?? req.body.productId);
  const quantity = Number(req.body.quantity);

  if (!Number.isInteger(productId) || productId < 1 ||
      !Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({
      message: "Product ID and quantity must be positive whole numbers.",
    });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [products] = await connection.execute(
      `SELECT id, name, stock, purchase_price, selling_price
       FROM products WHERE id = ? FOR UPDATE`,
      [productId]
    );

    if (!products.length) {
      await connection.rollback();
      return res.status(404).json({ message: "Product not found." });
    }

    const product = products[0];

    if (Number(product.stock) < quantity) {
      await connection.rollback();
      return res.status(400).json({
        message: `Insufficient stock. Available: ${product.stock} bottles.`,
      });
    }

    const unitPrice = Number(product.selling_price);
    const unitCost = Number(product.purchase_price);
    const total = Number((unitPrice * quantity).toFixed(2));
    const cost = Number((unitCost * quantity).toFixed(2));

    const [saleResult] = await connection.execute(
      `INSERT INTO sales
       (product_id, quantity, unit_price, unit_cost, total, cost, employee_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [productId, quantity, unitPrice, unitCost, total, cost, req.user.id]
    );

    await connection.execute(
      "UPDATE products SET stock = stock - ? WHERE id = ?",
      [quantity, productId]
    );

    await recordStockMovement(
      connection, productId, -quantity, "sale", req.user.id
    );

    await connection.commit();

    const [sales] = await pool.execute(
      `SELECT s.id, s.product_id, p.name AS product_name, s.quantity,
              s.unit_price, s.unit_cost, s.total, s.cost,
              (s.total - s.cost) AS profit, s.employee_id,
              u.name AS employee_name, s.created_at
       FROM sales s
       JOIN products p ON p.id = s.product_id
       LEFT JOIN users u ON u.id = s.employee_id
       WHERE s.id = ?`,
      [saleResult.insertId]
    );

    res.status(201).json({ message: "Sale recorded.", sale: sales[0] });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}));

app.get("/api/sales", authenticate, asyncHandler(async (req, res) => {
  const from = req.query.from;
  const to = req.query.to;
  const params = [];
  let where = "";

  if (from) {
    where += " AND DATE(s.created_at) >= ?";
    params.push(from);
  }

  if (to) {
    where += " AND DATE(s.created_at) <= ?";
    params.push(to);
  }

  const [rows] = await pool.execute(
    `SELECT s.id, s.product_id, p.name AS product_name, s.quantity,
            s.unit_price, s.unit_cost, s.total, s.cost,
            (s.total - s.cost) AS profit,
            s.employee_id, u.name AS employee_name, s.created_at
     FROM sales s
     JOIN products p ON p.id = s.product_id
     LEFT JOIN users u ON u.id = s.employee_id
     WHERE 1 = 1 ${where}
     ORDER BY s.created_at DESC
     LIMIT 5000`,
    params
  );

  res.json(rows);
}));

// ---------------- EXPENSES ----------------

app.get("/api/expenses", authenticate, asyncHandler(async (req, res) => {
  const from = req.query.from;
  const to = req.query.to;
  const params = [];
  let where = "";

  if (from) {
    where += " AND DATE(e.created_at) >= ?";
    params.push(from);
  }

  if (to) {
    where += " AND DATE(e.created_at) <= ?";
    params.push(to);
  }

  const [rows] = await pool.execute(
    `SELECT e.id, e.description, e.amount, e.employee_id,
            u.name AS employee_name, e.created_at
     FROM expenses e
     LEFT JOIN users u ON u.id = e.employee_id
     WHERE 1 = 1 ${where}
     ORDER BY e.created_at DESC
     LIMIT 5000`,
    params
  );

  res.json(rows);
}));

app.post("/api/expenses", authenticate, asyncHandler(async (req, res) => {
  const description = String(req.body.description || "").trim();
  const amount = Number(req.body.amount);

  if (!description || description.length > 255 || !positiveNumber(amount)) {
    return res.status(400).json({
      message: "Enter an expense description and an amount greater than zero.",
    });
  }

  const [result] = await pool.execute(
    `INSERT INTO expenses (description, amount, employee_id)
     VALUES (?, ?, ?)`,
    [description, amount, req.user.id]
  );

  const [rows] = await pool.execute(
    `SELECT e.id, e.description, e.amount, e.employee_id,
            u.name AS employee_name, e.created_at
     FROM expenses e
     LEFT JOIN users u ON u.id = e.employee_id
     WHERE e.id = ?`,
    [result.insertId]
  );

  res.status(201).json({ message: "Expense recorded.", expense: rows[0] });
}));

app.delete("/api/expenses/:id", authenticate, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const [rows] = await pool.execute(
    "SELECT id, employee_id FROM expenses WHERE id = ?",
    [id]
  );

  if (!rows.length) {
    return res.status(404).json({ message: "Expense not found." });
  }

  if (req.user.role !== "admin" &&
      Number(rows[0].employee_id) !== Number(req.user.id)) {
    return res.status(403).json({ message: "You can only delete your own expenses." });
  }

  await pool.execute("DELETE FROM expenses WHERE id = ?", [id]);
  res.json({ message: "Expense deleted." });
}));

// ---------------- REPORTS / DASHBOARD ----------------

app.get("/api/reports/summary", authenticate, asyncHandler(async (req, res) => {
  const date = String(req.query.date || new Date().toISOString().slice(0, 10));

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ message: "Date must use YYYY-MM-DD format." });
  }

  const [[sales]] = await pool.execute(
    `SELECT
       COALESCE(SUM(quantity), 0) AS bottles_sold,
       COALESCE(SUM(total), 0) AS revenue,
       COALESCE(SUM(cost), 0) AS cost_of_goods,
       COALESCE(SUM(total - cost), 0) AS gross_profit,
       COUNT(*) AS sale_count
     FROM sales WHERE DATE(created_at) = ?`,
    [date]
  );

  const [[expenses]] = await pool.execute(
    `SELECT COALESCE(SUM(amount), 0) AS expenses
     FROM expenses WHERE DATE(created_at) = ?`,
    [date]
  );

  const [[stock]] = await pool.execute(
    `SELECT COUNT(*) AS product_count,
            COALESCE(SUM(stock), 0) AS bottles_in_stock
     FROM products`
  );

  const netProfit = Number(sales.gross_profit) - Number(expenses.expenses);

  res.json({
    date,
    bottles_sold: Number(sales.bottles_sold),
    revenue: Number(sales.revenue),
    cost_of_goods: Number(sales.cost_of_goods),
    gross_profit: Number(sales.gross_profit),
    expenses: Number(expenses.expenses),
    net_profit: Number(netProfit.toFixed(2)),
    sale_count: Number(sales.sale_count),
    product_count: Number(stock.product_count),
    bottles_in_stock: Number(stock.bottles_in_stock),
    currency: "RWF",
  });
}));

app.get("/api/reports/daily", authenticate, asyncHandler(async (req, res) => {
  const from = req.query.from || new Date().toISOString().slice(0, 10);
  const to = req.query.to || from;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(to) || from > to) {
    return res.status(400).json({ message: "Provide valid from/to dates in YYYY-MM-DD format." });
  }

  const [rows] = await pool.execute(
    `SELECT d.report_date,
            COALESCE(s.bottles_sold, 0) AS bottles_sold,
            COALESCE(s.revenue, 0) AS revenue,
            COALESCE(s.cost_of_goods, 0) AS cost_of_goods,
            COALESCE(s.gross_profit, 0) AS gross_profit,
            COALESCE(e.expenses, 0) AS expenses,
            COALESCE(s.gross_profit, 0) - COALESCE(e.expenses, 0) AS net_profit
     FROM (
       SELECT DATE(created_at) AS report_date FROM sales
       WHERE DATE(created_at) BETWEEN ? AND ?
       UNION
       SELECT DATE(created_at) AS report_date FROM expenses
       WHERE DATE(created_at) BETWEEN ? AND ?
     ) d
     LEFT JOIN (
       SELECT DATE(created_at) AS sale_date,
              SUM(quantity) AS bottles_sold,
              SUM(total) AS revenue,
              SUM(cost) AS cost_of_goods,
              SUM(total - cost) AS gross_profit
       FROM sales
       WHERE DATE(created_at) BETWEEN ? AND ?
       GROUP BY DATE(created_at)
     ) s ON s.sale_date = d.report_date
     LEFT JOIN (
       SELECT DATE(created_at) AS expense_date, SUM(amount) AS expenses
       FROM expenses
       WHERE DATE(created_at) BETWEEN ? AND ?
       GROUP BY DATE(created_at)
     ) e ON e.expense_date = d.report_date
     ORDER BY d.report_date DESC`,
    [from, to, from, to, from, to, from, to]
  );

  res.json(rows);
}));

app.get("/api/reports/products", authenticate, asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT p.id, p.name, p.opening_stock, p.stock,
            p.purchase_price, p.selling_price,
            COALESCE(SUM(s.quantity), 0) AS bottles_sold,
            COALESCE(SUM(s.total), 0) AS revenue,
            COALESCE(SUM(s.total - s.cost), 0) AS gross_profit
     FROM products p
     LEFT JOIN sales s ON s.product_id = p.id
     GROUP BY p.id, p.name, p.opening_stock, p.stock,
              p.purchase_price, p.selling_price
     ORDER BY p.name ASC`
  );
  res.json(rows);
}));

// ---------------- ERROR HANDLING ----------------

app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found.",
    path: req.originalUrl,
  });
});

app.use((error, req, res, next) => {
  console.error("API error:", error.code || error.message);

  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ message: "That record already exists." });
  }

  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({ message: "Referenced product or user does not exist." });
  }

  if (error.code === "ER_BAD_FIELD_ERROR" || error.code === "ER_NO_SUCH_TABLE") {
    return res.status(500).json({
      message: "Database schema mismatch. Check that the cantine_db tables and column names match the SQL schema.",
    });
  }

  res.status(500).json({ message: "Internal server error." });
});

// ---------------- START SERVER ----------------

async function startServer() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Cantine API running at http://localhost:${PORT}`);
      console.log("Database connected successfully.");
    });
  } catch (error) {
    console.error("Could not connect to MySQL:", error.message);
    process.exit(1);
  }
}

startServer();
