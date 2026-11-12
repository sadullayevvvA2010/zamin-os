/* ===== ZAMIN OS — Ma'lumotlar qatlami ===== */
const DB = {
  KEY: 'zamin_os_db_v2', // Versiya o'zgardi, eski ma'lumotlar o'chadi

  seed() {
    const now = new Date();
    const iso = d => d.toISOString();
    const daysAgo = n => iso(new Date(now.getTime() - n * 86400000));

    const users = [
      { id: 1, name: 'Admin ZAMIN', email: 'admin@zamin.uz', password: 'admin123', role: 'Bosh administrator', avatar: 'A', branchId: null, createdAt: iso(now) }
    ];

    const branches = [
      { id: 1, name: 'Bosh ofis — Toshkent', address: 'Amir Temur ko\'chasi 1', phone: '+998 90 123 45 67', createdAt: iso(now) },
      { id: 2, name: 'Samarqand filiali', address: 'Registon ko\'chasi 5', phone: '+998 91 222 33 44', createdAt: iso(now) },
      { id: 3, name: 'Buxoro filiali', address: 'Mustaqillik ko\'chasi 12', phone: '+998 93 555 66 77', createdAt: iso(now) }
    ];

    const categories = [
      { id: 1, name: 'Oziq-ovqat' }, { id: 2, name: 'Ichimliklar' }, { id: 3, name: 'Maishiy texnika' }, { id: 4, name: 'Kiyim-kechak' }, { id: 5, name: 'Boshqa' }
    ];

    const productNames = [
      'Coca-Cola 1.5L', 'Pepsi 1L', 'Suv 0.5L', 'Non', 'Sut 1L', 'Yog\' 1L', 'Makaron 500g', 'Guruch 1kg', 'Un 5kg', 'Shakar 1kg', 'Choy 100g', 'Kofe 200g', 'Shokolad', 'Pechene', 'Fleshka 32GB', 'Telefon qoplamasi', 'Simsiz sichqoncha', 'Klaviatura', 'Kabel USB', 'Quloqchin'
    ];
    
    const products = productNames.map((name, i) => ({
      id: i + 1, name, sku: `SKU-${String(i + 1).padStart(4, '0')}`, barcode: `BC${String(100000 + i).slice(0, 6)}`,
      categoryId: (i % 5) + 1, purchasePrice: 5000 + i * 2000, salePrice: 8000 + i * 3000,
      stock: [45, 3, 120, 8, 60, 12, 30, 22, 4, 90, 15, 7, 25, 40, 5, 11, 2, 18, 55, 9][i],
      minStock: 10, branchId: (i % 3) + 1, createdAt: iso(now)
    }));

    const customers = [
      { id: 1, name: 'Aziz Karimov', phone: '+998 90 111 22 33', branchId: 1 },
      { id: 2, name: 'Dilnoza Yusupova', phone: '+998 91 222 33 44', branchId: 1 },
      { id: 3, name: 'Sardor Toshmatov', phone: '+998 93 333 44 55', branchId: 2 },
      { id: 4, name: 'Malika Rashidova', phone: '+998 94 444 55 66', branchId: 2 },
      { id: 5, name: 'Jasur Umarov', phone: '+998 95 555 66 77', branchId: 3 }
    ];

    const orders = [];
    for (let i = 0; i < 15; i++) {
      const p1 = products[i % products.length];
      const p2 = products[(i + 3) % products.length];
      const qty1 = 1 + (i % 4);
      const qty2 = 1 + (i % 3);
      const items = [
        { productId: p1.id, name: p1.name, qty: qty1, price: p1.salePrice },
        { productId: p2.id, name: p2.name, qty: qty2, price: p2.salePrice }
      ];
      const total = items.reduce((s, it) => s + it.qty * it.price, 0);
      const statuses = ['completed', 'pending', 'cancelled', 'completed', 'completed'];
      orders.push({
        id: i + 1, number: `ORD-${String(1000 + i)}`, customerId: customers[i % 5].id, customerName: customers[i % 5].name,
        branchId: (i % 3) + 1, items, total, status: statuses[i % 5], paymentStatus: i % 4 === 0 ? 'unpaid' : 'paid', createdAt: daysAgo(i)
      });
    }

    const suppliers = [
      { id: 1, name: 'Global Food MChJ', phone: '+998 71 200 10 10', address: 'Toshkent' },
      { id: 2, name: 'Oq Oltin Savdo', phone: '+998 71 200 20 20', address: 'Samarqand' },
      { id: 3, name: 'Texno Plus', phone: '+998 71 200 30 30', address: 'Toshkent' },
      { id: 4, name: 'Ichimlik Group', phone: '+998 71 200 40 40', address: 'Buxoro' },
      { id: 5, name: 'Universal Trade', phone: '+998 71 200 50 50', address: 'Toshkent' }
    ];

    const expenses = [
      { id: 1, title: 'Ijara to\'lovi', amount: 5000000, date: daysAgo(5), branchId: 1 },
      { id: 2, title: 'Xodimlar maoshi', amount: 12000000, date: daysAgo(10), branchId: 1 },
      { id: 3, title: 'Kommunal to\'lovlar', amount: 1500000, date: daysAgo(3), branchId: 2 },
      { id: 4, title: 'Logistika xarajatlari', amount: 2000000, date: daysAgo(7), branchId: 3 },
      { id: 5, title: 'Reklama va marketing', amount: 3000000, date: daysAgo(2), branchId: 1 }
    ];

    const notifications = [
      { id: 1, title: 'Kam qolgan mahsulot', message: 'Pepsi 1L — faqat 3 ta qoldi', read: false, createdAt: daysAgo(0) },
      { id: 2, title: 'Yangi buyurtma', message: 'ORD-1014 — 2 ta mahsulot qo\'shildi', read: false, createdAt: daysAgo(1) },
      { id: 3, title: 'Buyurtma bekor qilindi', message: 'ORD-1012 bekor qilindi', read: true, createdAt: daysAgo(2) },
      { id: 4, title: 'Omborga kirim', message: 'Coca-Cola 1.5L dan 50 dona keldi', read: false, createdAt: daysAgo(3) },
      { id: 5, title: 'Tizim xabari', message: 'ZAMIN OS muvaffaqiyatli yangilandi', read: true, createdAt: daysAgo(4) }
    ];

    const db = { users, branches, categories, products, customers, orders, suppliers, expenses, notifications, settings: { orgName: 'ZAMIN Savdo MChJ', theme: 'light' }, session: null };
    localStorage.setItem(this.KEY, JSON.stringify(db));
    return db;
  },

  get() {
    let raw = localStorage.getItem(this.KEY);
    if (!raw) return this.seed();
    try { return JSON.parse(raw); } catch { return this.seed(); }
  },
  save(db) { localStorage.setItem(this.KEY, JSON.stringify(db)); },
  add(col, item) { const db = this.get(); item.id = db[col].reduce((m, x) => Math.max(m, x.id), 0) + 1; db[col].push(item); this.save(db); return item; },
  update(col, id, changes) { const db = this.get(); const idx = db[col].findIndex(x => x.id === id); if (idx > -1) { db[col][idx] = { ...db[col][idx], ...changes }; this.save(db); } },
  remove(col, id) { const db = this.get(); db[col] = db[col].filter(x => x.id !== id); this.save(db); },
  reset() { localStorage.removeItem(this.KEY); this.seed(); }
};

// SANALARNI O'ZBEKCHA FORMATDA CHIQARISH (13.10.2026)
function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${d.getFullYear()}`;
}

function formatDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${formatDate(iso)}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// VALYUTA FORMATI
function formatUZS(n) {
  return new Intl.NumberFormat('uz-UZ').format(n) + ' so\'m';
}