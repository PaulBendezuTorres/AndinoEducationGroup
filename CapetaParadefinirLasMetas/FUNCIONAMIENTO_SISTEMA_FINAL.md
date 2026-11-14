# Funcionamiento del Programa Finalizado — Andino Education Group

## 1. Visión General del Sistema
El software actúa como un **puente automatizado y trazable** entre **WhatsApp Business** y **Google Drive** para la gestión documental de estudiantes que postulan a estudios en el extranjero (principalmente Australia). 

El sistema **no reemplaza** a WhatsApp ni a Google Drive: escucha lo que ocurre en los grupos de WhatsApp, identifica quién envía cada archivo, clasifica los documentos de los estudiantes mediante Inteligencia Artificial, los organiza automáticamente en la carpeta de Google Drive correspondiente y ofrece un **Panel Web Centralizado** para que el equipo supervise, valide excepciones y consulte el historial sin descargar archivos manualmente.

---

## 2. Flujo Operativo Paso a Paso (De Principio a Fin)

### Paso 1: Detección y Registro Inicial del Estudiante (Una sola vez)
1. **Creación del grupo:** Un asesor de Andino Education Group crea un grupo formal de WhatsApp con el nuevo estudiante (por ejemplo: *"Andino | Sofía Herrera"*).
2. **Captura automática:** El sistema detecta la creación del grupo en menos de 5 segundos y genera automáticamente una ficha de estudiante en estado **`Pendiente`**, extrayendo los datos iniciales disponibles (nombre y teléfono) e identificando a los participantes del grupo.
3. **Validación humana y vinculación:** Un encargado ingresa al panel web, revisa o completa los datos del estudiante (correo, destino/programa), confirma qué participante es el **Estudiante** y quiénes son **Personal de Andino**, y vincula la **carpeta existente de Google Drive** del estudiante.
4. **Activación:** Al guardar y confirmar, el estudiante pasa a estado **`Activo`**. Si el estudiante ya estaba registrado previamente (mismo teléfono o correo), el sistema bloquea la duplicidad y no vuelve a pedir sus datos.
   * *Regla de seguridad:* Mientras el estudiante esté en estado `Pendiente` o no tenga una carpeta de Drive vinculada, el sistema **no almacena** ningún documento en Drive.

### Paso 2: Recepción y Filtrado Inteligente de Archivos
1. **Envío por WhatsApp:** Durante el proceso de asesoría, tanto el estudiante como los asesores envían mensajes y archivos (PDF, fotos de documentos, guías internas) al grupo de WhatsApp.
2. **Filtro por rol del remitente:** El sistema verifica automáticamente quién envió el archivo:
   * **Si lo envía alguien del Personal de Andino:** El sistema etiqueta el archivo como **`Excluido de IA`**, no lo procesa ni lo sube a la carpeta del estudiante, evitando mezclar folletos o guías internas con documentos oficiales.
   * **Si lo envía el Estudiante:** El archivo continúa hacia el módulo de clasificación inteligente.

### Paso 3: Clasificación con Inteligencia Artificial y Revisión Humana
1. **Análisis automático:** La Inteligencia Artificial analiza el contenido del PDF o imagen (en menos de 10 segundos) y sugiere la categoría documental correspondiente:
   * *Pasaporte*
   * *DNI*
   * *Certificado de estudios*
   * *Extracto bancario*
   * *Visa anterior*
2. **Control de calidad (Validación humana):** 
   * Si la IA clasifica con alta confianza y el estudiante está `Activo`, el documento avanza al almacenamiento.
   * Si la IA detecta baja confianza (por ejemplo, una foto borrosa) o el encargado desea revisar, el documento queda en **`Pendiente de revisión`**. El encargado puede abrir la vista previa en el panel, corregir la categoría manualmente si hace falta y confirmar.

### Paso 4: Almacenamiento Automático en Google Drive y Trazabilidad
1. **Traslado directo:** Una vez confirmada la categoría, el sistema envía el archivo directamente desde la nube hacia la carpeta vinculada del estudiante en Google Drive, manteniendo su integridad sin ocupar espacio en las computadoras del personal.
2. **Registro de auditoría (Log):** Cada acción queda guardada cronológicamente con fecha, hora exacta, remitente, categoría asignada, ruta de destino en Drive y usuario que validó (con retención de auditoría de 12 meses).
3. **Consulta en el expediente:** En la ficha del estudiante dentro del panel web, el equipo puede ver al instante cuántos documentos se recibieron, cuáles ya están almacenados y cuáles faltan por revisar, sin tener que abrir WhatsApp ni buscar carpetas manualmente.

### Paso 5: Gestión de Estudiantes Inactivos y Sistema de Alertas
1. **Desactivación:** Si un estudiante decide pausar o abandonar su trámite, el encargado cambia su estado a **`Inactivo`**. Toda su documentación e historial previo permanecen intactos para futuras consultas.
2. **Retención preventiva y alerta:** Si ese estudiante `Inactivo` vuelve a escribir o enviar un documento al grupo de WhatsApp meses después:
   * El sistema **retiene** el archivo en estado **`Pendiente de revisión`** y **prohíbe** su guardado automático en Drive.
   * En menos de 1 minuto, se dispara una **Alerta de prioridad alta** en el panel web notificando al encargado.
   * El encargado revisa la alerta y decide de forma independiente si autoriza el almacenamiento de ese documento y si reactiva el expediente del estudiante.

---

## 3. Roles y Permisos en el Programa Finalizado

| Rol | Qué puede hacer en el sistema | Qué tiene restringido |
| :--- | :--- | :--- |
| **Personal (Asesor)** | • Consultar el panel general, expedientes e historial de estudiantes.<br>• Revisar y confirmar o corregir la clasificación de documentos pendientes. | • No puede activar ni desactivar estudiantes.<br>• No puede autorizar casos excepcionales de inactivos.<br>• No accede a configuración de integraciones ni usuarios. |
| **Encargado** | • Todo lo del rol Personal.<br>• Validar registros nuevos y vincular carpetas de Google Drive.<br>• Activar o desactivar estudiantes.<br>• Autorizar el almacenamiento de documentos retenidos de estudiantes inactivos. | • No puede gestionar cuentas de usuarios, roles ni credenciales técnicas de las APIs. |
| **Administrador** | • Acceso total a toda la operación documental.<br>• Gestionar usuarios, asignar roles y suspender accesos.<br>• Configurar y supervisar el estado de las integraciones (WhatsApp Business, Google Drive e IA). | • Sin restricciones operativas (todas sus acciones quedan auditadas). |

---

## 4. Resultado Final para la Agencia
Con el software finalizado, el flujo diario del equipo se reduce a **supervisar excepciones desde un único panel web**:
1. Validar una única vez a los estudiantes nuevos.
2. Revisar únicamente los documentos marcados como *Pendiente de revisión* o *Alertas*.
3. Tener la certeza de que cada documento enviado por un estudiante activo ya está clasificado, auditado y guardado en su carpeta exacta de Google Drive.