import type { AlertItem, AppUser, DocumentItem, Student } from "../types/domain";

export const initialStudents: Student[] = [
  {
    id: "est-1",
    name: "Sofía Herrera",
    email: "sofia.herrera@gmail.com",
    phone: "+51 984 210 432",
    destination: "Australia — Maestría en Negocios",
    whatsappGroup: "Andino | Sofía Herrera",
    driveFolder: "Andino Drive / Estudiantes / Sofía Herrera",
    status: "Activo",
    createdAt: "10/11/2026 09:15",
    participants: [
      { id: "p-1", name: "Sofía Herrera", phone: "+51 984 210 432", role: "Estudiante" },
      { id: "p-2", name: "Carolina Ríos", phone: "+51 999 100 201", role: "Personal de Andino" },
    ],
    timeline: [
      {
        id: "ev-1",
        timestamp: "10/11/2026 09:15:12",
        action: "Grupo detectado",
        actor: "WhatsApp Business",
        detail: "Se creó ficha en estado Pendiente desde el grupo Andino | Sofía Herrera.",
      },
      {
        id: "ev-2",
        timestamp: "10/11/2026 09:22:40",
        action: "Validación y carpeta vinculada",
        actor: "Carolina Ríos",
        detail: "Carpeta vinculada y estudiante activado.",
      },
    ],
  },
  {
    id: "est-2",
    name: "Mateo Paredes",
    email: "",
    phone: "+51 972 554 890",
    destination: "Australia — Inglés General",
    whatsappGroup: "Andino | Mateo Paredes",
    driveFolder: "",
    status: "Pendiente",
    createdAt: "14/11/2026 06:40",
    participants: [
      { id: "p-3", name: "Mateo Paredes", phone: "+51 972 554 890", role: "Estudiante" },
      { id: "p-4", name: "Luis Vega", phone: "+51 998 320 110", role: "Personal de Andino" },
    ],
    timeline: [
      {
        id: "ev-3",
        timestamp: "14/11/2026 06:40:05",
        action: "Grupo detectado",
        actor: "WhatsApp Business",
        detail: "Registro inicial en estado Pendiente. Falta confirmar datos y vincular Drive.",
      },
    ],
  },
  {
    id: "est-3",
    name: "Lucía Mendoza",
    email: "lucia.mendoza@outlook.com",
    phone: "+51 961 330 712",
    destination: "Australia — Diploma en Diseño",
    whatsappGroup: "Andino | Lucía Mendoza",
    driveFolder: "Andino Drive / Estudiantes / Lucía Mendoza",
    status: "Inactivo",
    createdAt: "02/08/2026 11:05",
    participants: [
      { id: "p-5", name: "Lucía Mendoza", phone: "+51 961 330 712", role: "Estudiante" },
      { id: "p-6", name: "Carolina Ríos", phone: "+51 999 100 201", role: "Personal de Andino" },
    ],
    timeline: [
      {
        id: "ev-4",
        timestamp: "02/08/2026 11:05:00",
        action: "Estudiante activado",
        actor: "Carolina Ríos",
        detail: "Expediente activo y carpeta vinculada.",
      },
      {
        id: "ev-5",
        timestamp: "15/10/2026 16:30:00",
        action: "Cambio a Inactivo",
        actor: "Carolina Ríos",
        detail: "Estudiante pausó el trámite. Historial conservado.",
      },
    ],
  },
];

export const initialDocuments: DocumentItem[] = [
  {
    id: "doc-1",
    studentId: "est-1",
    studentName: "Sofía Herrera",
    fileName: "pasaporte_sofia_herrera.pdf",
    senderName: "Sofía Herrera",
    senderRole: "Estudiante",
    category: "Pasaporte",
    confidence: 98,
    status: "Almacenado",
    drivePath: "Andino Drive / Estudiantes / Sofía Herrera / Pasaporte / pasaporte_sofia_herrera.pdf",
    validationType: "IA automática",
    receivedAt: "10/11/2026 10:04:18",
    updatedAt: "10/11/2026 10:04:24",
  },
  {
    id: "doc-2",
    studentId: "est-1",
    studentName: "Sofía Herrera",
    fileName: "guia_bienvenida_andino.pdf",
    senderName: "Carolina Ríos",
    senderRole: "Personal de Andino",
    category: "Sin clasificar",
    status: "Excluido de IA",
    validationType: "Excluido",
    receivedAt: "10/11/2026 10:15:00",
    updatedAt: "10/11/2026 10:15:01",
  },
  {
    id: "doc-3",
    studentId: "est-1",
    studentName: "Sofía Herrera",
    fileName: "estado_cuenta_octubre.jpg",
    senderName: "Sofía Herrera",
    senderRole: "Estudiante",
    category: "Extracto bancario",
    confidence: 62,
    status: "Pendiente de revisión",
    receivedAt: "13/11/2026 18:20:11",
    updatedAt: "13/11/2026 18:20:19",
  },
];

export const initialAlerts: AlertItem[] = [
  {
    id: "al-1",
    studentId: "est-2",
    studentName: "Mateo Paredes",
    title: "Estudiante pendiente de validación",
    description: "El grupo Andino | Mateo Paredes fue detectado. Confirma sus datos y vincula su carpeta de Drive.",
    priority: "Media",
    status: "Abierta",
    createdAt: "14/11/2026 06:40:05",
  },
];

export const initialUsers: AppUser[] = [
  { id: "u-1", name: "Carolina Ríos", email: "carolina@andino.edu", role: "Administrador", active: true },
  { id: "u-2", name: "Luis Vega", email: "luis.vega@andino.edu", role: "Encargado", active: true },
  { id: "u-3", name: "Valeria Quispe", email: "valeria.q@andino.edu", role: "Personal", active: true },
];
