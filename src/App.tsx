import { useState, type ReactNode } from "react";

const A = "/assets";

const icons = {
  home: "0bd12.svg",
  students: "6f7e8.svg",
  files: "f9d2e.svg",
  settings: "de35a.svg",
  plug: "12e34.svg",
  shield: "ff04f.svg",
  help: "5a145.svg",
  bell: "ed9f0.svg",
  chevron: "4f9df.svg",
  swap: "9299f.svg",
  search: "097c0.svg",
  down: "13670.svg",
  info: "34771.svg",
  back: "28c74.svg",
  refresh: "62945.svg",
  warning: "dec09.svg",
  lock: "da8f1.svg",
  pencil: "83584.svg",
  scan: "221a6.svg",
  folder: "c6883.svg",
  message: "3ecf3.svg",
  folderCheck: "25d8a.svg",
  userCheck: "8a441.svg",
  userPlus: "a95de.svg",
  sparkles: "baffe.svg",
};

type Page =
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

function Icon({ name, size = 18 }: { name: keyof typeof icons; size?: number }) {
  return <img className="icon" src={`${A}/${icons[name]}`} width={size} height={size} alt="" />;
}

function Brand({ large = false }: { large?: boolean }) {
  return (
    <div className={`brand ${large ? "brand-large" : ""}`}>
      <div className="brand-mark">
        <img src={`${A}/ccc1e.png`} alt="" />
      </div>
      <div>
        <strong>Andino</strong>
        <span>Education Group</span>
      </div>
    </div>
  );
}

