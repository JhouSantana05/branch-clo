import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ShieldCheck,
  Heart,
  Droplets,
  Sun,
  Flame,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "O Propósito & Manifesto | BRANCH CLO.",
  description:
    "Conheça a história, o manifesto e os pilares de alfaiataria da BRANCH CLO. The Vine Collection — João 15:5.",
};

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2E2620]">
      {/* Hero Editorial */}
      <section className="relative py-16 sm:py-24 border-b border-[#E8E1D5] bg-[#F5EFE6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[11px] font-mono tracking-widest text-[#1E3524] uppercase bg-[#EAE3D2] px-3 py-1 rounded">
            Manifesto da Marca
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2E2620] mt-4 tracking-tight leading-tight">
            Mais que roupa.<br />Um lembrete diário.
          </h1>
          <p className="text-stone-600 font-mono text-xs sm:text-sm mt-4 tracking-wider uppercase">
            THE VINE COLLECTION &bull; ENRAIZADOS NA VIDEIRA VERDADEIRA
          </p>
        </div>
      </section>

      {/* The Scripture & The Mission */}
      <section className="py-16 sm:py-20 border-b border-[#E8E1D5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-[#FAF7F2] border-l-4 border-[#1E3524] pl-6 sm:pl-8 py-4 mb-10">
            <blockquote className="font-serif text-xl sm:text-2xl text-[#2E2620] italic leading-relaxed">
              &ldquo;Eu sou a videira, vós, os ramos. Quem permanece em mim, e eu, nele, esse dá muito fruto; porque sem mim nada podeis fazer.&rdquo;
            </blockquote>
            <span className="block mt-3 font-mono text-xs text-stone-500 uppercase tracking-widest">
              — João 15:5 (Bíblia Sagrada)
            </span>
          </div>

          <div className="prose prose-stone max-w-none text-sm sm:text-base leading-relaxed text-stone-700 space-y-6">
            <p>
              A <strong>BRANCH CLO.</strong> nasceu de uma inquietação: por que a moda cristã muitas vezes é resumida a estampas genéricas ou tecidos frágeis? Acreditamos que a mensagem do Evangelho merece a maior excelência possível em matéria-prima, caimento e estética.
            </p>
            <p>
              Cada peça que criamos não é apenas um artigo de vestuário; é uma declaração silenciosa e sofisticada da nossa fé. Uma vestimenta que comunica respeito, modéstia e convicção tanto num culto de domingo quanto numa reunião executiva ou numa cafeteria no centro da cidade.
            </p>
          </div>
        </div>
      </section>

      {/* Craftsmanship Grid & Photos */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E8E1D5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono text-[#1E3524] uppercase tracking-widest">
              Rigor & Matéria-Prima
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif text-[#2E2620] mt-2">
              Os 3 Pilares da Alfaiataria Streetwear
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
            {/* Pillar 1 */}
            <div className="bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl p-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-2xl font-bold text-[#1E3524]">01</span>
                <h3 className="font-serif text-lg font-bold text-[#2E2620] mt-2 mb-3">
                  Suedine Premium 205g
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  100% algodão penteado com acabamento peletizado de toque aveludado. Malha encorpada de alta densidade que confere caimento estruturado sem marcar e zero transparência.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E8E1D5] text-[11px] font-mono text-stone-500">
                Toque aveludado &bull; Anti-bolinhas
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl p-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-2xl font-bold text-[#1E3524]">02</span>
                <h3 className="font-serif text-lg font-bold text-[#2E2620] mt-2 mb-3">
                  Gola Ribana 3cm 2x1
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Desenvolvemos a gola canelada de 3 centímetros com elastano de memória e pesponto reforçado ombro a ombro. Mantém o formato perfeito e não laceia mesmo após inúmeras lavagens.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E8E1D5] text-[11px] font-mono text-stone-500">
                Memória elástica &bull; Não deforma
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl p-6 flex flex-col justify-between">
              <div>
                <span className="font-mono text-2xl font-bold text-[#1E3524]">03</span>
                <h3 className="font-serif text-lg font-bold text-[#2E2620] mt-2 mb-3">
                  Emblema em Couro 4x5cm
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Nossa assinatura registrada: etiqueta em couro ecológico cortada e gravada a laser com o versículo João 15:5 e costurada artesanalmente na barra frontal da peça.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E8E1D5] text-[11px] font-mono text-stone-500">
                Gravação a laser &bull; Assinatura Branch
              </div>
            </div>
          </div>

          {/* Photo Pair Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative h-80 sm:h-96 rounded-xl overflow-hidden shadow-sm border border-[#E8E1D5]">
              <Image
                src="/catalog/detalhes-costura.jpeg"
                alt="Detalhe de costura e emblema em couro gravado Branch Clo"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <span className="text-white text-xs font-mono tracking-wider uppercase">
                  Emblema em Couro 4x5cm gravado a laser
                </span>
              </div>
            </div>

            <div className="relative h-80 sm:h-96 rounded-xl overflow-hidden shadow-sm border border-[#E8E1D5]">
              <Image
                src="/catalog/tee-oversized-offwhite-costas.jpeg"
                alt="The Vine Collection estampada nas costas"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <span className="text-white text-xs font-mono tracking-wider uppercase">
                  The Vine Collection &bull; Linha Adulto
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Garment Care Guide */}
      <section className="py-16 sm:py-20 border-b border-[#E8E1D5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-mono text-[#1E3524] uppercase tracking-widest">
              Longevidade
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#2E2620] mt-1">
              Guia de Cuidados com o Suedine 205g
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-2">
              Para preservar a maciez do algodão e o emblema de couro por anos:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E8E1D5] p-5 rounded-lg text-center">
              <Droplets className="w-6 h-6 mx-auto text-[#1E3524] mb-2" />
              <h4 className="text-xs font-bold font-mono text-[#2E2620] uppercase">Lavagem Suave</h4>
              <p className="text-xs text-stone-600 mt-1">
                Lave preferencialmente pelo avesso, em água fria e ciclo delicado com sabão neutro.
              </p>
            </div>

            <div className="bg-white border border-[#E8E1D5] p-5 rounded-lg text-center">
              <ShieldCheck className="w-6 h-6 mx-auto text-[#1E3524] mb-2" />
              <h4 className="text-xs font-bold font-mono text-[#2E2620] uppercase">Sem Alvejantes</h4>
              <p className="text-xs text-stone-600 mt-1">
                Não utilize cloro ou alvejantes agressivos para não desbotar as fibras naturais.
              </p>
            </div>

            <div className="bg-white border border-[#E8E1D5] p-5 rounded-lg text-center">
              <Sun className="w-6 h-6 mx-auto text-[#1E3524] mb-2" />
              <h4 className="text-xs font-bold font-mono text-[#2E2620] uppercase">Secagem à Sombra</h4>
              <p className="text-xs text-stone-600 mt-1">
                Evite secadoras rotativas. Estenda no varal na sombra para preservar a estrutura do fio.
              </p>
            </div>

            <div className="bg-white border border-[#E8E1D5] p-5 rounded-lg text-center">
              <Flame className="w-6 h-6 mx-auto text-[#1E3524] mb-2" />
              <h4 className="text-xs font-bold font-mono text-[#2E2620] uppercase">Passadoria</h4>
              <p className="text-xs text-stone-600 mt-1">
                Passe em temperatura média. Nunca passe o ferro diretamente sobre o couro ou a estampa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#F5EFE6] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-serif text-[#2E2620]">
            Pronto para vestir o propósito?
          </h3>
          <p className="text-stone-600 text-sm mt-2 mb-6">
            Conheça todas as peças da coleção The Vine disponíveis com entrega para todo o Brasil.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/masculino">
              <Button className="bg-[#1E3524] hover:bg-[#152519] text-white text-xs font-mono tracking-wider px-6">
                COLEÇÃO MASCULINA
              </Button>
            </Link>
            <Link href="/feminino">
              <Button variant="outline" className="border-[#2E2620]/30 hover:bg-white text-xs font-mono tracking-wider px-6">
                COLEÇÃO FEMININA
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
