# Andino Education Group — Gestión Documental

Aplicación web para la gestión documental automatizada de estudiantes, integrando el flujo entre **WhatsApp Business**, clasificación con **Inteligencia Artificial** y almacenamiento en **Google Drive** con trazabilidad completa.

## Funcionalidades principales

- **Gestión de estudiantes**: Detección de grupos de WhatsApp en estado `Pendiente`, validación de datos, bloqueo de duplicados y vinculación única con Google Drive.
- **Clasificación documental**: Filtrado automático por remitente (`Excluido de IA` para `Personal de Andino`), clasificación inteligente para documentos de estudiantes y corrección manual (`Validación humana`).
- **Trazabilidad y auditoría**: Registro cronológico por estudiante y vista consolidada de documentos con fecha, hora, estado y ruta destino.
- **Alertas y ciclo de vida**: Retención preventiva de documentos de estudiantes `Inactivo` con alertas prioritarias y autorización controlada.
- **Control de acceso por roles**:
  - **Administrador**: Acceso total, integraciones y gestión de usuarios.
  - **Encargado**: Validación de estudiantes, vinculación de Drive, cambios de estado y autorización de alertas.
  - **Personal**: Consulta de expedientes y revisión/corrección manual de documentos.

## Estructura del proyecto

```text
src/
├── features/
│   └── sprintBar/        # Barra contextual de acciones rápidas
├── shared/
│   ├── components/       # Componentes UI reutilizables
│   ├── context/          # Estado global y reglas de negocio (AppStore)
│   ├── data/             # Datos iniciales precargados
│   ├── router/           # Enrutador con URLs reales (History API)
│   └── types/            # Tipos de dominio (TypeScript)
├── App.tsx               # Vistas principales y control por roles
├── index.css             # Estilos globales y responsividad
└── main.tsx              # Punto de entrada
```

## Instalación y ejecución local

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:8443/`.

## Compilación para producción

```bash
npm run build
```
