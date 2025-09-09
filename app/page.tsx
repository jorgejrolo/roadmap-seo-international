"use client";
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const BRAND = { primaryFrom:'#00F5A0', primaryTo:'#00D9F5', ink:'#E5F7F2', bg:'#0B1220', border:'#1E293B' };

export default function Page(){
  return (
    <main className='max-w-7xl mx-auto p-8 text-white'>
      <div className='flex items-center gap-3'>
        <Image src='/logo.png' width={180} height={64} alt='logo' />
        <h1 className='text-3xl font-bold'>Roadmap SEO Internacional — Build OK</h1>
      </div>
      <p className='mt-4 text-slate-300'>Este es un placeholder mínimo para asegurar que el build en Vercel funciona. Si compila, te paso el archivo completo.</p>
    </main>
  );
}
