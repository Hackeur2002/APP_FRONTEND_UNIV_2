'use client'

import React from "react"
import { motion } from "framer-motion"
import { FileText, ChevronRight, Check, BookOpen, Award, FileSpreadsheet, Route, ClipboardList, GraduationCap, BadgeCheck, FileCheck } from 'lucide-react';

export default function ServicesSection() {
    const actesTypes = [
        {
            id: 'diplome',
            title: "Diplôme",
            description: "Demandez votre diplôme de Licence, Master ou Doctorat",
            icon: <GraduationCap className="text-blue-500" size={24} />,
            price: "20 000 FCFA"
        },
        {
            id: 'licence',
            title: "Attestation de succès - Licence",
            description: "Demandez votre attestation de succès en Licence",
            icon: <Award className="text-red-500" size={24} />,
            price: "2 000 FCFA"
        },
        {
            id: 'master',
            title: "Attestation de succès - Master",
            description: "Demandez votre attestation de succès en Master",
            icon: <Award className="text-indigo-500" size={24} />,
            price: "5 000 FCFA"
        },
        {
            id: 'releve',
            title: "Relevé de notes Licence",
            description: "Demandez votre relevé de notes de Licence",
            icon: <FileSpreadsheet className="text-green-500" size={24} />,
            price: "5 000 FCFA"
        },
        {
            id: 'bulletin',
            title: "Relevé de notes Master",
            description: "Demandez votre relevé de notes de Master",
            icon: <FileSpreadsheet className="text-orange-500" size={24} />,
            price: "10 000 FCFA"
        },
        {
            id: 'attestation',
            title: "Certificat d'inscription",
            description: "Demandez votre certificat d'inscription",
            icon: <FileCheck className="text-purple-500" size={24} />,
            price: "2 000 FCFA"
        },
        {
            id: 'parcours',
            title: "Parcours de l'étudiant",
            description: "Demandez votre parcours académique complet",
            icon: <Route className="text-green-500" size={24} />,
            price: "2 000 FCFA"
        }
    ];

    return (
        <section id="services" className="py-20 px-6 bg-white">
            <div className="mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Services disponibles</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Tous vos documents universitaires disponibles en ligne
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {actesTypes.map((acte, index) => (
                        <motion.div
                            key={acte.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 hover:shadow-lg transition-all border border-gray-100 hover:border-blue-100 hover:translate-y-[-5px]`}
                        >
                            <div className="mb-4 flex justify-between items-start">
                                <div className="p-3 rounded-lg bg-opacity-20" style={{ backgroundColor: `${acte.icon.props.className.split(' ')[1]?.replace('text-', 'bg-')}20` }}>
                                    {acte.icon}
                                </div>
                                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">{acte.price}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900">{acte.title}</h3>
                            <p className="text-gray-600 mb-6">{acte.description}</p>
                            <a href="#demande" className={`inline-flex items-center font-medium ${acte.icon.props.className.split(' ')[1]} hover:underline`}>
                                Demander <ChevronRight className="ml-1" size={18} />
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}