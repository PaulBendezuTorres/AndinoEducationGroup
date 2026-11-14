# Metas y Tareas del Proyecto — Andino Education Group

## Meta 0: Base técnica y responsividad
- [ ] Auditar [src/App.tsx](file:///c:/Users/Paul%20Bendezu/Desktop/Andino%20Education%20Group/src/App.tsx) y extraer lógica por funcionalidad a `src/features/` y `src/shared/` sin cambiar el diseño visual.
- [ ] Garantizar diseño 100% responsivo (móvil, tablet y escritorio) en `src/index.css` y componentes.
- [ ] Precargar datos iniciales en los 3 estados (`Activo`, `Pendiente`, `Inactivo`) y documentos de ejemplo.
- [ ] Agregar Barra de Pruebas de Sprints para simular eventos y reiniciar datos.

## Meta 1: Sprint 1 — Gestión y Registro Inicial (`HU01`–`HU05`)
- [ ] `HU01`: Botón `"Simular creación de grupo WhatsApp"` que cree un estudiante `Pendiente` con nombre y teléfono.
- [ ] `HU02`: Formulario de confirmación/edición (nombre, correo, teléfono, destino/programa); pasa a `Activo` solo al confirmar.
- [ ] `HU03`: Vincular una única carpeta de Google Drive al estudiante; bloquear almacenamiento si no tiene carpeta.
- [ ] `HU04`: Etiquetar participantes del grupo como `Estudiante` o `Personal de Andino`.
- [ ] `HU05`: Validar teléfono y correo contra registros existentes para bloquear duplicados.

## Meta 2: Sprint 2 — Clasificación Inteligente con IA (`HU06`–`HU09`)
- [ ] `HU06`: Botón `"Simular envío de archivo en grupo"` eligiendo remitente (`Estudiante` o `Personal`).
- [ ] `HU07`: Si el remitente es `Personal`, marcar como `Excluido de IA` y no procesarlo.
- [ ] `HU08`: Simular clasificación IA para `Estudiante` (`Pasaporte`, `DNI`, `Certificado de estudios`, `Extracto bancario`, `Visa anterior`).
- [ ] `HU09`: Permitir corrección manual de categoría y guardar como `Validación humana`.

## Meta 3: Sprint 3 — Almacenamiento Automatizado y Trazabilidad (`HU10`–`HU12`)
- [ ] `HU10`: Cambiar documento clasificado/validado a `Almacenado` y mostrar ruta simulada en Drive.
- [ ] `HU11`: Registrar y mostrar auditoría por documento (fecha, hora exacta y estado).
- [ ] `HU12`: Mostrar línea de tiempo / historial cronológico completo por estudiante.

## Meta 4: Sprint 4 — Gestión de Estados y Alertas (`HU13`–`HU16`)
- [ ] `HU13`: Mostrar claramente el estado (`Pendiente`, `Activo`, `Inactivo`) en ficha y listados.
- [ ] `HU14`: Permitir desactivar un estudiante `Activo` a `Inactivo` conservando su historial intacto.
- [ ] `HU15`: Botón `"Simular envío de documento de estudiante Inactivo"` que retenga el archivo en `Pendiente de revisión` y bloquee guardado automático.
- [ ] `HU16`: Generar alerta inmediata para que el encargado autorice el guardado y decida si reactiva al estudiante.

## Meta 5: Sprint 5 — Panel Web, Filtros y Roles (`HU17`–`HU18`)
- [ ] `HU17`: Panel consolidado con métricas (total estudiantes, procesados, pendientes de revisión, alertas abiertas).
- [ ] `HU18`: Filtros instantáneos por estado (`Todos`, `Pendiente`, `Activo`, `Inactivo`) y búsqueda en tiempo real.
- [ ] Selector rápido de rol (`Administrador`, `Encargado`, `Personal`) que habilite o restrinja acciones según permisos.
