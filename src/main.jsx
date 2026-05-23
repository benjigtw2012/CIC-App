
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import "./style.css";

const PRODUCTS = [{"supplier": "Ronjack", "category": "Decking", "code": "RJDBCHOC", "name": "Deep Embossed Decking Board", "colour": "Chocolate", "size": "3600 x 145 x 25mm", "weight": 9.94, "unit": 15.75, "rrp": 22.05}, {"supplier": "Ronjack", "category": "Decking", "code": "RJDBCARA", "name": "Deep Embossed Decking Board", "colour": "Caramel", "size": "3600 x 145 x 25mm", "weight": 9.94, "unit": 15.75, "rrp": 22.05}, {"supplier": "Ronjack", "category": "Decking", "code": "RJDBSILVERA", "name": "Deep Embossed Decking Board", "colour": "Silver Ash", "size": "3600 x 145 x 25mm", "weight": 9.94, "unit": 15.75, "rrp": 22.05}, {"supplier": "Ronjack", "category": "Decking", "code": "RJDBSLATE", "name": "Deep Embossed Decking Board", "colour": "Slate", "size": "3600 x 145 x 25mm", "weight": 9.94, "unit": 15.75, "rrp": 22.05}, {"supplier": "Ronjack", "category": "Decking", "code": "RJDBTEAK", "name": "Deep Embossed Decking Board", "colour": "Teak", "size": "3600 x 145 x 25mm", "weight": 9.94, "unit": 15.75, "rrp": 22.05}, {"supplier": "Oakio", "category": "Decking", "code": "OAKDBAMBER", "name": "Oakio Iniwood Decking Board", "colour": "Amber", "size": "3600 x 147 x 21mm", "weight": 8.39, "unit": 16.6, "rrp": 23.24}, {"supplier": "Oakio", "category": "Decking", "code": "OAKDBDARKGREY", "name": "Oakio Iniwood Decking Board", "colour": "Dark Grey", "size": "3600 x 147 x 21mm", "weight": 8.39, "unit": 16.6, "rrp": 23.24}, {"supplier": "Oakio", "category": "Decking", "code": "OAKDBOAK", "name": "Oakio Iniwood Decking Board", "colour": "Oak", "size": "3600 x 147 x 21mm", "weight": 8.39, "unit": 16.6, "rrp": 23.24}, {"supplier": "Oakio", "category": "Decking", "code": "OAKDBWHITE", "name": "Oakio Iniwood Decking Board", "colour": "Smoke White", "size": "3600 x 147 x 21mm", "weight": 8.39, "unit": 16.6, "rrp": 23.24}, {"supplier": "Ronjack", "category": "Decking Accessory", "code": "RJTCLIP", "name": "T-Fixings", "colour": "", "size": "Bag of 200", "weight": 1.5, "unit": 24.5, "rrp": 34.3}, {"supplier": "Ronjack", "category": "Decking Accessory", "code": "RJJOIST", "name": "Plastic Joist", "colour": "Black", "size": "50 x 125 x 3600mm", "weight": 20.9, "unit": 24.17, "rrp": 33.84}, {"supplier": "Ronjack", "category": "Cladding", "code": "RJCLADCHOC", "name": "Deep Embossed Cladding Board", "colour": "Chocolate", "size": "3600 x 148 x 21mm", "weight": 6.012, "unit": 13.4, "rrp": 18.76}, {"supplier": "Ronjack", "category": "Cladding", "code": "RJCLADCARA", "name": "Deep Embossed Cladding Board", "colour": "Caramel", "size": "3600 x 148 x 21mm", "weight": 6.012, "unit": 13.4, "rrp": 18.76}, {"supplier": "Ronjack", "category": "Fencing", "code": "RJFENCECHOC", "name": "Deep Embossed Fencing Board", "colour": "Chocolate", "size": "1820 x 150 x 20mm", "weight": 6.012, "unit": 8.5, "rrp": 11.9}, {"supplier": "Ronjack", "category": "Gate", "code": "RJALUGATE1800", "name": "Gate Frame Kit", "colour": "", "size": "1800 x 900mm", "weight": 66, "unit": 393.75, "rrp": 551.25}, {"supplier": "Ronjack", "category": "Garden Room", "code": "GRJANAPEX", "name": "Janssen Garden Room Apex Roof", "colour": "", "size": "2.95 x 2.95m", "weight": 680, "unit": 2289.0, "rrp": 3204.0}, {"supplier": "Coodec", "category": "Acoustic", "code": "CWS01WG68", "name": "Acoustic Shadow Panel", "colour": "Grey", "size": "2400x600x21", "weight": 11.2, "unit": 25.0, "rrp": 35.0}, {"supplier": "Coodec", "category": "Acoustic", "code": "CWS01WG65", "name": "Acoustic Shadow Panel", "colour": "Black", "size": "2400x600x21", "weight": 11.2, "unit": 25.0, "rrp": 35.0}, {"supplier": "Coodec", "category": "Acoustic", "code": "CWS01WG19", "name": "Acoustic Shadow Panel", "colour": "Walnut", "size": "2400x600x21", "weight": 11.2, "unit": 25.0, "rrp": 35.0}, {"supplier": "Coodec", "category": "Fluted", "code": "CWB250-WG19", "name": "WPC Fluted Panel", "colour": "Walnut", "size": "2400x250x10", "weight": 2.5, "unit": 5.52, "rrp": 7.73}, {"supplier": "Coodec", "category": "Trim & Fixings", "code": "AC04-AC04", "name": "Hidden Fixing for Coodec Stainless Steel", "colour": "Steel", "size": "45x35", "weight": 0.05, "unit": 0.4, "rrp": 0.56}];
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const DEFAULT_SETTINGS = { markup: 20, guernseyShipping: 15.7, repeatDiscount: 5, tradeDiscount: 10, minMargin: 12 };

