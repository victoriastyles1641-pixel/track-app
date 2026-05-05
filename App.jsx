import { useState, useEffect, useMemo } from "react";

// ─── Storage Keys ───────────────────────────────────────────────────────────
const STORAGE_KEY_PRODUCTS = "orders_app_products";
const STORAGE_KEY_ORDERS   = "orders_app_orders";
const STORAGE_KEY_ADS      = "orders_app_ads";

const initialProducts = ["منتج 1", "منتج 2", "منتج 3"];

// ─── Utilities ───────────────────────────────────────────────────────────────
function getWeekRange() {
  const today = new Date();
  const day = today.getDay(); // 0=Sun … 6=Sat
  const daysFromSat = (day + 1) % 7;   // Sat=0, Sun=1 … Fri=6
  const sat = new Date(today);
  sat.setDate(today.getDate() - daysFromSat);
  const thu = new Date(sat);
  thu.setDate(sat.getDate() + 5);       // Saturday + 5 = Thursday
  return {
    from: sat.toISOString().split("T")[0],
    to:   thu.toISOString().split("T")[0],
  };
}

function formatDate(d) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

function getLast30Days() {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  });
}

// ─── Shared Styles ───────────────────────────────────────────────────────────
const styles = {
  label: {
    fontSize: 12,
    color: "#a0aec0",
    marginBottom: 4,
    display: "block",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#f0f0f0",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    direction: "rtl",
    fontFamily: "inherit",
  },
  primaryBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg, #a78bfa, #60a5fa)",
    color: "white",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  deleteBtn: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#f87171",
    borderRadius: 8,
    padding: "6px 10px",
    cursor: "pointer",
    fontSize: 14,
    fontFamily: "inherit",
  },
};

// ─── Shared Components ───────────────────────────────────────────────────────
function Card({ children }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(8px)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 16,
      padding: 16,
      marginBottom: 14,
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 14, color: "#e2e8f0" }}>
      {children}
    </div>
  );
}

function Select({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        color: "#f0f0f0",
        fontSize: 14,
        outline: "none",
        direction: "rtl",
        fontFamily: "inherit",
      }}
    >
      {children}
    </select>
  );
}

