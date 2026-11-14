# Plan de Pruebas y Casos de Prueba — Andino Education Group

## 1. Plan de Pruebas

### 1.1 Objetivo
Verificar que el sistema de gestión documental automatizada de Andino Education Group cumpla las reglas de negocio, flujos operativos, restricciones de seguridad por rol y trazabilidad definidos para los **Sprints 1, 2 y 3**.

### 1.2 Alcance
- **Sprint 1 (`HU01`–`HU05`)**: Detección de grupo WhatsApp, validación de datos, vinculación única de carpeta Google Drive, etiquetado de participantes y bloqueo de duplicados.
- **Sprint 2 (`HU06`–`HU09`)**: Identificación de remitente, exclusión de `Personal de Andino`, clasificación automática por IA y corrección manual (`Validación humana`).
- **Sprint 3 (`HU10`–`HU12`)**: Almacenamiento automático en Google Drive con ruta destino, auditoría cronológica con fecha/hora y consulta del historial en la ficha del estudiante.
- **Control transversal**: Autenticación por roles (`Administrador`, `Encargado`, `Personal`) y enrutamiento por URL.

### 1.3 Estrategia y Tipos de Prueba
- **Pruebas de Caja Negra**: Validación funcional desde la interfaz web (entradas, acciones de usuario, mensajes de alerta/toast y resultados visibles en pantalla) sin inspeccionar el código fuente.
- **Pruebas de Caja Blanca**: Validación de rutas lógicas internas, condiciones (`if/else`), validaciones de estado y funciones en [AppStore.tsx](file:///c:/Users/Paul%20Bendezu/Desktop/Andino%20Education%20Group/src/shared/context/AppStore.tsx), [useAppRouter.ts](file:///c:/Users/Paul%20Bendezu/Desktop/Andino%20Education%20Group/src/shared/router/useAppRouter.ts) y [App.tsx](file:///c:/Users/Paul%20Bendezu/Desktop/Andino%20Education%20Group/src/App.tsx).

### 1.4 Ambiente y Cuentas de Prueba
- **URL local**: `http://localhost:8443/`
- **Cuentas**:
  - `carolina@andino.edu` (`Administrador`)
  - `luis.vega@andino.edu` (`Encargado`)
  - `valeria.q@andino.edu` (`Personal`)
- **Criterio de aceptación**: 100% de los casos críticos de negocio (bloqueo sin carpeta, exclusión de personal, bloqueo de duplicados y permisos por rol) deben aprobar sin excepciones.

---

## 2. Casos de Prueba — Sprint #1 (`HU01` a `HU05`)

### Caja Negra (Sprint 1)
| ID | HU | Escenario | Pasos | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **CN-S1-01** | `HU01` | Detección de nuevo grupo WhatsApp | 1. Iniciar sesión como `Encargado` o `Administrador`.<br>2. Clic en `+ Nuevo grupo WhatsApp`. | Se crea ficha en estado `Pendiente`, redirige a `/estudiantes/validar`, extrae nombre/teléfono y genera alerta abierta. |
| **CN-S1-02** | `HU02` / `HU03` | Intento de activación sin carpeta Drive | 1. En `/estudiantes/validar`, dejar vacío el campo *Carpeta de Google Drive*.<br>2. Clic en `Confirmar y activar`. | El sistema bloquea la activación y muestra aviso indicando que debe vincular una carpeta Drive. El estado sigue `Pendiente`. |
| **CN-S1-03** | `HU02` / `HU03` / `HU04` | Validación completa y activación | 1. Completar correo y destino.<br>2. Etiquetar participantes (`Estudiante` / `Personal de Andino`).<br>3. Clic en `Sugerir carpeta Drive` y luego `Confirmar y activar`. | El estudiante pasa a `Activo`, se resuelve la alerta pendiente y redirige a `/estudiantes/ficha`. |
| **CN-S1-04** | `HU05` | Bloqueo de registro duplicado | 1. Abrir un estudiante `Pendiente`.<br>2. Ingresar el mismo teléfono o correo de un estudiante `Activo` (ej. `+51 984 210 432`).<br>3. Clic en `Confirmar y activar`. | Se bloquea el registro con mensaje de error de duplicidad; no activa ni sobrescribe al estudiante existente. |
| **CN-S1-05** | Seguridad | Restricción de rol `Personal` en validación | 1. Iniciar sesión como `Personal` (`valeria.q@andino.edu`).<br>2. Ir a `/estudiantes` o intentar abrir `/estudiantes/validar`. | No aparece el botón `Validar` ni `+ Nuevo grupo WhatsApp`; si accede por URL a `/estudiantes/validar`, redirige a `/inicio`. |

### Caja Blanca (Sprint 1)
| ID | Módulo / Función | Condición / Camino Lógico Evaluado | Entrada | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **CB-S1-01** | `AppStore.simulateWhatsAppGroup()` | Inserción al inicio de `students`, `alerts` y `timeline` inicial | Llamada sin argumentos | `newStudent.status === "Pendiente"`, `driveFolder === ""`, `timeline.length === 1`. |
| **CB-S1-02** | `AppStore.confirmAndActivateStudent()` | Rama `if (role === "Personal")` | `role = "Personal"` | Retorna `{ ok: false, error: "Sin permisos suficientes." }` sin mutar `students`. |
| **CB-S1-03** | `AppStore.confirmAndActivateStudent()` | Rama de duplicidad `s.id !== id && s.status === "Activo" && (phone || email)` | `phone = "+51 984 210 432"` | Retorna `{ ok: false }` y dispara `notify(..., "err")`. |
| **CB-S1-04** | `AppStore.confirmAndActivateStudent()` | Rama `!payload.driveFolder.trim()` | `driveFolder = "   "` | Retorna `{ ok: false }` y dispara `notify(..., "warn")`. |
| **CB-S1-05** | `AppStore.confirmAndActivateStudent()` | Camino feliz (`ok: true`) | Datos válidos + `driveFolder` no vacío | Actualiza `status: "Activo"`, añade evento `"Estudiante activado"` al `timeline` y marca alerta como `"Resuelta"`. |

---

## 3. Casos de Prueba — Sprint #2 (`HU06` a `HU09`)

### Caja Negra (Sprint 2)
| ID | HU | Escenario | Pasos | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **CN-S2-01** | `HU06` / `HU07` | Envío de archivo por `Personal de Andino` | 1. Seleccionar un estudiante.<br>2. Clic en `+ Archivo de Personal`. | En `/documentos`, el archivo aparece con remitente `Personal de Andino`, categoría `Sin clasificar` y estado `Excluido de IA`. No se sube a Drive. |
| **CN-S2-02** | `HU06` / `HU08` | Clasificación automática por IA (Estudiante `Activo`) | 1. Seleccionar a `Sofía Herrera` (`Activo`).<br>2. Clic en `+ Archivo de Estudiante`. | El archivo se clasifica automáticamente en una de las 5 categorías. Si tiene alta confianza (`>= 80%`), pasa a `Almacenado`; si es baja, a `Pendiente de revisión`. |
| **CN-S2-03** | `HU03` / `HU08` | Bloqueo de archivo de estudiante `Pendiente` | 1. Seleccionar a `Mateo Paredes` (`Pendiente`).<br>2. Clic en `+ Archivo de Estudiante`. | El documento queda en estado `Bloqueado (sin carpeta)` y se muestra alerta de error. |
| **CN-S2-04** | `HU09` | Corrección manual de categoría | 1. En `/documentos`, clic en `Revisar` en `estado_cuenta_octubre.jpg` (`Pendiente de revisión`).<br>2. Cambiar categoría a `Pasaporte` y clic en `Guardar como Validación humana`. | El documento cambia a categoría `Pasaporte`, estado `Almacenado` y muestra ruta en Drive. |

### Caja Blanca (Sprint 2)
| ID | Módulo / Función | Condición / Camino Lógico Evaluado | Entrada | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **CB-S2-01** | `AppStore.simulateFileUpload()` | Rama `if (senderRole === "Personal de Andino")` | `senderRole = "Personal de Andino"` | Crea `DocumentItem` con `status: "Excluido de IA"`, `validationType: "Excluido"`, `drivePath: undefined`. |
| **CB-S2-02** | `AppStore.guessCategory()` | Coincidencia de palabras clave en `fileName` | `"pasaporte_sofia.pdf"` / `"extracto_nov.jpg"` | Retorna `{ category: "Pasaporte", confidence: 97 }` / `{ category: "Extracto bancario", confidence: 64 }`. |
| **CB-S2-03** | `AppStore.simulateFileUpload()` | Umbral de confianza `guessed.confidence >= 80` | `confidence = 95` vs `confidence = 64` | `>= 80` asigna `status: "Almacenado"` + `drivePath`; `< 80` asigna `status: "Pendiente de revisión"` sin `drivePath`. |
| **CB-S2-04** | `AppStore.correctDocumentCategory()` | Rama estudiante `Activo` con carpeta vs no `Activo` | `docId = "doc-3"`, `category = "DNI"` | Actualiza `category`, `validationType: "Validación humana"`, `status: "Almacenado"` y genera `drivePath`. |

---

## 4. Casos de Prueba — Sprint #3 (`HU10` a `HU12`)

### Caja Negra (Sprint 3)
| ID | HU | Escenario | Pasos | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **CN-S3-01** | `HU10` | Ruta destino en Google Drive | 1. Ir a `/documentos`.<br>2. Verificar un documento en estado `Almacenado`. | Debajo del nombre del archivo se muestra la ruta completa: `Andino Drive / Estudiantes / <Estudiante> / <Categoría> / <archivo>`. |
| **CN-S3-02** | `HU11` | Auditoría de fecha, hora y estado | 1. En `/documentos`, revisar la columna `Fecha y hora` y `Estado` tras subir o validar un archivo. | Muestra fecha y hora exacta (`DD/MM/YYYY HH:mm:ss`) y el estado actualizado (`Almacenado`, `Pendiente de revisión`, `Excluido de IA`, etc.). |
| **CN-S3-03** | `HU12` | Historial cronológico en ficha del estudiante | 1. Ir a `/estudiantes` y abrir la ficha de `Sofía Herrera`.<br>2. Revisar el panel derecho *Historial cronológico*. | Lista todos los eventos en orden cronológico con acción, detalle, fecha/hora y actor responsable. |

### Caja Blanca (Sprint 3)
| ID | Módulo / Función | Condición / Camino Lógico Evaluado | Entrada | Resultado Esperado |
| :--- | :--- | :--- | :--- | :--- |
| **CB-S3-01** | `AppStore.nowFormatted()` | Formato de marca temporal | `new Date()` | Retorna cadena con formato `DD/MM/YYYY HH:mm:ss` con ceros a la izquierda (`padStart(2, "0")`). |
| **CB-S3-02** | `AppStore.simulateFileUpload()` / `correctDocumentCategory()` | Construcción de `drivePath` e inserción en `student.timeline` | `student.driveFolder` + `category` + `fileName` | `drivePath === "${student.driveFolder} / ${category} / ${fileName}"` y `student.timeline` incrementa en +1 evento. |
| **CB-S3-03** | `ValidationForm` / `ReviewForm` | Sincronización de estado mediante `key={student.id}` y `key={doc.id}` | Cambio de `selectedStudentId` o `selectedDocId` | React remonta el formulario con los valores exactos del nuevo registro seleccionado sin arrastrar datos previos. |
