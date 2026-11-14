---
trigger: always_on
---

# Reglas del Proyecto — Andino Education Group

## 1. Fuentes (No modificar)
Las fuentes del proyecto están definidas en `src/index.css` y **no se deben cambiar ni reemplazar**:
- Principal: `"Inter:Regular", Inter, Arial, sans-serif` (`400`, `600` con `"Inter:Semi Bold"`)
- Soporte: `"Noto Sans:Regular"`, `"Noto Sans Math:Regular"`, `"Noto Sans Symbols:Regular"`, `"Noto Sans Symbols2:Regular"`

## 2. Colores de la empresa (No modificar)
Respetar estrictamente la paleta de colores definida en `src/index.css`:
- Texto principal: `#26364b`
- Fondo base: `#f4f7fb`
- Superficies / tarjetas / sidebar: `#ffffff`
- No introducir colores arbitrarios fuera de los tokens y clases existentes en `src/index.css`.

## 3. Arquitectura basada en funcionalidades (Feature-Based)
- Organizar el código por funcionalidad de negocio bajo `src/features/<funcionalidad>/` (componentes, estado/hooks, tipos y lógica propia).
- Colocar componentes UI y utilidades reutilizables transversales en `src/shared/`.
- Evitar mezclar lógica de distintas funcionalidades en un mismo archivo.

## 4. Diseño visual y responsividad
- **No cambiar el diseño** existente al agregar nuevas funcionalidades; mantener la estética, espaciados, jerarquía y componentes actuales.
- **Toda la web debe ser responsiva** (adaptada correctamente a móvil, tablet y escritorio).
- **Escala tipográfica uniforme en todas las pantallas**:
  - Título de página (`h1`): `24px` en escritorio / `20px` en móvil (`font-weight: 600`).
  - Subtítulo de página (`.page-head p`): `14px`, color `#64748b`.
  - Títulos de tarjeta/sección (`h3`): `16px` (`font-weight: 600`).
  - Botones (`.button`): `13px` (`font-weight: 600`), altura `36px`.
  - Texto base y tablas: `13px`–`14px`, color `#26364b`.

## 5. Estilo de respuesta
- Responder siempre **brevemente y directo al grano**, sin explicaciones largas ni rodeos.

## 6. Reglas de negocio críticas (No violar)
- **Bloqueo sin carpeta/pendiente**: Nunca almacenar en Drive si el estudiante está `Pendiente` o no tiene carpeta vinculada.
- **Exclusión de Personal**: Archivos enviados por `Personal` se marcan `Excluido de IA` y nunca pasan por IA ni se suben a Drive.
- **Retención de Inactivos**: Documentos de estudiantes `Inactivo` se retienen en `Pendiente de revisión` (prohibido guardado automático) y disparan alerta.
- **Control por roles**: Respetar restricciones de `Personal`, `Encargado` y `Administrador`.

## 7. Copy y redacción en la UI (No ser literal)
- **No copiar literalmente** las instrucciones o términos técnicos del usuario en la interfaz web (ej. evitar textos como *"Demostración"*, *"Datos ficticios. Sin conexiones reales"*, *"Entorno de demostración"*).
- Redactar siempre **textos naturales, profesionales y orientados al usuario final** de Andino Education Group.

## 8. Leyes de Gestalt y Armonía Visual
- **Simetría y Armonía**: Botones con altura (`36px`), padding (`0 14px`) y alineación uniformes; grillas balanceadas.
- **Cierre y Región Común**: Definir claramente dónde empieza y termina cada bloque/tarjeta (borde `#e2e8f0`, fondo `#ffffff`, `border-radius` y `padding` consistentes).
- **Proximidad**: Agrupar elementos relacionados (título + subtítulo, acciones juntas) con `gap` consistente y separar secciones distintas.
- **Proporción**: Evitar tarjetas estiradas con espacio vacío innecesario (`align-items: start` en grillas).
