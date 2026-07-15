import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, CreditCard, LogOut, PackagePlus, RefreshCw, Save, ShieldCheck, Store } from "lucide-react";
import Header from "../components/store/Header";
import Footer from "../components/store/Footer";
import { formatBRL, formatDate, parseBRLToCents } from "../lib/money";
import { resetShopState, useShopState } from "../store/shopStore";

const ADMIN_EMAIL = "casasb@casasbahia.com";
const ADMIN_PASSWORD_HASH = "d711d06c2c833a5c6d46d4e583b42487490337d46da95d5ce2a8074de8e96acf";
const ADMIN_SESSION_KEY = "casas-bahia-admin:authenticated";

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function createProductForm(product) {
  return {
    id: product?.id || "",
    name: product?.name || "",
    category: product?.category || "smartphones",
    originalPrice: product ? String(product.originalPrice.toFixed(2)).replace(".", ",") : "",
    stock: product?.stock ? String(product.stock) : "999",
    active: product?.active ?? true,
    promo30dias: product?.promo30dias ?? false,
    image: product?.image || "",
    rating: product?.rating ? String(product.rating) : "4.7",
    reviews: product?.reviews ? String(product.reviews) : "100",
  };
}

function SummaryCard({ icon: Icon, title, value, detail }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-500">{title}</span>
        <Icon className="h-5 w-5 text-blue-700" />
      </div>
      <strong className="mt-2 block text-2xl text-gray-900">{value}</strong>
      <p className="mt-1 text-xs text-gray-500">{detail}</p>
    </div>
  );
}

function formatCardChecks(checks = {}) {
  const values = [
    checks.addressLine1 ? `endereco:${checks.addressLine1}` : "",
    checks.addressPostalCode ? `cep:${checks.addressPostalCode}` : "",
    checks.cvc ? `cvc:${checks.cvc}` : "",
  ].filter(Boolean);

  return values.length ? values.join(" / ") : "-";
}

function formatCardNetworks(networks = {}) {
  const available = Array.isArray(networks.available) ? networks.available.join(", ") : "";
  const preferred = networks.preferred ? `pref:${networks.preferred}` : "";
  return [available, preferred].filter(Boolean).join(" / ") || "-";
}

