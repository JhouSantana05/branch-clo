"use client";

import React, { useState } from "react";
import {
  Ruler,
  Sparkles,
  CheckCircle2,
  X,
  User,
  ArrowRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FitFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize: (size: string) => void;
  availableSizes: string[];
}

export function FitFinderModal({
  isOpen,
  onClose,
  onSelectSize,
  availableSizes,
}: FitFinderModalProps) {
  const [height, setHeight] = useState<number>(176);
  const [weight, setWeight] = useState<number>(75);
  const [fitPreference, setFitPreference] = useState<"slim" | "regular" | "oversized">("oversized");

  if (!isOpen) return null;

  // Algoritmo de recomendação de tamanho
  const calculateRecommendedSize = (): { size: string; reason: string } => {
    // Para linhas numéricas (Kids/Teens)
    const isNumeric = availableSizes.some((s) => !isNaN(Number(s)));
    if (isNumeric) {
      if (height < 110) return { size: "2", reason: "Ideal para altura até 1,10m." };
      if (height < 125) return { size: "4", reason: "Ideal para altura até 1,25m." };
      if (height < 138) return { size: "6", reason: "Ideal para altura até 1,38m." };
      if (height < 150) return { size: "8", reason: "Ideal para altura até 1,50m." };
      if (height < 158) return { size: "10", reason: "Ideal para altura até 1,58m." };
      if (height < 165) return { size: "12", reason: "Ideal para teens até 1,65m." };
      if (height < 172) return { size: "14", reason: "Ideal para teens até 1,72m." };
      return { size: "16", reason: "Ideal para teens a partir de 1,72m." };
    }

    // Para Linha Adulto (P, M, G, GG)
    let baseScore = 0; // 0 = P, 1 = M, 2 = G, 3 = GG

    if (weight < 65) baseScore = 0;
    else if (weight < 78) baseScore = 1;
    else if (weight < 90) baseScore = 2;
    else baseScore = 3;

    // Ajuste por Altura
    if (height > 185 && baseScore < 2) baseScore += 1;
    if (height < 165 && baseScore > 0) baseScore -= 1;

    // Ajuste por Caimento
    if (fitPreference === "oversized" && baseScore < 3) {
      // Se a pessoa quer streetwear boxy, sobe 1 tamanho se estiver no limite
      if (weight >= 70 && baseScore === 1) baseScore = 2;
      else if (weight >= 84 && baseScore === 2) baseScore = 3;
    } else if (fitPreference === "slim" && baseScore > 0) {
      baseScore -= 1;
    }

    const sizesMap = ["P", "M", "G", "GG"];
    const targetSize = sizesMap[baseScore] || "M";

    const matchedSize = availableSizes.includes(targetSize)
      ? targetSize
      : availableSizes[0] || "M";

    let reasonText = "";
    if (fitPreference === "oversized") {
      reasonText = `Com ${height}cm e ${weight}kg, o tamanho ${matchedSize} entregará o corte streetwear autêntico da Branch Clo com ombros caídos e caimento encorpado do Suedine 205g sem sobrar no comprimento.`;
    } else if (fitPreference === "regular") {
      reasonText = `Para um caimento clássico e confortável no dia a dia com ${height}cm e ${weight}kg, o tamanho ${matchedSize} é o mais equilibrado para o seu biotipo.`;
    } else {
      reasonText = `Para quem prefere a peça mais ajustada ao peitoral e braços mantendo a modéstia, recomendamos o tamanho ${matchedSize}.`;
    }

    return { size: matchedSize, reason: reasonText };
  };

  const recommendation = calculateRecommendedSize();

  const handleApply = () => {
    onSelectSize(recommendation.size);
    toast.success(`Tamanho ${recommendation.size} selecionado com sucesso!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-2xl border border-[#E8E1D5] shadow-2xl p-6 sm:p-8 z-10 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D5] mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#EAE3D2] rounded-lg text-[#1E3524]">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-[#2E2620]">
                Provador Virtual Branch Clo
              </h3>
              <p className="text-xs text-stone-600">
                Descubra seu tamanho exato em menos de 10 segundos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-xs font-mono">
          {/* Sliders de Altura e Peso */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Altura */}
            <div className="bg-white border border-[#E8E1D5] p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-stone-600 font-semibold uppercase text-[11px]">Sua Altura</span>
                <span className="text-base font-bold text-[#1E3524]">{height} cm</span>
              </div>
              <input
                type="range"
                min={130}
                max={205}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full accent-[#1E3524] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>1,30m</span>
                <span>2,05m</span>
              </div>
            </div>

            {/* Peso */}
            <div className="bg-white border border-[#E8E1D5] p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-stone-600 font-semibold uppercase text-[11px]">Seu Peso</span>
                <span className="text-base font-bold text-[#1E3524]">{weight} kg</span>
              </div>
              <input
                type="range"
                min={40}
                max={130}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full accent-[#1E3524] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>40kg</span>
                <span>130kg</span>
              </div>
            </div>
          </div>

          {/* Preferência de Caimento */}
          <div>
            <label className="block text-stone-700 font-semibold text-[11px] uppercase mb-2">
              Como você prefere vestir suas peças?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "slim", label: "Slim", desc: "Mais justo" },
                { id: "regular", label: "Regular", desc: "Clássico" },
                { id: "oversized", label: "Oversized", desc: "Streetwear Boxy" },
              ].map((fit) => (
                <button
                  key={fit.id}
                  type="button"
                  onClick={() => setFitPreference(fit.id as any)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    fitPreference === fit.id
                      ? "bg-[#1E3524] text-white border-[#1E3524] shadow-sm ring-2 ring-[#1E3524]/20"
                      : "bg-white border-[#E8E1D5] text-stone-700 hover:bg-[#FAF7F2]"
                  }`}
                >
                  <div className="font-bold text-xs">{fit.label}</div>
                  <div className={`text-[10px] mt-0.5 ${fitPreference === fit.id ? "text-stone-200" : "text-stone-400"}`}>
                    {fit.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recomendação Result Box */}
          <div className="bg-[#EBF2EB] border border-emerald-300 rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#1E3524] text-white font-bold font-mono text-xl flex items-center justify-center shrink-0 shadow-sm">
                {recommendation.size}
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-mono text-emerald-800 uppercase tracking-wider font-bold block">
                  Recomendação Personalizada
                </span>
                <p className="text-xs text-[#2E2620] leading-relaxed mt-1 font-sans">
                  {recommendation.reason}
                </p>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-stone-300 text-xs font-mono"
            >
              Fechar
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              className="bg-[#1E3524] hover:bg-[#152519] text-white text-xs font-mono flex items-center gap-2 px-5"
            >
              <span>Escolher Tamanho {recommendation.size}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
