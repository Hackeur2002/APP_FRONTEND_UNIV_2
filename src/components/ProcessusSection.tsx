'use client'

import React from "react"
import { motion } from "framer-motion"
import { FileText, Shield, Mail } from 'lucide-react';


export default function ProcessusSection() {
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
          title: "Réception de notification",
          description: "Recevez une notification par email dès que votre document est prêt",
          icon: <Mail className="text-white" size={20} />
        }
      ];

    return (
        <section id="process" className="py-20 px-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Un processus simple en 3 étapes pour obtenir vos documents
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold z-10 shadow-lg">
                  {step.step}
                </div>
                <div className="bg-white rounded-xl p-8 pt-14 shadow-md h-full border border-gray-100">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 text-center">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
}
