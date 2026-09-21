"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Search,
  MessageCircle,
  Truck,
  RefreshCw,
  CreditCard,
  ShieldCheck,
  HelpCircle,
  Package,
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "pedidos" | "trocas" | "frete" | "pagamento" | "produtos";
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    category: "trocas",
    question: "Como funciona a política de trocas e devoluções?",
    answer:
      "Você tem até 7 (sete) dias corridos após o recebimento da encomenda para solicitar a troca ou devolução sem nenhum custo adicional. A primeira troca é 100% grátis: nós fornecemos o código de postagem reversa dos Correios para você enviar a peça sem pagar frete. A peça deve estar com a etiqueta original e sem sinais de uso.",
  },
  {
    id: "faq-2",
    category: "pedidos",
    question: "Como acompanho a entrega do meu pedido?",
    answer:
      "Você pode rastrear seu pedido em tempo real acessando nossa página de Rastreio (/rastreio). Basta digitar o número do pedido (ex: #BC-2026-1002) ou seu CPF. Assim que o pacote for postado nos Correios, você também poderá clicar diretamente no link de rastreamento com código oficial.",
  },
  {
    id: "faq-3",
    category: "frete",
    question: "Qual o prazo e valor do frete?",
    answer:
      "Enviamos para todo o território nacional via Correios (SEDEX e PAC). O prazo de entrega e o valor variam de acordo com o seu CEP e podem ser simulados na página de cada produto ou no Checkout. Compras acima de R$ 399 contam com FRETE GRÁTIS automático via PAC para qualquer região do Brasil.",
  },
  {
    id: "faq-4",
    category: "pagamento",
    question: "Como funciona o desconto de 5% no PIX?",
    answer:
      "Todos os pedidos pagos via PIX recebem automaticamente 5% de desconto no valor total dos produtos. Na tela de checkout, geramos um QR Code dinâmico e o código Copia e Cola para você efetuar o pagamento diretamente no aplicativo do seu banco com liquidação imediata.",
  },
  {
    id: "faq-5",
    category: "produtos",
    question: "Qual é o tecido das peças e a durabilidade da gola?",
    answer:
      "Utilizamos a malha Suedine Premium 205g 100% algodão penteado. É um tecido estruturado, com toque aveludado e caimento pesado que não marca o corpo e tem zero transparência. A gola de 3cm é feita em ribana canelada 2x1 com memória elástica, projetada para não lacear ou deformar após as lavagens.",
  },
  {
    id: "faq-6",
    category: "produtos",
    question: "O emblema de couro na barra pode estragar ao lavar?",
    answer:
      "Nosso emblema de 4x5cm é confeccionado em couro ecológico especial tratado e costurado com linha reforçada. Para garantir a longevidade, recomendamos lavar a peça pelo avesso em água fria e nunca passar o ferro de passar diretamente sobre o couro.",
  },
  {
    id: "faq-7",
    category: "pedidos",
    question: "Como entrar em contato diretamente com o atendimento?",
    answer:
      "Nosso time atende de segunda a sábado, das 09h às 19h, pelo WhatsApp oficial. Você pode clicar no botão verde no rodapé ou nesta página para falar diretamente com nossa equipe.",
  },
];

export function FaqView() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "faq-1": true, // Primeiro aberto por padrão
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === "ALL" || item.category === activeCategory;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchesCategory;

    const matchesSearch =
      item.question.toLowerCase().includes(term) || item.answer.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <span className="text-[11px] font-mono tracking-widest text-[#1E3524] uppercase bg-[#EAE3D2] px-3 py-1 rounded">
          Suporte & Transparência
        </span>
        <h1 className="text-2xl sm:text-4xl font-serif text-[#2E2620] mt-3">
          Central de Ajuda & Dúvidas
        </h1>
        <p className="text-stone-600 text-sm mt-2">
          Encontre respostas sobre frete, trocas sem custo, medidas e cuidados com as peças Branch Clo.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Qual é a sua dúvida? (ex: troca, frete, suedine, pix...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-[#E8E1D5] rounded-xl text-sm text-[#2E2620] focus:outline-none focus:border-[#1E3524] shadow-sm"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 text-xs font-mono">
        {[
          { id: "ALL", label: "Todas as Dúvidas" },
          { id: "trocas", label: "Trocas & Devoluções" },
          { id: "frete", label: "Frete & Prazos" },
          { id: "pedidos", label: "Rastreio & Pedidos" },
          { id: "pagamento", label: "PIX & Pagamentos" },
          { id: "produtos", label: "Tecido & Cuidados" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === tab.id
                ? "bg-[#1E3524] text-white"
                : "bg-white border border-[#E8E1D5] text-stone-700 hover:bg-[#FAF7F2]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      {filteredFaqs.length === 0 ? (
        <div className="bg-white border border-[#E8E1D5] rounded-xl p-10 text-center">
          <HelpCircle className="w-10 h-10 mx-auto text-stone-400 mb-3" />
          <h3 className="text-lg font-serif text-[#2E2620]">Nenhuma resposta encontrada</h3>
          <p className="text-sm text-stone-500 mt-1">
            Não localizamos respostas para &ldquo;{searchTerm}&rdquo;. Chame nosso atendimento no WhatsApp para tirar sua dúvida na hora.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setActiveCategory("ALL");
            }}
            className="mt-4 border-[#2E2620]/20 text-xs"
          >
            Ver Todas as Perguntas
          </Button>
        </div>
      ) : (
        <div className="space-y-3 mb-12">
          {filteredFaqs.map((faq) => {
            const isOpen = openItems[faq.id];

            return (
              <div
                key={faq.id}
                className="bg-white border border-[#E8E1D5] rounded-xl overflow-hidden shadow-sm transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  className="w-full text-left px-5 sm:px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#FAF7F2]/60 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif font-bold text-sm sm:text-base text-[#2E2620]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 text-[#1E3524]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-[#E8E1D5]/60 bg-[#FAF7F2]/30">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Support Box */}
      <div className="bg-[#F5EFE6] border border-[#E8E1D5] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#1E3524] bg-[#EAE3D2] px-2.5 py-0.5 rounded font-medium">
            Atendimento Personalizado
          </span>
          <h3 className="text-xl font-serif font-bold text-[#2E2620] mt-2">
            Ainda precisa de ajuda?
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-md">
            Fale diretamente com nossa equipe de suporte no WhatsApp para tirar dúvidas sobre pedidos, tamanhos ou despachos.
          </p>
        </div>

        <a
          href={`https://wa.me/5511999999999?text=${encodeURIComponent(
            "Olá! Estou com uma dúvida sobre a loja Branch Clo e gostaria de ajuda."
          )}`}
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto"
        >
          <Button className="bg-[#1E3524] hover:bg-[#152519] text-white text-xs font-mono tracking-wider px-6 py-3 h-auto w-full sm:w-auto flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>FALAR NO WHATSAPP</span>
          </Button>
        </a>
      </div>
    </div>
  );
}
