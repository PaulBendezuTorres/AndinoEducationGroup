# Especificación de Incrementos por Sprint — Andino Education Group

## 1. Objetivo del Prototipo Maquetado
Construir una aplicación web interactiva maquetada (sin backend ni APIs reales conectadas) enfocada **únicamente en demostrar el cumplimiento funcional de los 5 Sprints (Incrementos)** del sistema de automatización documental entre WhatsApp Business y Google Drive.

* **Enfoque:** Funcionalidad, flujo de datos simulados, transiciones de estado y reglas de negocio por cada Sprint.
* **Control de Incrementos:** Incluir un **Selector de Sprint (Sprint 1 a Sprint 5)** y botones de **Simulación de Eventos** para ejecutar y validar cada historia de usuario en vivo.

---

## 2. Incrementos por Sprint (Qué debe cumplir cada entrega)

### Incremento 1 — SPRINT 1: Gestión y Registro Inicial (`HU01` a `HU05`)
**Objetivo:** Detectar la creación de un grupo de WhatsApp, registrar al estudiante como pendiente, validar sus datos una sola vez y vincular su carpeta de Google Drive.

* **`HU01` Registro automático de estudiante:**
  * *Simulación:* Botón `"Simular creación de grupo WhatsApp"`.
  * *Cumplimiento:* Crea un registro de estudiante con estado `Pendiente` en menos de 5 segundos y extrae datos básicos detectados (nombre y teléfono).
* **`HU02` Confirmación y edición de datos:**
  * *Cumplimiento:* Formulario que permite editar/completar nombre, correo, teléfono y destino/programa. El estado del estudiante **no pasa a `Activo`** hasta que el encargado confirme explícitamente los datos.
* **`HU03` Vinculación con Google Drive:**
  * *Cumplimiento:* Permite asociar una única carpeta de Google Drive existente al estudiante. El sistema **bloquea el almacenamiento** de cualquier documento si el estudiante no tiene una carpeta vinculada.
* **`HU04` Diferenciación entre estudiante y personal:**
  * *Cumplimiento:* Permite etiquetar a los participantes del grupo según su rol (`Estudiante` vs. `Personal de Andino`).
* **`HU05` Bloqueo de registro duplicado:**
  * *Cumplimiento:* Valida teléfono y correo contra los estudiantes ya registrados; si ya existe un registro activo, impide crear uno nuevo o volver a solicitar datos.

---

### Incremento 2 — SPRINT 2: Clasificación Inteligente con IA (`HU06` a `HU09`)
**Objetivo:** Filtrar los archivos según quien los envía, clasificar automáticamente los documentos del estudiante con IA y permitir corrección humana.

* **`HU06` Identificación del remitente:**
  * *Simulación:* Botón `"Simular envío de archivo en grupo"` eligiendo si lo envía el Estudiante o un Asesor.
  * *Cumplimiento:* Cada archivo recibido queda asociado al remitente exacto antes de procesarse.
* **`HU07` Procesamiento exclusivo de documentos de estudiantes:**
  * *Cumplimiento:* Si el remitente es `Personal`, el archivo **no pasa por IA** y queda registrado como `Excluido de IA`. Solo los archivos enviados por `Estudiante` entran al flujo de clasificación.
* **`HU08` Reconocimiento del tipo de documento (IA simulada):**
  * *Cumplimiento:* Simula el análisis con Gemini API (< 10 segundos) y asigna una categoría del catálogo: `Pasaporte`, `DNI`, `Certificado de estudios`, `Extracto bancario` o `Visa anterior`.
* **`HU09` Corrección manual de clasificación:**
  * *Cumplimiento:* Permite al encargado revisar la categoría sugerida por la IA, cambiarla manualmente desde un selector y guardar el cambio marcado como `Validación humana`.

---

### Incremento 3 — SPRINT 3: Almacenamiento Automatizado y Trazabilidad (`HU10` a `HU12`)
**Objetivo:** Trasladar los archivos clasificados hacia Google Drive y registrar toda la trazabilidad e historial cronológico.

