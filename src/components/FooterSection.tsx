'use client'

import { FileText, Check, Clock, Mail, Phone, BookOpen, Award, FileSignature, LocateIcon, CheckSquare } from 'lucide-react';
import Image from 'next/image';
import logo from '../../public/images/up_logo.png';

export default function FooterSection() {
    // Données
    const actesTypes = [
      {
          id: 'diplome',
          title: "Diplôme",
          description: "Demandez votre diplôme de Licence, Master ou Doctorat",
          icon: <Award className="text-blue-500" size={24} />,
          price: "20 000 FCFA"
      },
      {
          id: 'licence',
          title: "Attestation de succès - Licence",
          description: "Demandez votre attestation de succès en Licence",
          icon: <BookOpen className="text-red-500" size={24} />,
          price: "2 000 FCFA"
      },
      {
          id: 'master',
          title: "Attestation de succès - Master",
          description: "Demandez votre attestation de succès en Master",
          icon: <BookOpen className="text-indigo-500" size={24} />,
          price: "5 000 FCFA"
      },
      {
          id: 'releve',
          title: "Relevé de notes Licence",
          description: "Demandez votre relevé de notes de Licence",
          icon: <FileText className="text-green-500" size={24} />,
          price: "5 000 FCFA"
      },
      {
          id: 'bulletin',
          title: "Relevé de notes Master",
          description: "Demandez votre relevé de notes de Master",
          icon: <FileText className="text-orange-500" size={24} />,
          price: "10 000 FCFA"
      },
      {
          id: 'attestation',
          title: "Certificat d'inscription",
          description: "Demandez votre certificat d'inscription",
          icon: <CheckSquare className="text-purple-500" size={24} />,
          price: "2 000 FCFA"
      },
      {
          id: 'parcours',
          title: "Parcours de l'étudiant",
          description: "Demandez votre parcours académique complet",
          icon: <FileSignature className="text-green-500" size={24} />,
          price: "2 000 FCFA"
      }
  ];
    return (
        <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                {/* <FileText className="text-white mr-2" size={28} /> */}
                <Image src={logo} className="text-white mr-2" width={50} height={50} alt="Université de Parakou" />
                <span className="text-xl font-semibold">UNIVERSITE DE PARAKOU</span>
              </div>
              <p className="text-gray-400">Plateforme de délivrance des actes académiques sécurisés en ligne</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                {actesTypes.slice(0, 5).map(acte => (
                  <li key={acte.id}>
                    <a href="#services" className="text-gray-400 hover:text-white">{acte.title}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Liens utiles</h4>
              <ul className="space-y-2">
                <li><a href="https://www.univ-parakou.bj" target='_blank' className="text-gray-400 hover:text-white">Université de Parakou</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Mentions légales</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Conditions d'utilisation</a></li>
                <li><a href="#faq" className="text-gray-400 hover:text-white">FAQ</a></li>
                <li><a href="#process" className="text-gray-400 hover:text-white">Procédure</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <Mail className="mr-2 mt-1" size={16} />
                  <span>univ-parakou@gmail.com</span>
                </li>
                <li className="flex items-start">
                  <Phone className="mr-2 mt-1" size={16} />
                  <span>+229 01 23 61 07 12</span>
                </li>
                <li className="flex items-start">
                  <Clock className="mr-2 mt-1" size={16} />
                  <span>Lundi-Vendredi : 08h-12h30 | 14h-17h30</span>
                </li>
                <li className="flex items-start">
                  <LocateIcon className="mr-2 mt-1" size={16} />
                  <span>Parakou, Quartier Arafat</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Université de Parakou. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    )
}
