'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, HelpCircle } from 'lucide-react';

export default function FaqSection() {
    const faqs = [
        {
            question: "Combien de temps prend le traitement d'une demande ?",
            answer: "La plupart des demandes sont traitées sous 48 à 72 heures. En période de forte affluence (fin d'année universitaire), cela peut prendre au delà 72 heures."
        },
        {
            question: "Les documents sont-ils officiels ?",
            answer: "Oui, tous les documents délivrés sont certifiés conformes par l'administration universitaire et ont la même valeur que ceux obtenus physiquement."
        },
        {
            question: "Puis-je faire une demande pour un ancien étudiant ?",
            answer: "Oui, vous pouvez faire une demande même si vous n'êtes plus étudiant. Il vous faudra simplement fournir votre numéro matricule."
        },
        {
            question: "Quels modes de paiement acceptez-vous ?",
            answer: "Nous acceptons les cartes bancaires (Visa, Mastercard), PayPal et les virements bancaires."
        }
    ];

    return (
        <section id="faq" className="py-20 px-6 bg-gray-50">
            <div className="mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Questions fréquentes</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Trouvez des réponses aux questions les plus courantes
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                        >
                            <details className="group">
                                <summary className="list-none p-6 cursor-pointer flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                                    <div className="text-gray-500 group-open:rotate-180 transition-transform">
                                        <ChevronRight size={20} />
                                    </div>
                                </summary>
                                <div className="px-6 pb-6 pt-0 text-gray-600">
                                    {faq.answer}
                                </div>
                            </details>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <div className="inline-flex items-center px-6 py-3 bg-white border border-gray-200 rounded-full shadow-sm">
                        <HelpCircle className="text-green-500 mr-2" />
                        <span className="font-medium text-gray-700">Vous avez d'autres questions ?</span>
                        <a href="#contact" className="ml-2 text-green-600 hover:underline">Contactez-nous</a>
                    </div>
                </div>
            </div>
        </section>
    )
}
