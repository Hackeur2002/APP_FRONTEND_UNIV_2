import { useState, useEffect } from "react"
import { api } from "@/services/api"
import { DocumentRequest } from "@/types/index"
import { RequestTable } from "@/components/admin/RequestTable"
import toast from 'react-hot-toast'

export default function PendingPage() {
  const [requests, setRequests] = useState<DocumentRequest[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchRequests = async () => {
    setIsLoading(true)
    try {
      const data = await api.fetchRequests()
      setRequests(data)
    } catch (error) {
      console.error('Failed to fetch requests:', error)
      toast.error('Échec du chargement des demandes')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Demandes en attente</h1>
      {isLoading ? (
        <p>Chargement des demandes...</p>
      ) : (
        <RequestTable requests={requests} setRequests={setRequests} />
      )}
    </div>
  )
}