function money(n) { return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(Number(n) || 0); }
function titleCase(word) {
  const labels = { quote: "Quote Builder", quotes: "Saved Quotes", orders: "Purchase Orders", customers: "Customers", settings: "Settings" };
  return labels[word] || String(word).replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase());
}
function settingLabel(key) {
  const labels = {
    markup: "Quote Uplift %",
    guernseyShipping: "Guernsey Shipping Surcharge %",
    repeatDiscount: "Repeat Customer Discount %",
    tradeDiscount: "Trade Customer Discount %",
    minMargin: "Minimum Margin %"
  };
  return labels[key] || titleCase(key);
}
function carriage(weight) { if (weight >= 1000) return 0; if (weight >= 617) return 110; if (weight >= 386) return 145; if (weight > 0) return 185; return 0; }
function sellPrice(base, type, s) {
  let discount = type === "repeat" ? s.repeatDiscount : type === "trade" ? s.tradeDiscount : 0;
  let price = base * (1 + s.markup / 100) * (1 + s.guernseyShipping / 100) * (1 - discount / 100);
  let min = base / (1 - s.minMargin / 100);
  return Number(Math.max(price, min).toFixed(2));
}

function App() {
  const [session, setSession] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [tab, setTab] = useState("quote");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [quotes, setQuotes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [quoteNo, setQuoteNo] = useState("");
  const [customer, setCustomer] = useState("");
  const [customerType, setCustomerType] = useState("standard");
  const [status, setStatus] = useState("Draft");
  const [lines, setLines] = useState([]);
  const [search, setSearch] = useState("");
  const [supplier, setSupplier] = useState("All");
  const [category, setCategory] = useState("All");
  const [useRrp, setUseRrp] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const sub = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.data.subscription.unsubscribe();
  }, []);

  useEffect(() => { if (session) loadAll(); }, [session]);

  async function loadAll() {
    const [q, o, c, s] = await Promise.all([
      supabase.from("quotes").select("*").order("created_at", { ascending: false }),
      supabase.from("purchase_orders").select("*").order("created_at", { ascending: false }),
      supabase.from("customers").select("*").order("name"),
      supabase.from("app_settings").select("*").eq("id", 1).maybeSingle()
    ]);
    if (q.data) setQuotes(q.data);
    if (o.data) setOrders(o.data);
    if (c.data) setCustomers(c.data);
    if (s.data?.settings) setSettings({ ...DEFAULT_SETTINGS, ...s.data.settings });
    if (!quoteNo) newQuoteNumber();
  }

  async function newQuoteNumber() {
    const { data, error } = await supabase.rpc("next_quote_number");
    if (error) alert(error.message); else setQuoteNo(data);
  }

  async function login(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) alert(error.message);
  }

  const suppliers = useMemo(() => ["All", ...new Set(PRODUCTS.map(p => p.supplier))].sort(), []);
  const categories = useMemo(() => {
    const pool = PRODUCTS.filter(p => supplier === "All" || p.supplier === supplier);
    return ["All", ...new Set(pool.map(p => p.category))].sort();
  }, [supplier]);

  const productRows = PRODUCTS.filter(p =>
    (supplier === "All" || p.supplier === supplier) &&
    (category === "All" || p.category === category) &&
    `${p.code} ${p.name} ${p.colour} ${p.size}`.toLowerCase().includes(search.toLowerCase())
  );

  function addLine(p) {
    const base = useRrp ? p.rrp : p.unit;
    const sell = sellPrice(base, customerType, settings);
    setLines(prev => [...prev, { ...p, qty: 1, basePrice: base, sell }]);
  }

  const totals = useMemo(() => {
    const subtotal = lines.reduce((s, l) => s + l.qty * l.sell, 0);
    const cost = lines.reduce((s, l) => s + l.qty * (l.basePrice ?? l.unit), 0);
    const weight = lines.reduce((s, l) => s + l.qty * (l.weight || 0), 0);
    const delivery = carriage(weight);
    return { subtotal, cost, weight, delivery, total: subtotal + delivery, profit: subtotal - cost };
  }, [lines]);

  async function backup(type, id, payload) {
    await fetch("/api/dropbox-backup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, id, payload }) });
  }

  async function saveQuote(newStatus = status) {
    const payload = { quote_no: quoteNo, customer, customer_type: customerType, status: newStatus, lines, totals, created_by: session.user.email };
    const { error } = await supabase.from("quotes").upsert(payload, { onConflict: "quote_no" });
    if (error) return alert(error.message);
    await backup("quote", quoteNo, payload);
    setStatus(newStatus);
    await loadAll();
    alert("Saved " + quoteNo);
  }

  async function acceptAndOrder() {
    await saveQuote("Accepted");
    const groups = {};
    lines.forEach(l => {
      const key = l.supplier === "Coodec" ? "Coodec" : "Ronjack-Oakio";
      groups[key] ||= [];
      groups[key].push(l);
    });
    for (const [supplierName, items] of Object.entries(groups)) {
      const poNo = `${quoteNo}-${supplierName}`;
      const po = {
        po_no: poNo, quote_no: quoteNo, supplier: supplierName, status: "Draft", lines: items,
        totals: { cost: items.reduce((s,l)=>s+l.qty*(l.basePrice ?? l.unit),0), weight: items.reduce((s,l)=>s+l.qty*(l.weight||0),0) },
        created_by: session.user.email
      };
      await supabase.from("purchase_orders").upsert(po, { onConflict: "po_no" });
      await backup("purchase-order", poNo, po);
    }
    await loadAll();
    setTab("orders");
  }

  async function saveCustomer() {
    if (!customer.trim()) return alert("Enter customer name");
    await supabase.from("customers").upsert({ name: customer, type: customerType }, { onConflict: "name" });
    await loadAll();
  }

  async function saveSettings() {
    await supabase.from("app_settings").upsert({ id: 1, settings });
    alert("Settings saved");
  }

  async function startNewQuote() {
    setLines([]); setCustomer(""); setCustomerType("standard"); setStatus("Draft"); await newQuoteNumber(); setTab("quote");
  }

  if (!session) return <div className="login"><form className="card loginCard" onSubmit={login}>
    <h1>CIC App Login</h1><p className="sub">Log in to create shared quotes and orders.</p>
    <input placeholder="Email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} />
    <input placeholder="Password" type="password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} />
    <button>Log in</button>
  </form></div>;

  return <div className="wrap">
    <div className="top"><div><h1>CIC App</h1><p className="sub">Logged in as {session.user.email}</p></div><div className="actions"><button onClick={startNewQuote}>New Quote</button><button className="grey" onClick={()=>supabase.auth.signOut()}>Log out</button></div></div>
    <div className="tabs">{["quote","quotes","orders","customers","settings"].map(t=><button key={t} className={tab===t?"active":""} onClick={()=>setTab(t)}>{t}</button>)}</div>

    {tab==="quote" && <div className="grid">
      <section className="card">
        <div className="controls"><input placeholder="Search products" value={search} onChange={e=>setSearch(e.target.value)} /><select value={supplier} onChange={e=>{setSupplier(e.target.value);setCategory("All")}}>{suppliers.map(s=><option key={s}>{s}</option>)}</select><select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select></div>
        <label className="check"><input type="checkbox" checked={useRrp} onChange={e=>setUseRrp(e.target.checked)} /> Add using RRP</label>
        <div className="scroll"><table><thead><tr><th>Code</th><th>Product</th><th>Trade</th><th>RRP</th><th></th></tr></thead><tbody>{productRows.map(p=><tr key={p.code}><td className="code">{p.code}</td><td><b>{p.name}</b><div className="muted">{p.supplier} · {p.colour} {p.size}</div></td><td>{money(p.unit)}</td><td>{money(p.rrp)}</td><td><button onClick={()=>addLine(p)}>Add</button></td></tr>)}</tbody></table></div>
      </section>

      <section className="card">
        <div className="quoteHead"><div><div className="muted">QUOTE</div><div className="quoteNo">{quoteNo}</div></div><span className="badge">{status}</span></div>
        <div className="three"><input placeholder="Customer / project" value={customer} onChange={e=>setCustomer(e.target.value)} /><select value={customerType} onChange={e=>setCustomerType(e.target.value)}><option value="standard">Standard</option><option value="repeat">Repeat customer</option><option value="trade">Trade customer</option></select><select value={status} onChange={e=>setStatus(e.target.value)}><option>Draft</option><option>Sent</option><option>Accepted</option><option>Ordered</option><option>Lost</option></select></div>
        <table><thead><tr><th>Item</th><th>Qty</th><th>Each</th><th>Line</th><th></th></tr></thead><tbody>{lines.map((l,i)=><tr key={i}><td><b>{l.code}</b> {l.name}</td><td><input className="qty" type="number" value={l.qty} onChange={e=>setLines(lines.map((x,j)=>j===i?{...x,qty:Number(e.target.value)||1}:x))} /></td><td><input className="price" type="number" value={l.sell} onChange={e=>setLines(lines.map((x,j)=>j===i?{...x,sell:Number(e.target.value)||0}:x))} /></td><td>{money(l.qty*l.sell)}</td><td><button className="red" onClick={()=>setLines(lines.filter((_,j)=>j!==i))}>X</button></td></tr>)}</tbody></table>
        <div className="totals"><div><span>Weight</span><b>{totals.weight.toFixed(2)}kg</b></div><div><span>Subtotal</span><b>{money(totals.subtotal)}</b></div><div><span>Delivery</span><b>{money(totals.delivery)}</b></div><div className="total"><span>Total</span><b>{money(totals.total)}</b></div><div className="private"><span>Profit</span><b>{money(totals.profit)}</b></div></div>
        <div className="actions"><button onClick={()=>saveQuote()}>Save Quote</button><button onClick={acceptAndOrder}>Accept + Generate PO</button><button className="grey" onClick={saveCustomer}>Save Customer</button></div>
      </section>
    </div>}

    {tab==="quotes" && <section className="card"><h2>Saved Quotes</h2><table><thead><tr><th>Quote</th><th>Customer</th><th>Status</th><th>Total</th><th>Created by</th></tr></thead><tbody>{quotes.map(q=><tr key={q.quote_no}><td>{q.quote_no}</td><td>{q.customer}</td><td>{q.status}</td><td>{money(q.totals?.total)}</td><td>{q.created_by}</td></tr>)}</tbody></table></section>}
    {tab==="orders" && <section className="card"><h2>Purchase Orders</h2><table><thead><tr><th>PO</th><th>Quote</th><th>Supplier</th><th>Cost</th><th>Created by</th></tr></thead><tbody>{orders.map(o=><tr key={o.po_no}><td>{o.po_no}</td><td>{o.quote_no}</td><td>{o.supplier}</td><td>{money(o.totals?.cost)}</td><td>{o.created_by}</td></tr>)}</tbody></table></section>}
    {tab==="customers" && <section className="card"><h2>Customers</h2><table><thead><tr><th>Name</th><th>Type</th></tr></thead><tbody>{customers.map(c=><tr key={c.id}><td>{c.name}</td><td>{c.type}</td></tr>)}</tbody></table></section>}
    {tab==="settings" && <section className="card"><h2>Settings</h2><div className="three">{Object.keys(DEFAULT_SETTINGS).map(k=><label key={k}>{settingLabel(k)}<input type="number" value={settings[k]} onChange={e=>setSettings({...settings,[k]:Number(e.target.value)})} /></label>)}</div><button onClick={saveSettings}>Save Settings</button></section>}
  </div>;
}

createRoot(document.getElementById("root")).render(<App />);
