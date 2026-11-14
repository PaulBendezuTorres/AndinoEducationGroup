import { useState, type ReactNode } from "react";
import { SprintBar } from "./features/sprintBar/SprintBar";
import {
  Badge,
  Brand,
  Button,
  Card,
  ConfirmDialog,
  Field,
  Icon,
  InfoBanner,
  PageHead,
  icons,
} from "./shared/components/UI";
import { AppStoreProvider, useAppStore } from "./shared/context/AppStore";
import { useAppRouter } from "./shared/router/useAppRouter";
import type { DocCategory, Page, Role, StudentStatus } from "./shared/types/domain";

const navItems: { page: Page; label: string; icon: keyof typeof icons }[] = [
  { page: "home", label: "Inicio", icon: "home" },
  { page: "students", label: "Estudiantes", icon: "students" },
  { page: "documents", label: "Documentos", icon: "files" },
  { page: "alerts", label: "Alertas", icon: "bell" },
  { page: "integrations", label: "Integraciones", icon: "plug" },
  { page: "users", label: "Usuarios", icon: "shield" },
];

function statusTone(status: StudentStatus): "green" | "amber" | "gray" {
  if (status === "Activo") return "green";
  if (status === "Pendiente") return "amber";
  return "gray";
}

function Sidebar({ page, go }: { page: Page; go: (page: Page) => void }) {
  const { role, alerts, currentUser } = useAppStore();
  const openAlerts = alerts.filter((a) => a.status === "Abierta").length;
  const active =
    page === "validation" || page === "student"
      ? "students"
      : page === "review"
        ? "documents"
        : page;

  const visibleNav = navItems.filter((item) => {
    if (role !== "Administrador" && (item.page === "integrations" || item.page === "users")) {
      return false;
    }
    return true;
  });

  return (
    <aside className="sidebar">
      <Brand />
      <div className="side-label">GESTIÓN DOCUMENTAL</div>
      <nav>
        {visibleNav.map((item, index) => (
          <button
            type="button"
            key={`${item.label}-${index}`}
            className={active === item.page ? "active" : ""}
            onClick={() => go(item.page)}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
            {item.label === "Alertas" && openAlerts > 0 && (
              <Badge tone="amber">{openAlerts}</Badge>
            )}
          </button>
        ))}
      </nav>
      <div className="side-bottom">
        <div className="account">
          <span>{(currentUser?.name ?? role).slice(0, 2).toUpperCase()}</span>
          <div>
            <strong>{currentUser?.name ?? "Usuario"}</strong>
            <small>{role}</small>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Shell({
  page,
  go,
  breadcrumb,
  children,
}: {
  page: Page;
  go: (page: Page) => void;
  breadcrumb: string;
  children: ReactNode;
}) {
  const { toast, clearToast, alerts, logout, currentUser, role } = useAppStore();
  const [openMenu, setOpenMenu] = useState<"none" | "notif" | "user">("none");
  const openAlerts = alerts.filter((a) => a.status === "Abierta");
  const firstName = (currentUser?.name ?? "Usuario").split(" ")[0];
  const initials = (currentUser?.name ?? role)
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div className="app-shell">
      <Sidebar page={page} go={go} />
      <div className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Andino Education Group</span>
            <Icon name="chevron" size={14} />
            <strong>{breadcrumb}</strong>
          </div>
          <div className="topbar-actions">
            <div className="menu-anchor">
              <button
                type="button"
                className="icon-btn"
                onClick={() => setOpenMenu(openMenu === "notif" ? "none" : "notif")}
                aria-label="Notificaciones"
              >
                <Icon name="bell" />
                {openAlerts.length > 0 && <span className="notif-dot" />}
              </button>
              {openMenu === "notif" && (
                <div className="dropdown-panel">
                  <div className="dropdown-head">
                    <span>Notificaciones</span>
                    <Badge tone={openAlerts.length > 0 ? "amber" : "green"}>
                      {openAlerts.length}
                    </Badge>
                  </div>
                  {openAlerts.length === 0 ? (
                    <p className="sub">No tienes notificaciones pendientes.</p>
                  ) : (
                    <div className="stack">
                      {openAlerts.slice(0, 3).map((a) => (
                        <button
                          type="button"
                          key={a.id}
                          className="dropdown-item"
                          onClick={() => {
                            setOpenMenu("none");
                            go("alerts");
                          }}
                        >
                          <div>
                            <strong>{a.title}</strong>
                            <div className="sub">{a.studentName}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    className="dropdown-item"
                    style={{ marginTop: 8, borderTop: "1px solid #f1f5f9", paddingTop: 10 }}
                    onClick={() => {
                      setOpenMenu("none");
                      go("alerts");
                    }}
                  >
                    <strong>Ver todas las alertas</strong>
                    <Icon name="chevron" size={14} />
                  </button>
                </div>
              )}
            </div>

            <span className="topbar-divider" />

            <div className="menu-anchor">
              <button
                type="button"
                className="user-trigger"
                onClick={() => setOpenMenu(openMenu === "user" ? "none" : "user")}
              >
                <div className="user-trigger-text">
                  <strong>Hola, {firstName}</strong>
                  <small>{role}</small>
                </div>
                <span className="avatar-circle">{initials}</span>
                <Icon name="down" size={14} />
              </button>
              {openMenu === "user" && (
                <div className="dropdown-panel narrow">
                  <div className="dropdown-head">
                    <div>
                      <div>{currentUser?.name}</div>
                      <small className="sub">{currentUser?.email}</small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      setOpenMenu("none");
                    }}
                  >
                    Configuración de usuario
                  </button>
                  <button
                    type="button"
                    className="dropdown-item danger"
                    onClick={() => {
                      setOpenMenu("none");
                      logout();
                      go("login");
                    }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <SprintBar page={page} go={go} />
        <main className="page-body">{children}</main>
      </div>
      {toast && (
        <div className={`toast ${toast.tone}`}>
          <span>{toast.text}</span>
          <button type="button" onClick={clearToast}>
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}

function Login({ go }: { go: (p: Page) => void }) {
  const { login, recoverPassword } = useAppStore();
  const [mode, setMode] = useState<"login" | "recover">("login");
  const [email, setEmail] = useState("carolina@andino.edu");
  const [password, setPassword] = useState("andino2026");
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean } | null>(null);

  return (
    <div className="login">
      <section className="login-story">
        <Brand large />
        <div className="login-copy">
          <h1>Gestión documental automatizada para asesoría académica</h1>
          <p>
            Centraliza los expedientes de WhatsApp Business, clasifica documentos con IA y resguarda
            cada archivo en Google Drive con trazabilidad completa.
          </p>

          <div className="feature-list">
            <div className="feature">
              <span>
                <Icon name="message" size={18} />
              </span>
              <div>
                <strong>Recepción desde WhatsApp Business</strong>
                <small>Detección automática de grupos y archivos de estudiantes.</small>
              </div>
            </div>
            <div className="feature">
              <span>
                <Icon name="sparkles" size={18} />
              </span>
              <div>
                <strong>Clasificación inteligente con IA</strong>
                <small>Organización documental con validación humana y trazabilidad.</small>
              </div>
            </div>
            <div className="feature">
              <span>
                <Icon name="folderCheck" size={18} />
              </span>
              <div>
                <strong>Resguardo en Google Drive</strong>
                <small>Almacenamiento seguro con control de estados y alertas.</small>
              </div>
            </div>
          </div>
        </div>
        <p className="legal">Andino Education Group · Plataforma interna de gestión documental.</p>
      </section>

      <section className="login-access">
        <div className="login-card">
          {mode === "login" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const res = login(email, password);
                if (res.ok) {
                  setFeedback(null);
                  go("home");
                } else {
                  setFeedback({ text: res.error ?? "Error al iniciar sesión.", ok: false });
                }
              }}
            >
              <div>
                <h2>Iniciar sesión</h2>
                <p className="login-sub">Accede a la gestión documental de Andino.</p>
              </div>

              <label>
                Correo electrónico
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFeedback(null);
                  }}
                  placeholder="nombre@andino.edu"
                  required
                />
              </label>

              <label>
                Contraseña
                <div className="password-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFeedback(null);
                    }}
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </label>

              <div className="login-options">
                <span className="sub">Sesión corporativa</span>
                <button
                  type="button"
                  onClick={() => {
                    setFeedback(null);
                    setMode("recover");
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {feedback && (
                <div className={`login-feedback ${feedback.ok ? "ok" : "err"}`}>
                  {feedback.text}
                </div>
              )}

              <Button primary type="submit">
                Ingresar al panel
              </Button>

              <div className="security">
                <Icon name="lock" size={14} />
                <span>Acceso exclusivo para cuentas autorizadas por el Administrador.</span>
              </div>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const res = recoverPassword(email);
                setFeedback({ text: res.message, ok: res.ok });
              }}
            >
              <div>
                <h2>Recuperar contraseña</h2>
                <p className="login-sub">Ingresa tu correo corporativo para restablecer tu acceso.</p>
              </div>

              <label>
                Correo electrónico
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFeedback(null);
                  }}
                  placeholder="nombre@andino.edu"
                  required
                />
              </label>

              {feedback && (
                <div className={`login-feedback ${feedback.ok ? "ok" : "err"}`}>
                  {feedback.text}
                </div>
              )}

              <Button primary type="submit">
                Enviar instrucciones
              </Button>

              <div className="login-options">
                <button
                  type="button"
                  onClick={() => {
                    setFeedback(null);
                    setMode("login");
                  }}
                >
                  ← Volver a iniciar sesión
                </button>
              </div>

              <div className="security">
                <Icon name="lock" size={14} />
                <span>Acceso exclusivo para cuentas autorizadas por el Administrador.</span>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

function Home({ go }: { go: (p: Page) => void }) {
  const { role, students, documents, alerts, setSelectedStudentId, setSelectedDocId } =
    useAppStore();
  const pendingDocs = documents.filter((d) => d.status === "Pendiente de revisión");
  const storedDocs = documents.filter((d) => d.status === "Almacenado");
  const openAlerts = alerts.filter((a) => a.status === "Abierta");

  return (
    <>
      <PageHead
        title="Panel de control"
        subtitle="Resumen operativo de estudiantes, documentos y alertas activas."
        action={
          <Button primary onClick={() => go("students")}>
            Ver estudiantes
          </Button>
        }
      />
      <div className="metrics-grid">
        <Card className="metric">
          <small>Total estudiantes</small>
          <strong>{students.length}</strong>
          <span>{students.filter((s) => s.status === "Activo").length} activos</span>
        </Card>
        <Card className="metric">
          <small>Documentos almacenados</small>
          <strong>{storedDocs.length}</strong>
          <span>En Google Drive</span>
        </Card>
        <Card className="metric">
          <small>Pendientes de revisión</small>
          <strong>{pendingDocs.length}</strong>
          <span>Requieren validación</span>
        </Card>
        <Card className="metric">
          <small>Alertas abiertas</small>
          <strong>{openAlerts.length}</strong>
          <span>Prioridad operativa</span>
        </Card>
      </div>

      <div className="home-grid">
        <Card>
          <div className="card-head">
            <h3>Estudiantes recientes</h3>
            <Button onClick={() => go("students")}>Ver todos</Button>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Estado</th>
                  <th>Carpeta Drive</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {students.slice(0, 5).map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.name}</strong>
                      <div className="sub">{s.phone}</div>
                    </td>
                    <td>
                      <Badge tone={statusTone(s.status)}>{s.status}</Badge>
                    </td>
                    <td>{s.driveFolder || "Sin vincular"}</td>
                    <td>
                      {s.status === "Pendiente" && role === "Personal" ? (
                        <Badge tone="amber">Requiere Encargado</Badge>
                      ) : (
                        <Button
                          onClick={() => {
                            setSelectedStudentId(s.id);
                            go(s.status === "Pendiente" ? "validation" : "student");
                          }}
                        >
                          {s.status === "Pendiente" ? "Validar" : "Ver ficha"}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <div className="card-head">
            <h3>Documentos por revisar</h3>
            <Button onClick={() => go("documents")}>Ir a documentos</Button>
          </div>
          {pendingDocs.length === 0 ? (
            <p className="sub">No hay documentos pendientes de revisión.</p>
          ) : (
            <div className="stack">
              {pendingDocs.map((d) => (
                <div key={d.id} className="row-item">
                  <div>
                    <strong>{d.fileName}</strong>
                    <div className="sub">
                      {d.studentName} · {d.category}
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedDocId(d.id);
                      go("review");
                    }}
                  >
                    Revisar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function Students({ go }: { go: (p: Page) => void }) {
  const { role, students, setSelectedStudentId, simulateWhatsAppGroup } = useAppStore();
  const [filter, setFilter] = useState<"Todos" | StudentStatus>("Todos");
  const [query, setQuery] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newGroup, setNewGroup] = useState("");

  const filtered = students.filter((s) => {
    const matchesStatus = filter === "Todos" || s.status === filter;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  return (
    <>
      <PageHead
        title="Estudiantes"
        subtitle="Listado de expedientes detectados desde WhatsApp Business."
        action={
          role !== "Personal" ? (
            <Button primary onClick={() => setShowNewForm((v) => !v)}>
              {showNewForm ? "Cancelar" : "+ Registrar estudiante"}
            </Button>
          ) : undefined
        }
      />
      {showNewForm && role !== "Personal" && (
        <Card className="mb-4">
          <div className="card-head">
            <h3>Registrar nuevo estudiante</h3>
          </div>
          <div className="two-col">
            <Field
              label="Nombre del estudiante"
              value={newName}
              onChange={setNewName}
              placeholder="Ej. Rodrigo Chávez (opcional: autogenerar)"
            />
            <Field
              label="Teléfono WhatsApp"
              value={newPhone}
              onChange={setNewPhone}
              placeholder="Ej. +51 988 123 456 (opcional)"
            />
            <Field
              label="Grupo de WhatsApp (origen)"
              value={newGroup}
              onChange={setNewGroup}
              placeholder="Ej. Andino | Rodrigo Chávez"
            />
          </div>
          <div className="head-action" style={{ marginTop: 12 }}>
            <Button
              primary
              onClick={() => {
                simulateWhatsAppGroup({ name: newName, phone: newPhone, whatsappGroup: newGroup });
                setNewName("");
                setNewPhone("");
                setNewGroup("");
                setShowNewForm(false);
                go("validation");
              }}
            >
              Crear y validar ahora
            </Button>
            <Button
              onClick={() => {
                simulateWhatsAppGroup({ name: newName, phone: newPhone, whatsappGroup: newGroup });
                setNewName("");
                setNewPhone("");
                setNewGroup("");
                setShowNewForm(false);
              }}
            >
              Solo agregar a Pendientes
            </Button>
          </div>
        </Card>
      )}
      <Card>
        <div className="toolbar">
          <div className="tabs">
            {(["Todos", "Pendiente", "Activo", "Inactivo"] as const).map((tab) => (
              <button
                type="button"
                key={tab}
                className={filter === tab ? "active" : ""}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <input
            className="search-input"
            placeholder="Buscar por nombre, teléfono o correo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Grupo WhatsApp</th>
                <th>Destino / Programa</th>
                <th>Carpeta Drive</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <strong>{s.name}</strong>
                    <div className="sub">{s.phone}</div>
                  </td>
                  <td>{s.whatsappGroup}</td>
                  <td>{s.destination}</td>
                  <td>{s.driveFolder || "Sin vincular"}</td>
                  <td>
                    <Badge tone={statusTone(s.status)}>{s.status}</Badge>
                  </td>
                  <td>
                    {s.status === "Pendiente" && role === "Personal" ? (
                      <Badge tone="amber">Requiere Encargado</Badge>
                    ) : (
                      <Button
                        onClick={() => {
                          setSelectedStudentId(s.id);
                          go(s.status === "Pendiente" ? "validation" : "student");
                        }}
                      >
                        {s.status === "Pendiente" ? "Validar" : "Abrir ficha"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function Validation({ go }: { go: (p: Page) => void }) {
  const { students, selectedStudentId, confirmAndActivateStudent } = useAppStore();
  const student = students.find((s) => s.id === selectedStudentId) ?? students[0];
  if (!student) return null;
  return <ValidationForm key={student.id} student={student} go={go} confirm={confirmAndActivateStudent} />;
}

function ValidationForm({
  student,
  go,
  confirm,
}: {
  student: ReturnType<typeof useAppStore>["students"][number];
  go: (p: Page) => void;
  confirm: ReturnType<typeof useAppStore>["confirmAndActivateStudent"];
}) {
  const [name, setName] = useState(student.name);
  const [email, setEmail] = useState(student.email);
  const [phone, setPhone] = useState(student.phone);
  const [destination, setDestination] = useState(student.destination);
  const [driveFolder, setDriveFolder] = useState(student.driveFolder);
  const [participants, setParticipants] = useState(student.participants);

  return (
    <>
      <PageHead
        title={`Validar: ${student.name}`}
        subtitle="Confirma los datos del estudiante, etiqueta participantes y vincula su carpeta de Drive."
        back="Volver a Estudiantes"
        onBack={() => go("students")}
      />
      <InfoBanner>
        Mientras el estudiante esté en estado Pendiente o sin carpeta de Drive vinculada, ningún
        documento se almacenará automáticamente.
      </InfoBanner>
      <div className="two-col">
        <Card>
          <h3>Datos del estudiante</h3>
          <div className="form-grid">
            <Field label="Nombre completo" value={name} onChange={setName} />
            <Field
              label="Correo electrónico"
              value={email}
              onChange={setEmail}
              placeholder="correo@ejemplo.com"
            />
            <Field label="Teléfono" value={phone} onChange={setPhone} />
            <Field label="Destino / Programa" value={destination} onChange={setDestination} />
            <Field
              label="Carpeta de Google Drive"
              value={driveFolder}
              onChange={setDriveFolder}
              placeholder={`Andino Drive / Estudiantes / ${name}`}
            />
          </div>
          <div className="sticky-actions">
            <Button
              onClick={() => setDriveFolder(`Andino Drive / Estudiantes / ${name}`)}
            >
              Sugerir carpeta Drive
            </Button>
            <Button
              primary
              onClick={() => {
                const res = confirm(student.id, {
                  name,
                  email,
                  phone,
                  destination,
                  driveFolder,
                  participants,
                });
                if (res.ok) go("student");
              }}
            >
              Confirmar y activar
            </Button>
          </div>
        </Card>

        <Card>
          <h3>Participantes del grupo ({student.whatsappGroup})</h3>
          <div className="stack">
            {participants.map((p) => (
              <div key={p.id} className="row-item">
                <div>
                  <strong>{p.name}</strong>
                  <div className="sub">{p.phone}</div>
                </div>
                <select
                  className="select-input"
                  value={p.role}
                  onChange={(e) =>
                    setParticipants((prev) =>
                      prev.map((item) =>
                        item.id === p.id
                          ? { ...item, role: e.target.value as "Estudiante" | "Personal de Andino" }
                          : item,
                      ),
                    )
                  }
                >
                  <option value="Estudiante">Estudiante</option>
                  <option value="Personal de Andino">Personal de Andino</option>
                </select>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function StudentDetail({ go }: { go: (p: Page) => void }) {
  const {
    role,
    students,
    documents,
    selectedStudentId,
    deactivateStudent,
    reactivateStudent,
    simulateFileUpload,
    setSelectedDocId,
  } = useAppStore();
  const [pendingAction, setPendingAction] = useState<"deactivate" | "reactivate" | null>(null);
  const student = students.find((s) => s.id === selectedStudentId) ?? students[0];
  if (!student) return null;

  const studentDocs = documents.filter((d) => d.studentId === student.id);
  const storedCount = studentDocs.filter((d) => d.status === "Almacenado").length;
  const pendingCount = studentDocs.filter((d) => d.status === "Pendiente de revisión").length;

  return (
    <>
      <PageHead
        title={student.name}
        subtitle={`${student.destination} · ${student.phone}`}
        back="Volver a Estudiantes"
        onBack={() => go("students")}
        action={
          <div className="head-action">
            <Button onClick={() => simulateFileUpload(student.id, "Estudiante")}>
              + Recibir archivo
            </Button>
            {role !== "Personal" && student.status === "Activo" && (
              <Button danger onClick={() => setPendingAction("deactivate")}>
                Pasar a Inactivo
              </Button>
            )}
            {role !== "Personal" && student.status === "Inactivo" && (
              <Button primary onClick={() => setPendingAction("reactivate")}>
                Reactivar estudiante
              </Button>
            )}
          </div>
        }
      />

      <ConfirmDialog
        open={pendingAction !== null}
        danger={pendingAction === "deactivate"}
        title={
          pendingAction === "deactivate"
            ? `¿Pasar a ${student.name} a Inactivo?`
            : `¿Reactivar a ${student.name}?`
        }
        description={
          pendingAction === "deactivate"
            ? "Los nuevos documentos recibidos quedarán retenidos en revisión y generarán una alerta prioritaria hasta ser autorizados."
            : "El estudiante volverá a estado Activo y sus próximos documentos se clasificarán y guardarán automáticamente en Google Drive."
        }
        confirmLabel={pendingAction === "deactivate" ? "Sí, pasar a Inactivo" : "Sí, reactivar"}
        onCancel={() => setPendingAction(null)}
        onConfirm={() => {
          if (pendingAction === "deactivate") deactivateStudent(student.id);
          if (pendingAction === "reactivate") reactivateStudent(student.id);
          setPendingAction(null);
        }}
      />

      <div className="metrics-grid">
        <Card className="metric">
          <small>Estado del expediente</small>
          <div>
            <Badge tone={statusTone(student.status)}>{student.status}</Badge>
          </div>
          <span>Alta: {student.createdAt}</span>
        </Card>
        <Card className="metric">
          <small>Documentos recibidos</small>
          <strong>{studentDocs.length}</strong>
          <span>
            {storedCount} en Drive · {pendingCount} por revisar
          </span>
        </Card>
        <Card className="metric">
          <small>Grupo WhatsApp</small>
          <strong style={{ fontSize: 15 }}>{student.whatsappGroup}</strong>
          <span>{student.participants.length} participantes</span>
        </Card>
        <Card className="metric">
          <small>Carpeta Google Drive</small>
          <strong style={{ fontSize: 14 }}>{student.driveFolder || "Sin vincular"}</strong>
          <span>{student.email || "Correo sin registrar"}</span>
        </Card>
      </div>

      <div className="two-col">
        <div className="stack">
          <Card>
            <div className="card-head">
              <h3>Documentos del expediente ({studentDocs.length})</h3>
              <Badge tone={statusTone(student.status)}>{student.status}</Badge>
            </div>
            {studentDocs.length === 0 ? (
              <p className="sub">Aún no se han recibido documentos en este expediente.</p>
            ) : (
              <div className="stack">
                {studentDocs.map((d) => (
                  <div key={d.id} className="row-item">
                    <div>
                      <strong>{d.fileName}</strong>
                      <div className="sub">
                        {d.category} · {d.receivedAt}
                      </div>
                      {d.drivePath && <div className="sub">{d.drivePath}</div>}
                    </div>
                    <div className="head-action">
                      <Badge
                        tone={
                          d.status === "Almacenado"
                            ? "green"
                            : d.status === "Pendiente de revisión"
                              ? "amber"
                              : "gray"
                        }
                      >
                        {d.status}
                      </Badge>
                      {d.status === "Pendiente de revisión" && (
                        <Button
                          onClick={() => {
                            setSelectedDocId(d.id);
                            go("review");
                          }}
                        >
                          Revisar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <div className="card-head">
              <h3>Participantes del grupo</h3>
              <Badge tone="blue">{student.participants.length}</Badge>
            </div>
            <div className="stack">
              {student.participants.map((p) => (
                <div key={p.id} className="row-item">
                  <div>
                    <strong>{p.name}</strong>
                    <div className="sub">{p.phone}</div>
                  </div>
                  <Badge tone={p.role === "Estudiante" ? "green" : "gray"}>{p.role}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <div className="card-head">
            <h3>Historial cronológico</h3>
            <Badge tone="gray">{student.timeline.length} eventos</Badge>
          </div>
          <div className="stack">
            {student.timeline.map((ev) => (
              <div
                key={ev.id}
                className="row-item"
                style={{ borderLeft: "3px solid #2b5bf5", paddingLeft: 12 }}
              >
                <div>
                  <strong>{ev.action}</strong>
                  <div className="sub">{ev.detail}</div>
                  <div className="sub">
                    {ev.timestamp} · {ev.actor}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function Documents({ go }: { go: (p: Page) => void }) {
  const { documents, setSelectedDocId } = useAppStore();
  const [statusFilter, setStatusFilter] = useState("Todos");

  const filtered = documents.filter((d) => statusFilter === "Todos" || d.status === statusFilter);

  return (
    <>
      <PageHead
        title="Documentos"
        subtitle="Trazabilidad completa de archivos recibidos, clasificados y almacenados."
      />
      <Card>
        <div className="toolbar">
          <div className="tabs">
            {["Todos", "Almacenado", "Pendiente de revisión", "Excluido de IA"].map((tab) => (
              <button
                type="button"
                key={tab}
                className={statusFilter === tab ? "active" : ""}
                onClick={() => setStatusFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Archivo</th>
                <th>Estudiante</th>
                <th>Remitente</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Fecha y hora</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td>
                    <strong>{d.fileName}</strong>
                    {d.drivePath && <div className="sub">{d.drivePath}</div>}
                  </td>
                  <td>{d.studentName}</td>
                  <td>{d.senderRole}</td>
                  <td>{d.category}</td>
                  <td>
                    <Badge
                      tone={
                        d.status === "Almacenado"
                          ? "green"
                          : d.status === "Pendiente de revisión"
                            ? "amber"
                            : "gray"
                      }
                    >
                      {d.status}
                    </Badge>
                  </td>
                  <td>{d.receivedAt}</td>
                  <td>
                    {d.status === "Pendiente de revisión" && (
                      <Button
                        onClick={() => {
                          setSelectedDocId(d.id);
                          go("review");
                        }}
                      >
                        Revisar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function Review({ go }: { go: (p: Page) => void }) {
  const { documents, students, selectedDocId, correctDocumentCategory } = useAppStore();
  const doc = documents.find((d) => d.id === selectedDocId) ?? documents[0];
  if (!doc) return null;
  const student = students.find((s) => s.id === doc.studentId);
  return (
    <ReviewForm
      key={doc.id}
      doc={doc}
      studentStatus={student?.status ?? "Activo"}
      driveFolder={student?.driveFolder ?? ""}
      go={go}
      onSave={correctDocumentCategory}
    />
  );
}

function ReviewForm({
  doc,
  studentStatus,
  driveFolder,
  go,
  onSave,
}: {
  doc: ReturnType<typeof useAppStore>["documents"][number];
  studentStatus: StudentStatus;
  driveFolder: string;
  go: (p: Page) => void;
  onSave: ReturnType<typeof useAppStore>["correctDocumentCategory"];
}) {
  const [category, setCategory] = useState<DocCategory>(doc.category);

  return (
    <>
      <PageHead
        title="Revisión de documento"
        subtitle="Confirma o corrige la categoría sugerida por la IA."
        back="Volver a Documentos"
        onBack={() => go("documents")}
      />
      {studentStatus === "Inactivo" && (
        <InfoBanner>
          Este estudiante está en estado Inactivo. Puedes corregir la categoría, pero el guardado en
          Drive requiere autorización desde Alertas por un Encargado o Administrador.
        </InfoBanner>
      )}
      {studentStatus === "Pendiente" && (
        <InfoBanner>
          Este estudiante está Pendiente de validación. El almacenamiento en Drive permanecerá
          bloqueado hasta vincular su carpeta.
        </InfoBanner>
      )}
      <div className="two-col review-grid">
        <Card>
          <div className="card-head">
            <h3>Vista previa del archivo</h3>
            <Badge tone={doc.status === "Almacenado" ? "green" : "amber"}>{doc.status}</Badge>
          </div>
          <div className="doc-preview-box">
            <div className="head-action">
              <Icon name="files" size={24} />
              <strong>{doc.fileName}</strong>
            </div>
            <div className="row-item">
              <span className="sub">Remitente</span>
              <strong>
                {doc.senderName} ({doc.senderRole})
              </strong>
            </div>
            <div className="row-item">
              <span className="sub">Fecha de recepción</span>
              <strong>{doc.receivedAt}</strong>
            </div>
            <div className="row-item">
              <span className="sub">Sugerencia IA</span>
              <Badge tone="blue">
                {doc.category} · {doc.confidence ?? 0}% confianza
              </Badge>
            </div>
          </div>
        </Card>

        <Card>
          <div className="card-head">
            <h3>Clasificación manual</h3>
            <Badge tone={statusTone(studentStatus)}>Estudiante: {studentStatus}</Badge>
          </div>
          <div className="stack">
            <div className="row-item">
              <span className="sub">Estudiante</span>
              <strong>{doc.studentName}</strong>
            </div>
            <div className="row-item">
              <span className="sub">Destino en Drive</span>
              <strong style={{ fontSize: 12.5 }}>
                {driveFolder ? `${driveFolder} / ${category}` : "Sin carpeta vinculada"}
              </strong>
            </div>
            <label className="field">
              <span>Categoría documental</span>
              <select
                className="select-input"
                value={category}
                onChange={(e) => setCategory(e.target.value as DocCategory)}
              >
                <option value="Pasaporte">Pasaporte</option>
                <option value="DNI">DNI</option>
                <option value="Certificado de estudios">Certificado de estudios</option>
                <option value="Extracto bancario">Extracto bancario</option>
                <option value="Visa anterior">Visa anterior</option>
              </select>
            </label>
            <div className="head-action">
              <Button onClick={() => go("documents")}>Cancelar</Button>
              <Button
                primary
                onClick={() => {
                  onSave(doc.id, category);
                  go("documents");
                }}
              >
                Guardar como Validación humana
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

function Alerts({ go }: { go: (p: Page) => void }) {
  const { role, alerts, resolveInactiveAlert, setSelectedStudentId, setSelectedDocId } =
    useAppStore();
  const [tab, setTab] = useState<"Abierta" | "Resuelta" | "Todas">("Abierta");
  const [confirmAlertId, setConfirmAlertId] = useState<string | null>(null);

  const openCount = alerts.filter((a) => a.status === "Abierta").length;
  const highCount = alerts.filter((a) => a.status === "Abierta" && a.priority === "Alta").length;
  const resolvedCount = alerts.filter((a) => a.status === "Resuelta").length;

  const filtered = alerts.filter((a) => tab === "Todas" || a.status === tab);

  return (
    <>
      <PageHead
        title="Alertas operativas"
        subtitle="Retenciones preventivas de estudiantes inactivos y validaciones pendientes."
      />

      <div className="metrics-grid">
        <Card className="metric">
          <small>Alertas abiertas</small>
          <strong>{openCount}</strong>
          <span>Requieren atención</span>
        </Card>
        <Card className="metric">
          <small>Prioridad alta</small>
          <strong>{highCount}</strong>
          <span>Documentos de inactivos</span>
        </Card>
        <Card className="metric">
          <small>Resueltas</small>
          <strong>{resolvedCount}</strong>
          <span>Historial atendido</span>
        </Card>
        <Card className="metric">
          <small>Tu nivel de acceso</small>
          <strong style={{ fontSize: 16 }}>{role}</strong>
          <span>{role === "Personal" ? "Consulta y revisión" : "Autorización habilitada"}</span>
        </Card>
      </div>

      <Card className="mb-4">
        <div className="toolbar" style={{ marginBottom: 0 }}>
          <div className="tabs">
            {(["Abierta", "Resuelta", "Todas"] as const).map((t) => (
              <button
                type="button"
                key={t}
                className={tab === t ? "active" : ""}
                onClick={() => setTab(t)}
              >
                {t === "Abierta" ? `Abiertas (${openCount})` : t === "Resuelta" ? `Resueltas (${resolvedCount})` : `Todas (${alerts.length})`}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="stack">
        {filtered.length === 0 ? (
          <Card>
            <p className="sub">No hay alertas en esta categoría.</p>
          </Card>
        ) : (
          filtered.map((a) => {
            const borderColor =
              a.status === "Resuelta"
                ? "#16a34a"
                : a.priority === "Alta"
                  ? "#d97706"
                  : "#2b5bf5";
            return (
              <Card key={a.id} className="alert-card">
                <div
                  className="reactivation"
                  style={{ borderLeft: `4px solid ${borderColor}`, paddingLeft: 14 }}
                >
                  <div>
                    <div className="head-action">
                      <Badge tone={a.priority === "Alta" ? "amber" : "blue"}>
                        Prioridad {a.priority}
                      </Badge>
                      <Badge tone={a.status === "Abierta" ? "amber" : "green"}>{a.status}</Badge>
                      <span className="sub">· {a.studentName}</span>
                    </div>
                    <h3>{a.title}</h3>
                    <p className="sub">{a.description}</p>
                    <small className="sub">{a.createdAt}</small>
                  </div>

                  {a.status === "Abierta" && role !== "Personal" && a.documentId && (
                    <div className="head-action">
                      <Button
                        onClick={() => {
                          setSelectedDocId(a.documentId!);
                          go("review");
                        }}
                      >
                        Revisar archivo
                      </Button>
                      <Button primary onClick={() => setConfirmAlertId(a.id)}>
                        Autorizar documento
                      </Button>
                    </div>
                  )}

                  {a.status === "Abierta" && role !== "Personal" && !a.documentId && (
                    <div className="head-action">
                      <Button
                        primary
                        onClick={() => {
                          setSelectedStudentId(a.studentId);
                          go("validation");
                        }}
                      >
                        Validar estudiante
                      </Button>
                    </div>
                  )}

                  {a.status === "Abierta" && role === "Personal" && (
                    <div className="head-action">
                      {a.documentId && (
                        <Button
                          onClick={() => {
                            setSelectedDocId(a.documentId!);
                            go("review");
                          }}
                        >
                          Revisar archivo
                        </Button>
                      )}
                      <Badge tone="gray">Requiere Encargado para autorizar</Badge>
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      <ConfirmDialog
        open={confirmAlertId !== null}
        title="¿Autorizar guardado en Google Drive?"
        description="El archivo retenido se almacenará en la carpeta del estudiante y la alerta pasará a Resuelta. El estudiante seguirá en estado Inactivo."
        confirmLabel="Sí, autorizar"
        onCancel={() => setConfirmAlertId(null)}
        onConfirm={() => {
          if (confirmAlertId) resolveInactiveAlert(confirmAlertId, true, false);
          setConfirmAlertId(null);
        }}
      />
    </>
  );
}

function Integrations() {
  const [waActive, setWaActive] = useState(true);
  const [driveVerified, setDriveVerified] = useState(true);
  const [aiThreshold, setAiThreshold] = useState("80");
  const [confirmPauseWa, setConfirmPauseWa] = useState(false);
  const [pendingThreshold, setPendingThreshold] = useState<string | null>(null);

  return (
    <>
      <PageHead
        title="Integraciones"
        subtitle="Configuración y estado operativo de WhatsApp Business, Google Drive y Gemini API."
      />
      <div className="three-col">
        <Card>
          <div className="card-head">
            <h3>WhatsApp Business</h3>
            <Badge tone={waActive ? "green" : "amber"}>
              {waActive ? "Conectado" : "Pausado"}
            </Badge>
          </div>
          <div className="stack">
            <p className="sub">Escucha en tiempo real de grupos y remitentes.</p>
            <div className="row-item">
              <span className="sub">Línea oficial</span>
              <strong>+51 999 100 200</strong>
            </div>
            <div className="row-item">
              <span className="sub">Webhook</span>
              <strong>Activo (&lt; 5 s)</strong>
            </div>
            <div className="head-action">
              <Button
                onClick={() => {
                  if (waActive) setConfirmPauseWa(true);
                  else setWaActive(true);
                }}
              >
                {waActive ? "Pausar escucha" : "Reanudar escucha"}
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="card-head">
            <h3>Google Drive</h3>
            <Badge tone={driveVerified ? "green" : "amber"}>
              {driveVerified ? "Conectado" : "Pendiente"}
            </Badge>
          </div>
          <div className="stack">
            <p className="sub">Almacenamiento directo en carpetas de estudiantes.</p>
            <div className="row-item">
              <span className="sub">Cuenta</span>
              <strong>documentos@andino.edu</strong>
            </div>
            <div className="row-item">
              <span className="sub">Carpeta raíz</span>
              <strong>Andino Drive / Estudiantes</strong>
            </div>
            <div className="head-action">
              <Button onClick={() => setDriveVerified(true)}>Verificar permisos</Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="card-head">
            <h3>Clasificador IA (Gemini)</h3>
            <Badge tone="green">Activo</Badge>
          </div>
          <div className="stack">
            <p className="sub">Clasificación automática en 5 categorías documentales.</p>
            <div className="row-item">
              <span className="sub">Tiempo promedio</span>
              <strong>&lt; 10 segundos</strong>
            </div>
            <label className="field">
              <span>Umbral de confianza automática</span>
              <select
                className="select-input"
                value={aiThreshold}
                onChange={(e) => setPendingThreshold(e.target.value)}
              >
                <option value="75">75% o superior</option>
                <option value="80">80% o superior (Recomendado)</option>
                <option value="90">90% o superior (Estricto)</option>
              </select>
            </label>
          </div>
        </Card>
      </div>

      <Card>
        <div className="card-head">
          <h3>Políticas automáticas activas</h3>
          <Badge tone="blue">Seguridad documental</Badge>
        </div>
        <div className="stack">
          <div className="row-item">
            <div>
              <strong>Bloqueo sin carpeta Drive</strong>
              <div className="sub">
                Estudiantes en estado Pendiente o sin carpeta vinculada no almacenan archivos.
              </div>
            </div>
            <Badge tone="green">Activo</Badge>
          </div>
          <div className="row-item">
            <div>
              <strong>Exclusión de Personal de Andino</strong>
              <div className="sub">
                Guías o folletos enviados por asesores se marcan como Excluido de IA.
              </div>
            </div>
            <Badge tone="green">Activo</Badge>
          </div>
          <div className="row-item">
            <div>
              <strong>Retención preventiva de Inactivos</strong>
              <div className="sub">
                Documentos de estudiantes inactivos quedan en revisión y generan alerta prioritaria.
              </div>
            </div>
            <Badge tone="green">Activo</Badge>
          </div>
        </div>
      </Card>

      <ConfirmDialog
        open={confirmPauseWa}
        danger
        title="¿Pausar escucha de WhatsApp Business?"
        description="Mientras la integración esté pausada, no se recibirán ni clasificarán automáticamente nuevos archivos de grupos."
        confirmLabel="Sí, pausar escucha"
        onCancel={() => setConfirmPauseWa(false)}
        onConfirm={() => {
          setWaActive(false);
          setConfirmPauseWa(false);
        }}
      />

      <ConfirmDialog
        open={pendingThreshold !== null}
        title="¿Cambiar umbral de confianza IA?"
        description={`Se actualizará el umbral automático de Gemini a ${pendingThreshold ?? aiThreshold}% para las próximas clasificaciones.`}
        confirmLabel="Sí, actualizar umbral"
        onCancel={() => setPendingThreshold(null)}
        onConfirm={() => {
          if (pendingThreshold) setAiThreshold(pendingThreshold);
          setPendingThreshold(null);
        }}
      />
    </>
  );
}

function Users() {
  const { users, createUser, toggleUserActive } = useAppStore();
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("Personal");
  const [formError, setFormError] = useState<string | null>(null);
  const pendingUser = users.find((u) => u.id === pendingUserId);

  const openCreateModal = () => {
    setNewName("");
    setNewEmail("");
    setNewRole("Personal");
    setFormError(null);
    setCreateOpen(true);
  };

  return (
    <>
      <PageHead
        title="Usuarios y roles"
        subtitle="Control de acceso del equipo de Andino. Solo el Administrador puede crear cuentas."
        action={
          <Button primary onClick={openCreateModal}>
            + Agregar cuenta
          </Button>
        }
      />
      <Card>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <Badge>{u.role}</Badge>
                  </td>
                  <td>
                    <Badge tone={u.active ? "green" : "gray"}>
                      {u.active ? "Activo" : "Suspendido"}
                    </Badge>
                  </td>
                  <td>
                    <Button danger={u.active} onClick={() => setPendingUserId(u.id)}>
                      {u.active ? "Suspender" : "Activar"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {createOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-user-title"
          onClick={() => setCreateOpen(false)}
        >
          <form
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              const res = createUser({ name: newName, email: newEmail, role: newRole });
              if (res.ok) {
                setCreateOpen(false);
              } else {
                setFormError(res.error ?? "No se pudo crear la cuenta.");
              }
            }}
          >
            <div className="modal-head">
              <div className="modal-icon">
                <Icon name="userPlus" size={18} />
              </div>
              <div>
                <h3 id="create-user-title">Nueva cuenta de equipo</h3>
                <p className="sub">
                  La cuenta quedará activa y habilitada para iniciar sesión con su correo.
                </p>
              </div>
            </div>

            <div className="stack">
              <Field
                label="Nombre completo"
                value={newName}
                onChange={(v) => {
                  setNewName(v);
                  setFormError(null);
                }}
                placeholder="Ej. Sofía Paredes"
              />
              <Field
                label="Correo corporativo"
                value={newEmail}
                onChange={(v) => {
                  setNewEmail(v);
                  setFormError(null);
                }}
                placeholder="sofia@andino.edu"
              />
              <label className="field">
                <span>Rol asignado</span>
                <select
                  className="select-input"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as Role)}
                >
                  <option value="Personal">Personal</option>
                  <option value="Encargado">Encargado</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </label>
              {formError && (
                <p className="sub" style={{ color: "#b91c1c" }}>
                  {formError}
                </p>
              )}
            </div>

            <div className="modal-actions">
              <Button onClick={() => setCreateOpen(false)}>Cancelar</Button>
              <Button primary type="submit">
                Crear cuenta
              </Button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingUser)}
        danger={Boolean(pendingUser?.active)}
        title={
          pendingUser?.active
            ? `¿Suspender acceso de ${pendingUser.name}?`
            : `¿Reactivar acceso de ${pendingUser?.name ?? ""}?`
        }
        description={
          pendingUser?.active
            ? `El usuario (${pendingUser.role}) perderá acceso al sistema hasta que un Administrador vuelva a activarlo.`
            : `El usuario volverá a tener acceso al sistema con el rol ${pendingUser?.role ?? ""}.`
        }
        confirmLabel={pendingUser?.active ? "Sí, suspender" : "Sí, activar"}
        onCancel={() => setPendingUserId(null)}
        onConfirm={() => {
          if (pendingUser) toggleUserActive(pendingUser.id);
          setPendingUserId(null);
        }}
      />
    </>
  );
}

function AppContent() {
  const { currentUser, role } = useAppStore();
  const { page, go } = useAppRouter(Boolean(currentUser));

  if (!currentUser || page === "login") return <Login go={go} />;

  const activePage: Page =
    (role !== "Administrador" && (page === "integrations" || page === "users")) ||
    (role === "Personal" && page === "validation")
      ? "home"
      : page;

  const titles: Record<Page, string> = {
    login: "Acceso",
    home: "Inicio",
    students: "Estudiantes",
    validation: "Validar estudiante",
    student: "Ficha de estudiante",
    documents: "Documentos",
    review: "Revisión de documento",
    alerts: "Alertas",
    integrations: "Integraciones",
    users: "Usuarios",
  };

  return (
    <Shell page={activePage} go={go} breadcrumb={titles[activePage]}>
      {activePage === "home" && <Home go={go} />}
      {activePage === "students" && <Students go={go} />}
      {activePage === "validation" && <Validation go={go} />}
      {activePage === "student" && <StudentDetail go={go} />}
      {activePage === "documents" && <Documents go={go} />}
      {activePage === "review" && <Review go={go} />}
      {activePage === "alerts" && <Alerts go={go} />}
      {activePage === "integrations" && <Integrations />}
      {activePage === "users" && <Users />}
    </Shell>
  );
}

export default function App() {
  return (
    <AppStoreProvider>
      <AppContent />
    </AppStoreProvider>
  );
}
