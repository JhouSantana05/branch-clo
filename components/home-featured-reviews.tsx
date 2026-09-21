"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CustomerReview, getStoredReviews } from "@/lib/reviews";
import { Star, CheckCircle2, MessageSquare, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeFeaturedReviews() {
  const [featuredReviews, setFeaturedReviews] = useState<CustomerReview[]>([]);

  useEffect(() => {
    const loadReviews = () => {
      const all = getStoredReviews();
      const featured = all.filter((r) => r.featuredOnHome);
      setFeaturedReviews(featured.length > 0 ? featured : all.slice(0, 3));
    };

    loadReviews();

    const handleSync = () => loadReviews();
    window.addEventListener("branch_clo_reviews_updated", handleSync);
    return () => window.removeEventListener("branch_clo_reviews_updated", handleSync);
  }, []);

  if (featuredReviews.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#F9F6F0] border-t border-b border-[#E8E1D5]">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 bg-[#EAE3D2] text-[#1E3524] px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AVALIAÇÕES &bull; THE VINE COMMUNITY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black uppercase tracking-tight text-[#2E2620]">
            QUEM VESTE A MENSAGEM
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            Fotos e depoimentos reais de irmãos e clientes que carregam a mensagem de João 15:5 no dia a dia. Confeccionadas com a excelência do tecido suedine premium 205g/m².
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {featuredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#E8E1D5] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Imagem do Cliente / Peça */}
                <div className="relative h-64 sm:h-72 w-full bg-stone-100 overflow-hidden">
                  <Image
                    src={rev.photoUrl}
                    alt={`Foto de ${rev.customerName}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Badge de Comprador Verificado na Foto */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-mono">
                    <span className="inline-flex items-center gap-1 bg-[#1E3524]/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Comprador Verificado</span>
                    </span>
                    <span className="text-[10px] text-stone-200 bg-black/50 px-2 py-0.5 rounded">
                      {rev.customerCity}
                    </span>
                  </div>
                </div>

                {/* Conteúdo do Depoimento */}
                <div className="p-6">
                  {/* Estrelas */}
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-stone-300"
                        }`}
                      />
                    ))}
                    <span className="text-xs font-mono font-bold text-stone-800 ml-1.5">
                      {rev.rating}.0 / 5.0
                    </span>
                  </div>

                  {/* Depoimento / Citação */}
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans italic mb-4 line-clamp-4">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  {/* Tag da Peça Comprada */}
                  <div className="bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E8E1D5] mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-0.5">
                      Peça Adquirida:
                    </span>
                    <p className="text-xs font-mono font-bold text-[#1E3524] truncate">
                      {rev.productName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rodapé do Card com Nome */}
              <div className="px-6 pb-6 pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-mono">
                <div>
                  <h4 className="font-bold text-[#2E2620]">{rev.customerName}</h4>
                  <span className="text-[10px] text-stone-400">
                    {new Date(rev.createdAt).toLocaleDateString("pt-BR", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <span className="text-[10px] text-[#1E3524] font-bold bg-[#EAE3D2] px-2 py-0.5 rounded">
                  Compra Verificada
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="mt-12 sm:mt-16 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/masculino">
            <Button className="bg-[#1E3524] hover:bg-[#152519] text-white px-8 py-3 h-auto text-xs font-mono uppercase tracking-widest shadow-md flex items-center gap-2">
              <span>Garantir Minha Peça The Vine</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="border-stone-400 text-stone-800 hover:bg-stone-100 px-6 py-3 h-auto text-xs font-mono uppercase tracking-widest">
              <span>Já comprou? Envie sua Foto e Avaliação</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
