export interface CustomerReview {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerCity: string;
  productName: string;
  rating: number; // 1 a 5 estrelas
  comment: string;
  photoUrl: string; // URL da imagem ou base64
  featuredOnHome: boolean; // Curadoria do lojista para destacar no final da Home
  createdAt: string;
}

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: "rev-1",
    orderNumber: "#BC-2026-1001",
    customerName: "Mateus Ribeiro de Souza",
    customerEmail: "mateus.souza@gmail.com",
    customerCity: "São Paulo, SP",
    productName: "The Vine — João 15:5 (Linha Adulto)",
    rating: 5,
    comment:
      "Qualidade surreal da malha suedine 205g. O caimento é impecável, gola de 3cm bem estruturada e a estampa inteira de João 15:5 nas costas é um testemunho diário. Já virou minha camiseta favorita!",
    photoUrl: "/catalog/tee-oversized-offwhite-costas.jpeg",
    featuredOnHome: true,
    createdAt: "2026-09-20T16:45:00Z",
  },
  {
    id: "rev-2",
    orderNumber: "#BC-2026-1002",
    customerName: "Priscila Albuquerque",
    customerEmail: "priscila.alb@outlook.com",
    customerCity: "Rio de Janeiro, RJ",
    productName: "Hoodie Boxy — João 15:5 (Preto)",
    rating: 5,
    comment:
      "A modelagem boxy é perfeita! O tecido é pesado, quentinho e super premium. A etiqueta em couro e o silk emborrachado na frente dão um acabamento de alta costura com essência cristã.",
    photoUrl: "/catalog/hoodie-boxy-preto-costas.jpeg",
    featuredOnHome: true,
    createdAt: "2026-09-19T14:20:00Z",
  },
  {
    id: "rev-3",
    orderNumber: "#BC-2026-0985",
    customerName: "Daniel Carvalho",
    customerEmail: "daniel.carvalho@gmail.com",
    customerCity: "Belo Horizonte, MG",
    productName: "The Vine — Juízes 7:7 (Linha Teens)",
    rating: 5,
    comment:
      "Comprei para o meu irmão mais novo e ele amou. A proposta da marca de unir moda urbana com propósito bíblico é fantástica. Entrega muito rápida e embalagem super cuidadosa!",
    photoUrl: "/catalog/hoodie-boxy-marrom-frente.jpeg",
    featuredOnHome: true,
    createdAt: "2026-09-18T11:10:00Z",
  },
  {
    id: "rev-4",
    orderNumber: "#BC-2026-0960",
    customerName: "Gabriela Santos",
    customerEmail: "gabriela.santos@gmail.com",
    customerCity: "Curitiba, PR",
    productName: "The Vine — João 15:5 (Linha Adulto)",
    rating: 5,
    comment:
      "Os detalhes dos acabamentos e da costura dupla reforçada mostram a excelência com que cada peça é produzida. Veste super bem tanto no dia a dia quanto no culto.",
    photoUrl: "/catalog/detalhes-costura.jpeg",
    featuredOnHome: false,
    createdAt: "2026-09-17T09:30:00Z",
  },
];

const REVIEWS_STORAGE_KEY = "branch_clo_reviews_db";

export function getStoredReviews(): CustomerReview[] {
  if (typeof window === "undefined") return INITIAL_REVIEWS;
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REVIEWS;
  }
}

export function saveCustomerReview(
  data: Omit<CustomerReview, "id" | "createdAt" | "featuredOnHome"> & {
    featuredOnHome?: boolean;
  }
): CustomerReview {
  const current = getStoredReviews();
  const newReview: CustomerReview = {
    ...data,
    id: "rev-" + Date.now(),
    featuredOnHome: data.featuredOnHome ?? false,
    createdAt: new Date().toISOString(),
  };

  const updated = [newReview, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("branch_clo_reviews_updated"));
  }
  return newReview;
}

export function toggleReviewFeatured(reviewId: string, featured: boolean): CustomerReview[] {
  const current = getStoredReviews();
  const updated = current.map((r) =>
    r.id === reviewId ? { ...r, featuredOnHome: featured } : r
  );
  if (typeof window !== "undefined") {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("branch_clo_reviews_updated"));
  }
  return updated;
}

export function deleteReview(reviewId: string): CustomerReview[] {
  const current = getStoredReviews();
  const updated = current.filter((r) => r.id !== reviewId);
  if (typeof window !== "undefined") {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("branch_clo_reviews_updated"));
  }
  return updated;
}
