"use client";

import React, { useState } from "react";
import { Star, CheckCircle2, ThumbsUp, MessageSquare, Plus, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface ReviewItem {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  verified: boolean;
  sizeBought: string;
  colorBought: string;
  customerProfile?: string;
  title: string;
  comment: string;
  likes: number;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    author: "Gabriel Vasconcelos",
    city: "São Paulo, SP",
    rating: 5,
    date: "Há 3 dias",
    verified: true,
    sizeBought: "G",
    colorBought: "Off-White",
    customerProfile: "1,82m &bull; 83kg (Caimento streetwear impecável)",
    title: "A qualidade do Suedine 205g é de outro nível!",
    comment:
      "Fiquei impressionado com o peso do tecido. Não marca absolutamente nada no corpo e o toque é aveludado demais. A gola de 3cm é bem fechada como deve ser uma peça streetwear de alto padrão e não laceou após a primeira lavagem. A mensagem de João 15:5 no couro dá uma elegância única.",
    likes: 24,
  },
  {
    id: "rev-2",
    author: "Deborah Silveira",
    city: "Belo Horizonte, MG",
    rating: 5,
    date: "Há 1 semana",
    verified: true,
    sizeBought: "M",
    colorBought: "Preto",
    customerProfile: "1,68m &bull; 62kg (Caimento soltinho e modesto)",
    title: "Modéstia com extrema sofisticação",
    comment:
      "Camiseta pesada, zero transparência e caimento reto elegante. O detalhe do emblema em couro legítimo gravado a laser na barra faz todo mundo na igreja e no trabalho perguntar de onde é. Já virou minha camiseta favorita.",
    likes: 19,
  },
  {
    id: "rev-3",
    author: "Mateus Ribeiro",
    city: "Curitiba, PR",
    rating: 5,
    date: "Há 2 semanas",
    verified: true,
    sizeBought: "GG",
    colorBought: "Marrom Café",
    customerProfile: "1,88m &bull; 92kg (Oversized perfeito nos ombros)",
    title: "Melhor camiseta cristã do mercado brasileiro",
    comment:
      "Estava cansado de comprar camisetas de fé que parecem brinde de evento. A Branch Clo entregou padrão Fear of God / Essentials com essência do Evangelho. Vale cada centavo. O acabamento das costuras duplas é impecável.",
    likes: 31,
  },
];

interface ProductReviewsProps {
  productTitle: string;
}

