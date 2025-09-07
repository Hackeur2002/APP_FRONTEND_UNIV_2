export interface DocumentRequest {
    documentPath: boolean;
    id: number;
    trackingId: string;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    matricule: string;
    establishment: string;
    studyYear: string;
    academicYear: string;
    documentType: string;
    status: string;
    rejectionReason: string | null;
    acteNaissancePath: string | null;
    carteEtudiantPath: string | null;
    fichePreinscriptionPath: string | null;
    diplomeBacPath: string | null;
    demandeManuscritePath: string | null;
    createdAt: string;
    updatedAt: string | null;
    payment?: Payment;
    documents?: Document[];
    validations?: Validation[];
  }
  
  export interface Payment {
    id: number;
    requestId: number;
    reference: string;
    amount: number;
    method: 'card' | 'mobile_money' | 'bank_transfer' | 'cash';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    paidAt: string | null;
    createdAt: string;
    updatedAt: string | null;
  }
  
  export interface Document {
    id: number;
    requestId: number;
    type: string;
    filePath: string;
    generatedBy: number | null;
    createdAt: string;
    updatedAt: string | null;
  }
  
  export interface Validation {
    id: number;
    requestId: number;
    staffId: number;
    step: 'validation1' | 'validation2' | 'validation3';
    approved: boolean;
    comments: string | null;
    signaturePath: string | null;
    createdAt: string;
    updatedAt: string | null;
  }