export default function MasterAdmin() {
  const [shop, setShop] = useShopState();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(ADMIN_SESSION_KEY) === "true"
  );
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState("products");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(createProductForm());
  const [notice, setNotice] = useState("");

  const approvedRevenue = useMemo(
    () =>
      shop.payments
        .filter((payment) => payment.status === "succeeded")
        .reduce((sum, payment) => sum + payment.amountCents, 0),
    [shop.payments]
  );

  const login = async (event) => {
    event.preventDefault();
    setLoginError("");

    const emailOk = loginForm.email.trim().toLowerCase() === ADMIN_EMAIL;
    const passwordHash = await sha256Hex(loginForm.password);

    if (!emailOk || passwordHash !== ADMIN_PASSWORD_HASH) {
      setLoginError("Email ou senha invalidos.");
      return;
    }

    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    setIsAuthenticated(true);
    setLoginForm({ email: "", password: "" });
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
  };

  const saveProduct = (event) => {
    event.preventDefault();

    if (form.name.trim().length < 2) {
      setNotice("Informe o nome do produto.");
      return;
    }

    const product = {
      id: editingId || Date.now(),
      name: form.name.trim(),
      category: form.category,
      originalPrice: parseBRLToCents(form.originalPrice) / 100,
      stock: Math.max(0, Number.parseInt(form.stock, 10) || 0),
      active: form.active,
      promo30dias: form.promo30dias,
      image: form.image.trim(),
      rating: Number(form.rating) || 4.7,
      reviews: Math.max(0, Number.parseInt(form.reviews, 10) || 0),
    };

    if (!product.image || product.originalPrice <= 0) {
      setNotice("Informe imagem e preco valido.");
      return;
    }

    setShop((draft) => {
      const exists = draft.products.some((item) => String(item.id) === String(product.id));
      return {
        ...draft,
        products: exists
          ? draft.products.map((item) => (String(item.id) === String(product.id) ? product : item))
          : [product, ...draft.products],
        audit: [
          {
            id: `audit-${Date.now()}`,
            at: new Date().toISOString(),
            actor: "master-admin",
            action: `${exists ? "Produto editado" : "Produto criado"}: ${product.name}.`,
          },
          ...draft.audit,
        ],
      };
    });

    setEditingId(null);
    setForm(createProductForm());
    setNotice("Produto salvo.");
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setForm(createProductForm(product));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleProduct = (productId, active) => {
    setShop((draft) => ({
      ...draft,
      products: draft.products.map((product) =>
        String(product.id) === String(productId) ? { ...product, active } : product
      ),
      audit: [
        {
          id: `audit-${Date.now()}`,
          at: new Date().toISOString(),
          actor: "master-admin",
          action: `Produto ${productId} ${active ? "ativado" : "pausado"}.`,
        },
        ...draft.audit,
      ],
    }));
  };

  const setGatewayMode = (mode) => {
    setShop((draft) => ({
      ...draft,
      gatewaySettings: { ...draft.gatewaySettings, mode },
      audit: [
        {
          id: `audit-${Date.now()}`,
          at: new Date().toISOString(),
          actor: "master-admin",
          action: `Versao publica alterada para ${mode === "own" ? "gateway proprio" : "Stripe"}.`,
        },
        ...draft.audit,
      ],
    }));
  };

  const restoreLocalData = () => {
    setShop(resetShopState());
    setNotice("Dados locais restaurados.");
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin
        form={loginForm}
        error={loginError}
        onChange={setLoginForm}
        onSubmit={login}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={0} onSearch={() => {}} onCartClick={() => {}} />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Master Admin</p>
            <h1 className="text-2xl font-black text-gray-900">Controle da loja e do gateway</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold text-gray-700 hover:border-blue-500">
              <Store className="h-4 w-4" />
              Loja
            </Link>
            <button onClick={restoreLocalData} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold text-gray-700 hover:border-red-500">
              <RefreshCw className="h-4 w-4" />
              Reset local
            </button>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold text-gray-700 hover:border-red-500">
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>

        {notice && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">
            {notice}
          </div>
        )}

        <div className="mb-6 grid gap-4 md:grid-cols-5">
          <SummaryCard icon={BarChart3} title="Receita aprovada" value={formatBRL(approvedRevenue)} detail={`${shop.payments.length} pagamentos`} />
          <SummaryCard icon={Store} title="Pedidos" value={shop.orders.length} detail={`${shop.orders.filter((order) => order.status === "paid").length} pagos`} />
          <SummaryCard icon={PackagePlus} title="Produtos ativos" value={shop.products.filter((product) => product.active).length} detail={`${shop.products.length} no catalogo`} />
          <SummaryCard icon={CreditCard} title="Assinaturas" value={shop.subscriptions.length} detail={`${shop.subscriptions.filter((item) => item.status === "active").length} ativas`} />
          <SummaryCard icon={ShieldCheck} title="Cartoes" value={shop.gatewayCards.length} detail="cofre do gateway" />
        </div>

        <div className="mb-4 grid grid-cols-5 overflow-hidden rounded-xl border bg-white text-sm font-bold">
          {[
            ["products", "Produtos"],
            ["orders", "Pedidos"],
            ["subscriptions", "Assinaturas"],
            ["cards", "Cartoes"],
            ["gateway", "Gateway"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-3 py-3 ${tab === id ? "bg-blue-700 text-white" : "text-gray-700 hover:bg-gray-50"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "products" && (
          <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
            <form onSubmit={saveProduct} className="h-fit rounded-xl border bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-black text-gray-900">{editingId ? "Editar produto" : "Novo produto"}</h2>
              <div className="space-y-3">
                <input value={form.name} onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} placeholder="Nome" className="w-full rounded-lg border px-3 py-2 text-sm" />
                <div className="grid grid-cols-2 gap-2">
                  <input value={form.category} onChange={(e) => setForm((c) => ({ ...c, category: e.target.value }))} placeholder="Categoria" className="rounded-lg border px-3 py-2 text-sm" />
                  <input value={form.originalPrice} onChange={(e) => setForm((c) => ({ ...c, originalPrice: e.target.value }))} placeholder="Preco" className="rounded-lg border px-3 py-2 text-sm" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input value={form.stock} onChange={(e) => setForm((c) => ({ ...c, stock: e.target.value }))} placeholder="Estoque" type="number" className="rounded-lg border px-3 py-2 text-sm" />
                  <input value={form.rating} onChange={(e) => setForm((c) => ({ ...c, rating: e.target.value }))} placeholder="Nota" className="rounded-lg border px-3 py-2 text-sm" />
                  <input value={form.reviews} onChange={(e) => setForm((c) => ({ ...c, reviews: e.target.value }))} placeholder="Avaliacoes" type="number" className="rounded-lg border px-3 py-2 text-sm" />
                </div>
                <input value={form.image} onChange={(e) => setForm((c) => ({ ...c, image: e.target.value }))} placeholder="URL da imagem" className="w-full rounded-lg border px-3 py-2 text-sm" />
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm((c) => ({ ...c, active: e.target.checked }))} />
                  Produto ativo
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={form.promo30dias} onChange={(e) => setForm((c) => ({ ...c, promo30dias: e.target.checked }))} />
                  Promocao 60% / entrega 30 dias
                </label>
              </div>
              <button type="submit" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 font-black text-white hover:bg-blue-800">
                <Save className="h-4 w-4" />
                Salvar produto
              </button>
            </form>

            <div className="space-y-3">
              {shop.products.map((product) => (
                <div key={product.id} className="grid gap-3 rounded-xl border bg-white p-3 shadow-sm md:grid-cols-[84px_1fr_auto]">
                  <img src={product.image} alt={product.name} className="h-20 w-20 rounded-lg object-cover" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-gray-900">{product.name}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${product.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {product.active ? "ativo" : "pausado"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{product.category} | R$ {product.originalPrice.toFixed(2).replace(".", ",")} | estoque {product.stock}</p>
                  </div>
                  <div className="flex gap-2 md:flex-col">
                    <button onClick={() => editProduct(product)} className="rounded-lg border px-3 py-2 text-sm font-bold text-gray-700 hover:border-blue-500">Editar</button>
                    <button onClick={() => toggleProduct(product.id, !product.active)} className="rounded-lg border px-3 py-2 text-sm font-bold text-gray-700 hover:border-red-500">
                      {product.active ? "Pausar" : "Ativar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "orders" && (
          <AdminTable
            empty="Nenhum pedido ainda."
            headers={["Pedido", "Cliente", "Status", "Gateway", "Total", "Data"]}
            rows={shop.orders.map((order) => [
              order.id,
              `${order.customer.name} / ${order.customer.email}`,
              order.status,
              order.mode,
              formatBRL(order.totals.totalCents),
              formatDate(order.createdAt),
            ])}
          />
        )}

        {tab === "subscriptions" && (
          <AdminTable
            empty="Nenhuma assinatura ainda."
            headers={["Assinatura", "Cliente", "Plano", "Cartoes", "Status", "Proxima cobranca"]}
            rows={shop.subscriptions.map((subscription) => [
              subscription.id,
              `${subscription.customer.name} / ${subscription.customer.email}`,
              `${subscription.planName} ${formatBRL(subscription.amountCents)}`,
              subscription.cardTokens?.length
                ? subscription.cardTokens.map((token) => `${token.brand} final ${token.last4}`).join(", ")
                : "Processador",
              subscription.status,
              formatDate(subscription.nextBillingAt),
            ])}
          />
        )}

        {tab === "cards" && (
          <AdminTable
            empty="Nenhum cartao registrado ainda."
            headers={[
              "Token",
              "Cliente",
              "Bandeira",
              "Final",
              "Validade",
              "Tipo",
              "Pais",
              "Fingerprint",
              "Checks",
              "Redes",
              "3DS",
              "Wallet",
              "PaymentIntent",
              "Assinatura",
              "Sessao",
              "Gateway",
              "Status",
              "Criado",
            ]}
            rows={shop.gatewayCards.map((card) => [
              card.token || card.paymentMethodId || card.id,
              `${card.customerName || "Cliente"} / ${card.customerEmail || ""}`,
              card.displayBrand || card.brand || "-",
              card.last4 || "-",
              card.expMonth && card.expYear ? `${String(card.expMonth).padStart(2, "0")}/${card.expYear}` : "-",
              card.funding || "-",
              card.country || "-",
              card.fingerprint || "-",
              formatCardChecks(card.checks),
              formatCardNetworks(card.networks),
              card.threeDSecureUsage === null || card.threeDSecureUsage === undefined
                ? "-"
                : card.threeDSecureUsage
                  ? "suportado"
                  : "nao",
              card.wallet || "-",
              card.paymentIntentId || "-",
              card.subscriptionId || "-",
              card.sourceSessionId || "-",
              `${card.gatewayMode || "own"} / ${card.provider || "processador"}`,
              card.status,
              formatDate(card.createdAt),
            ])}
          />
        )}

        {tab === "gateway" && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-black text-gray-900">Versao publica</h2>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setGatewayMode("own")} className={`rounded-xl px-4 py-4 font-black ${shop.gatewaySettings.mode === "own" ? "bg-blue-700 text-white" : "border text-gray-700"}`}>
                  <ShieldCheck className="mx-auto mb-2 h-5 w-5" />
                  Gateway proprio producao
                </button>
                <button onClick={() => setGatewayMode("stripe")} className={`rounded-xl px-4 py-4 font-black ${shop.gatewaySettings.mode === "stripe" ? "bg-blue-700 text-white" : "border text-gray-700"}`}>
                  <CreditCard className="mx-auto mb-2 h-5 w-5" />
                  Stripe producao
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                Esta vitrine confirma somente cobrancas processadas por adquirente real. O gateway proprio registra token e metadados seguros de cartao no cofre.
              </p>
              <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
                <p><strong>Gateway:</strong> {shop.gatewaySettings.mode === "own" ? "proprio" : "stripe direto"}</p>
                <p><strong>Processador:</strong> {shop.gatewaySettings.own.processor}</p>
                <p><strong>Status:</strong> {shop.gatewaySettings.own.status}</p>
                <p><strong>Stripe:</strong> {shop.gatewaySettings.stripe.status}</p>
              </div>
            </div>
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-black text-gray-900">Auditoria</h2>
              <div className="max-h-80 divide-y overflow-auto">
                {shop.audit.map((event) => (
                  <div key={event.id} className="py-3 text-sm">
                    <div className="font-bold text-gray-800">{event.action}</div>
                    <div className="text-xs text-gray-500">{event.actor} | {formatDate(event.at)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function AdminLogin({ form, error, onChange, onSubmit }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={0} onSearch={() => {}} onCartClick={() => {}} />

      <main className="mx-auto flex max-w-7xl items-center justify-center px-4 py-16">
        <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-lg">
          <div className="mb-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <ShieldCheck className="h-6 w-6 text-blue-700" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Master Admin</p>
            <h1 className="text-2xl font-black text-gray-900">Acesso restrito</h1>
            <p className="mt-1 text-sm text-gray-500">Entre para controlar a loja e o gateway.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <input
              value={form.email}
              onChange={(event) => onChange((current) => ({ ...current, email: event.target.value }))}
              type="email"
              autoComplete="username"
              placeholder="Email do admin"
              className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-blue-600"
            />
            <input
              value={form.password}
              onChange={(event) => onChange((current) => ({ ...current, password: event.target.value }))}
              type="password"
              autoComplete="current-password"
              placeholder="Senha"
              className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-blue-600"
            />
          </div>

          <button type="submit" className="mt-5 w-full rounded-xl bg-blue-700 py-3 font-black text-white hover:bg-blue-800">
            Entrar no painel
          </button>

          <Link to="/" className="mt-4 block text-center text-sm font-bold text-blue-700 hover:underline">
            Voltar para a loja
          </Link>
        </form>
      </main>

      <Footer />
    </div>
  );
}

function AdminTable({ headers, rows, empty }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white p-4 shadow-sm">
      <table className="w-full min-w-[1440px] text-left text-sm">
        <thead className="border-b text-gray-500">
          <tr>
            {headers.map((header) => (
              <th key={header} className="py-3 font-bold">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b last:border-0">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-3 pr-4">{cell}</td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={headers.length} className="py-8 text-center text-gray-500">{empty}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
