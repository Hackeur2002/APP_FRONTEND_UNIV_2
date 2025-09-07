"use client";

import { useState, useEffect } from "react";
import { RequestTable } from "@/components/admin/RequestTable";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { api } from "@/services/api";
import { DocumentRequest } from "@/types/index";
import toast from 'react-hot-toast';

export default function RequestsPage() {
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const fetchedRequests = await api.fetchRequests();
        console.log("fetchedRequests", fetchedRequests);
        setRequests(fetchedRequests);
      } catch (error) {
        console.error('Failed to fetch requests:', error);
        toast.error('Échec du chargement des demandes');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Toutes les demandes</h1>
        {isLoading ? (
          <p>Chargement...</p>
        ) : (
          <RequestTable requests={requests} setRequests={setRequests} />
        )}
      </div>
    </ProtectedRoute>
  );
}