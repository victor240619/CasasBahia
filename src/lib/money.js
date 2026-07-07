export function formatBRL(cents) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format((Number(cents) || 0) / 100)
}

export function parseBRLToCents(value) {
  if (typeof value === "number") {
    return Math.max(0, Math.round(value * 100))
  }

  const normalized = String(value || "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".")

  const amount = Number(normalized)
  if (!Number.isFinite(amount)) {
    return 0
  }

  return Math.max(0, Math.round(amount * 100))
}

export function formatDate(value) {
  if (!value) {
    return "-"
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value))
}
