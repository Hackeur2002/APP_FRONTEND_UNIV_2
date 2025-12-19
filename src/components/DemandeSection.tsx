'use client'

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, ChevronRight, ArrowRight, Menu, Upload, X, Check, Book, Calendar, Clock, FileInput, FileDigit, Shield, Mail, Phone, HelpCircle, User, BookOpen, Award, FileSignature } from 'lucide-react';
import { api } from "@/services/api";
import { useKKiaPay } from 'kkiapay-react';
import { generatePaymentReference } from "@/lib/utils";

// Fonction pour obtenir le prix du document sélectionné
const getDocumentPrice = (acteType: string, actesTypes: any[]) => {
    const selectedActe = actesTypes.find((acte: { id: any; }) => acte.id === acteType);
    return selectedActe ? parseInt(selectedActe.price.replace(' FCFA', ''), 10) : 0;
};

export default function DemandeSection() {
    const [mdocumentPrice, setDocumentPrice] = useState(0);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        matricule: '',
        etablissement: '',
        anneeEtude: '',
        anneeAcademique: '',
        acteType: '',
        email: '',
        telephone: '',
        paymentPhone: '',
        acteNaissance: null,
        carteEtudiant: null,
        fichePreinscription: null,
        diplomeBac: null,
        demandeManuscrite: null,
        paymentMethod: 'mobile_money'
    });
    const [filePreviews, setFilePreviews] = useState({
        acteNaissance: '',
        carteEtudiant: '',
        fichePreinscription: '',
        diplomeBac: '',
        demandeManuscrite: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
    const [trackingId, setTrackingId] = useState<string | null>(null);
    const [paymentReference, setPaymentReference] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [studentFullName, setStudentFullName] = useState<string | null>(null);
    const [studentVerification, setStudentVerification] = useState<any>(null); // Stocker la réponse de vérification

    const { openKkiapayWidget, addKkiapayListener, removeKkiapayListener } = useKKiaPay();

    const etablissements = [
        // "Faculté des Sciences",
        "Faculté de Médecine (FM)",
        "Faculté d'Agronomie (FA)",
        "Institut Universitaire de Technologie (IUT)",
        "Faculté de Droit et de Sciences Politiques (FDSP)",
        "Faculté de Sciences Economiques et de Gestion (FASEG)",
        // "Faculté de Lettres, Arts et Sciences Humaines (FLASH)",
        // "Institut de Formation et Soins Infirmiers et Obstétricaux (IFSIO)",
        // "Ecole Nationale de Statistique, de Planification et de Démographie (ENSPD)",
        // "Ecole Nationale des Techniciens en Santé publique et Surveillance Épidémiologique (ENATSE)",
        // "Ecole Doctorale des Sciences Agronomiques et de l'Eau (EDSAE)",
        // "Ecole Doctorale Sciences Juridiques, Politiques et Administratives (EDSJPA)"
    ];

    // Extraire les années d'étude par établissement à partir du fichier Excel
    const studyYearsByEstablishment = {
        "Faculté de Médecine (FM)": ["MG-MG-1", "MG-MG-2", "MG-MG-3", "MG-MG-4", "MG-MG-5", "MG-MG-6", "MG-MG-7"],
        "Faculté d'Agronomie (FA)": ["LP-AGRN-1", "LP-AGRN-2", "LP-AGRN-3", "LP-ESR-1", "LP-ESR-2", "LP-ESR-3", "LP-NSA-1", "LP-NSA-2", "LP-NSA-3", "LP-STPA-1", "LP-STPA-2", "LP-STPA-3", "LP-STPV-1", "LP-STPV-2", "LP-STPV-3", "MP-ACCA-1", "MP-ACCA-2", "MP-AE-1", "MP-AE-2", "MP-AGPE-1", "MP-AGPE-2", "MP-AGRN-1", "MP-AGRN-2"],
        "Institut Universitaire de Technologie (IUT)": ["LP-GB-1", "LP-GB-2", "LP-GB-3", "LP-GC-1", "LP-GC-2", "LP-GC-3", "LP-GE-1", "LP-GE-2", "LP-GE-3", "LP-GRH-1", "LP-GRH-2", "LP-GRH-3", "LP-GTL-1", "LP-GTL-2", "LP-GTL-3", "LP-IG-1", "LP-IG-2", "LP-IG-3", "MP-AIRH-1", "MP-AIRH-2", "MP-CCA-1", "MP-CCA-2", "MP-GEC-1", "MP-GEC-2", "MP-GLIA-1", "MP-GLIA-2", "MP-GTL-1", "MP-GTL-2", "MP-SIAD-1", "MP-SIAD-2"],
        "Faculté de Droit et de Sciences Politiques (FDSP)": ["LICE-DROIT_PRIVE-1", "LICE-DROIT_PRIVE-2", "LICE-DROIT_PRIVE-3", "LICE-DROIT_PUBLIC-1", "LICE-DROIT_PUBLIC-2", "LICE-DROIT_PUBLIC-3", "LICE-SPRI-1", "LICE-SPRI-2", "LICE-SPRI-3", "MP-ALDD-1", "MP-ALDD-2", "MP-ARH-1", "MP-ARH-2", "MP-ASPGCP-1", "MP-ASPGCP-2", "MP-ATPS-1", "MP-ATPS-2", "MP-DPSC-1", "MP-DPSC-2", "MP-ESSPD-1", "MP-ESSPD-2", "MP-JEA-1", "MP-JEA-2", "MP-RIPI-1", "MP-RIPI-2"],
        "Faculté de Sciences Economiques et de Gestion (FASEG)": ["LICE-APE-1", "LICE-APE-2", "LICE-APE-3", "LICE-EA-1", "LICE-EA-2", "LICE-EA-3", "LICE-EFCL-1", "LICE-EFCL-2", "LICE-EFCL-3", "LICE-EFI-1", "LICE-EFI-2", "LICE-EFI-3", "LICE-EGE-1", "LICE-EGE-2", "LICE-EGE-3", "LICE-FC-1", "LICE-FC-2", "LICE-FC-3", "LICE-MMO-1", "MP-ACG-1", "MP-ACG-2", "MP-BMF-1", "MP-BMF-2", "MP-EGDL-1", "MP-EGDL-2", "MP-GMPC-1", "MP-GMPC-2", "MP-MGP-1", "MP-MGP-2", "MP-NIPC-1", "MP-NIPC-2"]
    };

    const anneesAcademiques = [
        "2024-2025",
        "2023-2024",
        "2022-2023",
        "2021-2022",
        "2020-2021"
    ];

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

    const FileUploadField = ({ label, name, accept, preview, required = true }: any) => (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="relative">
                <input
                    type="file"
                    id={name}
                    name={name}
                    accept={accept}
                    onChange={(e) => handleFileChange(e, name)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required={required}
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    {preview ? (
                        <div className="flex flex-col items-center">
                            <FileText className="w-10 h-10 text-blue-500 mb-2" />
                            <span className="text-sm font-medium text-gray-700 truncate max-w-xs">{preview}</span>
                            <span className="text-xs text-green-600 mt-1">Cliquer pour changer</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Upload className="w-10 h-10 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-600">Glissez-déposez votre fichier ici</span>
                            <span className="text-xs text-gray-500">ou cliquez pour sélectionner</span>
                            {accept && <span className="text-xs text-gray-500 mt-1">(Format {accept} uniquement)</span>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    useEffect(() => {
        const successHandler = async (response: { transactionId: React.SetStateAction<string | null> | Blob; }) => {
            console.log('Paiement réussi:', response);
            setPaymentStatus('success');
            setPaymentReference(response.transactionId);

            setIsSubmitting(true);
            try {
                const formDataToSend = new FormData();
                formDataToSend.append('matricule', formData.matricule);
                formDataToSend.append('establishment', formData.etablissement);
                formDataToSend.append('studyYear', formData.anneeEtude);
                formDataToSend.append('academicYear', formData.anneeAcademique);
                formDataToSend.append('documentType', formData.acteType);
                formDataToSend.append('studentEmail', formData.email);
                formDataToSend.append('studentPhone', formData.telephone);
                formDataToSend.append('paymentMethod', formData.paymentMethod);
                formDataToSend.append('documentPrice', mdocumentPrice.toString());
                formDataToSend.append('paymentReference', response.transactionId);

                if (formData.acteNaissance) formDataToSend.append('acteNaissance', formData.acteNaissance);
                if (formData.carteEtudiant) formDataToSend.append('carteEtudiant', formData.carteEtudiant);
                if (formData.fichePreinscription) formDataToSend.append('fichePreinscription', formData.fichePreinscription);
                if (formData.diplomeBac) formDataToSend.append('diplomeBac', formData.diplomeBac);
                if (formData.demandeManuscrite) formDataToSend.append('demandeManuscrite', formData.demandeManuscrite);

                const submitResponse = await api.submitRequest(formDataToSend);
                if (!submitResponse.trackingId) {
                    throw new Error("Erreur lors de la création de la demande");
                }

                setTrackingId(submitResponse.trackingId);
                setCurrentStep(5);
            } catch (error) {
                console.error('Erreur lors de la soumission après paiement:', error);
                alert(error.message || "Une erreur est survenue lors de la soumission après le paiement. Veuillez contacter le support.");
            } finally {
                setIsSubmitting(false);
            }
        };

        const failureHandler = (error: any) => {
            console.log('Paiement échoué:', error);
            setPaymentStatus('failed');
        };

        addKkiapayListener('success', successHandler);
        addKkiapayListener('failed', failureHandler);

        return () => {
            removeKkiapayListener('success', successHandler);
            removeKkiapayListener('failed', failureHandler);
        };
    }, [addKkiapayListener, removeKkiapayListener, formData, mdocumentPrice]);

    const nextStep = async () => {
        if (currentStep === 1) {
            setIsSubmitting(true);
            setErrorMessage(null);
            try {
                const verificationData = {
                    matricule: formData.matricule,
                    anneeEtude: formData.anneeEtude,
                    anneeAcademique: formData.anneeAcademique,
                };
                const result = await api.verifyStudent(verificationData);
                if (result.success) {
                    setStudentFullName(`${result.student.prenom} ${result.student.nom}`); // Utiliser result.student
                    setStudentVerification(result.student); // Stocker uniquement les données de l'étudiant
                    setCurrentStep(prev => prev + 1);
                } else {
                    setErrorMessage(result.message || 'Étudiant non trouvé.');
                }
            } catch (error) {
                console.error('Erreur lors de la vérification:', error);
                setErrorMessage('Aucune correspondance pour les informations saisies.');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
        setErrorMessage(null);
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (name === 'etablissement') {
            setFormData(prev => ({
                ...prev,
                anneeEtude: '' // Réinitialiser anneeEtude lors du changement d'établissement
            }));
        }
        setErrorMessage(null);
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

    const handleOpenKkiapay = async() => {
        const amount = getDocumentPrice(formData.acteType, actesTypes);
        setDocumentPrice(amount);
        if (!formData.paymentPhone || !amount) {
            alert("Veuillez saisir un numéro de téléphone valide et vous assurer qu'un type d'acte est sélectionné.");
            return;
        }

        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('matricule', formData.matricule);
            formDataToSend.append('establishment', formData.etablissement);
            formDataToSend.append('studyYear', formData.anneeEtude);
            formDataToSend.append('academicYear', formData.anneeAcademique);
            formDataToSend.append('documentType', formData.acteType);
            formDataToSend.append('studentEmail', formData.email);
            formDataToSend.append('studentPhone', formData.telephone);
            formDataToSend.append('paymentMethod', formData.paymentMethod);
            formDataToSend.append('documentPrice', mdocumentPrice.toString());
            formDataToSend.append('paymentReference', generatePaymentReference());

            if (formData.acteNaissance) formDataToSend.append('acteNaissance', formData.acteNaissance);
            if (formData.carteEtudiant) formDataToSend.append('carteEtudiant', formData.carteEtudiant);
            if (formData.fichePreinscription) formDataToSend.append('fichePreinscription', formData.fichePreinscription);
            if (formData.diplomeBac) formDataToSend.append('diplomeBac', formData.diplomeBac);
            if (formData.demandeManuscrite) formDataToSend.append('demandeManuscrite', formData.demandeManuscrite);

            const submitResponse = await api.submitRequest(formDataToSend);
            if (!submitResponse.trackingId) {
                throw new Error("Erreur lors de la création de la demande");
            }

            setTrackingId(submitResponse.trackingId);
            setCurrentStep(5);

            if (studentVerification) {
                const recapData = {
                    studentFullName: `${studentVerification.prenom} ${studentVerification.nom}`,
                    email: formData.email,
                    matricule: formData.matricule,
                    etablissement: formData.etablissement,
                    anneeEtude: formData.anneeEtude,
                    anneeAcademique: formData.anneeAcademique,
                    documentType: actesTypes.find(acte => acte.id === formData.acteType)?.title || formData.acteType,
                    documentPrice: `${mdocumentPrice} FCFA`,
                    trackingId: submitResponse.trackingId,
                    paymentReference: generatePaymentReference(),
                    uploadedDocuments: Object.entries(filePreviews)
                        .filter(([_, value]) => value)
                        .map(([key, value]) => `${key}: ${value}`),
                    verificationDetails: {
                        sexe: studentVerification.sexe,
                        datenaissance: studentVerification.datenaissance,
                        lieunaissance: studentVerification.lieunaissance,
                        telephone: studentVerification.telephone,
                        email: studentVerification.email,
                        nationalite: studentVerification.nationalite,
                        statut: studentVerification.statut,
                        validation1: studentVerification.validation1,
                        validation2: studentVerification.validation2
                    }
                };
                const emailResponse = await api.sendRecap(recapData);
                if (!emailResponse.success) {
                    console.error('Erreur lors de l\'envoi du récapitulatif:', emailResponse.message);
                }
            }
        } catch (error) {
            console.error('Erreur lors de la soumission après paiement:', error);
            alert(error.message || "Une erreur est survenue lors de la soumission après le paiement. Veuillez contacter le support.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderPaymentStep = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 space-y-6"
        >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-center">
                <Shield className="mr-2 text-green-500" size={20} />
                Paiement
            </h3>
            {paymentStatus === 'pending' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Résumé de la demande */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Résumé de votre demande</h4>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Nom de l'étudiant</p>
                                <p className="text-gray-900">{studentFullName || 'Non renseigné'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Type de document</p>
                                <p className="text-gray-900">{actesTypes.find(acte => acte.id === formData.acteType)?.title || 'Non sélectionné'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Prix</p>
                                <p className="text-gray-900">{actesTypes.find(acte => acte.id === formData.acteType)?.price || '0 FCFA'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Numéro de matricule</p>
                                <p className="text-gray-900">{formData.matricule || 'Non renseigné'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Établissement</p>
                                <p className="text-gray-900">{formData.etablissement || 'Non renseigné'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Année d'étude</p>
                                <p className="text-gray-900">{formData.anneeEtude || 'Non renseignée'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">Année académique</p>
                                <p className="text-gray-900">{formData.anneeAcademique || 'Non renseignée'}</p>
                            </div>
                            {studentVerification && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Détails de vérification</p>
                                    <ul className="text-gray-900 list-disc list-inside">
                                        <li>Sexe: {studentVerification.sexe}</li>
                                        <li>Date de naissance: {studentVerification.datenaissance}</li>
                                        <li>Lieu de naissance: {studentVerification.lieunaissance}</li>
                                        <li>Téléphone: {studentVerification.telephone}</li>
                                        <li>Email: {studentVerification.email}</li>
                                        <li>Nationalité: {studentVerification.nationalite}</li>
                                        <li>Statut: {studentVerification.statut}</li>
                                        <li>Validation 1: {studentVerification.validation1}</li>
                                        <li>Validation 2: {studentVerification.validation2}</li>
                                    </ul>
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-gray-700">Documents fournis</p>
                                <ul className="text-gray-900 list-disc list-inside">
                                    {filePreviews.acteNaissance && <li>Acte de naissance: {filePreviews.acteNaissance}</li>}
                                    {filePreviews.carteEtudiant && <li>Carte d'étudiant: {filePreviews.carteEtudiant}</li>}
                                    {filePreviews.fichePreinscription && <li>Fiche de préinscription: {filePreviews.fichePreinscription}</li>}
                                    {filePreviews.diplomeBac && <li>Diplôme du BAC: {filePreviews.diplomeBac}</li>}
                                    {filePreviews.demandeManuscrite && <li>Demande manuscrite: {filePreviews.demandeManuscrite}</li>}
                                    {!Object.values(filePreviews).some(preview => preview) && <li>Aucun document fourni</li>}
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* Formulaire de paiement */}
                    <div className="flex flex-col justify-center">
                        <p className="text-gray-600 mb-4 text-center">Veuillez saisir le numéro de téléphone pour effectuer le paiement.</p>
                        <div className="max-w-md mx-auto mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de téléphone (Paiement)</label>
                            <input
                                type="tel"
                                name="paymentPhone"
                                value={formData.paymentPhone}
                                onChange={handleChange}
                                placeholder="Ex: 97000000"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>
                        <button
                            onClick={handleOpenKkiapay}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center mx-auto"
                            disabled={isSubmitting || !formData.paymentPhone}
                        >
                            {isSubmitting ? 'Traitement...' : 'Payer maintenant'} <ArrowRight className="ml-2" size={18} />
                        </button>
                        <p className="text-sm text-gray-500 mt-4 text-center">Vous serez redirigé vers KKiaPay pour finaliser le paiement.</p>
                    </div>
                </div>
            )}
            {paymentStatus === 'failed' && (
                <div className="py-8">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                        <X className="h-8 w-8 text-red-600" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Paiement échoué</h4>
                    <p className="text-gray-600 mb-6">Une erreur est survenue lors du traitement de votre paiement.</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleOpenKkiapay}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                            disabled={!formData.paymentPhone}
                        >
                            Réessayer le paiement
                        </button>
                        <button
                            onClick={prevStep}
                            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Retour
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );

    const renderConfirmationStep = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 space-y-6 text-center"
        >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-center">
                <Check className="mr-2 text-green-500" size={20} />
                Confirmation
            </h3>
            <div className="py-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Demande confirmée!</h4>
                <p className="text-gray-600 mb-6">
                    Votre demande a été enregistrée sous le numéro: <strong>{trackingId}</strong>
                </p>
                <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                    Faire une nouvelle demande
                </button>
            </div>
        </motion.div>
    );

    return (
        <section id="demande" className="py-20 px-6 bg-white">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Faire une demande</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Processus simple et sécurisé en 4 étapes
                    </p>
                </motion.div>

                <div className="flex justify-between mb-12 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-green-600 -z-10 transition-all duration-300"
                        style={{ width: `${(currentStep - 1) * 33.33}%` }}
                    ></div>

                    {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= step ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                {step}
                            </div>
                            <span className={`text-sm font-medium ${currentStep >= step ? 'text-green-600' : 'text-gray-500'}`}>
                                {step === 1 && 'Informations'}
                                {step === 2 && 'Contact'}
                                {step === 3 && 'Documents'}
                                {step === 4 && 'Paiement'}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    {currentStep === 1 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-8 space-y-6"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <User className="mr-2 text-green-500" size={20} />
                                Informations étudiant
                            </h3>
                            {errorMessage && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                                    {errorMessage}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de matricule</label>
                                <input
                                    type="text"
                                    name="matricule"
                                    value={formData.matricule}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Établissement</label>
                                <select
                                    name="etablissement"
                                    value={formData.etablissement}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                >
                                    <option value="" hidden>Sélectionnez votre établissement</option>
                                    {etablissements.map((etab, index) => (
                                        <option key={index} value={etab}>{etab}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Année d'étude</label>
                                    <select
                                        name="anneeEtude"
                                        value={formData.anneeEtude}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        required
                                    >
                                        <option value="" hidden>Sélectionnez votre année</option>
                                        {formData.etablissement && studyYearsByEstablishment[formData.etablissement]?.map((year: any, index: any) => (
                                            <option key={index} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Année académique</label>
                                    <select
                                        name="anneeAcademique"
                                        value={formData.anneeAcademique}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        required
                                    >
                                        <option value="" hidden>Sélectionnez l'année</option>
                                        {anneesAcademiques.map((annee, index) => (
                                            <option key={index} value={annee}>{annee}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center"
                                    disabled={isSubmitting || !formData.matricule || !formData.etablissement || !formData.anneeEtude || !formData.anneeAcademique}
                                >
                                    {isSubmitting ? 'Vérification...' : 'Suivant'} <ArrowRight className="ml-2" size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                    {currentStep === 2 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-8 space-y-6"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <Mail className="mr-2 text-green-500" size={20} />
                                Coordonnées et type d'acte
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type d'acte</label>
                                <select
                                    name="acteType"
                                    value={formData.acteType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    required
                                >
                                    <option value="" hidden>Sélectionnez le type d'acte</option>
                                    {actesTypes.map((acte) => (
                                        <option key={acte.id} value={acte.id}>{acte.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                                    <input
                                        type="tel"
                                        name="telephone"
                                        value={formData.telephone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between pt-4">
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Retour
                                </button>
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center"
                                    disabled={!formData.acteType || !formData.email || !formData.telephone}
                                >
                                    Suivant <ArrowRight className="ml-2" size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                    {currentStep === 3 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-8"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <FileInput className="mr-2 text-green-500" size={20} />
                                Documents à fournir
                            </h3>
                            <div className="space-y-6">
                                <FileUploadField
                                    label="Acte de naissance (PDF ou image)"
                                    name="acteNaissance"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    preview={filePreviews.acteNaissance}
                                />
                                <FileUploadField
                                    label="Carte d'étudiant (PDF ou image)"
                                    name="carteEtudiant"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    preview={filePreviews.carteEtudiant}
                                />
                                <FileUploadField
                                    label="Fiche de préinscription valide (PDF)"
                                    name="fichePreinscription"
                                    accept=".pdf"
                                    preview={filePreviews.fichePreinscription}
                                />
                                <FileUploadField
                                    label="Diplôme du BAC légalisé (PDF ou image)"
                                    name="diplomeBac"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    preview={filePreviews.diplomeBac}
                                />
                                <FileUploadField
                                    label="Demande manuscrite (PDF ou image)"
                                    name="demandeManuscrite"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    preview={filePreviews.demandeManuscrite}
                                />
                            </div>
                            <div className="flex justify-between pt-8">
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Retour
                                </button>
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center"
                                    disabled={!formData.acteType || !formData.email || !formData.telephone}
                                >
                                    Suivant <ArrowRight className="ml-2" size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                    {currentStep === 4 && renderPaymentStep()}
                    {currentStep === 5 && renderConfirmationStep()}
                </div>
            </div>
        </section>
    );
}