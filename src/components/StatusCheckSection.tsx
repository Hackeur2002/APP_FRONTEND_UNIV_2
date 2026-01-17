"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { api } from "@/services/api";

export default function StatusCheckSection() {
  const [trackingId, setTrackingId] = useState("");
  const [statusData, setStatusData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingId.trim()) {
      setError("Veuillez saisir un code de suivi de demande");
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatusData(null);

    try {
      const data = await api.checkRequestStatusByTrackingId(trackingId.trim());
      setStatusData(data);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la vérification du statut");
      setStatusData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status.includes("rejected") || status === "cancelled") {
      return <XCircle className="text-red-500" size={32} />;
    } else if (
      status === "generated" ||
      status === "completed" ||
      status === "approved"
    ) {
      return <CheckCircle className="text-green-500" size={32} />;
    } else {
      return <Clock className="text-yellow-500" size={32} />;
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes("rejected") || status === "cancelled") {
      return "bg-red-50 border-red-200 text-red-800";
    } else if (
      status === "generated" ||
      status === "completed" ||
      status === "approved"
    ) {
      return "bg-green-50 border-green-200 text-green-800";
    } else {
      return "bg-yellow-50 border-yellow-200 text-yellow-800";
    }
  };

  return (
    <section id="statut" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Vérifier le statut de votre demande
          </h2>
          <p className="text-xl text-gray-600">
            Entrez votre code de suivi pour connaître le niveau d'avancement de
            votre demande
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleCheckStatus} className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label
                  htmlFor="trackingId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Code de demande
                </label>
                <input
                  type="text"
                  id="trackingId"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  placeholder="Ex: DOC-XXXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Vérification...
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      Vérifier
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="text-red-500 mt-0.5" size={20} />
              <div>
                <p className="text-red-800 font-medium">Erreur</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          {statusData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border-2 rounded-lg p-6 ${getStatusColor(
                statusData.status
              )}`}
            >
              <div className="flex items-start gap-4 mb-4">
                {getStatusIcon(statusData.status)}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">
                    Statut de la demande
                  </h3>
                  <p className="text-lg font-semibold mb-1">
                    {statusData.statusMessage}
                  </p>
                  <p className="text-sm opacity-75">
                    Code: {statusData.trackingId}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-current border-opacity-20">
                <div>
                  <p className="text-sm font-medium opacity-75 mb-1">
                    Type de document
                  </p>
                  <p className="text-base font-semibold capitalize">
                    {statusData.documentType === "diplome"
                      ? "iplôme"
                      : statusData.documentType === "releve"
                      ? "Relevé de notes"
                      : statusData.documentType === "attestation"
                      ? "Attestation d'inscription"
                      : statusData.documentType === "bulletin"
                      ? "Bulletin de notes"
                      : statusData.documentType === "licence"
                      ? "Attestation de succès Licence"
                      : statusData.documentType === "master"
                      ? "Attestation de succès Master"
                      : statusData.documentType}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium opacity-75 mb-1">
                    Étudiant
                  </p>
                  <p className="text-base font-semibold">
                    {statusData.studentName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium opacity-75 mb-1">
                    Date de création
                  </p>
                  <p className="text-base font-semibold">
                    {new Date(statusData.createdAt).toLocaleDateString(
                      "fr-FR",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
                {statusData.updatedAt && (
                  <div>
                    <p className="text-sm font-medium opacity-75 mb-1">
                      Dernière mise à jour
                    </p>
                    <p className="text-base font-semibold">
                      {new Date(statusData.updatedAt).toLocaleDateString(
                        "fr-FR",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                )}
                {statusData.paymentStatus && (
                  <div>
                    <p className="text-sm font-medium opacity-75 mb-1">
                      Statut du paiement
                    </p>
                    <p className="text-base font-semibold capitalize">
                      {statusData.paymentStatus === "completed"
                        ? "Payé"
                        : statusData.paymentStatus === "pending"
                        ? "En attente"
                        : statusData.paymentStatus}
                    </p>
                  </div>
                )}
              </div>

              {statusData.rejectionReason && (
                <div className="mt-6 pt-6 border-t border-current border-opacity-20">
                  <p className="text-sm font-medium opacity-75 mb-2">
                    Raison du rejet
                  </p>
                  <p className="text-base">{statusData.rejectionReason}</p>
                </div>
              )}
            </motion.div>
          )}

          {!statusData && !error && !isLoading && (
            <div className="text-center py-12 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>Entrez un code de demande pour vérifier son statut</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