function Badge({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: "blue" | "green" | "amber" | "gray";
}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function Button({
  children,
  primary = false,
  danger = false,
  disabled = false,
  onClick,
}: {
  children: ReactNode;
  primary?: boolean;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={`button ${primary ? "primary" : ""} ${danger ? "danger" : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

const navItems: { page: Page; label: string; icon: keyof typeof icons }[] = [
  { page: "home", label: "Inicio", icon: "home" },
  { page: "students", label: "Estudiantes", icon: "students" },
  { page: "documents", label: "Documentos", icon: "files" },
  { page: "alerts", label: "Alertas", icon: "bell" },
  { page: "integrations", label: "Configuración", icon: "settings" },
  { page: "integrations", label: "Integraciones", icon: "plug" },
  { page: "users", label: "Usuarios", icon: "shield" },
];

function Sidebar({ page, go }: { page: Page; go: (page: Page) => void }) {
  const active =
    page === "validation" || page === "student"
      ? "students"
      : page === "review"
        ? "documents"
        : page;
  return (
    <aside className="sidebar">
      <Brand />
      <div className="side-label">GESTIÓN DOCUMENTAL</div>
      <nav>
        {navItems.map((item, index) => (
          <button
            key={`${item.label}-${index}`}
            className={
              active === item.page && !(item.label === "Configuración" && page === "integrations")
                ? "active"
                : ""
            }
            onClick={() => go(item.page)}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
            {item.label === "Alertas" && <Badge tone="amber">4</Badge>}
          </button>
        ))}
      </nav>
      <div className="side-bottom">
        <div className="demo-card">
          <Badge>Demostración</Badge>
          <p>Datos ficticios. Sin conexiones reales.</p>
        </div>
        <div className="account">
          <span>CR</span>
          <div>
            <strong>Carolina Ríos</strong>
            <small>Administradora</small>
          </div>
          <Icon name="swap" size={14} />
        </div>
      </div>
    </aside>
  );
}

function Shell({
  page,
  go,
  crumb,
  children,
}: {
  page: Page;
  go: (p: Page) => void;
  crumb: string;
  children: ReactNode;
}) {
  return (
    <div className="app-shell">
      <Sidebar page={page} go={go} />
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Espacio de trabajo</span>
            <Icon name="chevron" size={14} />
            <strong>{crumb}</strong>
          </div>
          <div className="utilities">
            <span>14 oct 2026 · Lima</span>
            <Badge>Entorno de demostración</Badge>
            <Icon name="help" />
            <Icon name="bell" />
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}

function PageHead({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>;
}

function Tabs({ items, active = 0 }: { items: string[]; active?: number }) {
  return (
    <div className="tabs">
      {items.map((item, i) => (
        <button className={i === active ? "active" : ""} key={item}>
          {item}
        </button>
      ))}
    </div>
  );
}

function Filters({ search, filters }: { search: string; filters: string[] }) {
  return (
    <div className="filters">
      <div className="search">
        <Icon name="search" />
        {search}
      </div>
      {filters.map((filter) => (
        <button key={filter}>
          <Icon name="down" size={14} />
          {filter}
        </button>
      ))}
    </div>
  );
}

function Pager({ label }: { label: string }) {
  return (
    <div className="pager">
      <span>{label}</span>
      <div>
        <span>8 por página</span>
        <button>‹</button>
        <b>1</b>
        <button>›</button>
      </div>
    </div>
  );
}

function Login({ go }: { go: (p: Page) => void }) {
  const features: [keyof typeof icons, string, string][] = [
    ["message", "Recepción en WhatsApp", "Identifica al estudiante y al remitente."],
    ["scan", "Clasificación asistida", "La IA sugiere; el personal revisa."],
    ["folderCheck", "Destino en Google Drive", "Conserva la carpeta existente y el historial."],
  ];
  return (
    <div className="login">
      <section className="login-story">
        <Brand large />
        <div className="login-copy">
          <Badge>Portal interno · Personal de agencia</Badge>
          <h1>
            Cada documento,
            <br />
            en su lugar.
          </h1>
          <p>
            Un espacio de trabajo para organizar documentos y acompañar a tus estudiantes con
            trazabilidad.
          </p>
          <div className="feature-list">
            {features.map(([icon, title, text]) => (
              <div className="feature" key={title}>
                <span>
                  <Icon name={icon} />
                </span>
                <div>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
        <small className="legal">
          Prototipo de demostración. El flujo de grupos es un supuesto del proyecto; no reemplaza
          WhatsApp ni Google Drive.
        </small>
      </section>
      <section className="login-access">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            go("home");
          }}
        >
          <Badge>Entorno de demostración</Badge>
          <div>
            <h2>Bienvenido de nuevo</h2>
            <p>Accede a la gestión documental de Andino.</p>
          </div>
          <label>
            Correo del personal
            <input defaultValue="carolina.rios@andino.example" />
          </label>
          <label>
            Contraseña
            <input type="password" defaultValue="demostracion" />
          </label>
          <div className="login-options">
            <label>
              <input type="checkbox" /> Recordar sesión
            </label>
            <button type="button">Olvidé mi contraseña</button>
          </div>
          <Button primary>Acceder</Button>
          <p>
            Acceso exclusivo para personal autorizado.
            <br />
            ¿Necesitas una cuenta? Contacta a tu administrador.
          </p>
          <div className="security">
            <Icon name="lock" size={16} />
            Sin autenticación ni servicios reales conectados.
          </div>
        </form>
      </section>
    </div>
  );
}

const studentRows = [
  ["Ana Torres", "AE-001", "Australia", "Carolina Ríos", "Activo", "3"],
  ["Diego Ramírez", "AE-002", "Australia", "Luis Salazar", "Activo", "2"],
  ["Sofía Herrera", "AE-003", "Australia", "Carolina Ríos", "Pendiente", "1"],
  ["Lucía Mendoza", "AE-004", "Australia", "Luis Salazar", "Inactivo", "1"],
  ["Valentina Castro", "AE-005", "Australia", "Carolina Ríos", "Activo", "2"],
  ["Mateo Silva", "AE-006", "Australia", "Luis Salazar", "Activo", "1"],
  ["Camila Vargas", "AE-007", "Australia", "Carolina Ríos", "Activo", "1"],
  ["Martín Rojas", "AE-008", "Australia", "Carolina Ríos", "Pendiente", "1"],
];

function Students({ go }: { go: (p: Page) => void }) {
  return (
    <>
      <PageHead
        title="Estudiantes"
        subtitle="Consulta expedientes y valida los registros detectados en grupos de WhatsApp."
        action={
          <Button primary onClick={() => go("validation")}>
            <Icon name="userCheck" /> Validar pendientes (2)
          </Button>
        }
      />
      <Tabs items={["Todos (8)", "Pendientes (2)", "Activos (5)", "Inactivos (1)"]} />
      <Filters
        search="Buscar por nombre, correo o ID"
        filters={["Estado: todos", "Responsable: todos"]}
      />
      <Card className="table-card">
        <table>
          <thead>
            <tr>
              <th>ESTUDIANTE</th>
              <th>DESTINO</th>
              <th>RESPONSABLE</th>
              <th>ESTADO</th>
              <th>DOCUMENTOS</th>
              <th>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {studentRows.map((r) => (
              <tr key={r[1]}>
                <td>
                  <button className="link" onClick={() => go("student")}>
                    {r[0]}
                  </button>
                  <small>{r[1]}</small>
                </td>
                <td>{r[2]}</td>
                <td>{r[3]}</td>
                <td>
                  <Badge
                    tone={r[4] === "Activo" ? "green" : r[4] === "Pendiente" ? "amber" : "gray"}
                  >
                    {r[4]}
                  </Badge>
                </td>
                <td>{r[5]}</td>
                <td>
                  <button
                    className="link"
                    onClick={() => go(r[4] === "Pendiente" ? "validation" : "student")}
                  >
                    {r[4] === "Pendiente" ? "Validar registro →" : "Abrir ficha →"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pager label="Mostrando 8 de 8 estudiantes" />
      </Card>
      <p className="footnote">
        Un registro pendiente no se activa hasta completar los datos y vincular una carpeta
        existente. Desactivar conserva documentos e historial.
      </p>
    </>
  );
}

function Metric({
  title,
  value,
  note,
  icon,
}: {
  title: string;
  value: string;
  note: string;
  icon?: keyof typeof icons;
}) {
  return (
    <Card className="metric">
      <div>
        <span>{title}</span>
        {icon && <Icon name={icon} />}
      </div>
      <strong>{value}</strong>
      <small>{note}</small>
    </Card>
  );
}

function Home({ go }: { go: (p: Page) => void }) {
  return (
    <>
      <PageHead
        title="Tu equipo, al día"
        subtitle="Prioriza las revisiones y los registros que necesitan atención."
        action={
          <Button primary onClick={() => go("documents")}>
            → &nbsp; Revisar pendientes
          </Button>
        }
      />
      <div className="metrics">
        <Metric
          title="Estudiantes"
          value="8"
          note="5 activos · 2 pendientes · 1 inactivo"
          icon="students"
        />
        <Metric
          title="Documentos procesados"
          value="10"
          note="6 almacenados · 4 por revisar"
          icon="files"
        />
        <Metric
          title="Revisiones pendientes"
          value="4"
          note="Requieren intervención humana"
          icon="scan"
        />
        <Metric title="Alertas abiertas" value="4" note="1 de estudiante inactivo" icon="bell" />
      </div>
      <div className="dashboard-grid">
        <div>
          <div className="section-title">
            <h3>Documentos por revisar</h3>
            <button onClick={() => go("documents")}>Ver todos →</button>
          </div>
          <Card className="table-card">
            <table>
              <thead>
                <tr>
                  <th>ESTUDIANTE</th>
                  <th>DOCUMENTO</th>
                  <th>ESTADO</th>
                  <th>ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Ana Torres", "Pasaporte", "Revisar →"],
                  ["Lucía Mendoza", "Extracto bancario", "Ver alerta →"],
                  ["Diego Ramírez", "Visa anterior", "Revisar →"],
                ].map((r) => (
                  <tr key={r[0]}>
                    <td>
                      <b className="blue">{r[0]}</b>
                      <small>
                        AE-00
                        {r[0] === "Ana Torres"
                          ? "1 · Activo"
                          : r[0] === "Lucía Mendoza"
                            ? "4 · Inactivo"
                            : "2 · Activo"}
                      </small>
                    </td>
                    <td>{r[1]}</td>
                    <td>
                      <Badge tone="amber">Pendiente de revisión</Badge>
                    </td>
                    <td>
                      <button
                        className="link"
                        onClick={() => go(r[2].startsWith("Ver") ? "alerts" : "review")}
                      >
                        {r[2]}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pager label="Mostrando 3 de 4 revisiones" />
          </Card>
          <Card className="flow">
            <h3>Estado del flujo</h3>
            <p>Distribución de los 12 documentos de estudiantes</p>
            <div className="flowbar">
              <i />
              <i />
              <i />
              <i />
            </div>
            <div>
              <span>6 almacenados</span>
              <span>4 en revisión</span>
              <span>1 en clasificación</span>
              <span>1 recibido</span>
            </div>
          </Card>
        </div>
        <div className="dashboard-side">
          <Card>
            <h3>Últimas alertas</h3>
            <p>4 abiertas · ordenadas por prioridad</p>
            <div className="alert-mini">
              <b>Estudiante inactivo</b>
              <time>10:18</time>
              <span>Lucía envió un nuevo documento. No se ha guardado en Drive.</span>
            </div>
            <div className="alert-mini">
              <b>Carpeta por vincular</b>
              <time>09:52</time>
              <span>Sofía necesita una carpeta de destino.</span>
            </div>
            <Button onClick={() => go("alerts")}>→ &nbsp; Ver alertas</Button>
          </Card>
          <Card>
            <h3>Registros por validar</h3>
            <p>Sofía Herrera y Martín Rojas están pendientes de validación.</p>
            <Button onClick={() => go("validation")}>
              <Icon name="userCheck" /> Validar estudiantes
            </Button>
            <small>Cifras de ejemplo · corte: 14 oct, 10:30.</small>
          </Card>
        </div>
      </div>
    </>
  );
}

function InfoBanner({ children }: { children: ReactNode }) {
  return (
    <div className="info-banner">
      <Icon name="info" />
      <div>{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
}: {
  label: string;
  value?: string;
  placeholder?: string;
}) {
  return (
    <label className="field">
      {label}
      <input defaultValue={value} placeholder={placeholder} />
    </label>
  );
}

function Validation({ go }: { go: (p: Page) => void }) {
  return (
    <>
      <PageHead
        title="Validar a Sofía Herrera"
        subtitle="AE-003 · Registro pendiente · Grupo detectado el 14 oct 2026, 09:45 (simulado)."
        action={
          <Button onClick={() => go("students")}>
            <Icon name="back" /> Volver a estudiantes
          </Button>
        }
      />
      <InfoBanner>
        <strong>Datos detectados: revisa antes de activar</strong>
        <p>
          Información de ejemplo obtenida al crear el grupo «Andino | Sofía Herrera». Confirma la
          identidad y el rol de cada integrante.
        </p>
      </InfoBanner>
      <div className="validation-grid">
        <div>
          <Card>
            <h3>Datos del estudiante</h3>
            <p>Completa o corrige los datos detectados.</p>
            <div className="field-grid">
              <Field label="Nombre completo *" value="Sofía Herrera" />
              <Field label="Correo *" placeholder="Completar correo del estudiante" />
              <Field label="Teléfono detectado *" value="+51 ••• ••• 103" />
              <Field label="Destino / programa" value="Australia · Inglés general" />
            </div>
            <div className="owner">
              Responsable del expediente <b>Carolina Ríos</b>
              <button>Cambiar</button>
            </div>
          </Card>
          <h3 className="outside-title">Integrantes del grupo</h3>
          <Card className="table-card">
            <table>
              <thead>
                <tr>
                  <th>INTEGRANTE</th>
                  <th>ROL ASIGNADO</th>
                  <th>ORIGEN</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Sofía Herrera", "+51 ••• ••• 103", "Estudiante", "Detectado"],
                  ["Carolina Ríos", "Personal de Andino", "Personal", "Directorio"],
                  ["Luis Salazar", "Personal de Andino", "Personal", "Directorio"],
                ].map((r) => (
                  <tr key={r[0]}>
                    <td>
                      <b className="blue">{r[0]}</b>
                      <small>{r[1]}</small>
                    </td>
                    <td>
                      <Button>
                        <Icon name="down" size={14} />
                        {r[2]}
                      </Button>
                    </td>
                    <td>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <p className="footnote">Los documentos enviados por personal quedan excluidos de IA.</p>
        </div>
        <div className="validation-side">
          <Card>
            <h3>Carpeta existente de Google Drive</h3>
            <p>Vincula un destino, no crees una carpeta duplicada.</p>
            <Badge tone="amber">Pendiente de vinculación</Badge>
            <Field
              label="Enlace o búsqueda de carpeta *"
              placeholder="Buscar carpeta existente..."
            />
            <Button>
              <Icon name="folder" /> Seleccionar carpeta
            </Button>
            <small>Solo se guardarán documentos tras completar la validación.</small>
          </Card>
          <Card>
            <h3>Comprobación de duplicados</h3>
            <p className="success">✓ &nbsp; Sin coincidencias por teléfono</p>
            <p>
              Búsqueda simulada en 8 registros. Completa el correo para finalizar la comprobación.
            </p>
            <Button>Buscar registros similares</Button>
          </Card>
        </div>
      </div>
      <Card className="sticky-actions">
        <div>
          <b>Faltan 2 requisitos para activar</b>
          <small>Completar el correo y vincular la carpeta de Drive.</small>
        </div>
        <div>
          <Button>Guardar borrador</Button>
          <Button disabled>
            <Icon name="lock" /> Confirmar y activar
          </Button>
        </div>
      </Card>
    </>
  );
}

const documents = [
  ["ana_pasaporte.pdf", "Ana Torres", "Pasaporte", "14 oct · 10:12", "Pendiente de revisión"],
  [
    "lucia_extracto.pdf",
    "Lucía Mendoza",
    "Extracto bancario",
    "14 oct · 10:18",
    "Pendiente de revisión",
  ],
  ["mateo_dni.pdf", "Mateo Silva", "DNI", "14 oct · 10:05", "En clasificación"],
  [
    "sofia_certificado.pdf",
    "Sofía Herrera",
    "Certificado de estudios",
    "14 oct · 09:52",
    "Pendiente de revisión",
  ],
  ["martin_pasaporte.pdf", "Martín Rojas", "Pasaporte", "14 oct · 09:48", "Recibido"],
  ["diego_visa.pdf", "Diego Ramírez", "Visa anterior", "14 oct · 09:35", "Pendiente de revisión"],
  ["guia_interna.pdf", "Luis Salazar", "Sin clasificación", "14 oct · 09:20", "Excluido de IA"],
];

function Documents({ go }: { go: (p: Page) => void }) {
  return (
    <>
      <PageHead
        title="Documentos"
        subtitle="12 documentos de estudiantes y 1 archivo de personal excluido. Recepciones de ejemplo."
        action={
          <Button primary onClick={() => go("review")}>
            <Icon name="scan" /> Revisiones pendientes (4)
          </Button>
        }
      />
      <Tabs items={["Todos (13)", "Por revisar (4)", "Almacenados (6)", "Excluidos (1)"]} />
      <Filters
        search="Buscar archivo o estudiante"
        filters={["Estado: todos", "Categoría: todas", "Remitente: todos"]}
      />
      <Card className="table-card">
        <table>
          <thead>
            <tr>
              <th>ARCHIVO / ESTUDIANTE</th>
              <th>REMITENTE / ROL</th>
              <th>CATEGORÍA</th>
              <th>FECHA Y HORA</th>
              <th>ESTADO</th>
              <th>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((r) => (
              <tr key={r[0]}>
                <td>
                  <b className="blue">{r[0]}</b>
                  <small>{r[1]}</small>
                </td>
                <td>
                  {r[1]}
                  <small>{r[0] === "guia_interna.pdf" ? "Personal" : "Estudiante"}</small>
                </td>
                <td>{r[2]}</td>
                <td>{r[3]}</td>
                <td>
                  <Badge
                    tone={
                      r[4].includes("Pendiente")
                        ? "amber"
                        : r[4] === "Excluido de IA"
                          ? "gray"
                          : "blue"
                    }
                  >
                    {r[4]}
                  </Badge>
                </td>
                <td>
                  <button className="link" onClick={() => go("review")}>
                    {r[4] === "Excluido de IA" ? "Ver origen →" : "Ver detalle →"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pager label="Mostrando 7 de 13 archivos · Página 1 de 2" />
      </Card>
      <InfoBanner>
        <strong>Los archivos del personal no pasan por IA</strong>
        <p>
          Se conservan como recepciones excluidas: no se clasifican ni se incorporan como documentos
          del estudiante.
        </p>
      </InfoBanner>
    </>
  );
}

function StudentDetail({ go }: { go: (p: Page) => void }) {
  return (
    <>
      <PageHead
        title="Ana Torres"
        subtitle="AE-001 · Expediente del estudiante · Responsable: Carolina Ríos."
        action={
          <div className="actions">
            <Button>
              <Icon name="pencil" /> Editar datos
            </Button>
            <Button danger>Desactivar</Button>
          </div>
        }
      />
      <div className="student-layout">
        <div className="student-aside">
          <Card>
            <div className="profile">
              <span>AT</span>
              <div>
                <b>Ana Torres</b>
                <Badge tone="green">Activo</Badge>
              </div>
            </div>
            <dl>
              <dt>Correo</dt>
              <dd>ana.torres@example.com</dd>
              <dt>Teléfono</dt>
              <dd>+51 ••• ••• 101</dd>
              <dt>Destino</dt>
              <dd>Australia</dd>
              <dt>Programa</dt>
              <dd>Inglés general</dd>
              <dt>Registro</dt>
              <dd>08 oct 2026</dd>
            </dl>
          </Card>
          <Card>
            <h3>Vinculaciones</h3>
            <p className="eyebrow">WHATSAPP · SIMULADO</p>
            <b>Andino | Ana Torres</b>
            <p>1 estudiante · 2 integrantes del personal</p>
            <p className="eyebrow">GOOGLE DRIVE · SIMULADO</p>
            <button className="link">AE-001_Ana_Torres ↗</button>
            <p>Carpeta existente vinculada</p>
          </Card>
        </div>
        <div>
          <Tabs items={["Documentos (3)", "Historial", "Vinculaciones"]} />
          <div className="metrics three">
            <Metric title="" value="3" note="Recibidos" />
            <Metric title="" value="2" note="Almacenados" />
            <Metric title="" value="1" note="Por revisar" />
          </div>
          <Card className="table-card">
            <table>
              <thead>
                <tr>
                  <th>DOCUMENTO</th>
                  <th>CATEGORÍA</th>
                  <th>ESTADO</th>
                  <th>ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "ana_pasaporte.pdf",
                    "14 oct 2026 · 10:12",
                    "Pasaporte",
                    "Pendiente de revisión",
                  ],
                  [
                    "ana_certificado.pdf",
                    "13 oct 2026 · 16:40",
                    "Certificado de estudios",
                    "Almacenado",
                  ],
                  ["ana_extracto.pdf", "12 oct 2026 · 11:20", "Extracto bancario", "Almacenado"],
                ].map((r) => (
                  <tr key={r[0]}>
                    <td>
                      <b>{r[0]}</b>
                      <small>{r[1]}</small>
                    </td>
                    <td>{r[2]}</td>
                    <td>
                      <Badge tone={r[3] === "Almacenado" ? "green" : "amber"}>{r[3]}</Badge>
                    </td>
                    <td>
                      <button className="link" onClick={() => go("review")}>
                        {r[3] === "Almacenado" ? "Ver detalle →" : "Revisar →"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pager label="Mostrando 3 de 3 documentos" />
          </Card>
          <InfoBanner>
            <strong>El historial se conserva</strong>
            <p>
              Desactivar el estudiante no elimina su expediente. Los documentos nuevos requieren
              revisión y autorización de almacenamiento.
            </p>
          </InfoBanner>
        </div>
      </div>
    </>
  );
}

function Review({ go }: { go: (p: Page) => void }) {
  return (
    <>
      <PageHead
        title="Revisar documento"
        subtitle="ana_pasaporte.pdf · DOC-012 · Recibido el 14 oct 2026, 10:12."
        action={
          <Button onClick={() => go("documents")}>
            <Icon name="back" /> Volver a documentos
          </Button>
        }
      />
      <div className="review-grid">
        <Card className="preview">
          <div className="preview-bar">
            <b>Vista previa ficticia</b>
            <span>− &nbsp;&nbsp; 100 % &nbsp;&nbsp; ＋</span>
          </div>
          <div className="paper">
            <small>DOCUMENTO DE EJEMPLO</small>
            <h2>PASAPORTE</h2>
            <p>Sin información personal ni validez oficial</p>
            <hr />
            <div className="passport">
              <div className="portrait">♙</div>
              <div>
                <small>NOMBRE: MUESTRA</small>
                <small>NÚMERO: XXXXXXXX</small>
                <small>FECHA: XX / XX / XXXX</small>
              </div>
            </div>
            <b className="sample">MUESTRA · NO VÁLIDO</b>
            <p>
              P&lt;&lt;MUESTRA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
              <br />
              XXXXXXXX&lt;&lt;&lt;DEMO&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
            </p>
          </div>
          <small>Página 1 de 1 · PDF · 1,2 MB</small>
        </Card>
        <div className="review-side">
          <Card>
            <div className="section-title">
              <h3>Ana Torres · AE-001</h3>
              <Badge tone="amber">Pendiente de revisión</Badge>
            </div>
            <p>
              Remitente: Ana Torres · Estudiante &nbsp; <Badge tone="green">Activo</Badge>
            </p>
            <b className="ai">
              <Icon name="sparkles" /> Categoría sugerida por IA: Pasaporte
            </b>
            <label className="field">
              Categoría final · puedes corregir
              <select>
                <option>Pasaporte</option>
              </select>
            </label>
            <p className="eyebrow">DESTINO EXISTENTE · SIMULADO</p>
            <b className="blue">Estudiantes / AE-001_Ana_Torres / Pasaporte</b>
            <p>Aún no almacenado. Requiere confirmación del personal.</p>
            <div className="actions">
              <Button>Guardar corrección</Button>
              <Button primary>✓ &nbsp; Confirmar y almacenar</Button>
            </div>
          </Card>
          <Card>
            <h3>Cronología del documento</h3>
            <ol className="timeline">
              <li>
                <time>10:12</time>
                <div>
                  <b>Recibido</b>
                  <small>WhatsApp · Grupo Andino | Ana Torres</small>
                </div>
              </li>
              <li>
                <time>10:13</time>
                <div>
                  <b>Clasificado por IA</b>
                  <small>Sugerencia: Pasaporte · resultado simulado</small>
                </div>
              </li>
              <li>
                <time>Ahora</time>
                <div>
                  <b>Revisión humana pendiente</b>
                  <small>Carolina Ríos · categoría por confirmar</small>
                </div>
              </li>
              <li>
                <time>Después</time>
                <div>
                  <b>Almacenamiento pendiente</b>
                  <small>Se registrará el destino y la hora al autorizar.</small>
                </div>
              </li>
            </ol>
          </Card>
        </div>
      </div>
      <p className="footnote">
        La revisión confirma la categoría y el destino documental; no certifica autenticidad,
        validez legal ni decisiones de visado.
      </p>
    </>
  );
}

function Alerts() {
  const items = [
    ["Alta", "14 oct · 10:18", "Estudiante inactivo", "Lucía Mendoza", "Nuevo extracto bancario"],
    [
      "Media",
      "14 oct · 09:52",
      "Carpeta no vinculada",
      "Sofía Herrera",
      "Certificado pendiente de destino",
    ],
    ["Media", "14 oct · 10:13", "Revisión de categoría", "Ana Torres", "Pasaporte sugerido por IA"],
    [
      "Media",
      "14 oct · 09:48",
      "Registro por validar",
      "Martín Rojas",
      "Identidad y carpeta por confirmar",
    ],
  ];
  const [selected, setSelected] = useState(0);
  const current = items[selected];
  return (
    <>
      <PageHead
        title="Alertas"
        subtitle="Revisa excepciones antes de continuar el flujo documental."
        action={
          <Button>
            <Icon name="refresh" /> Actualizar
          </Button>
        }
      />
      <Tabs items={["Abiertas (4)", "Resueltas (0)"]} />
      <div className="alerts-layout">
        <div className="alert-list">
          {items.map((a, i) => (
            <button
              className={i === selected ? "selected" : ""}
              key={a[2]}
              onClick={() => setSelected(i)}
            >
              <div>
                <Badge tone={a[0] === "Alta" ? "amber" : "gray"}>{a[0]}</Badge>
                <time>{a[1]}</time>
              </div>
              <b>{a[2]}</b>
              <strong>{a[3]}</strong>
              <span>{a[4]}</span>
            </button>
          ))}
        </div>
        <div className="alert-detail">
          <Card>
            <div className="section-title">
              <h2>{selected === 0 ? "Documento de estudiante inactivo" : current[2]}</h2>
              <Badge tone="amber">Abierta</Badge>
            </div>
            <div className="warning">
              <Icon name="warning" />
              <div>
                <b>
                  {selected === 0 ? "No se ha guardado en Google Drive" : "Acción manual requerida"}
                </b>
                <p>
                  El archivo permanece pendiente de revisión. No se almacenará automáticamente
                  mientras no exista autorización del personal.
                </p>
              </div>
            </div>
            <div className="detail-cols">
              <div>
                <span>ESTUDIANTE</span>
                <b>{current[3]} · AE-004</b>
                <Badge tone="gray">Inactivo</Badge>
              </div>
              <div>
                <span>DOCUMENTO RECIBIDO</span>
                <b>lucia_extracto.pdf</b>
                <small>14 oct 2026 · 10:18</small>
              </div>
            </div>
            <p>
              Remitente: Lucía Mendoza · Estudiante
              <br />
              Grupo: Andino | Lucía Mendoza · Inactiva desde el 12 oct.
            </p>
            <label className="field">
              Categoría para revisión
              <select>
                <option>Extracto bancario</option>
              </select>
            </label>
            <p className="eyebrow">DESTINO PROPUESTO · NO ALMACENADO</p>
            <b className="blue">Estudiantes / AE-004_Lucia_Mendoza / Extractos</b>
            <label className="check">
              <input type="checkbox" /> He revisado la categoría y la carpeta de destino.
            </label>
            <div className="actions">
              <Button>
                <Icon name="files" /> Ver documento
              </Button>
              <Button disabled>
                <Icon name="lock" /> Autorizar almacenamiento
              </Button>
            </div>
          </Card>
          <Card className="reactivation">
            <div>
              <h3>Reactivación: una decisión independiente</h3>
              <p>
                Reactivar cambia el estado del estudiante. No autoriza ni guarda este documento; la
                revisión anterior sigue siendo necesaria.
              </p>
            </div>
            <Button>Reactivar estudiante</Button>
          </Card>
        </div>
      </div>
    </>
  );
}

function Integrations() {
  return (
    <>
      <PageHead
        title="Integraciones"
        subtitle="Configura el puente documental sin reemplazar las herramientas del equipo."
        action={
          <Button>
            <Icon name="settings" /> Revisar configuración
          </Button>
        }
      />
      <Tabs items={["Servicios", "Reglas del flujo", "Registro de eventos"]} />
      <InfoBanner>
        <strong>Todas las conexiones son simuladas</strong>
        <p>
          Esta demostración no accede a WhatsApp Business ni a Google Drive. Estados, cuentas y
          revisiones son ejemplos visuales.
        </p>
      </InfoBanner>
      <div className="integration-grid">
        <IntegrationCard
          icon="message"
          title="WhatsApp Business"
          badge="Recepción simulada"
          rows={[
            ["Cuenta de ejemplo", "Andino · +51 ••• ••• 000"],
            ["Grupos de ejemplo", "8 grupos · 8 estudiantes detectados"],
            ["Última revisión simulada", "14 oct 2026 · 10:30"],
          ]}
          text="Identifica al remitente antes de clasificar. Los archivos enviados por personal quedan excluidos de IA."
          buttons={["Configurar recepción", "Revisar grupos"]}
        />
        <IntegrationCard
          icon="folder"
          title="Google Drive"
          badge="Vinculación simulada"
          rows={[
            ["Cuenta de ejemplo", "documentos@andino.example"],
            ["Carpetas de ejemplo", "6 vinculadas · 2 pendientes de vinculación"],
            ["Destino de trabajo", "Carpetas existentes / Estudiantes"],
          ]}
          text="Guarda solo en la carpeta vinculada. Los casos de estudiantes inactivos requieren autorización específica."
          buttons={["Configurar destino", "Revisar carpetas"]}
        />
      </div>
      <Card>
        <h3>Reglas de seguridad documental</h3>
        <div className="rules">
          <Rule
            icon="userCheck"
            title="Validación del registro"
            text="Datos completos y carpeta existente antes de activar."
          />
          <Rule
            icon="scan"
            title="Revisión humana"
            text="La IA sugiere categorías; no toma decisiones de visado."
          />
          <Rule
            icon="shield"
            title="Autorización explícita"
            text="Un documento de un inactivo nunca se guarda automáticamente."
          />
        </div>
      </Card>
      <p className="footnote">
        El flujo de grupos de WhatsApp es un supuesto del proyecto, sujeto a validación técnica; no
        garantiza disponibilidad en la API de WhatsApp Business.
      </p>
    </>
  );
}

function IntegrationCard({
  icon,
  title,
  badge,
  rows,
  text,
  buttons,
}: {
  icon: keyof typeof icons;
  title: string;
  badge: string;
  rows: string[][];
  text: string;
  buttons: string[];
}) {
  return (
    <Card>
      <div className="integration-title">
        <span>
          <Icon name={icon} />
        </span>
        <div>
          <h2>{title}</h2>
          <Badge>{badge}</Badge>
        </div>
      </div>
      <dl>
        {rows.map((r) => (
          <div key={r[0]}>
            <dt>{r[0]}</dt>
            <dd>{r[1]}</dd>
          </div>
        ))}
      </dl>
      <p>{text}</p>
      <div className="actions">
        {buttons.map((b, i) => (
          <Button key={b}>
            {i === 0 && <Icon name="settings" />}
            {b}
          </Button>
        ))}
      </div>
    </Card>
  );
}

function Rule({ icon, title, text }: { icon: keyof typeof icons; title: string; text: string }) {
  return (
    <div>
      <Icon name={icon} />
      <b>{title}</b>
      <p>{text}</p>
    </div>
  );
}

function Users() {
  const people = [
    [
      "Carolina Ríos",
      "carolina.rios@andino.example",
      "Administrador",
      "Habilitado",
      "14 oct · 10:30",
    ],
    ["Luis Salazar", "luis.salazar@andino.example", "Encargado", "Habilitado", "14 oct · 10:20"],
    ["Elena Paredes", "elena.paredes@andino.example", "Personal", "Habilitado", "13 oct · 17:45"],
    ["Pilar Vega", "pilar.vega@andino.example", "Personal", "Suspendido", "10 oct · 12:15"],
  ];
  return (
    <>
      <PageHead
        title="Usuarios y roles"
        subtitle="Administra el acceso del personal y los permisos del espacio de trabajo."
        action={
          <Button primary>
            <Icon name="userPlus" /> Invitar usuario
          </Button>
        }
      />
      <InfoBanner>
        <strong>Área exclusiva del administrador</strong>
        <p>
          Carolina Ríos tiene acceso de administradora. El personal y los encargados no pueden
          acceder a la gestión de usuarios.
        </p>
      </InfoBanner>
      <Tabs items={["Personal (4)", "Roles y permisos", "Invitaciones (0)"]} />
      <Filters search="Buscar por nombre o correo" filters={["Rol: todos", "Acceso: todos"]} />
      <Card className="table-card">
        <table>
          <thead>
            <tr>
              <th>PERSONAL</th>
              <th>ROL</th>
              <th>ACCESO</th>
              <th>ÚLTIMA ACTIVIDAD</th>
              <th>GESTIÓN</th>
            </tr>
          </thead>
          <tbody>
            {people.map((p) => (
              <tr key={p[0]}>
                <td>
                  <b className="blue">{p[0]}</b>
                  <small>{p[1]}</small>
                </td>
                <td>{p[2]}</td>
                <td>
                  <Badge tone={p[3] === "Habilitado" ? "green" : "gray"}>{p[3]}</Badge>
                </td>
                <td>{p[4]}</td>
                <td>
                  <button className="link">
                    {p[3] === "Habilitado" ? "Gestionar permisos →" : "Revisar acceso →"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pager label="Mostrando 4 de 4 usuarios" />
      </Card>
      <div className="permissions-grid">
        <Card>
          <h3>Permisos por rol</h3>
          <table className="permissions">
            <thead>
              <tr>
                <th>CAPACIDAD</th>
                <th>Personal</th>
                <th>Encargado</th>
                <th>Administrador</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Revisar y clasificar documentos", "✓", "✓", "✓"],
                ["Activar y desactivar estudiantes", "—", "✓", "✓"],
                ["Autorizar casos excepcionales", "—", "✓", "✓"],
                ["Configurar servicios y gestionar usuarios", "—", "—", "✓"],
              ].map((r) => (
                <tr key={r[0]}>
                  {r.map((c, i) => (
                    <td key={i}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card>
          <h3>Acceso con trazabilidad</h3>
          <Icon name="shield" />
          <p>
            Los cambios de rol y acceso quedan en el historial. Suspender un usuario no borra sus
            acciones anteriores.
          </p>
          <small>Permisos y actividad simulados.</small>
        </Card>
      </div>
    </>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("login");
  if (page === "login") return <Login go={setPage} />;
  const crumb: Record<Exclude<Page, "login">, string> = {
    home: "Inicio",
    students: "Estudiantes",
    validation: "Estudiantes / Validación",
    student: "Estudiantes / Ana Torres",
    documents: "Documentos",
    review: "Documentos / Revisión",
    alerts: "Alertas",
    integrations: "Configuración / Integraciones",
    users: "Configuración / Usuarios",
  };
  return (
    <Shell page={page} go={setPage} crumb={crumb[page]}>
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