export function ProductReviews({ productTitle }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState(false);

  // Form States
  const [newAuthor, setNewAuthor] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newSize, setNewSize] = useState("M");
  const [newColor, setNewColor] = useState("Off-White");
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");

  const handleLike = (id: string) => {
    if (likedReviews[id]) return;
    setLikedReviews((prev) => ({ ...prev, [id]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
    );
    toast.success("Obrigado pelo feedback!");
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) {
      toast.error("Por favor, preencha seu nome e comentário.");
      return;
    }

    const created: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: newAuthor,
      city: newCity || "Brasil",
      rating: newRating,
      date: "Agora mesmo",
      verified: true,
      sizeBought: newSize,
      colorBought: newColor,
      title: newTitle || "Excelente qualidade!",
      comment: newComment,
      likes: 0,
    };

    setReviews([created, ...reviews]);
    setShowForm(false);
    setNewAuthor("");
    setNewCity("");
    setNewTitle("");
    setNewComment("");
    toast.success("Avaliação enviada com sucesso! Muito obrigado pelo seu relato.");
  };

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="mt-16 border-t border-[#E8E1D5] pt-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#E8E1D5]">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#1E3524] uppercase bg-[#EAE3D2] px-2.5 py-0.5 rounded">
            Prova Social & Depoimentos
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2E2620] mt-2">
            Avaliações de Quem Já Usa
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Opiniões reais de clientes sobre o corte, caimento e durabilidade da peça.
          </p>
        </div>

        {/* Rating Summary Box */}
        <div className="flex items-center gap-6 bg-[#F5EFE6] border border-[#E8E1D5] rounded-xl p-4 sm:p-5">
          <div className="text-center">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-[#2E2620] leading-none block">
              {averageRating}
            </span>
            <div className="flex items-center justify-center gap-0.5 text-amber-500 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="text-[10px] font-mono text-stone-500 mt-1 block">
              {reviews.length} avaliações
            </span>
          </div>

          <div className="h-12 w-[1px] bg-[#E8E1D5]" />

          <div>
            <span className="text-xs font-semibold text-[#2E2620] block">100% Recomendam</span>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              Tecido encorpado &bull; Gola estruturada
            </span>
            <Button
              size="sm"
              onClick={() => setShowForm(true)}
              className="mt-2 text-xs bg-[#1E3524] hover:bg-[#152519] text-white flex items-center gap-1.5 h-7 px-3"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Avaliar Peça</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Review Submission Modal / Form */}
      {showForm && (
        <div className="my-8 bg-[#F5EFE6] border border-[#1E3524]/20 rounded-xl p-6 sm:p-8 animate-in fade-in-0 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D5] mb-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-[#2E2620]">
                Deixe seu relato sobre {productTitle}
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Compartilhe sua experiência sobre o tecido, gola ou caimento para ajudar outros irmãos.
              </p>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
            {/* Stars Selector */}
            <div>
              <label className="font-mono text-stone-700 block mb-1">Sua Nota Geral:</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= newRating ? "fill-amber-400 text-amber-500" : "text-stone-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="font-mono text-stone-600 ml-2">{newRating} de 5 estrelas</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-stone-700 block mb-1">Seu Nome Completo:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Lucas Ferreira"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full bg-white border border-[#E8E1D5] rounded-lg p-2.5 focus:outline-none focus:border-[#1E3524]"
                />
              </div>

              <div>
                <label className="font-mono text-stone-700 block mb-1">Cidade / Estado:</label>
                <input
                  type="text"
                  placeholder="Ex: Rio de Janeiro, RJ"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full bg-white border border-[#E8E1D5] rounded-lg p-2.5 focus:outline-none focus:border-[#1E3524]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-stone-700 block mb-1">Tamanho Escolhido:</label>
                <select
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  className="w-full bg-white border border-[#E8E1D5] rounded-lg p-2.5 focus:outline-none focus:border-[#1E3524]"
                >
                  <option value="P">P</option>
                  <option value="M">M</option>
                  <option value="G">G</option>
                  <option value="GG">GG</option>
                  <option value="Único">Tamanho Único</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-stone-700 block mb-1">Cor Adquirida:</label>
                <select
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-full bg-white border border-[#E8E1D5] rounded-lg p-2.5 focus:outline-none focus:border-[#1E3524]"
                >
                  <option value="Off-White">Off-White Natural</option>
                  <option value="Preto">Preto Intenso</option>
                  <option value="Marrom Café">Marrom Café</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-mono text-stone-700 block mb-1">Título do seu Relato:</label>
              <input
                type="text"
                placeholder="Ex: Superou minhas expectativas no tecido!"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-white border border-[#E8E1D5] rounded-lg p-2.5 focus:outline-none focus:border-[#1E3524]"
              />
            </div>

            <div>
              <label className="font-mono text-stone-700 block mb-1">Sua Avaliação Detalhada:</label>
              <textarea
                rows={3}
                required
                placeholder="Conte o que achou da densidade da malha Suedine 205g, do conforto da gola 3cm e do caimento..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-white border border-[#E8E1D5] rounded-lg p-2.5 focus:outline-none focus:border-[#1E3524]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="border-stone-300"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-[#1E3524] hover:bg-[#152519] text-white">
                Publicar Avaliação
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4 my-8">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white border border-[#E8E1D5] rounded-xl p-5 sm:p-6 shadow-sm hover:border-[#1E3524]/30 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#EAE3D2] text-[#1E3524] font-mono font-bold flex items-center justify-center text-xs">
                  {rev.author.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-sm text-[#2E2620]">
                      {rev.author}
                    </span>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Comprador Verificado
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-500 font-mono">
                    {rev.city} &bull; {rev.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rev.rating ? "fill-amber-400 text-amber-500" : "text-stone-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Spec Tag */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-stone-500 mb-3 bg-[#FAF7F2] px-3 py-1.5 rounded border border-[#E8E1D5]/60 w-fit">
              <span>Peça: Cor {rev.colorBought} &bull; Tam {rev.sizeBought}</span>
              {rev.customerProfile && (
                <>
                  <span>&bull;</span>
                  <span dangerouslySetInnerHTML={{ __html: rev.customerProfile }} />
                </>
              )}
            </div>

            {/* Title & Comment */}
            <h4 className="font-serif font-bold text-sm text-[#2E2620] mb-1.5">
              {rev.title}
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {rev.comment}
            </p>

            {/* Like Counter */}
            <div className="mt-4 pt-3 border-t border-[#E8E1D5]/60 flex items-center justify-between text-xs text-stone-500">
              <span className="text-[11px]">Esta avaliação foi útil?</span>
              <button
                type="button"
                onClick={() => handleLike(rev.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors text-xs font-mono ${
                  likedReviews[rev.id]
                    ? "bg-emerald-50 text-emerald-800 font-semibold"
                    : "hover:bg-[#FAF7F2] text-stone-600"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Útil ({rev.likes})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
