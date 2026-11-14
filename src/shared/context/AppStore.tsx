import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  initialAlerts,
  initialDocuments,
  initialStudents,
  initialUsers,
} from "../data/initialData";
import type {
  AlertItem,
  AppUser,
  DocCategory,
  DocumentItem,
  Participant,
  Role,
  Student,
} from "../types/domain";

function nowFormatted() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function guessCategory(fileName: string): { category: DocCategory; confidence: number } {
  const lower = fileName.toLowerCase();
  if (lower.includes("pasaporte")) return { category: "Pasaporte", confidence: 97 };
  if (lower.includes("dni")) return { category: "DNI", confidence: 95 };
  if (lower.includes("certificado") || lower.includes("estudio"))
    return { category: "Certificado de estudios", confidence: 91 };
  if (lower.includes("extracto") || lower.includes("banco") || lower.includes("cuenta"))
    return { category: "Extracto bancario", confidence: 64 };
  if (lower.includes("visa")) return { category: "Visa anterior", confidence: 93 };
  return { category: "Certificado de estudios", confidence: 68 };
}

interface AppStoreValue {
  currentUser: AppUser | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  recoverPassword: (email: string) => { ok: boolean; message: string };
  role: Role;
  setRole: (role: Role) => void;
  students: Student[];
  documents: DocumentItem[];
  alerts: AlertItem[];
  users: AppUser[];
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  selectedDocId: string;
  setSelectedDocId: (id: string) => void;
  toast: { text: string; tone: "ok" | "warn" | "err" } | null;
  clearToast: () => void;
  // Sprint 1
  simulateWhatsAppGroup: (custom?: { name?: string; phone?: string; whatsappGroup?: string }) => void;
  simulateRandomStudent: () => void;
  confirmAndActivateStudent: (
    id: string,
    payload: {
      name: string;
      email: string;
      phone: string;
      destination: string;
      driveFolder: string;
      participants: Participant[];
    },
  ) => { ok: boolean; error?: string };
  // Sprint 2 & 3
  simulateFileUpload: (
    studentId: string,
    senderRole: "Estudiante" | "Personal de Andino",
    fileName?: string,
  ) => void;
  correctDocumentCategory: (docId: string, category: DocCategory) => void;
  // Sprint 4
  deactivateStudent: (id: string) => void;
  reactivateStudent: (id: string) => void;
  resolveInactiveAlert: (alertId: string, authorizeDoc: boolean, reactivateStudent: boolean) => void;
  // Sprint 5
  createUser: (payload: { name: string; email: string; role: Role }) => {
    ok: boolean;
    error?: string;
  };
  toggleUserActive: (userId: string) => void;
  resetAll: () => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

const STORAGE_KEY = "andino_app_state_v1";

function loadStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const saved = loadStoredState();
  const [users, setUsers] = useState<AppUser[]>(saved?.users ?? initialUsers);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(
    saved && "currentUser" in saved ? saved.currentUser : initialUsers[0],
  );
  const [role, setRole] = useState<Role>(saved?.role ?? "Administrador");
  const [students, setStudents] = useState<Student[]>(saved?.students ?? initialStudents);
  const [documents, setDocuments] = useState<DocumentItem[]>(saved?.documents ?? initialDocuments);
  const [alerts, setAlerts] = useState<AlertItem[]>(saved?.alerts ?? initialAlerts);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("est-1");
  const [selectedDocId, setSelectedDocId] = useState<string>("doc-3");
  const [toast, setToast] = useState<{ text: string; tone: "ok" | "warn" | "err" } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ users, currentUser, role, students, documents, alerts }),
      );
    } catch {
      // ignore quota errors
    }
  }, [users, currentUser, role, students, documents, alerts]);

  const notify = (text: string, tone: "ok" | "warn" | "err" = "ok") => {
    setToast({ text, tone });
  };

  const clearToast = () => setToast(null);

  const login: AppStoreValue["login"] = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { ok: false, error: "Correo no registrado en el sistema." };
    }
    if (!found.active) {
      return { ok: false, error: "Tu usuario está suspendido. Contacta al Administrador." };
    }
    if (password.trim().length < 4) {
      return { ok: false, error: "Ingresa una contraseña válida (mínimo 4 caracteres)." };
    }
    setCurrentUser(found);
    setRole(found.role);
    notify(`Bienvenido, ${found.name} (${found.role}).`, "ok");
    return { ok: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const recoverPassword: AppStoreValue["recoverPassword"] = (email) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { ok: false, message: "No encontramos una cuenta con ese correo." };
    }
    return {
      ok: true,
      message: `Se enviaron las instrucciones de recuperación a ${found.email}.`,
    };
  };

  const simulateWhatsAppGroup = (custom?: {
    name?: string;
    phone?: string;
    whatsappGroup?: string;
  }) => {
    const idx = students.length + 1;
    const names = [
      "Diego Salazar",
      "Camila Vargas",
      "Andrés Morales",
      "Valeria Torres",
      "Sebastián Rojas",
      "Paula Mendoza",
      "Gabriel Castro",
      "Fernanda Silva",
    ];
    const name = custom?.name?.trim() || names[(idx - 1) % names.length];
    const phone =
      custom?.phone?.trim() ||
      `+51 9${Math.floor(10000000 + Math.random() * 89999999)}`.replace(
        /(\+51 \d{3})(\d{3})(\d{3})/,
        "$1 $2 $3",
      );
    const whatsappGroup = custom?.whatsappGroup?.trim() || `Andino | ${name}`;
    const ts = nowFormatted();
    const newStudent: Student = {
      id: `est-${Date.now()}`,
      name,
      email: "",
      phone,
      destination: "Australia — Por definir",
      whatsappGroup,
      driveFolder: "",
      status: "Pendiente",
      createdAt: ts,
      participants: [
        { id: `p-${Date.now()}-1`, name, phone, role: "Estudiante" },
        { id: `p-${Date.now()}-2`, name: "Luis Vega", phone: "+51 998 320 110", role: "Personal de Andino" },
      ],
      timeline: [
        {
          id: `ev-${Date.now()}`,
          timestamp: ts,
          action: "Grupo detectado",
          actor: "WhatsApp Business",
          detail: `Ficha creada en estado Pendiente desde grupo Andino | ${name}.`,
        },
      ],
    };
    setStudents((prev) => [newStudent, ...prev]);
    setSelectedStudentId(newStudent.id);
    setAlerts((prev) => [
      {
        id: `al-${Date.now()}`,
        studentId: newStudent.id,
        studentName: name,
        title: "Nuevo estudiante pendiente",
        description: `Se detectó el grupo Andino | ${name}. Valida sus datos y vincula su carpeta de Drive.`,
        priority: "Media",
        status: "Abierta",
        createdAt: ts,
      },
      ...prev,
    ]);
    notify(`Grupo detectado: ${name} registrado como Pendiente.`, "ok");
  };

  const simulateRandomStudent = () => {
    const statuses: Student["status"][] = ["Pendiente", "Activo", "Inactivo"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const names = [
      "Renata Paredes",
      "Joaquín Navarro",
      "Mariana Quispe",
      "Tomás Herrera",
      "Alejandra Díaz",
      "Nicolás Vega",
    ];
    const name = names[Math.floor(Math.random() * names.length)];
    const phone = `+51 9${Math.floor(10000000 + Math.random() * 89999999)}`.replace(
      /(\+51 \d{3})(\d{3})(\d{3})/,
      "$1 $2 $3",
    );
    const ts = nowFormatted();
    const id = `est-${Date.now()}`;
    const hasDrive = status !== "Pendiente";
    const driveFolder = hasDrive ? `Andino Drive / Estudiantes / ${name}` : "";
    const email = hasDrive ? `${name.toLowerCase().replace(/\s+/g, ".")}@gmail.com` : "";

    const newStudent: Student = {
      id,
      name,
      email,
      phone,
      destination: hasDrive ? "Australia — Maestría en Educación" : "Australia — Por definir",
      whatsappGroup: `Andino | ${name}`,
      driveFolder,
      status,
      createdAt: ts,
      participants: [
        { id: `p-${Date.now()}-1`, name, phone, role: "Estudiante" },
        { id: `p-${Date.now()}-2`, name: "Luis Vega", phone: "+51 998 320 110", role: "Personal de Andino" },
      ],
      timeline: [
        {
          id: `ev-${Date.now()}`,
          timestamp: ts,
          action: status === "Pendiente" ? "Grupo detectado" : `Estudiante ${status}`,
          actor: status === "Pendiente" ? "WhatsApp Business" : role,
          detail:
            status === "Pendiente"
              ? `Ficha creada en estado Pendiente. Falta validar datos y vincular Drive.`
              : `Estudiante registrado en estado ${status} con carpeta Drive vinculada.`,
        },
      ],
    };

    setStudents((prev) => [newStudent, ...prev]);
    setSelectedStudentId(id);

    if (status === "Pendiente") {
      setAlerts((prev) => [
        {
          id: `al-${Date.now()}`,
          studentId: id,
          studentName: name,
          title: "Nuevo estudiante pendiente",
          description: `Se detectó el grupo Andino | ${name}. Valida sus datos y vincula su carpeta de Drive.`,
          priority: "Media",
          status: "Abierta",
          createdAt: ts,
        },
        ...prev,
      ]);
    }
    notify(`Estudiante agregado: ${name} (${status}).`, "ok");
  };

  const confirmAndActivateStudent: AppStoreValue["confirmAndActivateStudent"] = (id, payload) => {
    if (role === "Personal") {
      notify("Tu rol Personal no tiene permiso para activar estudiantes.", "err");
      return { ok: false, error: "Sin permisos suficientes." };
    }
    const cleanPhone = payload.phone.trim();
    const cleanEmail = payload.email.trim().toLowerCase();
    const duplicate = students.find(
      (s) =>
        s.id !== id &&
        s.status === "Activo" &&
        ((cleanPhone && s.phone.trim() === cleanPhone) ||
          (cleanEmail && s.email.trim().toLowerCase() === cleanEmail)),
    );
    if (duplicate) {
      const msg = `Registro duplicado: ya existe un estudiante activo (${duplicate.name}) con ese teléfono o correo.`;
      notify(msg, "err");
      return { ok: false, error: msg };
    }
    if (!payload.driveFolder.trim()) {
      const msg = "Debes vincular una carpeta de Google Drive antes de activar al estudiante.";
      notify(msg, "warn");
      return { ok: false, error: msg };
    }

    const ts = nowFormatted();
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              ...payload,
              status: "Activo",
              timeline: [
                ...s.timeline,
                {
                  id: `ev-${Date.now()}`,
                  timestamp: ts,
                  action: "Estudiante activado",
                  actor: role,
                  detail: `Datos confirmados y carpeta vinculada: ${payload.driveFolder}`,
                },
              ],
            }
          : s,
      ),
    );
    setAlerts((prev) =>
      prev.map((a) => (a.studentId === id && a.status === "Abierta" ? { ...a, status: "Resuelta" } : a)),
    );
    notify(`${payload.name} validado y activado correctamente.`, "ok");
    return { ok: true };
  };

  const simulateFileUpload: AppStoreValue["simulateFileUpload"] = (
    studentId,
    senderRole,
    customFileName,
  ) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
    const ts = nowFormatted();
    const sampleFiles =
      senderRole === "Personal de Andino"
        ? ["folleto_australiano_2026.pdf", "guia_visa_interna.pdf"]
        : ["dni_escaneado.pdf", "certificado_estudios_2025.pdf", "extracto_bancario_nov.jpg", "visa_anterior.pdf"];
    const fileName = customFileName || sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
    const docId = `doc-${Date.now()}`;

    // Regla 1: Personal -> Excluido de IA
    if (senderRole === "Personal de Andino") {
      const doc: DocumentItem = {
        id: docId,
        studentId: student.id,
        studentName: student.name,
        fileName,
        senderName: "Asesor Andino",
        senderRole,
        category: "Sin clasificar",
        status: "Excluido de IA",
        validationType: "Excluido",
        receivedAt: ts,
        updatedAt: ts,
      };
      setDocuments((prev) => [doc, ...prev]);
      setStudents((prev) =>
        prev.map((s) =>
          s.id === student.id
            ? {
                ...s,
                timeline: [
                  ...s.timeline,
                  {
                    id: `ev-${Date.now()}`,
                    timestamp: ts,
                    action: "Archivo excluido de IA",
                    actor: "Filtro de remitente",
                    detail: `${fileName} enviado por Personal de Andino. No se procesa ni sube a Drive.`,
                  },
                ],
              }
            : s,
        ),
      );
      notify(`${fileName} marcado como Excluido de IA (enviado por Personal).`, "warn");
      return;
    }

    // Regla 2: Estudiante Inactivo -> Retención preventiva + Alerta alta
    if (student.status === "Inactivo") {
      const guessed = guessCategory(fileName);
      const doc: DocumentItem = {
        id: docId,
        studentId: student.id,
        studentName: student.name,
        fileName,
        senderName: student.name,
        senderRole: "Estudiante",
        category: guessed.category,
        confidence: guessed.confidence,
        status: "Pendiente de revisión",
        receivedAt: ts,
        updatedAt: ts,
      };
      setDocuments((prev) => [doc, ...prev]);
      setAlerts((prev) => [
        {
          id: `al-${Date.now()}`,
          studentId: student.id,
          studentName: student.name,
          documentId: docId,
          title: `Documento retenido de estudiante Inactivo (${student.name})`,
          description: `Se recibió ${fileName}. El guardado automático en Drive está bloqueado hasta autorización.`,
          priority: "Alta",
          status: "Abierta",
          createdAt: ts,
        },
        ...prev,
      ]);
      setStudents((prev) =>
        prev.map((s) =>
          s.id === student.id
            ? {
                ...s,
                timeline: [
                  ...s.timeline,
                  {
                    id: `ev-${Date.now()}`,
                    timestamp: ts,
                    action: "Documento retenido (Inactivo)",
                    actor: "Regla de retención",
                    detail: `${fileName} retenido en Pendiente de revisión. Alerta generada.`,
                  },
                ],
              }
            : s,
        ),
      );
      notify(`Alerta: ${student.name} está Inactivo. Documento retenido en revisión.`, "warn");
      return;
    }

    // Regla 3: Estudiante Pendiente o sin carpeta Drive -> Bloqueo de almacenamiento
    if (student.status === "Pendiente" || !student.driveFolder.trim()) {
      const guessed = guessCategory(fileName);
      const doc: DocumentItem = {
        id: docId,
        studentId: student.id,
        studentName: student.name,
        fileName,
        senderName: student.name,
        senderRole: "Estudiante",
        category: guessed.category,
        confidence: guessed.confidence,
        status: "Bloqueado (sin carpeta)",
        receivedAt: ts,
        updatedAt: ts,
      };
      setDocuments((prev) => [doc, ...prev]);
      notify(`Bloqueado: ${student.name} está Pendiente o no tiene carpeta Drive vinculada.`, "err");
      return;
    }

    // Estudiante Activo con carpeta -> IA clasifica
    const guessed = guessCategory(fileName);
    const highConfidence = guessed.confidence >= 80;
    const doc: DocumentItem = {
      id: docId,
      studentId: student.id,
      studentName: student.name,
      fileName,
      senderName: student.name,
      senderRole: "Estudiante",
      category: guessed.category,
      confidence: guessed.confidence,
      status: highConfidence ? "Almacenado" : "Pendiente de revisión",
      drivePath: highConfidence
        ? `${student.driveFolder} / ${guessed.category} / ${fileName}`
        : undefined,
      validationType: highConfidence ? "IA automática" : undefined,
      receivedAt: ts,
      updatedAt: ts,
    };
    setDocuments((prev) => [doc, ...prev]);
    setStudents((prev) =>
      prev.map((s) =>
        s.id === student.id
          ? {
              ...s,
              timeline: [
                ...s.timeline,
                {
                  id: `ev-${Date.now()}`,
                  timestamp: ts,
                  action: highConfidence ? "Almacenado en Drive" : "Pendiente de revisión",
                  actor: "Clasificador IA",
                  detail: highConfidence
                    ? `${fileName} clasificado como ${guessed.category} (${guessed.confidence}%) y guardado en Drive.`
                    : `${fileName} clasificado con baja confianza (${guessed.confidence}%). Requiere revisión.`,
                },
              ],
            }
          : s,
      ),
    );
    notify(
      highConfidence
        ? `${fileName} clasificado (${guessed.category}) y almacenado en Drive.`
        : `${fileName} requiere revisión humana (${guessed.confidence}% confianza).`,
      highConfidence ? "ok" : "warn",
    );
  };

  const correctDocumentCategory = (docId: string, category: DocCategory) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;
    const student = students.find((s) => s.id === doc.studentId);
    const ts = nowFormatted();

    if (!student || student.status !== "Activo" || !student.driveFolder.trim()) {
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === docId
            ? { ...d, category, validationType: "Validación humana", updatedAt: ts }
            : d,
        ),
      );
      notify("Categoría corregida. El guardado en Drive sigue bloqueado porque el estudiante no está Activo.", "warn");
      return;
    }

    const drivePath = `${student.driveFolder} / ${category} / ${doc.fileName}`;
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === docId
          ? {
              ...d,
              category,
              status: "Almacenado",
              drivePath,
              validationType: "Validación humana",
              updatedAt: ts,
            }
          : d,
      ),
    );
    setStudents((prev) =>
      prev.map((s) =>
        s.id === student.id
          ? {
              ...s,
              timeline: [
                ...s.timeline,
                {
                  id: `ev-${Date.now()}`,
                  timestamp: ts,
                  action: "Validación humana",
                  actor: role,
                  detail: `${doc.fileName} confirmado como ${category} y almacenado en Drive.`,
                },
              ],
            }
          : s,
      ),
    );
    notify(`${doc.fileName} validado como ${category} y almacenado en Drive.`, "ok");
  };

  const deactivateStudent = (id: string) => {
    if (role === "Personal") {
      notify("El rol Personal no puede desactivar estudiantes.", "err");
      return;
    }
    const ts = nowFormatted();
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "Inactivo",
              timeline: [
                ...s.timeline,
                {
                  id: `ev-${Date.now()}`,
                  timestamp: ts,
                  action: "Cambio a Inactivo",
                  actor: role,
                  detail: "Estudiante desactivado. Documentación e historial conservados.",
                },
              ],
            }
          : s,
      ),
    );
    notify("Estudiante pasado a Inactivo sin pérdida de historial.", "ok");
  };

  const reactivateStudent = (id: string) => {
    if (role === "Personal") {
      notify("El rol Personal no puede reactivar estudiantes.", "err");
      return;
    }
    const ts = nowFormatted();
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "Activo",
              timeline: [
                ...s.timeline,
                {
                  id: `ev-${Date.now()}`,
                  timestamp: ts,
                  action: "Estudiante reactivado",
                  actor: role,
                  detail: "Expediente reactivado desde la ficha del estudiante.",
                },
              ],
            }
          : s,
      ),
    );
    notify("Estudiante reactivado correctamente.", "ok");
  };

  const resolveInactiveAlert = (
    alertId: string,
    authorizeDoc: boolean,
    reactivateStudent: boolean,
  ) => {
    if (role === "Personal") {
      notify("El rol Personal no puede autorizar documentos de estudiantes inactivos.", "err");
      return;
    }
    const alert = alerts.find((a) => a.id === alertId);
    if (!alert) return;
    const ts = nowFormatted();

    if (reactivateStudent) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === alert.studentId
            ? {
                ...s,
                status: "Activo",
                timeline: [
                  ...s.timeline,
                  {
                    id: `ev-${Date.now()}`,
                    timestamp: ts,
                    action: "Estudiante reactivado",
                    actor: role,
                    detail: "Expediente reactivado desde módulo de Alertas.",
                  },
                ],
              }
            : s,
        ),
      );
    }

    if (authorizeDoc && alert.documentId) {
      const student = students.find((s) => s.id === alert.studentId);
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === alert.documentId
            ? {
                ...d,
                status: "Almacenado",
                validationType: "Validación humana",
                drivePath: `${student?.driveFolder || "Andino Drive"} / ${d.category} / ${d.fileName}`,
                updatedAt: ts,
              }
            : d,
        ),
      );
    }

    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, status: "Resuelta" } : a)));
    notify("Alerta resuelta correctamente.", "ok");
  };

  const createUser: AppStoreValue["createUser"] = (payload) => {
    if (role !== "Administrador") {
      return { ok: false, error: "Solo el Administrador puede crear cuentas." };
    }
    const cleanName = payload.name.trim();
    const cleanEmail = payload.email.trim().toLowerCase();
    if (!cleanName || !cleanEmail.includes("@")) {
      return { ok: false, error: "Ingresa un nombre y un correo electrónico válido." };
    }
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { ok: false, error: "Ya existe una cuenta registrada con ese correo." };
    }
    const newUser: AppUser = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      role: payload.role,
      active: true,
    };
    setUsers((prev) => [...prev, newUser]);
    notify(`Cuenta creada para ${cleanName} (${payload.role}).`, "ok");
    return { ok: true };
  };

  const toggleUserActive = (userId: string) => {
    if (role !== "Administrador") {
      notify("Solo el Administrador puede gestionar usuarios.", "err");
      return;
    }
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, active: !u.active } : u)));
    notify("Estado de usuario actualizado.", "ok");
  };

  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStudents(initialStudents);
    setDocuments(initialDocuments);
    setAlerts(initialAlerts);
    setUsers(initialUsers);
    setSelectedStudentId("est-1");
    setSelectedDocId("doc-3");
    notify("Datos restablecidos al estado inicial.", "ok");
  };

  return (
    <AppStoreContext.Provider
      value={{
        currentUser,
        login,
        logout,
        recoverPassword,
        role,
        setRole,
        students,
        documents,
        alerts,
        users,
        selectedStudentId,
        setSelectedStudentId,
        selectedDocId,
        setSelectedDocId,
        toast,
        clearToast,
        simulateWhatsAppGroup,
        simulateRandomStudent,
        confirmAndActivateStudent,
        simulateFileUpload,
        correctDocumentCategory,
        deactivateStudent,
        reactivateStudent,
        resolveInactiveAlert,
        createUser,
        toggleUserActive,
        resetAll,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used inside AppStoreProvider");
  return ctx;
}