function Chip({ label, value, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span style={{ fontSize: 9, color: "#888" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div style={{ textAlign: "center", color: "#666", padding: "20px 0", fontSize: 13 }}>
      {text}
    </div>
  );
}

// ─── Tab Definitions ─────────────────────────────────────────────────────────
const TABS = [
  { id: "orders",   label: "الطلبيات",    icon: "📦" },
  { id: "ads",      label: "الإعلانات",   icon: "📢" },
  { id: "stats",    label: "الإحصائيات",  icon: "📊" },
  { id: "settings", label: "الإعدادات",   icon: "⚙️" },
];

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("orders");

  const [products, setProducts] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_PRODUCTS)) || initialProducts; }
    catch { return initialProducts; }
  });

  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_ORDERS)) || []; }
    catch { return []; }
  });

  const [ads, setAds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_ADS)) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ADS, JSON.stringify(ads));
  }, [ads]);

  return (
    <div dir="rtl" style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      fontFamily: "'Cairo', 'Tajawal', sans-serif",
      color: "#f0f0f0",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px 8px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        textAlign: "center",
      }}>
        <h1 style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: 1,
          background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          🛒 متتبع الطلبيات
        </h1>
      </div>

      {/* Page Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", paddingBottom: 80 }}>
        {tab === "orders"   && <OrdersTab   orders={orders}   setOrders={setOrders}     products={products} />}
        {tab === "ads"      && <AdsTab      ads={ads}         setAds={setAds}           products={products} />}
        {tab === "stats"    && <StatsTab    orders={orders}   ads={ads}                 products={products} />}
        {tab === "settings" && <SettingsTab products={products} setProducts={setProducts} />}
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        background: "rgba(15,12,41,0.95)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        zIndex: 100,
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              padding: "10px 4px 8px",
              border: "none",
              cursor: "pointer",
              background: "transparent",
              color: tab === t.id ? "#a78bfa" : "#888",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              transition: "all 0.2s",
              borderTop: tab === t.id ? "2px solid #a78bfa" : "2px solid transparent",
              fontFamily: "inherit",
            }}
          >
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{ fontSize: 11, fontWeight: tab === t.id ? 700 : 400 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
function OrdersTab({ orders, setOrders, products }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm]     = useState({ date: today, product: products[0] || "", total: "" });
  const [filter, setFilter] = useState("all");

  // Keep selected product in sync if products list changes
  useEffect(() => {
    if (products.length && !products.includes(form.product)) {
      setForm(f => ({ ...f, product: products[0] }));
    }
  }, [products]); // eslint-disable-line react-hooks/exhaustive-deps

  const addOrder = () => {
    if (!form.product || !form.date) return;
    setOrders(prev => [...prev, { id: Date.now(), ...form, total: form.total || null }]);
    setForm(f => ({ ...f, total: "" }));
  };

  const deleteOrder = id => setOrders(prev => prev.filter(o => o.id !== id));

  const uniqueDates = [...new Set(orders.map(o => o.date))].sort((a, b) => b.localeCompare(a));
  const filtered    = filter === "all" ? orders : orders.filter(o => o.date === filter);
  const sorted      = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      {/* Add Order Form */}
      <Card>
        <SectionTitle>➕ إضافة طلبية</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={styles.label}>التاريخ</label>
          <Select value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))}>
            {getLast30Days().map(d => (
              <option key={d} value={d}>
                {formatDate(d)}{d === today ? " — اليوم" : ""}
              </option>
            ))}
          </Select>

          <label style={styles.label}>المنتج</label>
          <Select value={form.product} onChange={v => setForm(f => ({ ...f, product: v }))}>
            {products.map(p => <option key={p} value={p}>{p}</option>)}
          </Select>

          <label style={styles.label}>
            المجموع <span style={{ color: "#888", fontSize: 11 }}>(اختياري)</span>
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={form.total}
            onChange={e => setForm(f => ({ ...f, total: e.target.value }))}
            style={styles.input}
          />

          <button onClick={addOrder} style={styles.primaryBtn}>+ إضافة الطلبية</button>
        </div>
      </Card>

      {/* Orders List */}
      <Card>
        <SectionTitle>📋 سجل الطلبيات</SectionTitle>
        <div style={{ marginBottom: 10 }}>
          <Select value={filter} onChange={v => setFilter(v)}>
            <option value="all">كل الأيام</option>
            {uniqueDates.map(d => <option key={d} value={d}>{formatDate(d)}</option>)}
          </Select>
        </div>

        {sorted.length === 0
          ? <Empty text="لا توجد طلبيات" />
          : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sorted.map(o => (
                <div key={o.id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{o.product}</div>
                    <div style={{ fontSize: 12, color: "#a78bfa", marginTop: 2 }}>{formatDate(o.date)}</div>
                    {o.total && (
                      <div style={{ fontSize: 12, color: "#60a5fa", marginTop: 2 }}>{o.total} ريال</div>
                    )}
                  </div>
                  <button onClick={() => deleteOrder(o.id)} style={styles.deleteBtn}>🗑</button>
                </div>
              ))}
            </div>
          )
        }
      </Card>
    </div>
  );
}

