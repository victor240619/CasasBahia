const CARD_BRANDS = [
  { name: "Visa", pattern: /^4/ },
  { name: "Mastercard", pattern: /^(5[1-5]|2[2-7])/ },
  { name: "American Express", pattern: /^3[47]/ },
  { name: "Elo", pattern: /^(4011|4312|4389|4514|4576|5041|5067|509|6277|6362|6363)/ },
  { name: "Hipercard", pattern: /^(38|60)/ },
]

export function normalizeCardNumber(value) {
  return String(value || "").replace(/\D/g, "")
}

export function validateLuhn(value) {
  const number = normalizeCardNumber(value)
  if (number.length < 12 || number.length > 19) {
    return false
  }

  let sum = 0
  let shouldDouble = false

  for (let index = number.length - 1; index >= 0; index -= 1) {
    let digit = Number(number[index])
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    sum += digit
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}

export function detectCardBrand(value) {
  const number = normalizeCardNumber(value)
  const match = CARD_BRANDS.find((brand) => brand.pattern.test(number))
  return match?.name || "Desconhecida"
}

function normalizeExpiry(month, year) {
  const expMonth = Number(month)
  let expYear = Number(year)

  if (expYear > 0 && expYear < 100) {
    expYear += 2000
  }

  return { expMonth, expYear }
}

export function validateCardInput(input, now = new Date()) {
  const errors = []
  const number = normalizeCardNumber(input.number)
  const holderName = String(input.holderName || "").trim()
  const cvc = String(input.cvc || "").replace(/\D/g, "")
  const { expMonth, expYear } = normalizeExpiry(input.expMonth, input.expYear)

  if (holderName.length < 3) {
    errors.push("Informe o nome impresso no cartao.")
  }

  if (!validateLuhn(number)) {
    errors.push("Numero do cartao invalido.")
  }

  if (!Number.isInteger(expMonth) || expMonth < 1 || expMonth > 12) {
    errors.push("Mes de validade invalido.")
  }

  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  if (
    !Number.isInteger(expYear) ||
    expYear < currentYear ||
    (expYear === currentYear && expMonth < currentMonth)
  ) {
    errors.push("Cartao vencido.")
  }

  if (cvc.length < 3 || cvc.length > 4) {
    errors.push("CVV invalido.")
  }

  return {
    ok: errors.length === 0,
    errors,
    normalized: {
      number,
      holderName,
      cvc,
      expMonth,
      expYear,
      brand: detectCardBrand(number),
    },
  }
}

export function createId(prefix) {
  const randomValue =
    globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`

  return `${prefix}_${String(randomValue).replace(/-/g, "").slice(0, 18)}`
}

export function tokenizeCard(input, now = new Date()) {
  const validation = validateCardInput(input, now)

  if (!validation.ok) {
    throw new Error(validation.errors.join(" "))
  }

  const { number, holderName, expMonth, expYear, brand } = validation.normalized

  return {
    id: createId("tok"),
    holderName,
    brand,
    last4: number.slice(-4),
    expMonth,
    expYear,
    createdAt: now.toISOString(),
    storage: "token_only",
  }
}
