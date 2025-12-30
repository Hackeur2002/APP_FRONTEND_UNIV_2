'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronRight, ArrowRight, Menu, Upload, X, Check, Book, Calendar, Clock, FileInput, FileDigit, Shield, Mail, Phone, HelpCircle, User, BookOpen, Award, FileSignature } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import ProcessusSection from '@/components/ProcessusSection';
import StatsSection from '@/components/StatsSection';
import DemandeSection from '@/components/DemandeSection';
import StatusCheckSection from '@/components/StatusCheckSection';
import FaqSection from '@/components/FaqSection';
import ContactSection from '@/components/ContactSection';
import FooterSection from '@/components/FooterSection';

export default function ModernLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('diplome');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    matricule: '',
    etablissement: '',
    anneeEtude: '',
    anneeAcademique: '',
    acteType: '',
    email: '',
    telephone: '',
    acteNaissance: null,
    carteEtudiant: null,
    fichePreinscription: null,
    diplomeBac: null,
    demandeManuscrite: null
  });
  const [filePreviews, setFilePreviews] = useState({
    acteNaissance: '',
    carteEtudiant: '',
    fichePreinscription: '',
    diplomeBac: '',
    demandeManuscrite: ''
  });

  // Données pour les selects
  const etablissements = [
    "Faculté des Sciences",
    "Faculté des Lettres",
    "Faculté de Droit",
    "Faculté de Médecine",
    "Faculté d'Économie"
  ];

  const anneesEtude = [
    "Licence 1",
    "Licence 2",
    "Licence 3",
    "Master 1",
    "Master 2",
    "Doctorat"
  ];

  const anneesAcademiques = [
    "2023-2024",
    "2022-2023",
    "2021-2022",
    "2020-2021"
  ];

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: any, field: any) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
      setFilePreviews(prev => ({
        ...prev,
        [field]: file.name
      }));
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const submitForm = () => {
    console.log('Form submitted:', formData);
    // Ici vous pourriez envoyer les données à votre API
    alert('Demande soumise avec succès!');
  };

  // Données
  const actesTypes = [
    {
      id: 'diplome',
      title: "Copie de diplôme",
      description: "Obtenez une copie certifiée conforme de votre diplôme",
      icon: <Award className="text-blue-500" size={24} />,
      price: "3000 FCFA"
    },
    {
      id: 'releve',
      title: "Relevé de notes",
      description: "Demandez votre relevé de notes officiel",
      icon: <BookOpen className="text-green-500" size={24} />,
      price: "4000 FCFA"
    },
    {
      id: 'attestation',
      title: "Attestation",
      description: "Attestation de scolarité ou de réussite",
      icon: <FileSignature className="text-purple-500" size={24} />,
      price: "5000 FCFA"
    },
    {
      id: 'bulletin',
      title: "Bulletin de notes",
      description: "Bulletin semestriel détaillé",
      icon: <FileText className="text-orange-500" size={24} />,
      price: "2500 FCFA"
    },
    {
      id: 'licence',
      title: "Attestation de licence",
      description: "Document officiel de validation de licence",
      icon: <Check className="text-red-500" size={24} />,
      price: "3000 FCFA"
    },
    {
      id: 'master',
      title: "Attestation de master",
      description: "Document officiel de validation de master",
      icon: <Check className="text-indigo-500" size={24} />,
      price: "5000 FCFA"
    }
  ];

  const stats = [
    { value: "24-48h", label: "Délai moyen", icon: <Clock className="text-blue-500" size={32} /> },
    { value: "100%", label: "En ligne", icon: <Shield className="text-green-500" size={32} /> },
    { value: "24/7", label: "Accessible", icon: <Check className="text-purple-500" size={32} /> },
    { value: "5000+", label: "Étudiants", icon: <User className="text-orange-500" size={32} /> }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Remplissez le formulaire",
      description: "Complétez les informations requises pour votre demande",
      icon: <FileText className="text-white" size={20} />
    },
    {
      step: 2,
      title: "Paiement sécurisé",
      description: "Effectuez le paiement en ligne de manière sécurisée",
      icon: <Shield className="text-white" size={20} />
    },
    {
      step: 3,
      title: "Réception des documents",
      description: "Recevez vos documents par email sous 48h maximum",
      icon: <Mail className="text-white" size={20} />
    }
  ];

  const faqs = [
    {
      question: "Combien de temps prend le traitement d'une demande ?",
      answer: "La plupart des demandes sont traitées sous 24 à 48 heures. En période de forte affluence (fin d'année universitaire), cela peut prendre jusqu'à 72 heures."
    },
    {
      question: "Les documents sont-ils officiels ?",
      answer: "Oui, tous les documents délivrés sont certifiés conformes par l'administration universitaire et ont la même valeur que ceux obtenus physiquement."
    },
    {
      question: "Puis-je faire une demande pour un ancien étudiant ?",
      answer: "Oui, vous pouvez faire une demande même si vous n'êtes plus étudiant. Il vous faudra simplement fournir votre numéro d'étudiant ou d'identification."
    },
    {
      question: "Quels modes de paiement acceptez-vous ?",
      answer: "Nous acceptons les cartes bancaires (Visa, Mastercard), PayPal et les virements bancaires."
    }
  ];

  

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Section Services */}
      <ServicesSection />

      {/* Section Processus */}
      <ProcessusSection />

      {/* Section Stats */}
      <StatsSection />

      {/* Section Demande */}
      <DemandeSection />

      {/* Section Vérification du Statut */}
      <StatusCheckSection />

      {/* Section FAQ */}
      <FaqSection />

      {/* Section Contact */}
      <ContactSection />

      {/* Footer */}
      <FooterSection />
    </div>
  );
}