// ─── Ads Tab ──────────────────────────────────────────────────────────────────
function AdsTab({ ads, setAds, products }) {
  const today   = new Date().toISOString().split("T")[0];
  const [selDate, setSelDate] = useState(today);

  const todayAds = ads.find(a => a.date === selDate) || { date: selDate, entries: {} };

  const toggleProduct = product => {
    setAds(prev => {
      const existing = prev.find(a => a.date === selDate);
      if (existing) {
        const entries = { ...existing.entries };
        if (entries[product]) {
          delete entries[product];
        } else {
          entries[product] = { active: true, spend: "" };
        }
        return prev.map(a => a.date === selDate ? { ...a, entries } : a);
      }
      return [...prev, { date: selDate, entries: { [product]: { active: true, spend: "" } } }];
    });
  };

  const setSpend = (product, spend) => {
    setAds(prev => {
      const existing = prev.find(a => a.date === selDate);
      if (!existing) return prev;
      const entries = {
        ...existing.entries,
        [product]: { ...existing.entries[product], spend },
      };
      return prev.map(a => a.date === selDate ? { ...a, entries } : a);
    });
  };

  return (
    <div>
      <Card>
        <SectionTitle>📢 تسجيل الإعلانات اليومية</SectionTitle>

        <div style={{ marginBottom: 14 }}>
          <label style={styles.label}>اختر التاريخ</label>
          <Select value={selDate} onChange={v => setSelDate(v)}>
            {getLast30Days().map(d => (
              <option key={d} value={d}>
                {formatDate(d)}{d === today ? " — اليوم" : ""}
              </option>
            ))}
          </Select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {products.map(p => {
            const entry    = todayAds.entries[p];
            const isActive = !!entry;

            return (
              <div
                key={p}
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  border: `1px solid ${isActive ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.08)"}`,
                  background: isActive ? "rgba(167,139,250,0.08)" : "rgba(255,255,255,0.04)",
                  transition: "all 0.2s",
                }}
              >
                {/* Toggle Row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleProduct(p)}
                >
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{p}</span>
                  {/* Toggle Switch */}
                  <div style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: isActive ? "#a78bfa" : "rgba(255,255,255,0.15)",
                    position: "relative",
                    transition: "background 0.2s",
                    flexShrink: 0,
                  }}>
                    <div style={{
                      position: "absolute",
                      top: 3,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "white",
                      transition: "all 0.2s",
                      right: isActive ? 3 : "auto",
                      left: isActive ? "auto" : 3,
                    }} />
                  </div>
                </div>

                {/* Spend Input (visible only when active) */}
                {isActive && (
                  <div style={{ padding: "0 14px 12px" }}>
                    <input
                      type="number"
                      placeholder="مبلغ الإنفاق (اختياري)"
                      value={entry.spend || ""}
                      onChange={e => setSpend(p, e.target.value)}
                      onClick={e => e.stopPropagation()}
                      style={styles.input}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ─── Stats Tab ────────────────────────────────────────────────────────────────
function StatsTab({ orders, ads, products }) {
  const week = getWeekRange();
  const [from,          setFrom]          = useState(week.from);
  const [to,            setTo]            = useState(week.to);
  const [filterProduct, setFilterProduct] = useState("all");

  const statsData = useMemo(() => {
    return products.map(product => {
      // Orders within range
      const productOrders = orders.filter(
        o => o.product === product && o.date >= from && o.date <= to
      );
      const orderCount    = productOrders.length;
      const totalRevenue  = productOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

      // Ad days within range for this product
      const adDays   = ads.filter(a => a.date >= from && a.date <= to && a.entries?.[product]);
      const totalSpend = adDays.reduce((sum, a) => sum + (parseFloat(a.entries[product]?.spend) || 0), 0);
      const activeDays = adDays.length;

      // Red flag: ≥3 consecutive ad days with zero orders
      const adDaysSorted = adDays.map(a => a.date).sort();
      let redFlag = false;
      if (adDaysSorted.length >= 3 && orderCount === 0) {
        for (let i = 0; i <= adDaysSorted.length - 3; i++) {
          const d1 = new Date(adDaysSorted[i]);
          const d2 = new Date(adDaysSorted[i + 1]);
          const d3 = new Date(adDaysSorted[i + 2]);
          if ((d2 - d1) / 86400000 === 1 && (d3 - d2) / 86400000 === 1) {
            redFlag = true;
            break;
          }
        }
      }

      // Orange flag: 1–2 orders only
      const orangeFlag = !redFlag && orderCount >= 1 && orderCount <= 2;

      return { product, orderCount, totalRevenue, totalSpend, activeDays, redFlag, orangeFlag };
    });
  }, [orders, ads, products, from, to]);

  const filtered = filterProduct === "all"
    ? statsData
    : statsData.filter(s => s.product === filterProduct);

  const sorted = [...filtered].sort((a, b) => b.orderCount - a.orderCount);

  const resetWeek = () => { setFrom(week.from); setTo(week.to); };

  return (
    <div>
      {/* Filters */}
      <Card>
        <SectionTitle>🔍 الفلاتر</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>من</label>
              <input
                type="date"
                value={from}
                onChange={e => setFrom(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>إلى</label>
              <input
                type="date"
                value={to}
                onChange={e => setTo(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div>
            <label style={styles.label}>المنتج</label>
            <Select value={filterProduct} onChange={v => setFilterProduct(v)}>
              <option value="all">كل المنتجات</option>
              {products.map(p => <option key={p} value={p}>{p}</option>)}
            </Select>
          </div>

          <button
            onClick={resetWeek}
            style={{ ...styles.primaryBtn, background: "rgba(255,255,255,0.08)", color: "#ccc", fontSize: 12 }}
          >
            ↺ إعادة تعيين للأسبوع الحالي (السبت – الخميس)
          </button>
        </div>
      </Card>

      {/* Legend */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div style={{
          flex: 1, padding: "6px 10px", borderRadius: 8,
          border: "1px solid rgba(239,68,68,0.4)",
          background: "rgba(239,68,68,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 10, color: "#f87171" }}>🔴 3 أيام إعلان بلا طلبية</span>
        </div>
        <div style={{
          flex: 1, padding: "6px 10px", borderRadius: 8,
          border: "1px solid rgba(251,146,60,0.4)",
          background: "rgba(251,146,60,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 10, color: "#fb923c" }}>🟠 طلبيتان أو أقل بالأسبوع</span>
        </div>
      </div>

      {/* Ranking */}
      <Card>
        <SectionTitle>📊 ترتيب المنتجات</SectionTitle>
        {sorted.length === 0
          ? <Empty text="لا توجد بيانات" />
          : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sorted.map((s, i) => {
                const rowStyle = s.redFlag
                  ? { border: "1px solid rgba(239,68,68,0.5)",  background: "rgba(239,68,68,0.08)" }
                  : s.orangeFlag
                  ? { border: "1px solid rgba(251,146,60,0.4)", background: "rgba(251,146,60,0.07)" }
                  : { border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.05)" };

                const badge = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
                const countColor = s.redFlag ? "#f87171" : s.orangeFlag ? "#fb923c" : "#a78bfa";

                return (
                  <div key={s.product} style={{ borderRadius: 12, overflow: "hidden", ...rowStyle }}>
                    <div style={{ padding: "12px 14px" }}>
                      {/* Top row */}
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 18 }}>{badge}</span>
                          <span style={{ fontWeight: 700, fontSize: 14 }}>{s.product}</span>
                          {s.redFlag && (
                            <span style={{
                              fontSize: 11, color: "#f87171",
                              background: "rgba(239,68,68,0.15)",
                              padding: "2px 7px", borderRadius: 8,
                            }}>تنبيه</span>
                          )}
                          {s.orangeFlag && (
                            <span style={{
                              fontSize: 11, color: "#fb923c",
                              background: "rgba(251,146,60,0.15)",
                              padding: "2px 7px", borderRadius: 8,
                            }}>ضعيف</span>
                          )}
                        </div>
                        <span style={{ fontWeight: 900, fontSize: 20, color: countColor }}>
                          {s.orderCount}
                        </span>
                      </div>

                      {/* Metrics row */}
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {s.totalRevenue > 0 && (
                          <Chip label="الإيرادات"   value={`${s.totalRevenue.toFixed(0)} ر`}              color="#60a5fa" />
                        )}
                        {s.totalSpend > 0 && (
                          <Chip label="الإنفاق"     value={`${s.totalSpend.toFixed(0)} ر`}               color="#f59e0b" />
                        )}
                        {s.activeDays > 0 && (
                          <Chip label="أيام إعلان"  value={s.activeDays}                                  color="#34d399" />
                        )}
                        {s.totalSpend > 0 && s.orderCount > 0 && (
                          <Chip label="تكلفة/طلبية" value={(s.totalSpend / s.orderCount).toFixed(1)}      color="#c084fc" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        }
      </Card>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab({ products, setProducts }) {
  const [newProduct, setNewProduct] = useState("");

  const addProduct = () => {
    const name = newProduct.trim();
    if (!name || products.includes(name)) return;
    setProducts(prev => [...prev, name]);
    setNewProduct("");
  };

  const removeProduct = name => setProducts(prev => prev.filter(p => p !== name));

  return (
    <div>
      <Card>
        <SectionTitle>📦 إدارة المنتجات</SectionTitle>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input
            type="text"
            placeholder="اسم المنتج الجديد"
            value={newProduct}
            onChange={e => setNewProduct(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addProduct()}
            style={{ ...styles.input, flex: 1 }}
          />
          <button
            onClick={addProduct}
            style={{ ...styles.primaryBtn, width: "auto", padding: "10px 18px", whiteSpace: "nowrap" }}
          >
            + إضافة
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {products.length === 0
            ? <Empty text="لا توجد منتجات — أضف منتجاً أولاً" />
            : products.map(p => (
              <div key={p} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 14px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}>
                <span style={{ fontWeight: 600 }}>{p}</span>
                <button onClick={() => removeProduct(p)} style={styles.deleteBtn}>🗑</button>
              </div>
            ))
          }
        </div>
      </Card>
    </div>
  );
}
