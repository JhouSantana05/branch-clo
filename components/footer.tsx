import React from "react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-[#FAF7F2] py-14 px-4 sm:px-6 lg:px-8 text-xs font-mono">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/">
            <div className="relative h-10 w-44">
              <Image
                src="/brand/logo.svg"
                alt="BRANCH CLO."
                fill
                className="object-contain"
              />
            </div>
          </Link>
          <span className="text-[#8C7A68] text-[11px]">
            THE VINE COLLECTION &bull; ENRAIZADOS EM CRISTO. CONECTADOS AO PROPÓSITO.
          </span>
          <span className="text-[#A39280] text-[10px]">
            &copy; {new Date().getFullYear()} BRANCH CLO. Todos os direitos reservados.
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-[11px] uppercase tracking-wider text-[#6B5E52]">
          <Link href="/masculino" className="hover:text-[#1E3524] transition-colors">
            Masculino
          </Link>
          <Link href="/feminino" className="hover:text-[#1E3524] transition-colors">
            Feminino
          </Link>
          <Link href="/teens" className="hover:text-[#1E3524] transition-colors">
            Teens
          </Link>
          <Link href="/infantil" className="hover:text-[#1E3524] transition-colors">
            Infantil
          </Link>
          <Link href="/acessorios" className="hover:text-[#1E3524] transition-colors">
            Acessórios
          </Link>
          <Link href="/#tabela" className="hover:text-[#1E3524] transition-colors font-semibold">
            Tabela de Preços
          </Link>
        </div>
      </div>
    </footer>
  );
}
