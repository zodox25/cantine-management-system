
import React, { useCallback, useEffect, useMemo, useState } from "react";

const API = "http://localhost:5000/api";
const TOKEN_KEY = "cantine_token";
const USER_KEY = "cantine_user";

const translations = {
  rw: {
    brand: "CANTINE PRO", subtitle: "Imicungire ya Cantine",
    dashboard: "Ahabanza", products: "Ibicuruzwa", stock: "Ububiko",
    sales: "Ibyagurishijwe", expenses: "Amafaranga yakoreshejwe",
    reports: "Raporo", users: "Abakozi na konti", logout: "Sohoka",
    login: "Injira", register: "Iyandikishe", welcome: "Murakaza neza",
    overview: "Incamake y'ibikorwa bya cantine", revenue: "Amafaranga yinjiye",
    profit: "Inyungu mbere ya expenses", netProfit: "Inyungu nyayo",
    expensesToday: "Expenses z'uyu munsi", bottles: "Amacupa yagurishijwe",
    inStock: "Amacupa asigaye", productCount: "Ibicuruzwa",
    newProduct: "Andika igicuruzwa", productName: "Izina ry'igicuruzwa",
    openingStock: "Stock itangirirwaho", purchasePrice: "Igiciro cyo kugura",
    sellingPrice: "Igiciro cyo kugurisha", save: "Bika", cancel: "Reka",
    quantity: "Umubare", selectProduct: "Hitamo igicuruzwa",
    addStock: "Ongeramo stock", recordSale: "Andika igurisha",
    description: "Ibisobanuro", amount: "Amafaranga", addExpense: "Andika expense",
    date: "Itariki", employee: "Umukozi", status: "Imiterere",
    approve: "Emeza", reject: "Anga", admin: "Admin", user: "Umukozi",
    pending: "Ategereje", approved: "Yemejwe", rejected: "Yanzwe",
    search: "Shakisha...", actions: "Ibikorwa", loading: "Birimo gufunguka...",
    noData: "Nta makuru ahari.", password: "Ijambo ry'ibanga",
    username: "Username", fullName: "Amazina yuzuye",
    confirmPassword: "Emeza password", createAccount: "Fungura konti",
    alreadyAccount: "Ufite konti? Injira", noAccount: "Nta konti ufite?",
    loginTitle: "Injira muri konti yawe", registerTitle: "Fungura konti nshya",
    accountPending: "Konti yawe iracyategereje kwemezwa na admin.",
    loginSuccess: "Winjiye neza.", registered: "Kwiyandikisha byagenze neza.",
    productSaved: "Igicuruzwa cyabitswe.", saleSaved: "Igurisha ryabitswe.",
    stockSaved: "Stock yongeweho.", expenseSaved: "Expense yabitswe.",
    failed: "Habaye ikibazo.", allProducts: "Ibicuruzwa byose",
    recentSales: "Ibyagurishijwe vuba", dailyReport: "Raporo y'umunsi",
    from: "Kuva", to: "Kugeza", filter: "Shakisha raporo",
    total: "Igiteranyo", cost: "Ikiguzi cy'ibicuruzwa",
    grossProfit: "Inyungu mbere ya expenses", net: "Inyungu nyuma ya expenses",
    theme: "Imigaragarire", language: "Ururimi", light: "Umucyo",
    dark: "Umwijima", profile: "Konti", lowStock: "Stock iri hasi",
    noStock: "Stock yarangiye", edit: "Hindura", delete: "Siba",
    saveChanges: "Bika impinduka", unitPrice: "Igiciro kuri kimwe",
    soldQty: "Byagurishijwe", balance: "Stock isigaye",
    totalRevenue: "Amafaranga yose yinjiye", today: "Uyu munsi",
    allUsers: "Konti zose", role: "Uburenganzira",
    stockHistory: "Amateka ya stock", movement: "Igikorwa",
    opening: "Stock yatangijwe", purchase: "Stock yongeweho",
    sale: "Igurisha", refresh: "Ongera ufungure", welcomeBack: "Murakaza neza",
    noResults: "Nta makuru ahuye n'ibyo washakishije.", signOut: "Gusohoka",
    passwordHint: "Nibura inyuguti 8", price: "Igiciro",
    day: "Umunsi", revenueShort: "Amafaranga yinjiye",
    product: "Igicuruzwa", quantitySold: "Umubare wagurishijwe",
    expenseList: "Expenses zanditswe", salesHistory: "Amateka y'igurisha",
    deleteConfirm: "Urashaka koko gusiba iki gicuruzwa?",
    account: "Konti", statusUpdated: "Imiterere yahinduwe.",
    sold: "Byagurishijwe", inventory: "Ububiko bw'ibicuruzwa",
    all: "Byose", adminOnly: "Iki gikorwa gisaba uburenganzira bwa admin.",
    noProducts: "Banza wandike igicuruzwa.", registerHelp: "Konti ya mbere iba admin.",
    userHelp: "Izindi konti zitegereza kwemezwa na admin.",
    expense: "Expense", costPrice: "Igiciro cyo kugura",
    profitPerSale: "Inyungu", reportRange: "Igihe cya raporo",
    exportPrint: "Print / Save PDF", close: "Funga", menu: "Menu",
    connection: "Imiterere ya server", connected: "Server irakora",
    disconnected: "Server ntibonetse", stockValue: "Agaciro ka stock",
    quantityRequired: "Umubare ugomba kuba nibura 1.",
    changePrice: "Guhindura ibiciro", updateProduct: "Hindura igicuruzwa",
    noPermission: "Nta burenganzira ufite kuri iki gikorwa.",
    userManagement: "Imicungire ya konti",
  },
  en: {
    brand: "CANTINE PRO", subtitle: "Cantine Management",
    dashboard: "Dashboard", products: "Products", stock: "Stock",
    sales: "Sales", expenses: "Expenses", reports: "Reports",
    users: "Users & Accounts", logout: "Logout", login: "Login",
    register: "Register", welcome: "Welcome", overview: "Business overview",
    revenue: "Revenue", profit: "Gross profit", netProfit: "Net profit",
    expensesToday: "Today's expenses", bottles: "Bottles sold",
    inStock: "Bottles in stock", productCount: "Products",
    newProduct: "Register product", productName: "Product name",
    openingStock: "Opening stock", purchasePrice: "Purchase price",
    sellingPrice: "Selling price", save: "Save", cancel: "Cancel",
    quantity: "Quantity", selectProduct: "Select product", addStock: "Add stock",
    recordSale: "Record sale", description: "Description", amount: "Amount",
    addExpense: "Add expense", date: "Date", employee: "Employee",
    status: "Status", approve: "Approve", reject: "Reject", admin: "Admin",
    user: "Employee", pending: "Pending", approved: "Approved",
    rejected: "Rejected", search: "Search...", actions: "Actions",
    loading: "Loading...", noData: "No data available.", password: "Password",
    username: "Username", fullName: "Full name", confirmPassword: "Confirm password",
    createAccount: "Create account", alreadyAccount: "Have an account? Login",
    noAccount: "Don't have an account?", loginTitle: "Login to your account",
    registerTitle: "Create an account", accountPending: "Your account is waiting for admin approval.",
    loginSuccess: "Login successful.", registered: "Registration successful.",
    failed: "Something went wrong.", allProducts: "All products",
    recentSales: "Recent sales", dailyReport: "Daily report", from: "From",
    to: "To", filter: "Filter report", total: "Total", cost: "Cost of goods",
    grossProfit: "Gross profit", net: "Net profit", theme: "Appearance",
    language: "Language", light: "Light", dark: "Dark", profile: "Profile",
    lowStock: "Low stock", noStock: "Out of stock", edit: "Edit", delete: "Delete",
    saveChanges: "Save changes", unitPrice: "Unit price", soldQty: "Sold",
    balance: "Stock balance", totalRevenue: "Total revenue", today: "Today",
    allUsers: "All accounts", role: "Role", stockHistory: "Stock history",
    movement: "Movement", opening: "Opening stock", purchase: "Stock added",
    sale: "Sale", refresh: "Refresh", welcomeBack: "Welcome back",
    noResults: "No matching records.", signOut: "Sign out", passwordHint: "At least 8 characters",
    price: "Price", day: "Day", revenueShort: "Revenue", product: "Product",
    quantitySold: "Quantity sold", expenseList: "Expenses", salesHistory: "Sales history",
    deleteConfirm: "Are you sure you want to delete this product?",
    account: "Account", statusUpdated: "Status updated.", sold: "Sold",
    inventory: "Inventory", all: "All", adminOnly: "Administrator permission required.",
    noProducts: "Register a product first.", registerHelp: "The first account becomes admin.",
    userHelp: "Other accounts await admin approval.", expense: "Expense",
    costPrice: "Purchase price", profitPerSale: "Profit", reportRange: "Report range",
    exportPrint: "Print / Save PDF", close: "Close", menu: "Menu",
    connection: "Server status", connected: "Server online", disconnected: "Server unavailable",
    stockValue: "Stock value", quantityRequired: "Quantity must be at least 1.",
    changePrice: "Change prices", updateProduct: "Update product",
    noPermission: "You do not have permission.", userManagement: "User management",
  },
  fr: {
    brand: "CANTINE PRO", subtitle: "Gestion de cantine",
    dashboard: "Tableau de bord", products: "Produits", stock: "Stock",
    sales: "Ventes", expenses: "Dépenses", reports: "Rapports",
    users: "Utilisateurs", logout: "Déconnexion", login: "Connexion",
    register: "Inscription", welcome: "Bienvenue", overview: "Vue d'ensemble",
    revenue: "Recettes", profit: "Bénéfice brut", netProfit: "Bénéfice net",
    expensesToday: "Dépenses du jour", bottles: "Bouteilles vendues",
    inStock: "Stock disponible", productCount: "Produits",
    newProduct: "Nouveau produit", productName: "Nom du produit",
    openingStock: "Stock initial", purchasePrice: "Prix d'achat",
    sellingPrice: "Prix de vente", save: "Enregistrer", cancel: "Annuler",
    quantity: "Quantité", selectProduct: "Choisir un produit", addStock: "Ajouter du stock",
    recordSale: "Enregistrer une vente", description: "Description", amount: "Montant",
    addExpense: "Ajouter une dépense", date: "Date", employee: "Employé",
    status: "Statut", approve: "Approuver", reject: "Refuser", admin: "Admin",
    user: "Employé", pending: "En attente", approved: "Approuvé",
    rejected: "Refusé", search: "Rechercher...", actions: "Actions",
    loading: "Chargement...", noData: "Aucune donnée.", password: "Mot de passe",
    username: "Nom d'utilisateur", fullName: "Nom complet",
    confirmPassword: "Confirmer le mot de passe", createAccount: "Créer un compte",
    alreadyAccount: "Déjà un compte ? Connexion", noAccount: "Pas de compte ?",
    loginTitle: "Connectez-vous", registerTitle: "Créer un compte",
    accountPending: "Votre compte attend l'approbation de l'administrateur.",
    loginSuccess: "Connexion réussie.", registered: "Inscription réussie.",
    failed: "Une erreur est survenue.", allProducts: "Tous les produits",
    recentSales: "Ventes récentes", dailyReport: "Rapport journalier", from: "Du",
    to: "Au", filter: "Filtrer", total: "Total", cost: "Coût des produits",
    grossProfit: "Bénéfice brut", net: "Bénéfice net", theme: "Apparence",
    language: "Langue", light: "Clair", dark: "Sombre", profile: "Profil",
    lowStock: "Stock faible", noStock: "Rupture de stock", edit: "Modifier",
    delete: "Supprimer", saveChanges: "Enregistrer", unitPrice: "Prix unitaire",
    soldQty: "Vendus", balance: "Stock restant", totalRevenue: "Recettes totales",
    today: "Aujourd'hui", allUsers: "Tous les comptes", role: "Rôle",
    stockHistory: "Historique du stock", movement: "Mouvement",
    opening: "Stock initial", purchase: "Stock ajouté", sale: "Vente",
    refresh: "Actualiser", welcomeBack: "Bon retour", noResults: "Aucun résultat.",
    signOut: "Déconnexion", passwordHint: "8 caractères minimum", price: "Prix",
    day: "Jour", revenueShort: "Recettes", product: "Produit",
    quantitySold: "Quantité vendue", expenseList: "Dépenses",
    salesHistory: "Historique des ventes",
    deleteConfirm: "Voulez-vous vraiment supprimer ce produit ?",
    account: "Compte", statusUpdated: "Statut modifié.", sold: "Vendu",
    inventory: "Inventaire", all: "Tout", adminOnly: "Autorisation administrateur requise.",
    noProducts: "Enregistrez d'abord un produit.",
    registerHelp: "Le premier compte devient administrateur.",
    userHelp: "Les autres comptes attendent l'approbation.",
    expense: "Dépense", costPrice: "Prix d'achat", profitPerSale: "Bénéfice",
    reportRange: "Période du rapport", exportPrint: "Imprimer / Enregistrer PDF",
    close: "Fermer", menu: "Menu", connection: "État du serveur",
    connected: "Serveur connecté", disconnected: "Serveur indisponible",
    stockValue: "Valeur du stock", quantityRequired: "La quantité doit être au moins 1.",
    changePrice: "Modifier les prix", updateProduct: "Modifier le produit",
    noPermission: "Vous n'avez pas l'autorisation.", userManagement: "Gestion des comptes",
  },
};

