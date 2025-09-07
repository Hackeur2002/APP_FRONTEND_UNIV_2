'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronRight, ArrowRight, Menu, X } from 'lucide-react';
import Image from 'next/image';
import logo1 from '../../public/images/logoUP.jpg';
import logo from '../../public/images/up_logo.png';

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className="relative h-screen  text-white"
      style={{
        backgroundImage: 'url(/images/rectorat_up.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      <div className="relative z-10 h-full">
        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-10 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">

            {/* <FileText className="text-white mr-2" size={28} /> */}
            <Image src={logo} className="text-white mr-5" width={50} height={50} alt="Université de Parakou" />
            <span className="text-xl font-semibold">Université de Parakou</span>
          </div>

          {/* Menu desktop */}
          <div className="hidden md:flex space-x-8">
            <a href="#services" className="hover:text-blue-200 transition-colors">Services</a>
            <a href="#process" className="hover:text-blue-200 transition-colors">Procédure</a>
            <a href="#demande" className="hover:text-blue-200 transition-colors">Demande</a>
            <a href="#faq" className="hover:text-blue-200 transition-colors">FAQ</a>
            <a href="#contact" className="px-4 py-2 bg-emerald-900 bg-opacity-10 hover:bg-opacity-20 hover:bg-emerald-800 rounded-full transition-colors">
              Contact
            </a>
          </div>

          {/* Menu mobile */}
          <button
            className="md:hidden z-20"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Overlay menu mobile */}
          {menuOpen && (
            <div className="fixed inset-0 bg-green-900 bg-opacity-95 z-10 flex flex-col items-center justify-center space-y-8 text-xl">
              <a href="#services" className="hover:text-blue-200" onClick={() => setMenuOpen(false)}>Services</a>
              <a href="#process" className="hover:text-blue-200" onClick={() => setMenuOpen(false)}>Procédure</a>
              <a href="#demande" className="hover:text-blue-200" onClick={() => setMenuOpen(false)}>Demande</a>
              <a href="#faq" className="hover:text-blue-200" onClick={() => setMenuOpen(false)}>FAQ</a>
              <a href="#contact" className="hover:text-blue-200" onClick={() => setMenuOpen(false)}>Contact</a>
            </div>
          )}
        </nav>

        {/* Contenu Hero */}
        <div className="mx-auto h-full flex flex-col justify-center items-center text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6 max-w-3xl leading-tight"
          >
            Vos actes académiques en quelques clics
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-2xl text-blue-100"
          >
            Obtenez rapidement vos diplômes, relevés de notes et attestations sans vous déplacer
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#demande"
              className="px-8 py-3 bg-white text-green-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              Faire une demande <ArrowRight className="ml-2" />
            </a>
            <a
              href="#services"
              className="px-8 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-700 hover:bg-opacity-10 transition-colors"
            >
              Nos services
            </a>
          </motion.div>
        </div>

        {/* Indicateur scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="rotate-90 text-white opacity-70" size={24} />
        </div>
      </div>
    </section>
  )
};
