import { useState, type ReactNode } from "react";
import { SprintBar } from "./features/sprintBar/SprintBar";
import {
  Badge,
  Brand,
  Button,
  Card,
  Field,
  Icon,
  InfoBanner,
  PageHead,
  icons,
} from "./shared/components/UI";
import { AppStoreProvider, useAppStore } from "./shared/context/AppStore";
import type { DocCategory, Page, StudentStatus } from "./shared/types/domain";

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
    if (role === "Personal" && (item.page === "integrations" || item.page === "users")) return false;
    if (role === "Encargado" && item.page === "users") return false;
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
        <SprintBar go={go} />
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
        </div>
      </section>
      <section className="login-access">
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
            <h2>Iniciar sesión</h2>
            <p className="login-sub">Accede a la gestión documental de Andino.</p>
            <label>
              Correo electrónico
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {feedback && (
              <p className="sub" style={{ color: feedback.ok ? "#15803d" : "#b91c1c" }}>
                {feedback.text}
              </p>
            )}
            <Button primary type="submit">
              Ingresar al panel
            </Button>
            <div className="head-action" style={{ marginTop: 12 }}>
              <button
                type="button"
                className="back-link"
                onClick={() => {
                  setFeedback(null);
                  setMode("recover");
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
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
            <h2>Recuperar contraseña</h2>
            <p className="login-sub">Ingresa tu correo para restablecer tu acceso.</p>
            <label>
              Correo electrónico
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            {feedback && (
              <p className="sub" style={{ color: feedback.ok ? "#15803d" : "#b91c1c" }}>
                {feedback.text}
              </p>
            )}
            <Button primary type="submit">
              Enviar instrucciones
            </Button>
            <div className="head-action" style={{ marginTop: 12 }}>
              <button
                type="button"
                className="back-link"
                onClick={() => {
                  setFeedback(null);
                  setMode("login");
                }}
              >
                Volver a iniciar sesión
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

function Home({ go }: { go: (p: Page) => void }) {
  const { students, documents, alerts, setSelectedStudentId, setSelectedDocId } = useAppStore();
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
                      <Button
                        onClick={() => {
                          setSelectedStudentId(s.id);
                          go(s.status === "Pendiente" ? "validation" : "student");
                        }}
                      >
                        {s.status === "Pendiente" ? "Validar" : "Ver ficha"}
                      </Button>
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
  const { students, setSelectedStudentId, simulateWhatsAppGroup } = useAppStore();
  const [filter, setFilter] = useState<"Todos" | StudentStatus>("Todos");
  const [query, setQuery] = useState("");

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
          <Button
            primary
            onClick={() => {
              simulateWhatsAppGroup();
              go("validation");
            }}
          >
            + Nuevo grupo WhatsApp
          </Button>
        }
      />
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
                    <Button
                      onClick={() => {
                        setSelectedStudentId(s.id);
                        go(s.status === "Pendiente" ? "validation" : "student");
                      }}
                    >
                      {s.status === "Pendiente" ? "Validar" : "Abrir ficha"}
                    </Button>
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

  const [name, setName] = useState(student?.name ?? "");
  const [email, setEmail] = useState(student?.email ?? "");
  const [phone, setPhone] = useState(student?.phone ?? "");
  const [destination, setDestination] = useState(student?.destination ?? "");
  const [driveFolder, setDriveFolder] = useState(student?.driveFolder ?? "");
  const [participants, setParticipants] = useState(student?.participants ?? []);

  if (!student) return null;

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
                const res = confirmAndActivateStudent(student.id, {
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
    simulateFileUpload,
    setSelectedDocId,
  } = useAppStore();
  const student = students.find((s) => s.id === selectedStudentId) ?? students[0];
  if (!student) return null;

  const studentDocs = documents.filter((d) => d.studentId === student.id);

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
              <Button danger onClick={() => deactivateStudent(student.id)}>
                Pasar a Inactivo
              </Button>
            )}
          </div>
        }
      />

      <div className="two-col">
        <Card>
          <div className="card-head">
            <h3>Expediente y documentos ({studentDocs.length})</h3>
            <Badge tone={statusTone(student.status)}>{student.status}</Badge>
          </div>
          <p className="sub">Carpeta Drive: {student.driveFolder || "Sin vincular"}</p>
          <div className="stack">
            {studentDocs.map((d) => (
              <div key={d.id} className="row-item">
                <div>
                  <strong>{d.fileName}</strong>
                  <div className="sub">
                    {d.category} · {d.receivedAt}
                  </div>
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
        </Card>

        <Card>
          <h3>Historial cronológico</h3>
          <div className="stack">
            {student.timeline.map((ev) => (
              <div key={ev.id} className="row-item">
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
  const { documents, selectedDocId, correctDocumentCategory } = useAppStore();
  const doc = documents.find((d) => d.id === selectedDocId) ?? documents[0];
  const [category, setCategory] = useState<DocCategory>(doc?.category ?? "Pasaporte");

  if (!doc) return null;

  return (
    <>
      <PageHead
        title="Revisión de documento"
        subtitle="Confirma o corrige la categoría sugerida por la IA."
        back="Volver a Documentos"
        onBack={() => go("documents")}
      />
      <div className="review-grid">
        <Card className="preview">
          <div className="paper">
            <Icon name="files" size={32} />
            <strong>{doc.fileName}</strong>
            <p className="sub">Remitente: {doc.senderName}</p>
            <p className="sub">Confianza IA: {doc.confidence ?? 0}%</p>
          </div>
        </Card>
        <Card>
          <h3>Clasificación manual</h3>
          <div className="stack">
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
            <Button
              primary
              onClick={() => {
                correctDocumentCategory(doc.id, category);
                go("documents");
              }}
            >
              Guardar como Validación humana
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

function Alerts() {
  const { role, alerts, resolveInactiveAlert } = useAppStore();

  return (
    <>
      <PageHead
        title="Alertas operativas"
        subtitle="Retenciones preventivas de estudiantes inactivos y validaciones pendientes."
      />
      <div className="stack">
        {alerts.map((a) => (
          <Card key={a.id}>
            <div className="reactivation">
              <div>
                <div className="head-action">
                  <Badge tone={a.priority === "Alta" ? "amber" : "blue"}>{a.priority}</Badge>
                  <Badge tone={a.status === "Abierta" ? "amber" : "green"}>{a.status}</Badge>
                </div>
                <h3>{a.title}</h3>
                <p className="sub">{a.description}</p>
                <small className="sub">{a.createdAt}</small>
              </div>
              {role !== "Personal" && a.status === "Abierta" && a.documentId && (
                <div className="head-action">
                  <Button onClick={() => resolveInactiveAlert(a.id, true, false)}>
                    Autorizar solo documento
                  </Button>
                  <Button primary onClick={() => resolveInactiveAlert(a.id, true, true)}>
                    Autorizar y reactivar
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function Integrations() {
  return (
    <>
      <PageHead
        title="Integraciones"
        subtitle="Estado de conexión con WhatsApp Business, Google Drive y Gemini API."
      />
      <div className="metrics-grid">
        <Card>
          <h3>WhatsApp Business</h3>
          <Badge tone="green">Conectado</Badge>
          <p className="sub">Escucha activa de grupos y remitentes.</p>
        </Card>
        <Card>
          <h3>Google Drive</h3>
          <Badge tone="green">Conectado</Badge>
          <p className="sub">Almacenamiento automático por carpeta vinculada.</p>
        </Card>
        <Card>
          <h3>Clasificador IA</h3>
          <Badge tone="green">Activo</Badge>
          <p className="sub">Detección automática de 5 categorías documentales.</p>
        </Card>
      </div>
    </>
  );
}

function Users() {
  const { users, toggleUserActive } = useAppStore();
  return (
    <>
      <PageHead title="Usuarios y roles" subtitle="Control de acceso del equipo de Andino." />
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
                    <Button onClick={() => toggleUserActive(u.id)}>
                      {u.active ? "Suspender" : "Activar"}
                    </Button>
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

function AppContent() {
  const { currentUser } = useAppStore();
  const [page, setPage] = useState<Page>("home");

  if (!currentUser || page === "login") return <Login go={setPage} />;

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
    <Shell page={page} go={setPage} breadcrumb={titles[page]}>
      {page === "home" && <Home go={setPage} />}
      {page === "students" && <Students go={setPage} />}
      {page === "validation" && <Validation go={setPage} />}
      {page === "student" && <StudentDetail go={setPage} />}
      {page === "documents" && <Documents go={setPage} />}
      {page === "review" && <Review go={setPage} />}
      {page === "alerts" && <Alerts />}
      {page === "integrations" && <Integrations />}
      {page === "users" && <Users />}
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
