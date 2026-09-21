export interface OrderItemData {
  productName: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerCpf: string;
  shippingAddress: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
  };
  shippingMethod: "PAC" | "SEDEX";
  shippingCost: number;
  paymentMethod: "PIX" | "CREDIT_CARD";
  subtotal: number;
  discount: number;
  total: number;
  status: "AGUARDANDO_PIX" | "PAGO" | "EM_SEPARACAO" | "ENVIADO" | "ENTREGUE";
  trackingCode?: string;
  pixCode?: string;
  createdAt: string;
  items: OrderItemData[];
}

// Armazenamento em memória para demonstração / runtime serverless
export const INITIAL_ORDERS: OrderData[] = [
  {
    id: "ord-1001",
    orderNumber: "#BC-2026-1001",
    customerName: "Mateus Ribeiro de Souza",
    customerPhone: "(11) 98765-4321",
    customerEmail: "mateus.souza@gmail.com",
    customerCpf: "123.456.789-00",
    shippingAddress: {
      street: "Rua Augusta",
      number: "1500",
      complement: "Apto 42",
      neighborhood: "Consolação",
      city: "São Paulo",
      state: "SP",
      postalCode: "01304-001",
    },
    shippingMethod: "SEDEX",
    shippingCost: 19.9,
    paymentMethod: "PIX",
    subtotal: 129.9,
    discount: 6.5,
    total: 143.3,
    status: "EM_SEPARACAO",
    createdAt: "2026-09-20T14:32:00Z",
    items: [
      {
        productName: "The Vine — João 15:5 (Linha Adulto)",
        color: "Off-White",
        size: "M",
        quantity: 1,
        unitPrice: 129.9,
        imageUrl: "/catalog/tee-oversized-offwhite-frente.jpeg",
      },
    ],
  },
  {
    id: "ord-1002",
    orderNumber: "#BC-2026-1002",
    customerName: "Priscila Albuquerque",
    customerPhone: "(21) 99812-3456",
    customerEmail: "priscila.alb@outlook.com",
    customerCpf: "987.654.321-11",
    shippingAddress: {
      street: "Av. Atlântica",
      number: "2200",
      neighborhood: "Copacabana",
      city: "Rio de Janeiro",
      state: "RJ",
      postalCode: "22041-001",
    },
    shippingMethod: "PAC",
    shippingCost: 0.0, // Frete Grátis
    paymentMethod: "PIX",
    subtotal: 419.7,
    discount: 20.98,
    total: 398.72,
    status: "ENVIADO",
    trackingCode: "NL829374612BR",
    createdAt: "2026-09-19T10:15:00Z",
    items: [
      {
        productName: "The Vine — João 15:5 (Linha Adulto)",
        color: "Preto",
        size: "G",
        quantity: 2,
        unitPrice: 129.9,
        imageUrl: "/catalog/hoodie-boxy-preto-costas.jpeg",
      },
      {
        productName: "O Chamado — Juízes 7:7 (Linha Teens)",
        color: "Marrom",
        size: "14",
        quantity: 1,
        unitPrice: 109.9,
        imageUrl: "/catalog/hoodie-boxy-marrom-frente.jpeg",
      },
      {
        productName: "Emblema Couro Gravado João 15:5 (Kit)",
        color: "Marrom Café",
        size: "Único",
        quantity: 1,
        unitPrice: 50.0,
        imageUrl: "/catalog/detalhes-costura.jpeg",
      },
    ],
  },
  {
    id: "ord-1000",
    orderNumber: "#BC-2026-0980",
    customerName: "Mateus Ribeiro de Souza",
    customerPhone: "(11) 98765-4321",
    customerEmail: "mateus.souza@gmail.com",
    customerCpf: "123.456.789-00",
    shippingAddress: {
      street: "Avenida Paulista",
      number: "1000",
      complement: "Apto 42",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      postalCode: "01310-100",
    },
    shippingMethod: "SEDEX",
    shippingCost: 18.5,
    paymentMethod: "PIX",
    subtotal: 129.9,
    discount: 6.5,
    total: 141.9,
    status: "ENTREGUE",
    trackingCode: "BR987654321SP",
    createdAt: "2026-09-12T11:00:00Z",
    items: [
      {
        productName: "The Vine — João 15:5 (Linha Adulto)",
        color: "Off-White",
        size: "M",
        quantity: 1,
        unitPrice: 129.9,
        imageUrl: "/catalog/tee-oversized-offwhite-frente.jpeg",
      },
    ],
  },
];

const ORDERS_STORAGE_KEY = "branch_clo_orders_db";

export function getStoredOrders(): OrderData[] {
  if (typeof window === "undefined") return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveNewOrder(newOrder: OrderData): void {
  const current = getStoredOrders();
  const updated = [newOrder, ...current.filter((o) => o.id !== newOrder.id)];
  if (typeof window !== "undefined") {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("branch_clo_orders_updated"));
  }
}

export function updateOrderStatus(
  orderId: string,
  status: OrderData["status"],
  trackingCode?: string
): OrderData[] {
  const current = getStoredOrders();
  const updated = current.map((ord) => {
    if (ord.id === orderId) {
      return {
        ...ord,
        status,
        trackingCode: trackingCode !== undefined ? trackingCode : ord.trackingCode,
      };
    }
    return ord;
  });
  if (typeof window !== "undefined") {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("branch_clo_orders_updated"));
  }
  return updated;
}

export function getCustomerOrders(customerEmail: string): OrderData[] {
  const orders = getStoredOrders();
  const cleanEmail = customerEmail.trim().toLowerCase();
  return orders.filter(
    (ord) => ord.customerEmail.trim().toLowerCase() === cleanEmail
  );
}
