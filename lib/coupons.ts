"use client";

export type CouponDiscountType = "PERCENT" | "FIXED";

export interface CouponData {
  id: string;
  code: string;               // Ex: "THEVINE10", "PROMO20"
  name: string;               // Nome descritivo da campanha (ex: "Desconto de Lançamento")
  discountType: CouponDiscountType; // "PERCENT" ou "FIXED"
  discountValue: number;      // Valor: 10 para 10% ou 25 para R$ 25,00
  validUntil: string;         // "YYYY-MM-DD"
  minOrderValue?: number;     // Valor mínimo de compra (opcional)
  active: boolean;            // Ativo ou Inativo
  createdAt: string;          // ISO String
}

const STORAGE_KEY = "branch_clo_coupons_v1";

// Cupons Iniciais Pré-configurados da Loja
const INITIAL_COUPONS: CouponData[] = [
  {
    id: "cpn-vine10",
    code: "THEVINE10",
    name: "Desconto Oficial de Lançamento",
    discountType: "PERCENT",
    discountValue: 10,
    validUntil: "2026-12-31",
    minOrderValue: 0,
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "cpn-boasvindas20",
    code: "BEMVINDO20",
    name: "Boas-vindas à Branch Clo",
    discountType: "FIXED",
    discountValue: 20,
    validUntil: "2026-12-31",
    minOrderValue: 120,
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "cpn-semente15",
    code: "SEMENTE15",
    name: "Campanha Família João 15:5",
    discountType: "PERCENT",
    discountValue: 15,
    validUntil: "2026-12-31",
    minOrderValue: 0,
    active: true,
    createdAt: new Date().toISOString(),
  },
];

/**
 * Verifica se um cupom já passou da data de validade (até 23:59:59 da data estipulada)
 */
export function isCouponExpired(validUntil: string): boolean {
  if (!validUntil) return false;
  try {
    const [year, month, day] = validUntil.split("-").map(Number);
    if (!year || !month || !day) return false;
    const expiry = new Date(year, month - 1, day, 23, 59, 59, 999);
    return new Date() > expiry;
  } catch {
    return false;
  }
}

/**
 * Retorna a lista de todos os cupons salvos
 */
export function getStoredCoupons(): CouponData[] {
  if (typeof window === "undefined") return INITIAL_COUPONS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COUPONS));
      return INITIAL_COUPONS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return INITIAL_COUPONS;
    return parsed;
  } catch {
    return INITIAL_COUPONS;
  }
}

/**
 * Salva a lista de cupons e emite evento customizado de sincronização
 */
export function saveCoupons(coupons: CouponData[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
    window.dispatchEvent(new CustomEvent("branch_clo_coupons_updated"));
  } catch (err) {
    console.error("Erro ao salvar cupons:", err);
  }
}

/**
 * Cadastra um novo cupom no gerador
 */
export function createCoupon(data: {
  code: string;
  name: string;
  discountType: CouponDiscountType;
  discountValue: number;
  validUntil: string;
  minOrderValue?: number;
}): { success: boolean; message: string; coupon?: CouponData } {
  const codeClean = data.code.trim().toUpperCase().replace(/\s+/g, "");
  if (!codeClean) {
    return { success: false, message: "O código do cupom é obrigatório." };
  }

  const nameClean = data.name.trim();
  if (!nameClean) {
    return { success: false, message: "O nome/descrição da campanha é obrigatório." };
  }

  if (isNaN(data.discountValue) || data.discountValue <= 0) {
    return { success: false, message: "Insira um valor de desconto válido e maior que zero." };
  }

  if (data.discountType === "PERCENT" && data.discountValue > 90) {
    return { success: false, message: "O desconto percentual máximo permitido é 90%." };
  }

  if (!data.validUntil) {
    return { success: false, message: "A data de duração/validade é obrigatória." };
  }

  const existing = getStoredCoupons();
  const codeExists = existing.some((c) => c.code.toUpperCase() === codeClean);
  if (codeExists) {
    return {
      success: false,
      message: `Já existe um cupom com o código "${codeClean}". Escolha outro código.`,
    };
  }

  const newCoupon: CouponData = {
    id: `cpn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    code: codeClean,
    name: nameClean,
    discountType: data.discountType,
    discountValue: Number(data.discountValue),
    validUntil: data.validUntil,
    minOrderValue: data.minOrderValue ? Number(data.minOrderValue) : 0,
    active: true,
    createdAt: new Date().toISOString(),
  };

  const updated = [newCoupon, ...existing];
  saveCoupons(updated);

  return {
    success: true,
    message: `Cupom "${codeClean}" gerado com sucesso!`,
    coupon: newCoupon,
  };
}

/**
 * Exclui um cupom definitivamente
 */
export function deleteCoupon(id: string): boolean {
  const list = getStoredCoupons();
  const filtered = list.filter((c) => c.id !== id);
  if (filtered.length === list.length) return false;
  saveCoupons(filtered);
  return true;
}

/**
 * Ativa ou pausa um cupom
 */
export function toggleCouponStatus(id: string): boolean {
  const list = getStoredCoupons();
  let found = false;
  const updated = list.map((c) => {
    if (c.id === id) {
      found = true;
      return { ...c, active: !c.active };
    }
    return c;
  });
  if (found) saveCoupons(updated);
  return found;
}

/**
 * Valida um cupom no checkout considerando código, ativação, subtotal e expiração automática por data
 */
export function validateCoupon(
  inputCode: string,
  subtotal: number
): {
  valid: boolean;
  message: string;
  coupon?: CouponData;
  discountAmount: number;
} {
  const cleanCode = (inputCode || "").trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, message: "Digite um código de cupom.", discountAmount: 0 };
  }

  const coupons = getStoredCoupons();
  const coupon = coupons.find((c) => c.code.toUpperCase() === cleanCode);

  if (!coupon) {
    return { valid: false, message: "Cupom inválido ou não encontrado.", discountAmount: 0 };
  }

  // Verifica se o lojista pausou o cupom
  if (!coupon.active) {
    return { valid: false, message: "Este cupom foi desativado pela loja.", discountAmount: 0 };
  }

  // Validação automática de expiração pela data de duração
  if (isCouponExpired(coupon.validUntil)) {
    const [y, m, d] = coupon.validUntil.split("-");
    const formattedDate = `${d}/${m}/${y}`;
    return {
      valid: false,
      message: `Este cupom perdeu a validade em ${formattedDate}.`,
      discountAmount: 0,
    };
  }

  // Pedido Mínimo
  if (coupon.minOrderValue && coupon.minOrderValue > 0 && subtotal < coupon.minOrderValue) {
    return {
      valid: false,
      message: `Pedido mínimo de R$ ${coupon.minOrderValue.toFixed(2).replace(".", ",")} para aplicar este cupom.`,
      discountAmount: 0,
    };
  }

  let discountAmount = 0;
  if (coupon.discountType === "PERCENT") {
    discountAmount = (subtotal * coupon.discountValue) / 100;
  } else {
    discountAmount = Math.min(subtotal, coupon.discountValue);
  }

  const formattedDiscount =
    coupon.discountType === "PERCENT"
      ? `${coupon.discountValue}%`
      : `R$ ${coupon.discountValue.toFixed(2).replace(".", ",")}`;

  return {
    valid: true,
    message: `Cupom ${coupon.code} aplicado com sucesso! Desconto de ${formattedDiscount}.`,
    coupon,
    discountAmount,
  };
}
