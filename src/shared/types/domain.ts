export type Role = "Administrador" | "Encargado" | "Personal";

export type StudentStatus = "Pendiente" | "Activo" | "Inactivo";

export type DocCategory =
  | "Pasaporte"
  | "DNI"
  | "Certificado de estudios"
  | "Extracto bancario"
  | "Visa anterior"
  | "Sin clasificar";

export type DocStatus =
  | "Recibido"
  | "En clasificación"
  | "Pendiente de revisión"
  | "Almacenado"
  | "Excluido de IA"
  | "Bloqueado (sin carpeta)";

export type Page =
  | "login"
  | "home"
  | "students"
  | "validation"
  | "student"
  | "documents"
  | "review"
  | "alerts"
  | "integrations"
  | "users";

export interface Participant {
  id: string;
  name: string;
  phone: string;
  role: "Estudiante" | "Personal de Andino";
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  detail: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  whatsappGroup: string;
  driveFolder: string;
  status: StudentStatus;
  participants: Participant[];
  timeline: AuditEvent[];
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  studentId: string;
  studentName: string;
  fileName: string;
  senderName: string;
  senderRole: "Estudiante" | "Personal de Andino";
  category: DocCategory;
  confidence?: number;
  status: DocStatus;
  drivePath?: string;
  validationType?: "IA automática" | "Validación humana" | "Excluido";
  receivedAt: string;
  updatedAt: string;
}

export interface AlertItem {
  id: string;
  studentId: string;
  studentName: string;
  documentId?: string;
  title: string;
  description: string;
  priority: "Alta" | "Media";
  status: "Abierta" | "Resuelta";
  createdAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
}
