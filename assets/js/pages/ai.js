/* ===== ZAMIN AI (oddiy qoidalar asosida) ===== */
const AIPage = {
  history: [],

  render(container) {
    container.innerHTML = `
      <div class="page-header">
        <div><h1>ZAMIN AI</h1><p>O'zbek tilidagi biznes yordamchisi</p></div>
      </div>
      <div class="card ai-chat">
        <div class="ai-messages" id="aiMessages">
          <div class="ai-msg bot">Assalomu alaykum! Men ZAMIN AI yordamchisiman. Savdo, mahsulot, ombor yoki moliya haqida savol bering.</div>
        </div>
        <div class="ai-suggestions">
          <button class="ai-suggestion" data-q="Bugun qancha savdo qildim?">Bugun qancha savdo?</button>
          <button class="ai-suggestion" data-q="Qaysi mahsulotlar kamayib qoldi?">Kam qolgan mahsulotlar</button>
          <button class="ai-suggestion" data-q="Qaysi filialning natijasi yaxshiroq?">Eng yaxshi filial</button>
          <button class="ai-suggestion" data-q="Umumiy foydam qancha?">Umumiy foyda</button>
        </div>
        <div class="ai-input-wrap">
          <input id="aiInput" placeholder="Savolingizni yozing..." />
          <button class="btn btn-primary" id="aiSend">Yuborish</button>
        </div>
      </div>
    `;

    document.getElementById('aiSend').addEventListener('click', () => this.send());
    document.getElementById('aiInput').addEventListener('keydown', e => { if (e.key === 'Enter') this.send(); });
    document.querySelectorAll('.ai-suggestion').forEach(b => b.addEventListener('click', () => {
      document.getElementById('aiInput').value = b.dataset.q;
      this.send();
    }));
  },

  send() {
    const input = document.getElementById('aiInput');
    const q = input.value.trim();
    if (!q) return;
    input.value = '';
    this.append('user', q);
    setTimeout(() => this.append('bot', this.answer(q)), 300);
  },

  append(role, text) {
    const box = document.getElementById('aiMessages');
    const el = document.createElement('div');
    el.className = 'ai-msg ' + role;
    el.textContent = text;
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
  },

  answer(q) {
    const db = DB.get();
    const ql = q.toLowerCase();
    const today = new Date().toISOString().slice(0, 10);

    if (ql.includes('bugun') && ql.includes('savdo')) {
      const t = db.orders.filter(o => o.status === 'completed' && o.createdAt.slice(0, 10) === today)
        .reduce((s, o) => s + o.total, 0);
      return `Bugungi savdo: ${formatUZS(t)}. (${db.orders.filter(o => o.createdAt.slice(0, 10) === today).length} ta buyurtma)`;
    }
    if (ql.includes('kam') && (ql.includes('mahsulot') || ql.includes('qoldi'))) {
      const low = db.products.filter(p => p.stock <= p.minStock);
      if (!low.length) return "Hozircha barcha mahsulotlar yetarli miqdorda.";
      return `Kam qolgan mahsulotlar (${low.length} ta):\n` + low.slice(0, 5).map(p => `• ${p.name} — ${p.stock} ta`).join('\n');
    }
    if (ql.includes('filial')) {
      const stats = db.branches.map(b => {
        const total = db.orders.filter(o => o.branchId === b.id && o.status === 'completed').reduce((s, o) => s + o.total, 0);
        return { name: b.name, total };
      }).sort((a, b) => b.total - a.total);
      return `Eng yaxshi filial: ${stats[0].name} (${formatUZS(stats[0].total)}).\n\nBarcha filiallar:\n` + stats.map(s => `• ${s.name}: ${formatUZS(s.total)}`).join('\n');
    }
    if (ql.includes('foyda')) {
      const inc = db.orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0);
      const exp = db.expenses.reduce((s, e) => s + e.amount, 0);
      return `Umumiy daromad: ${formatUZS(inc)}\nXarajat: ${formatUZS(exp)}\nSof foyda: ${formatUZS(inc - exp)}`;
    }
    if (ql.includes('buyurtma')) {
      return `Jami ${db.orders.length} ta buyurtma mavjud. ${db.orders.filter(o => o.status === 'pending').length} tasi kutilmoqda.`;
    }
    return "Kechirasiz, savolingizni tushunmadim. Savdo, mahsulot, filial yoki foyda haqida so'rashingiz mumkin.";
  }
};