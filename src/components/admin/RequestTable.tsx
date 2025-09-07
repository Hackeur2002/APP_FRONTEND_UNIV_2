import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DocumentRequest } from "@/types/index"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { api } from "@/services/api"
import toast from 'react-hot-toast'
import { FileText, Mail } from "lucide-react"

interface RequestTableProps {
  requests: DocumentRequest[]
  setRequests?: (requests: DocumentRequest[]) => void
}

export function RequestTable({ requests, setRequests }: RequestTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentRequestId, setCurrentRequestId] = useState<number | null>(null)
  const [openValidationDialog, setOpenValidationDialog] = useState(false)
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false)
  const [openEmailDialog, setOpenEmailDialog] = useState(false)
  const [approved, setApproved] = useState(true)
  const [comments, setComments] = useState("")
  const [signature, setSignature] = useState<File | null>(null)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailMessage, setEmailMessage] = useState("")

  // Fonction pour recharger les demandes depuis l'API
  const refreshRequests = async () => {
    try {
      const updatedRequests = await api.fetchRequests()
      if (setRequests) {
        setRequests(updatedRequests)
      }
    } catch (error) {
      console.error('Failed to refresh requests:', error)
      toast.error('Échec du rechargement des demandes')
    }
  }

  const handleViewDocuments = async (trackingId: number) => {
    setIsLoading(true)
    try {
      const request = await api.fetchRequestById(trackingId)
      setSelectedRequest(request)
    } catch (error) {
      console.error('Failed to fetch request:', error)
      toast.error('Échec du chargement des documents')
    } finally {
      setIsLoading(false)
    }
  }

  const handleValidateSubmit = async (requestId: number, approved: boolean, comments: string) => {
    setIsLoading(true)
    try {
      if (!approved && !comments.trim()) {
        toast.error('Une raison est requise en cas de rejet')
        return
      }
      await api.validateRequest(requestId, approved, comments)
      await refreshRequests()
      toast.success('Validation soumise avec succès')
      setOpenValidationDialog(false)
    } catch (error) {
      console.error('Failed to validate request:', error)
      toast.error('Échec de la validation de la demande')
    } finally {
      setIsLoading(false)
      setCurrentRequestId(null)
      setApproved(true)
      setComments("")
    }
  }

  const handleGenerateSubmit = async (requestId: number, signature: File | null) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      if (signature) {
        formData.append('signature', signature)
      }

      const response = await api.generateDocument(requestId, formData)
      await refreshRequests()
      const updatedRequest = await api.fetchRequestById(requestId)
      setSelectedRequest(updatedRequest)
      toast.success('Document généré avec succès')
      setOpenGenerateDialog(false)
    } catch (error: any) {
      console.error('Failed to generate document:', error)
      toast.error(error.response?.data?.error || 'Échec de la génération du document')
    } finally {
      setIsLoading(false)
      setCurrentRequestId(null)
      setSignature(null)
    }
  }

  const handleSendEmailSubmit = async (requestId: number, subject: string, message: string) => {
    setIsLoading(true)
    try {
      if (!subject.trim() || !message.trim()) {
        toast.error('L\'objet et le message sont requis')
        return
      }
      await api.sendCustomEmail(requestId, subject, message)
      toast.success('Email envoyé avec succès')
      setOpenEmailDialog(false)
    } catch (error: any) {
      console.error('Failed to send email:', error)
      toast.error(error.response?.data?.error || 'Échec de l\'envoi de l\'email')
    } finally {
      setIsLoading(false)
      setCurrentRequestId(null)
      setEmailSubject("")
      setEmailMessage("")
    }
  }

  const renderRejectionReasons = (rejectionReason: string | null) => {
    if (!rejectionReason) return '-'
    try {
      const reasons = JSON.parse(rejectionReason)
      return (
        <ul className="list-disc pl-4">
          {reasons.map((reason: { role: string; email: string; reason: string }, index: number) => (
            <li key={index}>
              <strong>{reason.role}</strong> ({reason.email}): {reason.reason}
            </li>
          ))}
        </ul>
      )
    } catch (error) {
      return rejectionReason
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID Suivi</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Raison de Rejet</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{request.trackingId}</TableCell>
            <TableCell>{request.studentName}</TableCell>
            <TableCell>{request.documentType}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  request.status === 'generated'
                    ? 'bg-green-100 text-green-800'
                    : request.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {request.status}
              </span>
            </TableCell>
            <TableCell>{renderRejectionReasons(request.rejectionReason)}</TableCell>
            <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => handleViewDocuments(request.id)} disabled={isLoading}>
                      Voir Documents
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Documents pour {request.trackingId}</DialogTitle>
                    </DialogHeader>
                    {selectedRequest && selectedRequest.trackingId === request.trackingId ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-bold">Documents soumis</h3>
                          {[
                            { name: 'Acte de Naissance', path: selectedRequest.acteNaissancePath },
                            { name: 'Carte Étudiant', path: selectedRequest.carteEtudiantPath },
                            { name: 'Fiche Préinscription', path: selectedRequest.fichePreinscriptionPath },
                            { name: 'Diplôme Bac', path: selectedRequest.diplomeBacPath },
                            { name: 'Demande Manuscrite', path: selectedRequest.demandeManuscritePath },
                          ].map((doc) =>
                            doc.path ? (
                              <div key={doc.name} className="flex items-center">
                                <FileText className="mr-2 h-4 w-4" />
                                <a
                                  href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${doc.path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {doc.name}
                                </a>
                              </div>
                            ) : null
                          )}
                        </div>
                        {selectedRequest.status === 'generated' && selectedRequest.documents?.length > 0 && (
                          <div className="pt-4 border-t">
                            <h3 className="font-bold mb-2">Document Généré</h3>
                            <div className="flex items-center">
                              <FileText className="mr-2 h-4 w-4" />
                              <a
                                href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/tmp/${selectedRequest.documents[0].filePath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {selectedRequest.documentType} - {selectedRequest.trackingId}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p>Chargement des documents...</p>
                    )}
                  </DialogContent>
                </Dialog>

                {(request.status === 'pending_validator1' || (request.status === 'pending_validator2' && request.documentType === 'diploma')) && (
                  <Dialog
                    open={openValidationDialog && currentRequestId === request.id}
                    onOpenChange={(open) => {
                      setOpenValidationDialog(open)
                      if (!open) {
                        setCurrentRequestId(null)
                        setApproved(true)
                        setComments("")
                      } else {
                        setCurrentRequestId(request.id)
                        setApproved(true)
                        setComments("")
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button disabled={isLoading} onClick={() => setCurrentRequestId(request.id)}>
                        Valider
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Valider la Demande {request.trackingId}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`approved-${request.id}`}
                            checked={approved}
                            onCheckedChange={(checked) => setApproved(!!checked)}
                          />
                          <Label htmlFor={`approved-${request.id}`}>Approuver</Label>
                        </div>
                        <div>
                          <Label htmlFor={`comments-${request.id}`}>
                            Commentaires {approved ? '(optionnel)' : '(obligatoire en cas de rejet)'}
                          </Label>
                          <Textarea
                            id={`comments-${request.id}`}
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder={
                              approved
                                ? 'Entrez vos commentaires (optionnel)...'
                                : 'Entrez la raison du rejet (obligatoire)...'
                            }
                          />
                        </div>
                        <Button
                          onClick={() => handleValidateSubmit(request.id, approved, comments)}
                          disabled={isLoading && currentRequestId === request.id}
                        >
                          Soumettre
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {request.status === 'pending_validator2' && request.documents?.length === 0 && (
                  <Dialog
                    open={openGenerateDialog && currentRequestId === request.id}
                    onOpenChange={(open) => {
                      setOpenGenerateDialog(open)
                      if (!open) {
                        setCurrentRequestId(null)
                        setSignature(null)
                      } else {
                        setCurrentRequestId(request.id)
                        setSignature(null)
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button disabled={isLoading} onClick={() => setCurrentRequestId(request.id)}>
                        Générer Document
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Générer Document pour {request.trackingId}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`signature-${request.id}`}>Signature (optionnel)</Label>
                          <Input
                            id={`signature-${request.id}`}
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => setSignature(e.target.files?.[0] || null)}
                          />
                        </div>
                        <Button
                          onClick={() => handleGenerateSubmit(request.id, signature)}
                          disabled={isLoading && currentRequestId === request.id}
                        >
                          {isLoading && currentRequestId === request.id ? 'Génération...' : 'Générer et Envoyer'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {request.status !== 'generated' && (
                  <Dialog
                    open={openEmailDialog && currentRequestId === request.id}
                    onOpenChange={(open) => {
                      setOpenEmailDialog(open)
                      if (!open) {
                        setCurrentRequestId(null)
                        setEmailSubject("")
                        setEmailMessage("")
                      } else {
                        setCurrentRequestId(request.id)
                        setEmailSubject(`Mise à jour concernant votre demande ${request.trackingId}`)
                        setEmailMessage("")
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={isLoading}
                        onClick={() => setCurrentRequestId(request.id)}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Envoyer un email
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Envoyer un email pour la demande {request.trackingId}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`subject-${request.id}`}>Objet</Label>
                          <Input
                            id={`subject-${request.id}`}
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            placeholder="Entrez l'objet de l'email..."
                          />
                        </div>
                        <div>
                          <Label htmlFor={`message-${request.id}`}>Message</Label>
                          <Textarea
                            id={`message-${request.id}`}
                            value={emailMessage}
                            onChange={(e) => setEmailMessage(e.target.value)}
                            placeholder="Entrez le message..."
                          />
                        </div>
                        <Button
                          onClick={() => handleSendEmailSubmit(request.id, emailSubject, emailMessage)}
                          disabled={isLoading && currentRequestId === request.id}
                        >
                          Envoyer
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {request.status === 'generated' && request.documents?.length > 0 && (
                  <Button variant="outline" asChild>
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/tmp/${request.documents[0].filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Voir le document généré
                    </a>
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}