const money = (value) =>
  `${Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })} RWF`;

const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const initialProduct = {
  name: "",
  opening_stock: "0",
  purchase_price: "",
  selling_price: "",
};

function Icon({ name }) {
  const icons = {
    dashboard: "◫", products: "▦", stock: "▤", sales: "↗",
    expenses: "↘", reports: "▥", users: "♙", settings: "⚙",
    logout: "⇥", menu: "☰", search: "⌕", sun: "☀", moon: "☾",
    plus: "+", refresh: "⟳", close: "×", calendar: "▣",
    money: "₣", bottles: "▥", warning: "!", check: "✓",
  };
  return <span className="cp-icon" aria-hidden="true">{icons[name] || "•"}</span>;
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch {
      return null;
    }
  });

  const [lang, setLang] = useState(() => localStorage.getItem("cantine_lang") || "rw");
  const [theme, setTheme] = useState(() => localStorage.getItem("cantine_theme") || "light");
  const [page, setPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    name: "", username: "", password: "", confirmPassword: "",
  });

  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [movements, setMovements] = useState([]);
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [dailyReports, setDailyReports] = useState([]);
  const [productReports, setProductReports] = useState([]);

  const [productForm, setProductForm] = useState(initialProduct);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saleForm, setSaleForm] = useState({ product_id: "", quantity: "1" });
  const [stockForm, setStockForm] = useState({ product_id: "", quantity: "1" });
  const [expenseForm, setExpenseForm] = useState({ description: "", amount: "" });
  const [reportDates, setReportDates] = useState({ from: todayISO(), to: todayISO() });
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [serverOnline, setServerOnline] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });

  const t = useCallback((key) => translations[lang]?.[key] || translations.en[key] || key, [lang]);

  const notify = useCallback((text, type = "success") => {
    setNotice({ text, type });
  }, []);

  useEffect(() => {
    localStorage.setItem("cantine_lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("cantine_theme", theme);
    document.documentElement.setAttribute("data-cantine-theme", theme);
  }, [theme]);

  const api = useCallback(async (path, options = {}) => {
    const headers = { ...(options.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (options.body !== undefined) headers["Content-Type"] = "application/json";

    let response;
    try {
      response = await fetch(`${API}${path}`, {
        ...options,
        headers,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
      });
    } catch {
      setServerOnline(false);
      throw new Error("Server ntibonetse. Tangiza backend kuri port 5000.");
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Request failed (${response.status})`);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  }, [token]);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken("");
    setUser(null);
    setProducts([]);
    setSales([]);
    setExpenses([]);
    setMovements([]);
    setUsers([]);
    setSummary(null);
    setPage("dashboard");
    setMobileOpen(false);
    setNotice({ type: "", text: "" });
  }, []);

  const loadAll = useCallback(async () => {
    if (!token) return;
    setPageLoading(true);

    try {
      const me = await api("/auth/me");
      setUser(me.user);
      localStorage.setItem(USER_KEY, JSON.stringify(me.user));

      const results = await Promise.allSettled([
        api("/products"),
        api("/sales"),
        api("/expenses"),
        api("/stock/movements"),
        api(`/reports/summary?date=${todayISO()}`),
        api(`/reports/daily?from=${reportDates.from}&to=${reportDates.to}`),
        api("/reports/products"),
      ]);

      const assign = (result, setter, fallback) => {
        if (result.status === "fulfilled") setter(result.value);
        else setter(fallback);
      };

      assign(results[0], setProducts, []);
      assign(results[1], setSales, []);
      assign(results[2], setExpenses, []);
      assign(results[3], setMovements, []);
      assign(results[4], setSummary, null);
      assign(results[5], setDailyReports, []);
      assign(results[6], setProductReports, []);
      setServerOnline(true);

      if (me.user.role === "admin") {
        try {
          setUsers(await api("/users"));
        } catch {
          setUsers([]);
        }
      }
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        signOut();
        notify(error.message, "error");
      } else {
        setServerOnline(false);
        notify(error.message, "error");
      }
    } finally {
      setPageLoading(false);
    }
  }, [token, api, reportDates.from, reportDates.to, signOut, notify]);

  useEffect(() => {
    if (token) loadAll();
  }, [token, loadAll]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => String(p.name || "").toLowerCase().includes(q));
  }, [products, search]);

  const filteredSales = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sales;
    return sales.filter((s) =>
      `${s.product_name || ""} ${s.employee_name || ""}`.toLowerCase().includes(q)
    );
  }, [sales, search]);

  const filteredExpenses = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return expenses;
    return expenses.filter((e) =>
      `${e.description || ""} ${e.employee_name || ""}`.toLowerCase().includes(q)
    );
  }, [expenses, search]);

  const totalStockValue = useMemo(
    () => products.reduce((sum, p) => sum + Number(p.stock || 0) * Number(p.purchase_price || 0), 0),
    [products]
  );

  const perform = async (operation, successMessage, callback) => {
    setBusy(true);
    try {
      const result = await operation();
      if (callback) callback(result);
      notify(successMessage || result?.message || "Byagenze neza.");
      await loadAll();
      return result;
    } catch (error) {
      notify(error.message || t("failed"), "error");
      return null;
    } finally {
      setBusy(false);
    }
  };

  const handleAuth = async (event) => {
    event.preventDefault();

    if (authMode === "register" && authForm.password !== authForm.confirmPassword) {
      notify("Password ntiyahuye n'iyo wongeye kwandika.", "error");
      return;
    }

    setBusy(true);
    try {
      const endpoint = authMode === "login" ? "/auth/login" : "/auth/register";
      const payload = {
        username: authForm.username.trim(),
        password: authForm.password,
      };
      if (authMode === "register") payload.name = authForm.name.trim();

      const data = await api(endpoint, { method: "POST", body: payload });

      if (data.token && data.user) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setPage("dashboard");
        notify(data.message || t("loginSuccess"));
      } else {
        notify(data.message || t("registered"));
        setAuthMode("login");
        setAuthForm({ name: "", username: authForm.username, password: "", confirmPassword: "" });
      }
    } catch (error) {
      notify(error.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();

    const payload = {
      name: productForm.name.trim(),
      opening_stock: Number(productForm.opening_stock),
      purchase_price: Number(productForm.purchase_price),
      selling_price: Number(productForm.selling_price),
    };

    if (!payload.name || payload.opening_stock < 0 ||
        payload.purchase_price < 0 || payload.selling_price <= 0) {
      notify("Reba neza izina, stock n'ibiciro.", "error");
      return;
    }

    if (editingProduct) {
      await perform(
        () => api(`/products/${editingProduct.id}`, { method: "PUT", body: {
          name: payload.name,
          purchase_price: payload.purchase_price,
          selling_price: payload.selling_price,
        } }),
        "Igicuruzwa cyahinduwe.",
        () => {
          setEditingProduct(null);
          setProductForm(initialProduct);
        }
      );
    } else {
      await perform(
        () => api("/products", { method: "POST", body: payload }),
        t("productSaved"),
        () => setProductForm(initialProduct)
      );
    }
  };

  const startEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      opening_stock: String(product.opening_stock ?? 0),
      purchase_price: String(product.purchase_price ?? ""),
      selling_price: String(product.selling_price ?? ""),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(t("deleteConfirm"))) return;
    await perform(
      () => api(`/products/${product.id}`, { method: "DELETE" }),
      "Igicuruzwa cyasibwe."
    );
  };

  const handleSale = async (event) => {
    event.preventDefault();
    const quantity = Number(saleForm.quantity);
    if (!saleForm.product_id || !Number.isInteger(quantity) || quantity < 1) {
      notify(t("quantityRequired"), "error");
      return;
    }

    const result = await perform(
      () => api("/sales", {
        method: "POST",
        body: { product_id: Number(saleForm.product_id), quantity },
      }),
      t("saleSaved"),
      () => setSaleForm({ product_id: "", quantity: "1" })
    );

    if (result?.sale) {
      notify(`${t("saleSaved")} ${money(result.sale.total)}.`, "success");
    }
  };

  const handleStock = async (event) => {
    event.preventDefault();
    const quantity = Number(stockForm.quantity);

    if (!stockForm.product_id || !Number.isInteger(quantity) || quantity < 1) {
      notify(t("quantityRequired"), "error");
      return;
    }

    await perform(
      () => api("/stock/purchase", {
        method: "POST",
        body: { product_id: Number(stockForm.product_id), quantity },
      }),
      t("stockSaved"),
      () => setStockForm({ product_id: "", quantity: "1" })
    );
  };

  const handleExpense = async (event) => {
    event.preventDefault();
    const amount = Number(expenseForm.amount);

    if (!expenseForm.description.trim() || !Number.isFinite(amount) || amount <= 0) {
      notify("Andika ibisobanuro n'amafaranga arenga zero.", "error");
      return;
    }

    await perform(
      () => api("/expenses", {
        method: "POST",
        body: { description: expenseForm.description.trim(), amount },
      }),
      t("expenseSaved"),
      () => setExpenseForm({ description: "", amount: "" })
    );
  };

  const updateUserStatus = async (account, status) => {
    await perform(
      () => api(`/users/${account.id}/status`, {
        method: "PATCH",
        body: { status },
      }),
      t("statusUpdated")
    );
  };

  const updateUserRole = async (account, role) => {
    if (account.id === user?.id && role !== "admin") {
      notify("Ntushobora gukuraho uburenganzira bwa admin kuri konti yawe.", "error");
      return;
    }

    await perform(
      () => api(`/users/${account.id}/role`, {
        method: "PATCH",
        body: { role },
      }),
      t("statusUpdated")
    );
  };

  const loadReports = async (event) => {
    if (event) event.preventDefault();

    await perform(async () => {
      const [daily, summaryData, productsData] = await Promise.all([
        api(`/reports/daily?from=${reportDates.from}&to=${reportDates.to}`),
        api(`/reports/summary?date=${reportDates.to}`),
        api("/reports/products"),
      ]);
      setDailyReports(daily);
      setSummary(summaryData);
      setProductReports(productsData);
      return { message: "Raporo zavuguruwe." };
    }, "Raporo zavuguruwe.");
  };

  const navItems = [
    { id: "dashboard", label: t("dashboard"), icon: "dashboard" },
    { id: "products", label: t("products"), icon: "products" },
    { id: "stock", label: t("stock"), icon: "stock" },
    { id: "sales", label: t("sales"), icon: "sales" },
    { id: "expenses", label: t("expenses"), icon: "expenses" },
    { id: "reports", label: t("reports"), icon: "reports" },
    ...(user?.role === "admin"
      ? [{ id: "users", label: t("users"), icon: "users" }]
      : []),
  ];

  const currentTitle = navItems.find((item) => item.id === page)?.label || t("dashboard");

  const printReport = () => window.print();

  if (!token || !user) {
    return (
      <div className="cp-auth">
        <style>{styles}</style>
        <div className="cp-auth-left">
          <div className="cp-brand-large"><span className="cp-brand-mark">C</span> CANTINE PRO</div>
          <div className="cp-auth-hero">
            <span className="cp-eyebrow">BUSINESS MANAGEMENT</span>
            <h1>Manage your cantine.<br /><span>Grow your business.</span></h1>
            <p>Manage products, stock, sales, expenses and reports in one place.</p>
            <div className="cp-hero-stats">
              <div><strong>01</strong><span>Products</span></div>
              <div><strong>02</strong><span>Stock</span></div>
              <div><strong>03</strong><span>Reports</span></div>
            </div>
          </div>
          <div className="cp-auth-footer">CANTINE PRO · RWF · Secure business management</div>
        </div>

        <div className="cp-auth-right">
          <div className="cp-auth-top">
            <select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="rw">Kinyarwanda</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
            <button className="cp-theme-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? "☾" : "☀"}
            </button>
          </div>

          <form className="cp-auth-form" onSubmit={handleAuth}>
            <span className="cp-eyebrow">{authMode === "login" ? "WELCOME BACK" : "GET STARTED"}</span>
            <h2>{authMode === "login" ? t("loginTitle") : t("registerTitle")}</h2>
            <p className="cp-muted">
              {authMode === "login"
                ? "Enter your details to access your dashboard."
                : "Create your account to start using the system."}
            </p>

            {authMode === "register" && (
              <label className="cp-field">
                <span>{t("fullName")}</span>
                <input required minLength={2} value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  placeholder="Your full name" autoComplete="name" />
              </label>
            )}

            <label className="cp-field">
              <span>{t("username")}</span>
              <input required minLength={3} value={authForm.username}
                onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                placeholder="Enter username" autoComplete="username" />
            </label>

            <label className="cp-field">
              <span>{t("password")}</span>
              <input required minLength={8} type="password" value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                placeholder="••••••••" autoComplete={authMode === "login" ? "current-password" : "new-password"} />
            </label>

            {authMode === "register" && (
              <label className="cp-field">
                <span>{t("confirmPassword")}</span>
                <input required minLength={8} type="password" value={authForm.confirmPassword}
                  onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                  placeholder="••••••••" autoComplete="new-password" />
              </label>
            )}

            {notice.text && (
              <div className={`cp-notice ${notice.type}`}>{notice.text}</div>
            )}

            <button className="cp-btn cp-btn-primary cp-full" disabled={busy}>
              {busy ? t("loading") : authMode === "login" ? t("login") : t("createAccount")}
              <span>→</span>
            </button>

            <div className="cp-auth-switch">
              {authMode === "login" ? t("noAccount") : t("alreadyAccount")}
              <button type="button" onClick={() => {
                setAuthMode(authMode === "login" ? "register" : "login");
                setNotice({ type: "", text: "" });
              }}>
                {authMode === "login" ? t("register") : t("login")}
              </button>
            </div>
            {authMode === "register" && (
              <p className="cp-help">{t("registerHelp")} {t("userHelp")}</p>
            )}
          </form>
        </div>
      </div>
    );
  }

  const StatCard = ({ label, value, icon, tone = "blue", detail }) => (
    <div className="cp-stat">
      <div className={`cp-stat-icon ${tone}`}><Icon name={icon} /></div>
      <div className="cp-stat-content">
        <span>{label}</span>
        <strong>{value}</strong>
        {detail && <small>{detail}</small>}
      </div>
    </div>
  );

  const TableWrap = ({ children }) => <div className="cp-table-wrap"><table>{children}</table></div>;

  const EmptyRow = ({ colSpan }) => (
    <tr><td colSpan={colSpan} className="cp-empty">{t("noData")}</td></tr>
  );

  const pageContent = () => {
    if (page === "dashboard") {
      return (
        <>
          <div className="cp-welcome-row">
            <div>
              <h2>{t("welcomeBack")}, {user.name} 👋</h2>
              <p>{t("overview")}</p>
            </div>
            <div className="cp-date-pill"><Icon name="calendar" /> {todayISO()}</div>
          </div>

          <div className="cp-stats-grid">
            <StatCard label={t("revenue")} value={money(summary?.revenue)} icon="money" tone="blue" detail={t("today")} />
            <StatCard label={t("profit")} value={money(summary?.gross_profit)} icon="sales" tone="green" detail={t("today")} />
            <StatCard label={t("expensesToday")} value={money(summary?.expenses)} icon="expenses" tone="orange" detail={t("today")} />
            <StatCard label={t("netProfit")} value={money(summary?.net_profit)} icon="reports" tone="purple" detail={t("today")} />
          </div>

          <div className="cp-stats-grid cp-stats-small">
            <StatCard label={t("bottles")} value={Number(summary?.bottles_sold || 0).toLocaleString()} icon="bottles" tone="blue" />
            <StatCard label={t("inStock")} value={Number(summary?.bottles_in_stock || 0).toLocaleString()} icon="stock" tone="green" />
            <StatCard label={t("productCount")} value={Number(summary?.product_count || 0)} icon="products" tone="purple" />
            <StatCard label={t("stockValue")} value={money(totalStockValue)} icon="money" tone="orange" />
          </div>

          <div className="cp-dashboard-grid">
            <section className="cp-panel">
              <div className="cp-panel-head">
                <div><h3>{t("allProducts")}</h3><p>{t("inventory")}</p></div>
                <button className="cp-btn cp-btn-light cp-btn-sm" onClick={() => setPage("products")}>{t("products")} →</button>
              </div>
              <TableWrap>
                <thead><tr><th>{t("product")}</th><th>{t("sellingPrice")}</th><th>{t("balance")}</th><th>{t("status")}</th></tr></thead>
                <tbody>
                  {products.slice(0, 6).map((p) => (
                    <tr key={p.id}>
                      <td><strong>{p.name}</strong></td>
                      <td>{money(p.selling_price)}</td>
                      <td>{p.stock}</td>
                      <td><span className={`cp-badge ${Number(p.stock) === 0 ? "red" : Number(p.stock) < 10 ? "orange" : "green"}`}>
                        {Number(p.stock) === 0 ? t("noStock") : Number(p.stock) < 10 ? t("lowStock") : t("approved")}
                      </span></td>
                    </tr>
                  ))}
                  {!products.length && <EmptyRow colSpan={4} />}
                </tbody>
              </TableWrap>
            </section>

            <section className="cp-panel">
              <div className="cp-panel-head">
                <div><h3>{t("recentSales")}</h3><p>{t("salesHistory")}</p></div>
                <button className="cp-btn cp-btn-light cp-btn-sm" onClick={() => setPage("sales")}>{t("sales")} →</button>
              </div>
              <TableWrap>
                <thead><tr><th>{t("product")}</th><th>{t("quantity")}</th><th>{t("total")}</th></tr></thead>
                <tbody>
                  {sales.slice(0, 6).map((s) => (
                    <tr key={s.id}>
                      <td><strong>{s.product_name}</strong><small className="cp-cell-sub">{s.employee_name || ""}</small></td>
                      <td>{s.quantity}</td><td className="cp-money">{money(s.total)}</td>
                    </tr>
                  ))}
                  {!sales.length && <EmptyRow colSpan={3} />}
                </tbody>
              </TableWrap>
            </section>
          </div>

          <section className="cp-panel cp-shortcuts">
            <div className="cp-panel-head"><div><h3>Quick actions</h3><p>Start a common task</p></div></div>
            <div className="cp-shortcut-grid">
              <button onClick={() => setPage("products")}><span>＋</span><strong>{t("newProduct")}</strong><small>Register a product</small></button>
              <button onClick={() => setPage("sales")}><span>↗</span><strong>{t("recordSale")}</strong><small>Record a bottle sale</small></button>
              <button onClick={() => setPage("stock")}><span>▤</span><strong>{t("addStock")}</strong><small>Update inventory</small></button>
              <button onClick={() => setPage("expenses")}><span>↘</span><strong>{t("addExpense")}</strong><small>Record a cost</small></button>
            </div>
          </section>
        </>
      );
    }

    if (page === "products") {
      return (
        <>
          <div className="cp-page-intro"><div><h2>{t("products")}</h2><p>Register products and manage prices.</p></div>
            <span className="cp-count">{products.length} {t("productCount")}</span>
          </div>

          <section className="cp-panel cp-form-panel">
            <div className="cp-panel-head"><div><h3>{editingProduct ? t("updateProduct") : t("newProduct")}</h3>
              <p>{editingProduct ? t("changePrice") : "Add a new item to your inventory."}</p></div></div>
            <form className="cp-form-grid" onSubmit={handleCreateProduct}>
              <label className="cp-field"><span>{t("productName")}</span>
                <input required value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} placeholder="e.g. Fanta Orange" /></label>
              {!editingProduct && <label className="cp-field"><span>{t("openingStock")}</span>
                <input type="number" min="0" step="1" required value={productForm.opening_stock} onChange={(e) => setProductForm({ ...productForm, opening_stock: e.target.value })} /></label>}
              <label className="cp-field"><span>{t("purchasePrice")} (RWF)</span>
                <input type="number" min="0" step="any" required value={productForm.purchase_price} onChange={(e) => setProductForm({ ...productForm, purchase_price: e.target.value })} placeholder="0" /></label>
              <label className="cp-field"><span>{t("sellingPrice")} (RWF)</span>
                <input type="number" min="0.01" step="any" required value={productForm.selling_price} onChange={(e) => setProductForm({ ...productForm, selling_price: e.target.value })} placeholder="1200" /></label>
              <div className="cp-form-actions">
                <button disabled={busy} className="cp-btn cp-btn-primary">{busy ? t("loading") : t("save")}</button>
                {editingProduct && <button type="button" className="cp-btn cp-btn-light" onClick={() => { setEditingProduct(null); setProductForm(initialProduct); }}>{t("cancel")}</button>}
              </div>
            </form>
          </section>

          <section className="cp-panel">
            <div className="cp-panel-head"><div><h3>{t("allProducts")}</h3><p>Product stock and pricing.</p></div>
              <div className="cp-search"><Icon name="search" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("search")} /></div>
            </div>
            <TableWrap>
              <thead><tr><th>{t("product")}</th><th>{t("openingStock")}</th><th>{t("balance")}</th><th>{t("purchasePrice")}</th><th>{t("sellingPrice")}</th><th>{t("status")}</th><th>{t("actions")}</th></tr></thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong><small className="cp-cell-sub">ID: {p.id}</small></td>
                    <td>{p.opening_stock}</td><td><strong>{p.stock}</strong></td>
                    <td>{money(p.purchase_price)}</td><td>{money(p.selling_price)}</td>
                    <td><span className={`cp-badge ${Number(p.stock) === 0 ? "red" : Number(p.stock) < 10 ? "orange" : "green"}`}>{Number(p.stock) === 0 ? t("noStock") : Number(p.stock) < 10 ? t("lowStock") : t("approved")}</span></td>
                    <td><div className="cp-row-actions">
                      <button className="cp-btn cp-btn-light cp-btn-sm" onClick={() => startEditProduct(p)}>{t("edit")}</button>
                      {user.role === "admin" && <button className="cp-btn cp-btn-danger cp-btn-sm" onClick={() => handleDeleteProduct(p)}>{t("delete")}</button>}
                    </div></td>
                  </tr>
                ))}
                {!filteredProducts.length && <EmptyRow colSpan={7} />}
              </tbody>
            </TableWrap>
          </section>
        </>
      );
    }

    if (page === "stock") {
      return (
        <>
          <div className="cp-page-intro"><div><h2>{t("stock")}</h2><p>Record new purchases and track inventory movement.</p></div></div>
          <div className="cp-stats-grid cp-stats-small">
            <StatCard label={t("inStock")} value={products.reduce((sum, p) => sum + Number(p.stock || 0), 0)} icon="stock" tone="blue" />
            <StatCard label={t("productCount")} value={products.length} icon="products" tone="green" />
            <StatCard label={t("stockValue")} value={money(totalStockValue)} icon="money" tone="purple" />
          </div>

          <section className="cp-panel cp-form-panel">
            <div className="cp-panel-head"><div><h3>{t("addStock")}</h3><p>Each bottle is one stock unit.</p></div></div>
            <form className="cp-form-grid" onSubmit={handleStock}>
              <label className="cp-field"><span>{t("selectProduct")}</span>
                <select required value={stockForm.product_id} onChange={(e) => setStockForm({ ...stockForm, product_id: e.target.value })}>
                  <option value="">-- {t("selectProduct")} --</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.stock} in stock)</option>)}
                </select></label>
              <label className="cp-field"><span>{t("quantity")}</span>
                <input type="number" required min="1" step="1" value={stockForm.quantity} onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })} /></label>
              <div className="cp-form-actions"><button disabled={busy || !products.length} className="cp-btn cp-btn-primary">{t("addStock")}</button></div>
            </form>
            {!products.length && <p className="cp-help">{t("noProducts")}</p>}
          </section>

          <section className="cp-panel">
            <div className="cp-panel-head"><div><h3>{t("stockHistory")}</h3><p>Recent stock movements.</p></div></div>
            <TableWrap>
              <thead><tr><th>{t("date")}</th><th>{t("product")}</th><th>{t("movement")}</th><th>{t("quantity")}</th><th>{t("employee")}</th></tr></thead>
              <tbody>
                {movements.map((m) => (
                  <tr key={m.id}><td>{m.created_at ? new Date(m.created_at).toLocaleString() : "—"}</td>
                    <td><strong>{m.product_name}</strong></td>
                    <td><span className={`cp-badge ${m.movement_type === "sale" ? "orange" : "green"}`}>{m.movement_type === "opening" ? t("opening") : m.movement_type === "purchase" ? t("purchase") : m.movement_type === "sale" ? t("sale") : m.movement_type}</span></td>
                    <td>{m.quantity > 0 ? `+${m.quantity}` : m.quantity}</td><td>{m.employee_name || "—"}</td>
                  </tr>
                ))}
                {!movements.length && <EmptyRow colSpan={5} />}
              </tbody>
            </TableWrap>
          </section>
        </>
      );
    }

    if (page === "sales") {
      const chosenProduct = products.find((p) => Number(p.id) === Number(saleForm.product_id));
      const qty = Math.max(0, Number(saleForm.quantity) || 0);
      return (
        <>
          <div className="cp-page-intro"><div><h2>{t("sales")}</h2><p>Sell products and automatically update stock.</p></div></div>
          <div className="cp-stats-grid cp-stats-small">
            <StatCard label={t("totalRevenue")} value={money(summary?.revenue)} icon="money" tone="blue" />
            <StatCard label={t("bottles")} value={summary?.bottles_sold || 0} icon="bottles" tone="green" />
            <StatCard label={t("profit")} value={money(summary?.gross_profit)} icon="sales" tone="purple" />
          </div>

          <section className="cp-panel cp-form-panel">
            <div className="cp-panel-head"><div><h3>{t("recordSale")}</h3><p>Stock is checked before the sale is saved.</p></div></div>
            <form className="cp-form-grid" onSubmit={handleSale}>
              <label className="cp-field"><span>{t("selectProduct")}</span>
                <select required value={saleForm.product_id} onChange={(e) => setSaleForm({ ...saleForm, product_id: e.target.value })}>
                  <option value="">-- {t("selectProduct")} --</option>
                  {products.map((p) => <option disabled={Number(p.stock) < 1} key={p.id} value={p.id}>{p.name} · {money(p.selling_price)} · Stock: {p.stock}</option>)}
                </select></label>
              <label className="cp-field"><span>{t("quantity")}</span>
                <input required type="number" min="1" step="1" max={chosenProduct?.stock || undefined} value={saleForm.quantity} onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })} /></label>
              {chosenProduct && (
                <div className="cp-sale-preview">
                  <div><span>{t("unitPrice")}</span><strong>{money(chosenProduct.selling_price)}</strong></div>
                  <div><span>{t("balance")}</span><strong>{chosenProduct.stock}</strong></div>
                  <div><span>{t("total")}</span><strong>{money(Number(chosenProduct.selling_price) * qty)}</strong></div>
                </div>
              )}
              <div className="cp-form-actions"><button disabled={busy || !products.length} className="cp-btn cp-btn-primary">{t("recordSale")}</button></div>
            </form>
          </section>

          <section className="cp-panel">
            <div className="cp-panel-head"><div><h3>{t("salesHistory")}</h3><p>Sales saved in the database.</p></div>
              <div className="cp-search"><Icon name="search" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("search")} /></div>
            </div>
            <TableWrap>
              <thead><tr><th>{t("date")}</th><th>{t("product")}</th><th>{t("quantity")}</th><th>{t("unitPrice")}</th><th>{t("total")}</th><th>{t("profit")}</th><th>{t("employee")}</th></tr></thead>
              <tbody>{filteredSales.map((s) => (
                <tr key={s.id}><td>{s.created_at ? new Date(s.created_at).toLocaleString() : "—"}</td><td><strong>{s.product_name}</strong></td>
                  <td>{s.quantity}</td><td>{money(s.unit_price)}</td><td className="cp-money">{money(s.total)}</td><td className="cp-positive">{money(s.profit ?? Number(s.total) - Number(s.cost))}</td><td>{s.employee_name || "—"}</td></tr>
              ))}{!filteredSales.length && <EmptyRow colSpan={7} />}</tbody>
            </TableWrap>
          </section>
        </>
      );
    }

    if (page === "expenses") {
      return (
        <>
          <div className="cp-page-intro"><div><h2>{t("expenses")}</h2><p>Record operating costs and expenses.</p></div></div>
          <div className="cp-stats-grid cp-stats-small">
            <StatCard label={t("expensesToday")} value={money(summary?.expenses)} icon="expenses" tone="orange" />
            <StatCard label={t("netProfit")} value={money(summary?.net_profit)} icon="reports" tone="green" />
          </div>
          <section className="cp-panel cp-form-panel">
            <div className="cp-panel-head"><div><h3>{t("addExpense")}</h3><p>Expenses are included in net profit reports.</p></div></div>
            <form className="cp-form-grid" onSubmit={handleExpense}>
              <label className="cp-field"><span>{t("description")}</span>
                <input required maxLength={255} value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} placeholder="e.g. Transport, electricity" /></label>
              <label className="cp-field"><span>{t("amount")} (RWF)</span>
                <input required min="0.01" step="any" type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} placeholder="0" /></label>
              <div className="cp-form-actions"><button disabled={busy} className="cp-btn cp-btn-primary">{t("addExpense")}</button></div>
            </form>
          </section>

          <section className="cp-panel">
            <div className="cp-panel-head"><div><h3>{t("expenseList")}</h3><p>Recorded expenses.</p></div>
              <div className="cp-search"><Icon name="search" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("search")} /></div>
            </div>
            <TableWrap>
              <thead><tr><th>{t("date")}</th><th>{t("description")}</th><th>{t("employee")}</th><th>{t("amount")}</th><th>{t("actions")}</th></tr></thead>
              <tbody>{filteredExpenses.map((e) => (
                <tr key={e.id}><td>{e.created_at ? new Date(e.created_at).toLocaleString() : "—"}</td>
                  <td><strong>{e.description}</strong></td><td>{e.employee_name || "—"}</td><td>{money(e.amount)}</td>
                  <td>{user.role === "admin" || Number(e.employee_id) === Number(user.id)
                    ? <button disabled={busy} className="cp-btn cp-btn-danger cp-btn-sm" onClick={() => {
                      if (window.confirm("Urashaka koko gusiba iyi expense?")) {
                        perform(() => api(`/expenses/${e.id}`, { method: "DELETE" }), "Expense yasibwe.");
                      }
                    }}>{t("delete")}</button> : "—"}</td>
                </tr>
              ))}{!filteredExpenses.length && <EmptyRow colSpan={5} />}</tbody>
            </TableWrap>
          </section>
        </>
      );
    }

    if (page === "reports") {
      return (
        <>
          <div className="cp-page-intro"><div><h2>{t("reports")}</h2><p>Analyze sales, expenses and profits for any date range.</p></div>
            <button className="cp-btn cp-btn-light" onClick={printReport}><Icon name="reports" /> {t("exportPrint")}</button>
          </div>
          <section className="cp-panel cp-form-panel cp-print-hide">
            <form className="cp-form-grid" onSubmit={loadReports}>
              <label className="cp-field"><span>{t("from")}</span><input required type="date" value={reportDates.from} onChange={(e) => setReportDates({ ...reportDates, from: e.target.value })} /></label>
              <label className="cp-field"><span>{t("to")}</span><input required type="date" min={reportDates.from} value={reportDates.to} onChange={(e) => setReportDates({ ...reportDates, to: e.target.value })} /></label>
              <div className="cp-form-actions"><button disabled={busy} className="cp-btn cp-btn-primary">{t("filter")}</button></div>
            </form>
          </section>

          <div className="cp-report-heading"><h3>{t("reportRange")}: {reportDates.from} — {reportDates.to}</h3><p>Currency: Rwandan Franc (RWF)</p></div>
          <div className="cp-stats-grid">
            <StatCard label={t("revenue")} value={money(dailyReports.reduce((sum, r) => sum + Number(r.revenue || 0), 0))} icon="money" tone="blue" />
            <StatCard label={t("cost")} value={money(dailyReports.reduce((sum, r) => sum + Number(r.cost_of_goods || 0), 0))} icon="stock" tone="orange" />
            <StatCard label={t("grossProfit")} value={money(dailyReports.reduce((sum, r) => sum + Number(r.gross_profit || 0), 0))} icon="sales" tone="green" />
            <StatCard label={t("expenses")} value={money(dailyReports.reduce((sum, r) => sum + Number(r.expenses || 0), 0))} icon="expenses" tone="orange" />
          </div>
          <div className="cp-stats-grid cp-stats-small">
            <StatCard label={t("net")} value={money(dailyReports.reduce((sum, r) => sum + Number(r.net_profit || 0), 0))} icon="reports" tone="purple" />
            <StatCard label={t("bottles")} value={dailyReports.reduce((sum, r) => sum + Number(r.bottles_sold || 0), 0)} icon="bottles" tone="blue" />
          </div>

          <section className="cp-panel">
            <div className="cp-panel-head"><div><h3>{t("dailyReport")}</h3><p>Daily revenue, expenses and net profit.</p></div></div>
            <TableWrap>
              <thead><tr><th>{t("day")}</th><th>{t("bottles")}</th><th>{t("revenue")}</th><th>{t("cost")}</th><th>{t("grossProfit")}</th><th>{t("expenses")}</th><th>{t("net")}</th></tr></thead>
              <tbody>{dailyReports.map((r) => (
                <tr key={String(r.report_date)}><td>{String(r.report_date).slice(0, 10)}</td><td>{r.bottles_sold}</td>
                  <td>{money(r.revenue)}</td><td>{money(r.cost_of_goods)}</td><td>{money(r.gross_profit)}</td><td>{money(r.expenses)}</td>
                  <td className={Number(r.net_profit) >= 0 ? "cp-positive" : "cp-negative"}>{money(r.net_profit)}</td></tr>
              ))}{!dailyReports.length && <EmptyRow colSpan={7} />}</tbody>
            </TableWrap>
          </section>

          <section className="cp-panel">
            <div className="cp-panel-head"><div><h3>{t("allProducts")}</h3><p>Performance by product.</p></div></div>
            <TableWrap>
              <thead><tr><th>{t("product")}</th><th>{t("openingStock")}</th><th>{t("balance")}</th><th>{t("soldQty")}</th><th>{t("revenue")}</th><th>{t("grossProfit")}</th></tr></thead>
              <tbody>{productReports.map((p) => (
                <tr key={p.id}><td><strong>{p.name}</strong></td><td>{p.opening_stock}</td><td>{p.stock}</td><td>{p.bottles_sold}</td><td>{money(p.revenue)}</td><td>{money(p.gross_profit)}</td></tr>
              ))}{!productReports.length && <EmptyRow colSpan={6} />}</tbody>
            </TableWrap>
          </section>
        </>
      );
    }

    if (page === "users" && user.role === "admin") {
      return (
        <>
          <div className="cp-page-intro"><div><h2>{t("userManagement")}</h2><p>Approve accounts and manage user roles.</p></div>
            <span className="cp-count">{users.length} {t("allUsers")}</span>
          </div>
          <div className="cp-stats-grid cp-stats-small">
            <StatCard label={t("allUsers")} value={users.length} icon="users" tone="blue" />
            <StatCard label={t("pending")} value={users.filter((u) => u.status === "pending").length} icon="warning" tone="orange" />
            <StatCard label={t("approved")} value={users.filter((u) => u.status === "approved").length} icon="check" tone="green" />
          </div>
          <section className="cp-panel">
            <div className="cp-panel-head"><div><h3>{t("allUsers")}</h3><p>Account status and permissions.</p></div>
              <div className="cp-search"><Icon name="search" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("search")} /></div>
            </div>
            <TableWrap>
              <thead><tr><th>{t("account")}</th><th>{t("username")}</th><th>{t("role")}</th><th>{t("status")}</th><th>{t("date")}</th><th>{t("actions")}</th></tr></thead>
              <tbody>{users.filter((u) => `${u.name} ${u.username}`.toLowerCase().includes(search.toLowerCase())).map((account) => (
                <tr key={account.id}><td><div className="cp-user-cell"><span className="cp-avatar">{String(account.name || "?").charAt(0).toUpperCase()}</span><strong>{account.name}</strong></div></td>
                  <td>{account.username}</td>
                  <td><select className="cp-inline-select" value={account.role} disabled={Number(account.id) === Number(user.id)} onChange={(e) => updateUserRole(account, e.target.value)}>
                    <option value="user">{t("user")}</option><option value="admin">{t("admin")}</option>
                  </select></td>
                  <td><span className={`cp-badge ${account.status === "approved" ? "green" : account.status === "pending" ? "orange" : "red"}`}>{t(account.status) || account.status}</span></td>
                  <td>{account.created_at ? new Date(account.created_at).toLocaleDateString() : "—"}</td>
                  <td><div className="cp-row-actions">
                    {account.status !== "approved" && <button disabled={busy} className="cp-btn cp-btn-success cp-btn-sm" onClick={() => updateUserStatus(account, "approved")}>{t("approve")}</button>}
                    {account.status !== "rejected" && Number(account.id) !== Number(user.id) && <button disabled={busy} className="cp-btn cp-btn-danger cp-btn-sm" onClick={() => updateUserStatus(account, "rejected")}>{t("reject")}</button>}
                    {account.status === "rejected" && <button disabled={busy} className="cp-btn cp-btn-light cp-btn-sm" onClick={() => updateUserStatus(account, "pending")}>{t("pending")}</button>}
                  </div></td>
                </tr>
              ))}{!users.length && <EmptyRow colSpan={6} />}</tbody>
            </TableWrap>
          </section>
        </>
      );
    }

    return <section className="cp-panel"><h3>{t("noData")}</h3></section>;
  };

  return (
    <div className={`cp-app ${theme === "dark" ? "cp-dark" : ""}`}>
      <style>{styles}</style>
      {mobileOpen && <button className="cp-mobile-overlay" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}

      <aside className={`cp-sidebar ${mobileOpen ? "cp-sidebar-open" : ""}`}>
        <div className="cp-logo-row">
          <span className="cp-brand-mark">C</span>
          <div><strong>CANTINE PRO</strong><small>Management system</small></div>
          <button className="cp-close-mobile" onClick={() => setMobileOpen(false)}>×</button>
        </div>

        <div className="cp-side-label">WORKSPACE</div>
        <nav className="cp-nav">
          {navItems.map((item) => (
            <button key={item.id} className={`cp-nav-item ${page === item.id ? "active" : ""}`} onClick={() => { setPage(item.id); setMobileOpen(false); setSearch(""); }}>
              <Icon name={item.icon} /><span>{item.label}</span>{page === item.id && <i />}
            </button>
          ))}
        </nav>

        <div className="cp-sidebar-bottom">
          <div className={`cp-connection ${serverOnline ? "online" : "offline"}`}>
            <span className="cp-connection-dot" /><div><strong>{t("connection")}</strong><small>{serverOnline ? t("connected") : t("disconnected")}</small></div>
          </div>
          <button className="cp-nav-item cp-logout" onClick={signOut}><Icon name="logout" /><span>{t("logout")}</span></button>
          <div className="cp-sidebar-profile">
            <span className="cp-avatar">{String(user.name || "?").charAt(0).toUpperCase()}</span>
            <div className="cp-profile-text"><strong>{user.name}</strong><small>{user.role === "admin" ? t("admin") : t("user")}</small></div>
            <span className="cp-profile-online" />
          </div>
        </div>
      </aside>

      <main className="cp-main">
        <header className="cp-topbar">
          <div className="cp-topbar-left">
            <button className="cp-menu-button" onClick={() => setMobileOpen(true)} aria-label={t("menu")}><Icon name="menu" /></button>
            <div><div className="cp-breadcrumb">Workspace <span>/</span> {currentTitle}</div><h1>{currentTitle}</h1></div>
          </div>
          <div className="cp-topbar-actions">
            <button className="cp-icon-button" title={t("refresh")} onClick={loadAll}><Icon name="refresh" /></button>
            <select className="cp-language-select" aria-label={t("language")} value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="rw">RW</option><option value="en">EN</option><option value="fr">FR</option>
            </select>
            <button className="cp-icon-button" title={t("theme")} onClick={() => setTheme(theme === "light" ? "dark" : "light")}><Icon name={theme === "light" ? "moon" : "sun"} /></button>
            <div className="cp-top-profile"><span className="cp-avatar">{String(user.name || "?").charAt(0).toUpperCase()}</span><div><strong>{user.name}</strong><small>{user.role === "admin" ? t("admin") : t("user")}</small></div></div>
          </div>
        </header>

        <div className="cp-content">
          {notice.text && (
            <div className={`cp-notice cp-global-notice ${notice.type}`}>
              <span>{notice.type === "error" ? "⚠" : "✓"}</span>
              <span>{notice.text}</span>
              <button onClick={() => setNotice({ type: "", text: "" })}>×</button>
            </div>
          )}
          {pageLoading && <div className="cp-loading-line"><span /></div>}
          {pageContent()}
          <footer className="cp-footer"><span>© {new Date().getFullYear()} CANTINE PRO</span><span>RWF · Cantine Management System</span></footer>
        </div>
      </main>
    </div>
  );
}

const styles = `
:root{--cp-bg:#f5f7fb;--cp-panel:#fff;--cp-text:#182230;--cp-muted:#7c8799;--cp-border:#e8edf4;--cp-primary:#315ce8;--cp-primary-soft:#edf2ff;--cp-input:#fff;--cp-shadow:0 5px 24px rgba(20,38,75,.045)}
*{box-sizing:border-box}
body{margin:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
button,input,select{font:inherit}
button{cursor:pointer}
.cp-app{min-height:100vh;background:var(--cp-bg);color:var(--cp-text);--cp-bg:#f5f7fb;--cp-panel:#fff;--cp-text:#182230;--cp-muted:#7c8799;--cp-border:#e8edf4;--cp-primary:#315ce8;--cp-primary-soft:#edf2ff;--cp-input:#fff;--cp-shadow:0 5px 24px rgba(20,38,75,.045)}
.cp-app.cp-dark,.cp-auth:has(+ .cp-dark){--cp-bg:#101724;--cp-panel:#182333;--cp-text:#e8eef8;--cp-muted:#a0aec2;--cp-border:#2a3749;--cp-primary:#6e91ff;--cp-primary-soft:#25375c;--cp-input:#121c2a;--cp-shadow:0 5px 24px rgba(0,0,0,.14)}
.cp-app.cp-dark{background:var(--cp-bg);color:var(--cp-text)}
.cp-icon{display:inline-flex;align-items:center;justify-content:center;font-size:19px;line-height:1;min-width:20px}
.cp-sidebar{position:fixed;inset:0 auto 0 0;width:255px;background:#fff;border-right:1px solid var(--cp-border);display:flex;flex-direction:column;padding:24px 16px 16px;z-index:40;color:#253149}
.cp-dark .cp-sidebar{background:#141e2c;color:#e8eef8;border-color:var(--cp-border)}
.cp-logo-row{display:flex;align-items:center;gap:11px;padding:0 7px 32px}
.cp-brand-mark{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:13px;background:linear-gradient(140deg,#315ce8,#698aff);color:white;font-size:24px;font-weight:900;box-shadow:0 5px 12px #315ce833;flex-shrink:0}
.cp-logo-row strong{display:block;font-size:14px;letter-spacing:.3px;font-weight:850}
.cp-logo-row small{display:block;font-size:10px;color:#8a95a6;margin-top:4px}
.cp-close-mobile{display:none;margin-left:auto;background:none;border:0;font-size:26px;color:inherit}
.cp-side-label{font-size:10px;letter-spacing:1.5px;color:#9aa4b5;font-weight:800;padding:0 12px 12px}
.cp-nav{display:flex;flex-direction:column;gap:5px}
.cp-nav-item{width:100%;height:46px;display:flex;align-items:center;gap:12px;padding:0 12px;border:0;background:transparent;border-radius:10px;color:#7b879b;text-align:left;font-size:13px;font-weight:650;transition:all .18s;position:relative}
.cp-dark .cp-nav-item{color:#a5b2c7}
.cp-nav-item:hover{background:#f4f6fb;color:#30446a}
.cp-dark .cp-nav-item:hover{background:#202e40;color:#fff}
.cp-nav-item.active{background:#edf2ff;color:#315ce8}
.cp-dark .cp-nav-item.active{background:#26385b;color:#9db3ff}
.cp-nav-item.active i{position:absolute;right:0;top:12px;bottom:12px;width:3px;border-radius:4px;background:#315ce8}
.cp-sidebar-bottom{margin-top:auto}
.cp-connection{display:flex;align-items:center;gap:10px;padding:13px 11px;background:#f6f8fc;border:1px solid #edf0f6;border-radius:11px;margin-bottom:12px}
.cp-dark .cp-connection{background:#1c2a3b;border-color:var(--cp-border)}
.cp-connection-dot{width:8px;height:8px;border-radius:50%;background:#b4bdca;flex-shrink:0}
.cp-connection.online .cp-connection-dot{background:#16b77c;box-shadow:0 0 0 4px #16b77c1b}
.cp-connection strong,.cp-connection small{display:block;font-size:10px}
.cp-connection small{color:var(--cp-muted);margin-top:3px}
.cp-logout{margin-bottom:10px}
.cp-sidebar-profile{display:flex;align-items:center;gap:9px;padding:12px 7px 0;border-top:1px solid var(--cp-border)}
.cp-avatar{width:35px;height:35px;border-radius:50%;background:#e7edff;color:#315ce8;display:inline-flex;align-items:center;justify-content:center;font-weight:800;flex-shrink:0}
.cp-profile-text{min-width:0;flex:1}
.cp-profile-text strong,.cp-profile-text small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cp-profile-text strong{font-size:12px}
.cp-profile-text small{font-size:10px;color:var(--cp-muted);margin-top:4px}
.cp-profile-online{width:8px;height:8px;border-radius:50%;background:#19b57b}
.cp-main{margin-left:255px;min-height:100vh;min-width:0}
.cp-topbar{height:88px;background:var(--cp-panel);border-bottom:1px solid var(--cp-border);display:flex;align-items:center;justify-content:space-between;padding:0 32px;gap:16px;position:sticky;top:0;z-index:25}
.cp-topbar-left{display:flex;align-items:center;gap:12px;min-width:0}
.cp-breadcrumb{font-size:10px;color:var(--cp-muted);margin-bottom:5px}
.cp-breadcrumb span{padding:0 5px;color:#c2c9d5}
.cp-topbar h1{font-size:20px;letter-spacing:-.45px;margin:0;font-weight:800}
.cp-topbar-actions{display:flex;align-items:center;gap:11px}
.cp-icon-button,.cp-theme-btn{width:37px;height:37px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--cp-border);background:var(--cp-panel);color:var(--cp-text);border-radius:10px}
.cp-icon-button:hover,.cp-theme-btn:hover{border-color:#b8c8f9;background:var(--cp-primary-soft)}
.cp-language-select{background:var(--cp-panel);color:var(--cp-text);border:1px solid var(--cp-border);border-radius:9px;padding:9px 8px;font-size:11px;font-weight:750}
.cp-top-profile{display:flex;align-items:center;gap:9px;padding-left:9px;border-left:1px solid var(--cp-border)}
.cp-top-profile strong,.cp-top-profile small{display:block;white-space:nowrap}
.cp-top-profile strong{font-size:11px}
.cp-top-profile small{font-size:10px;color:var(--cp-muted);margin-top:3px}
.cp-menu-button{display:none;border:0;background:transparent;color:var(--cp-text);font-size:22px}
.cp-content{padding:27px 32px 18px;max-width:1700px;margin:auto}
.cp-welcome-row,.cp-page-intro{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:22px}
.cp-welcome-row h2,.cp-page-intro h2{font-size:22px;letter-spacing:-.6px;margin:0 0 7px;font-weight:820}
.cp-welcome-row p,.cp-page-intro p{font-size:12px;color:var(--cp-muted);margin:0}
.cp-date-pill,.cp-count{display:inline-flex;align-items:center;gap:8px;padding:10px 13px;background:var(--cp-panel);border:1px solid var(--cp-border);border-radius:10px;color:var(--cp-muted);font-size:11px;font-weight:650;white-space:nowrap}
.cp-stats-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-bottom:18px}
.cp-stats-small{margin-bottom:22px}
.cp-stat{background:var(--cp-panel);border:1px solid var(--cp-border);border-radius:14px;padding:20px 17px;display:flex;align-items:center;gap:13px;min-width:0;box-shadow:var(--cp-shadow)}
.cp-stat-icon{width:43px;height:43px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.cp-stat-icon.blue{background:#edf2ff;color:#315ce8}
.cp-stat-icon.green{background:#e7f8f0;color:#159a65}
.cp-stat-icon.orange{background:#fff3e5;color:#e88b20}
.cp-stat-icon.purple{background:#f1eaff;color:#8c60d9}
.cp-dark .cp-stat-icon.blue{background:#26385b;color:#9db3ff}
.cp-dark .cp-stat-icon.green{background:#173c34;color:#6ddbb0}
.cp-dark .cp-stat-icon.orange{background:#493421;color:#ffc179}
.cp-dark .cp-stat-icon.purple{background:#35274e;color:#c6a4ff}
.cp-stat-content{min-width:0}
.cp-stat-content span,.cp-stat-content small{display:block;font-size:10px;color:var(--cp-muted)}
.cp-stat-content strong{display:block;font-size:clamp(15px,1.45vw,22px);letter-spacing:-.55px;line-height:1.35;margin:5px 0;overflow-wrap:anywhere}
.cp-stat-content small{font-size:9px}
.cp-dashboard-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:18px}
.cp-panel{background:var(--cp-panel);border:1px solid var(--cp-border);border-radius:14px;box-shadow:var(--cp-shadow);margin-bottom:18px;min-width:0;overflow:hidden}
.cp-panel-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:20px 20px 17px}
.cp-panel-head h3{font-size:14px;letter-spacing:-.15px;margin:0;font-weight:800}
.cp-panel-head p{font-size:10px;color:var(--cp-muted);margin:5px 0 0}
.cp-table-wrap{width:100%;overflow:auto}
.cp-table-wrap table{width:100%;border-collapse:collapse;text-align:left;white-space:nowrap;font-size:11px}
.cp-table-wrap th{padding:12px 16px;background:#f8f9fc;color:#8b95a6;font-size:9px;text-transform:uppercase;letter-spacing:.65px;font-weight:800;border-top:1px solid var(--cp-border);border-bottom:1px solid var(--cp-border)}
.cp-dark .cp-table-wrap th{background:#1d2a3b;color:#a7b4c8}
.cp-table-wrap td{padding:13px 16px;border-bottom:1px solid var(--cp-border);color:var(--cp-text);vertical-align:middle}
.cp-table-wrap tbody tr:last-child td{border-bottom:0}
.cp-table-wrap tbody tr:hover{background:rgba(100,130,190,.035)}
.cp-table-wrap td strong{font-size:11px;font-weight:750}
.cp-cell-sub{display:block;color:var(--cp-muted);font-size:9px;margin-top:4px}
.cp-money{font-weight:800;color:#315ce8!important}
.cp-positive{color:#129969!important;font-weight:750}
.cp-negative{color:#e04f61!important;font-weight:750}
.cp-empty{text-align:center!important;padding:32px 15px!important;color:var(--cp-muted)!important;font-size:12px!important}
.cp-badge{display:inline-flex;align-items:center;padding:5px 8px;border-radius:6px;font-size:9px;font-weight:800;white-space:nowrap}
.cp-badge.green{color:#13835d;background:#e7f8ef}
.cp-badge.orange{color:#b87518;background:#fff2df}
.cp-badge.red{color:#c73b51;background:#ffebef}
.cp-dark .cp-badge.green{background:#173c34;color:#7ce0b7}
.cp-dark .cp-badge.orange{background:#493721;color:#ffd18b}
.cp-dark .cp-badge.red{background:#492832;color:#ffa1af}
.cp-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 16px;border-radius:9px;border:1px solid transparent;font-size:11px;font-weight:750;transition:all .15s;white-space:nowrap}
.cp-btn:disabled{opacity:.55;cursor:not-allowed}
.cp-btn-primary{background:#315ce8;color:white;box-shadow:0 4px 10px #315ce820}
.cp-btn-primary:hover:not(:disabled){background:#254bd0;transform:translateY(-1px)}
.cp-btn-light{background:var(--cp-panel);border-color:var(--cp-border);color:var(--cp-text)}
.cp-btn-light:hover{background:var(--cp-primary-soft);border-color:#cbd6fa}
.cp-btn-success{background:#e5f8ee;color:#128157}
.cp-btn-danger{background:#fff0f1;color:#c73b51}
.cp-btn-sm{padding:7px 10px;font-size:10px;border-radius:7px}
.cp-full{width:100%;margin-top:7px;justify-content:space-between}
.cp-form-panel{padding-bottom:20px}
.cp-form-grid{padding:0 20px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.cp-field{display:flex;flex-direction:column;gap:8px;min-width:0}
.cp-field>span{font-size:11px;font-weight:750;color:var(--cp-text)}
.cp-field input,.cp-field select,.cp-search input{width:100%;min-width:0;border:1px solid var(--cp-border);background:var(--cp-input);color:var(--cp-text);padding:12px 12px;border-radius:9px;outline:none;font-size:12px;transition:border .15s,box-shadow .15s}
.cp-field input:focus,.cp-field select:focus,.cp-search input:focus{border-color:#7896ff;box-shadow:0 0 0 3px #315ce815}
.cp-field input::placeholder,.cp-search input::placeholder{color:#a7b0bf}
.cp-form-actions{display:flex;align-items:center;gap:9px;grid-column:1/-1;padding-top:3px}
.cp-search{display:flex;align-items:center;gap:8px;border:1px solid var(--cp-border);border-radius:9px;padding-left:10px;color:var(--cp-muted);width:min(230px,45%)}
.cp-search input{border:0;box-shadow:none!important;padding:9px 8px;background:transparent}
.cp-row-actions{display:flex;align-items:center;gap:6px}
.cp-sale-preview{grid-column:1/-1;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;padding:15px;background:var(--cp-bg);border:1px solid var(--cp-border);border-radius:10px}
.cp-sale-preview span,.cp-sale-preview strong{display:block}
.cp-sale-preview span{font-size:10px;color:var(--cp-muted);margin-bottom:7px}
.cp-sale-preview strong{font-size:14px}
.cp-shortcuts{padding-bottom:18px}
.cp-shortcut-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;padding:0 20px}
.cp-shortcut-grid button{display:flex;flex-direction:column;align-items:flex-start;text-align:left;gap:7px;padding:16px;border:1px solid var(--cp-border);background:var(--cp-panel);border-radius:11px;color:var(--cp-text);transition:all .18s;min-width:0}
.cp-shortcut-grid button:hover{border-color:#b8c8f9;transform:translateY(-2px);background:var(--cp-primary-soft)}
.cp-shortcut-grid button>span{display:grid;place-items:center;width:32px;height:32px;border-radius:9px;background:var(--cp-primary-soft);color:var(--cp-primary);font-size:21px}
.cp-shortcut-grid strong{font-size:11px}
.cp-shortcut-grid small{font-size:9px;color:var(--cp-muted)}
.cp-user-cell{display:flex;align-items:center;gap:9px}
.cp-user-cell .cp-avatar{width:29px;height:29px;font-size:11px}
.cp-inline-select{padding:7px 8px;border:1px solid var(--cp-border);border-radius:7px;background:var(--cp-input);color:var(--cp-text);font-size:10px}
.cp-report-heading{margin:8px 0 18px}
.cp-report-heading h3{font-size:15px;margin:0 0 5px}
.cp-report-heading p{font-size:11px;color:var(--cp-muted);margin:0}
.cp-footer{display:flex;justify-content:space-between;gap:10px;padding:22px 2px 4px;color:var(--cp-muted);font-size:9px}
.cp-notice{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:9px;font-size:12px;margin-bottom:17px;overflow-wrap:anywhere}
.cp-notice.success{background:#e9f9f0;color:#127e56;border:1px solid #d1f0df}
.cp-notice.error{background:#fff0f1;color:#b92d46;border:1px solid #f9d8dd}
.cp-global-notice button{margin-left:auto;border:0;background:none;color:inherit;font-size:20px;flex-shrink:0}
.cp-loading-line{height:3px;background:var(--cp-border);margin:-27px -32px 24px;overflow:hidden}
.cp-loading-line span{display:block;height:100%;width:35%;background:#315ce8;animation:cp-load 1.2s ease-in-out infinite}
@keyframes cp-load{0%{transform:translateX(-110%)}100%{transform:translateX(310%)}}
.cp-mobile-overlay{display:none}
.cp-auth{min-height:100vh;display:grid;grid-template-columns:1.05fr .95fr;background:#fff;color:#1b2639;--cp-primary:#315ce8}
.cp-auth-left{position:relative;overflow:hidden;background:linear-gradient(145deg,#101e45 0%,#1d3a7a 58%,#315ce8 100%);padding:36px 8%;display:flex;flex-direction:column;color:#fff;min-height:100vh}
.cp-auth-left:after{content:"";position:absolute;width:490px;height:490px;border-radius:50%;border:1px solid #ffffff18;right:-170px;bottom:-150px;box-shadow:0 0 0 60px #ffffff08,0 0 0 120px #ffffff06;pointer-events:none}
.cp-brand-large{display:flex;align-items:center;gap:12px;font-size:15px;font-weight:900;letter-spacing:.6px}
.cp-auth-hero{position:relative;z-index:1;margin:auto 0;max-width:580px;padding:65px 0}
.cp-eyebrow{display:inline-block;color:#6889f7;font-size:10px;letter-spacing:1.8px;font-weight:850}
.cp-auth-left .cp-eyebrow{color:#9fb7ff}
.cp-auth-hero h1{font-size:clamp(35px,4vw,59px);line-height:1.13;letter-spacing:-2.1px;margin:22px 0;font-weight:850}
.cp-auth-hero h1 span{color:#a9bdff}
.cp-auth-hero p{font-size:14px;line-height:1.9;color:#d4dfff;max-width:410px}
.cp-hero-stats{display:flex;gap:48px;margin-top:42px}
.cp-hero-stats strong,.cp-hero-stats span{display:block}
.cp-hero-stats strong{font-size:25px}
.cp-hero-stats span{font-size:10px;color:#c7d4ff;margin-top:5px}
.cp-auth-footer{font-size:10px;color:#b7c8ff;position:relative;z-index:1}
.cp-auth-right{display:flex;flex-direction:column;position:relative;padding:27px clamp(20px,5vw,80px);min-width:0;background:#fff}
.cp-auth-top{display:flex;justify-content:flex-end;gap:9px}
.cp-auth-top select{border:1px solid #e6eaf2;background:white;color:#24304a;padding:9px;border-radius:8px;font-size:11px}
.cp-auth-form{width:100%;max-width:390px;margin:auto}
.cp-auth-form h2{font-size:29px;letter-spacing:-1px;margin:13px 0 9px;color:#18243a}
.cp-muted{color:#8b96a9;font-size:12px;line-height:1.7;margin:0 0 27px}
.cp-auth-form .cp-field{margin-bottom:18px}
.cp-auth-form .cp-field input{background:#fff;border-color:#e2e8f1;color:#18243a;padding:13px}
.cp-auth-form .cp-field input:focus{border-color:#6b8bff;box-shadow:0 0 0 3px #315ce814}
.cp-auth-switch{text-align:center;color:#7d8799;font-size:11px;margin-top:23px}
.cp-auth-switch button{border:0;background:none;color:#315ce8;font-weight:800;margin-left:5px}
.cp-help{font-size:10px;line-height:1.6;color:#8994a6;margin-top:16px}
@media(min-width:1600px){.cp-content{padding-left:42px;padding-right:42px}.cp-topbar{padding-left:42px;padding-right:42px}.cp-stat{padding:22px}}
@media(max-width:1200px){.cp-stats-grid{gap:10px}.cp-stat{padding:15px 12px;gap:9px}.cp-stat-icon{width:36px;height:36px}.cp-content{padding-left:22px;padding-right:22px}.cp-topbar{padding-left:22px;padding-right:22px}.cp-shortcut-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:1000px){.cp-sidebar{width:225px}.cp-main{margin-left:225px}.cp-stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.cp-dashboard-grid{grid-template-columns:1fr}.cp-auth{grid-template-columns:.8fr 1fr}.cp-auth-left{padding-left:7%;padding-right:7%}.cp-auth-hero h1{font-size:39px}}
@media(max-width:700px){.cp-sidebar{transform:translateX(-105%);transition:transform .25s ease;width:270px;box-shadow:none}.cp-sidebar.cp-sidebar-open{transform:translateX(0);box-shadow:12px 0 40px #0002}.cp-close-mobile{display:block}.cp-main{margin-left:0}.cp-mobile-overlay{display:block;position:fixed;inset:0;background:#10182777;border:0;z-index:35}.cp-topbar{height:72px;padding:0 14px;gap:8px}.cp-topbar h1{font-size:17px}.cp-topbar-actions{gap:6px}.cp-top-profile{display:none}.cp-menu-button{display:inline-flex;align-items:center;justify-content:center}.cp-breadcrumb{font-size:9px}.cp-icon-button{width:33px;height:33px}.cp-language-select{padding:8px 5px}.cp-content{padding:19px 13px 14px}.cp-loading-line{margin:-19px -13px 18px}.cp-welcome-row h2,.cp-page-intro h2{font-size:19px}.cp-welcome-row{align-items:flex-start}.cp-date-pill{font-size:10px;padding:8px}.cp-stat{padding:13px 10px;gap:9px;border-radius:11px}.cp-stat-icon{width:33px;height:33px;border-radius:9px}.cp-stat-content span{font-size:9px}.cp-stat-content strong{font-size:15px}.cp-stat-content small{font-size:9px}.cp-panel-head{padding:16px 13px 14px;align-items:flex-start}.cp-panel-head h3{font-size:13px}.cp-panel-head p{font-size:9px}.cp-table-wrap th{padding:11px 12px;font-size:8px}.cp-table-wrap td{padding:11px 12px;font-size:10px}.cp-form-grid{padding:0 13px;grid-template-columns:1fr;gap:14px}.cp-form-actions{grid-column:1}.cp-sale-preview{grid-column:1;gap:7px;padding:11px}.cp-sale-preview strong{font-size:11px}.cp-sale-preview span{font-size:9px}.cp-search{width:45%;min-width:100px}.cp-search input{font-size:10px}.cp-panel-head>.cp-btn{font-size:9px;padding:8px}.cp-row-actions{flex-wrap:wrap}.cp-btn-sm{font-size:9px;padding:6px 8px}.cp-shortcut-grid{padding:0 13px;gap:8px}.cp-shortcut-grid button{padding:12px}.cp-shortcut-grid strong{font-size:10px}.cp-footer{font-size:8px}.cp-auth{grid-template-columns:1fr}.cp-auth-left{display:none}.cp-auth-right{min-height:100vh;padding:20px}.cp-auth-form{max-width:420px}.cp-auth-form h2{font-size:25px}.cp-page-intro{align-items:flex-start}.cp-count{font-size:9px;padding:8px}.cp-report-heading h3{font-size:13px}}
@media(max-width:380px){.cp-stats-grid{gap:7px}.cp-stat{padding:10px 8px;gap:7px}.cp-stat-icon{width:28px;height:28px}.cp-stat-content strong{font-size:13px}.cp-topbar-actions{gap:4px}.cp-icon-button{width:29px;height:29px}.cp-topbar{padding:0 9px}.cp-content{padding-left:9px;padding-right:9px}.cp-welcome-row h2{font-size:16px}.cp-date-pill{font-size:9px}.cp-shortcut-grid{grid-template-columns:1fr 1fr}}
@media print{.cp-sidebar,.cp-topbar,.cp-print-hide,.cp-footer,.cp-global-notice,.cp-page-intro .cp-btn{display:none!important}.cp-main{margin:0!important}.cp-content{padding:0!important;max-width:none!important}.cp-app{background:#fff!important;color:#111!important;--cp-panel:#fff;--cp-text:#111;--cp-muted:#555;--cp-border:#ddd;--cp-bg:#fff}.cp-panel,.cp-stat{box-shadow:none;break-inside:avoid;border:1px solid #ddd}.cp-stats-grid{grid-template-columns:repeat(4,1fr)}.cp-table-wrap{overflow:visible}.cp-table-wrap table{white-space:normal;font-size:9px}.cp-table-wrap th,.cp-table-wrap td{padding:7px}.cp-report-heading{margin-top:20px}}
`;