* **`HU10` Almacenamiento automático en Drive:**
  * *Cumplimiento:* Una vez clasificado (y validado si corresponde), el documento cambia su estado a `Almacenado` y muestra la ruta simulada dentro de la carpeta vinculada del estudiante en Google Drive.
* **`HU11` Registro de fecha, hora y estado:**
  * *Cumplimiento:* Cada documento procesado guarda y muestra en pantalla su registro de auditoría: fecha, hora exacta y estado actual (`Recibido`, `En clasificación`, `Pendiente de revisión`, `Almacenado`, `Excluido`).
* **`HU12` Consulta de historial documental:**
  * *Cumplimiento:* Muestra una lista o línea de tiempo cronológica por estudiante con todos los eventos y documentos recibidos de inicio a fin.

---

### Incremento 4 — SPRINT 4: Gestión de Estados y Alertas (`HU13` a `HU16`)
**Objetivo:** Controlar el ciclo de vida del estudiante, retener documentos de casos inactivos y alertar al encargado.

* **`HU13` Consulta del estado del estudiante:**
  * *Cumplimiento:* Cada estudiante muestra claramente su estado actual (`Pendiente`, `Activo` o `Inactivo`) en su ficha y listados.
* **`HU14` Desactivación sin pérdida de historial:**
  * *Cumplimiento:* Acción para cambiar un estudiante `Activo` a `Inactivo` conservando intactos todos sus documentos e historial previos para consulta.
* **`HU15` Documentos pendientes de revisión de inactivos:**
  * *Simulación:* Botón `"Simular envío de documento de estudiante Inactivo"`.
  * *Cumplimiento:* El sistema **retiene** el archivo en estado `Pendiente de revisión` y **prohíbe** su guardado automático en Drive hasta que exista autorización explícita del encargado.
* **`HU16` Alerta por estudiante inactivo:**
  * *Cumplimiento:* Genera una notificación/alerta inmediata (< 1 minuto simulado) en el módulo de Alertas permitiendo al encargado autorizar el guardado del documento y decidir por separado si reactiva o no al estudiante.

---

### Incremento 5 — SPRINT 5: Panel Web, Filtros y Cierre (`HU17` a `HU18`)
**Objetivo:** Centralizar la supervisión operativa en un panel web con filtros dinámicos y control por roles.

* **`HU17` Panel de estados y documentos:**
  * *Cumplimiento:* Vista consolidada con indicadores resumen (total estudiantes, documentos procesados, pendientes de revisión, alertas abiertas) y lista de estudiantes con sus documentos y estados.
* **`HU18` Filtro por estado del estudiante:**
  * *Cumplimiento:* Filtros interactivos instantáneos por estado (`Todos`, `Pendiente`, `Activo`, `Inactivo`) y búsqueda rápida que actualizan los resultados en tiempo real.
* **Control de acceso por rol:**
  * *Cumplimiento:* Selector rápido de sesión por rol (`Administrador`, `Encargado`, `Personal`) que habilita o restringe acciones críticas (como activar/desactivar estudiantes o gestionar usuarios y servicios).

---

## 3. Reglas para Antigravity al Construir el Prototipo
1. **Prioridad 100% funcional sobre decoración:** Usa una interfaz limpia y sencilla (Tailwind CSS estándar) enfocada en que **todas las acciones, reglas y bloqueos de cada Sprint funcionen de verdad en memoria**.
2. **Barra de Pruebas de Sprints:** Incluye un panel superior o lateral con botones directos para disparar los eventos externos de cada Sprint (crear grupo WhatsApp, recibir documento de estudiante, recibir documento de personal, recibir documento de inactivo) y reiniciar los datos de prueba cuando sea necesario.
3. **Datos iniciales listos:** Precarga estudiantes en los 3 estados (`Activo`, `Pendiente`, `Inactivo`) y documentos en distintos estados para poder probar cada incremento sin empezar desde cero.