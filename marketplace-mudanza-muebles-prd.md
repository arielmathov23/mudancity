Este PRD define el alcance del POC de 7 días: un flujo completo end-to-end entre mudanzas, publicaciones públicas sin login, ofertas con gating y un panel owner con respuesta y coordinación. Si se implementa tal como está, podremos medir en la ventana de 7 días (tasa de publicaciones con ofertas, velocidad de respuesta <24h y % que llegan a coordinación real) usando timestamps consistentes desde Supabase.

# Marketplace para vender muebles de mudanza (POC 7 días)

## 1. Product Overview

Construimos una web app tipo marketplace para vender muebles usados por una mudanza. El owner crea una “mudanza” y luego una o más “publicaciones” con ítems (fotos, nombre, precio) y define si cada publicación vende todo el bundle o un subconjunto explícito. Cada publicación tiene una URL pública sin login que muestra ítems incluidos y el estado Open/Closed. Las personas pueden enviar ofertas con gating de login; el owner revisa ofertas en panel y, al responder “Sí”, se habilita un flujo de coordinación donde el contacto del buyer se comparte solo para esa oferta aceptada.

## 2. Core User Flows

Flujo Owner: (1) crea una mudanza; (2) crea una publicación asociada (bundle o subconjunto) y carga ítems con fotos/nombre/precio; (3) ajusta estado Open/Closed; (4) comparte/da de alta la publicación vía su URL pública. (5) en el panel, el owner ve ofertas en orden cronológico con resumen (precio, subconjunto, timestamp) y responde “Sí/No” registrando timestamp; (6) si “Sí”, el flujo pasa a coordinación pendiente; (7) owner marca “Coordinado” con timestamp cuando se concreta.

Flujo Buyer (happy path): (1) entra a la URL pública de una publicación; (2) revisa ítems incluidos y precios y verifica estado Open; (3) hace login (Google o email/pass); (4) completa el form obligatorio (email + teléfono); (5) envía una oferta con precio y checklist del subconjunto ofrecido; (6) espera respuesta del owner y, cuando sea “Sí”, el comprador ve el estado de coordinación (pendiente/coordinado) según aplique.

Flujo Guest (sin login): (1) entra a URL pública; (2) puede ver ítems incluidos/precios y estado Open/Closed; (3) si intenta ofertar, es redirigido a login y vuelve al formulario en contexto cuando ya inició sesión.

## 3. Functional Requirements

Estas son las capacidades en alcance para el POC. Se agrupan por áreas funcionales y se listan solo los features con prioridad “must/should” definidos en el reference board (sin re-priorizar ni fusionar).

### Authentication y gating

- must — Login y gating para ofertar: para enviar una oferta se exige autenticación; si no está logueado, el CTA “Ofertar” redirige a login y retorna al formulario con la publicación en contexto. El backend valida que la oferta pertenezca a una publicación existente y que el solicitante no sea el owner. Luego del login, el buyer completa un form obligatorio con email y teléfono.

### Mudanzas, Publicaciones e ítems

- must — Crear publicación mudanza (CRUD): el owner crea una “mudanza” y luego crea una o más “publicaciones” asociadas (mudanza_id). Carga ítems con fotos, nombre y precios; una publicación puede ser bundle (todos los ítems) o un subconjunto guardado explícitamente como “incluidos”. La publicación soporta edición y cierre con estado Open/Closed para afectar lo que se oferta desde la URL pública.

### Página pública (sin login)

- must — Página pública del listado: cada publicación tiene una URL pública que muestra los ítems incluidos y sus precios sin login. La página debe mostrar el estado Open/Closed para reducir ofertas tardías. Si el owner publicó subconjuntos, la vista pública renderiza solo los ítems incluidos.

### Ofertas y panel del owner

- must — Panel owner: ofertas y respuesta: el owner tiene un panel por publicación con ofertas recibidas en orden cronológico, mostrando resumen (precio, subconjunto y timestamps). Puede responder “Sí” o “No” por oferta; el sistema registra timestamp de respuesta para medir anti-spam por velocidad. Si el owner responde “Sí”, se habilita el flujo de coordinación para esa oferta y el contacto se maneja según la regla de compartición (ver feature “should” correspondiente).

### Oferta (payload del buyer)

- should — Oferta: precio y subconjunto: en el formulario de oferta, el buyer ingresa precio ofrecido y selecciona el subconjunto de muebles ofrecido basado en los ítems incluidos en la publicación. El backend valida que el subconjunto seleccionado sea un subconjunto válido de los ítems incluidos. (Si existe campo de condición mínima en UI, se registra y persiste; fuera de esto no se agrega lógica adicional en MVP).

### Compartición de contacto

- should — Compartir contacto al aceptar: cuando el owner responde “Sí”, se revela al owner el email y teléfono del buyer SOLO para esa oferta aceptada. El buyer no debe ver el contacto antes de la aceptación; el gating depende del estado de oferta. Se requiere validar que los datos existan (email/teléfono completados) antes de permitir el intercambio en UI y/o responder con mensaje de error si faltan.

### Coordinación y cierre

- should — Estado de coordinación y cierre: luego de un “Sí”, se habilita estado de coordinación: pendiente → coordinado (con timestamp) y coordinación cerrada/cancelada según interacción de MVP. En esta primera etapa, el owner marca “Coordinado” con timestamp; esa información se refleja en panel y vista del buyer para transparencia. No se implementan recordatorios o calendarización avanzada (fuera de alcance).

### Analítica básica para KPIs POC

- should — Analítica básica por KPI POC: instrumentación mínima con timestamps para calcular KPIs del POC en ventanas de 7 días desde la primera publicación del owner para esa mudanza. Se requiere consistencia con mudanza_id y campos created_at/response_at/coordination_at para medir: (1) publicación→oferta (tasa ≥1 oferta), (2) respuesta del owner &lt;24h, (3) coordinación real (ofertas que terminan en coordinación real). Se incluye una vista simple de conteos por cohort; fuera de alcance BI avanzado/exportación avanzada.

## 4. User Roles & Permissions

Definimos 3 tipos de usuario: Guest (no logueado), Buyer (logueado) y Owner (logueado). En este MVP no hay admin funcional dedicado dentro del producto (operaciones y soporte quedan fuera del alcance del panel).

Guest: puede ver la página pública de publicaciones (ítems incluidos, precios y Open/Closed) pero no puede enviar ofertas; el CTA de ofertar redirige a login.

Buyer: puede enviar ofertas solo para publicaciones Open y solo cuando haya completado el form obligatorio (email/teléfono). Buyer no puede ver el email/teléfono del owner ni la información de contacto del otro lado antes de la aceptación.

Owner: puede crear mudanzas y publicaciones, cerrar/abrir publicaciones, ver panel de ofertas por publicación y responder “Sí/No”; puede marcar coordinación como “Coordinado”. El backend debe impedir que un owner envíe ofertas a sus propias publicaciones y que un buyer acepte/revele contacto fuera del estado permitido.

## 5. Data Model & Key Objects

Entidades principales (conceptuales):

- Usuario: id (Supabase), rol (owner/buyer) y atributos de contacto del buyer (email, teléfono) cuando están completados.
- Mudanza: id, owner_id, created_at.
- Ítem: id, publicación_id, nombre, precio, fotos (URLs/paths), created_at.
- Publicación: id, mudanza_id, owner_id, título/descripcion mínima si aplica, estado Open/Closed, tipo de publicación (bundle vs subconjunto), y relación explícita de “incluidos” (qué ítems componen el conjunto publicado).
- Oferta: id, publicación_id, mudanza_id (derivado o persistido), buyer_id, precio_ofertado, selección de subconjunto (referencias a ítems incluidos), created_at.
- Respuesta del owner: respuesta (Sí/No), response_at, y estado de oferta resultante.
- Coordinación: coordinación para oferta aceptada, con estado (pendiente/coordinado/cerrado/cancelado) y timestamps (coordination_at/coordinado_at según corresponda).

Relaciones clave: una mudanza tiene N publicaciones; una publicación tiene N ítems; una publicación tiene M ofertas; una oferta puede tener una respuesta única del owner; una oferta aceptada puede crear un registro de coordinación.

## 6. Business Rules & Logic

1. Publicación como bundle vs subconjunto: si el owner elige bundle, los ítems incluidos son todos los ítems definidos para esa publicación. Si elige subconjunto, el sistema guarda explícitamente la lista de ítems incluidos y la UI pública renderiza solo esos ítems.

2. Validación del subconjunto en ofertas: al enviar una oferta, el backend valida subconjunto_ofrecido ⊆ ítems_incluidos de esa publicación. Si no cumple, la oferta se rechaza con error de validación y no se registra oferta parcial.

3. Gating por rol y estado: guest no puede enviar ofertas. Buyer solo puede ofertar si la publicación está Open y la oferta no pertenece al owner de esa publicación. Si la publicación está Closed, el formulario de ofertar debe deshabilitarse o devolver error.

4. Anti-spam por velocidad: el sistema registra response_at cuando el owner responde “Sí/No”. Los timestamps deben permitir calcular si respuesta fue &lt;24h para ofertas dentro de la ventana del POC.

5. Compartición de contacto controlada por estado: el email/teléfono del buyer se comparten al owner solo si la oferta está aceptada (“Sí”) y con el registro de esa oferta. En ningún caso el buyer debe ver el contacto antes de la aceptación.

6. Habilitación de coordinación: al responder “Sí”, la oferta queda en coordinación pendiente. El owner marca “Coordinado” con timestamp cuando termina el ciclo; ese estado es visible para el buyer.

## 7. Edge Cases & Error Handling

- Oferta con subconjunto inválido (por UI o manipulación): → backend rechaza con 4xx y mensaje “selección no válida para esta publicación”; no se crea registro de oferta.

- Buyer intenta ofertar siendo owner (misma publicación): → backend bloquea por regla de negocio y muestra error de permisos.

- Buyer intenta ofertar en publicación Closed: → UI deshabilita CTA o backend devuelve error; se evita registrar ofertas.

- Buyer no completó email/teléfono post-login: → el sistema no permite enviar oferta hasta completar el form obligatorio; si el login volvió “al contexto”, se guarda el contexto para retomar.

- Race condition: owner cierra publicación mientras hay buyer con formulario abierto: → backend vuelve a validar estado Open al enviar; si cambió a Closed, responde error.

- Múltiples ofertas del mismo buyer para la misma publicación: → se permiten en MVP (no se define unicidad), pero el panel y analytics deben tratar cada oferta como una unidad con timestamps propios.

- Owner responde dos veces sobre la misma oferta (doble click / reintento): → implementar idempotencia a nivel API para asegurar una sola respuesta y no duplicar timestamps.

- Contactos faltantes del buyer al aceptar: → si falta email o teléfono, el sistema debe impedir la revelación y registrar un estado de error para que el owner no reciba datos incompletos (o forzar completar datos antes del “Sí”, según decisión de implementación).

## 8. Success Metrics & Analytics

POC (7 días): medimos desde la fecha de la primera publicación del owner para una mudanza (anchor). Se calculan KPIs por mudanza y agregados por cohort (por ventana) para tomar decisiones de siguiente iteración.

Eventos/fields a instrumentar:

- publication_created: (mudanza_id, publicación_id, created_at)
- offer_created: (mudanza_id, publicación_id, oferta_id, created_at, subconjunto_count)
- owner_response_recorded: (oferta_id, response_at, accepted=true/false)
- coordination_status_changed: (oferta_id, estado, timestamp)

KPIs a medir: (a) ≥25% de publicaciones reciben ≥1 oferta en 7 días: publicaciones con count(offer_created en ventana) ≥ 1 / total de publicaciones de esa mudanza en cohort. (b) % ofertas con respuesta del owner en &lt;24h dentro de 7 días: ofertas creadas en ventana con owner_response_recorded y (response_at - offer_created) &lt; 24h. (c) ≥15% de ofertas terminan en coordinación real dentro de 7 días: ofertas aceptadas (Sí) que llegan a estado coordinado con timestamp dentro de la ventana / ofertas aceptadas creadas en ventana.

Nota: no incorporamos BI avanzado; la vista simple debe mostrar conteos y tasas con cortes por mudanza y sumario de la ventana.

## 9. Technical Constraints & Dependencies

- Supabase Auth: login con Google sign-in y email/pass. Después del login, el buyer completa form obligatorio con email y teléfono.
- Supabase Storage: fotos de ítems se almacenan en storage y se renderizan en la página pública.
- Backend/API: validación obligatoria de pertenencia de oferta a publicación, validación de subconjunto ⊆ incluidos, y regla de no permitir ofertas del owner sobre sus propias publicaciones.
- Política de seguridad: usar RLS (o control equivalente) para asegurar que el panel owner y la lectura de datos privados (contacto) dependan del estado de oferta aceptada.
- Arquitectura: web app independiente para este POC; no se reutiliza código del “021”.
- Rendimiento: la página pública debe cargar el listado sin depender de login; si hay muchas fotos, se recomienda estrategia de carga progresiva (lazy-load) para no romper tiempos de carga percibidos.

## 10. Testing & QA Requirements

Flujo publicación mudanza:

- Test funcional: crear mudanza → crear publicación bundle vs subconjunto y verificar que los ítems “incluidos” se guardan correctamente.
- Test de estado: cambiar Open/Closed y comprobar que la UI pública y el gating de ofertas respetan el estado.

Página pública:

- Test funcional: renderiza solo ítems incluidos, muestra precios correctos y etiqueta Open/Closed.
- Test de regresión visual: comprobar consistencia en Chrome/Firefox/Safari.

Login y gating:

- Test funcional: guest → CTA “Ofertar” redirige a login y retorna al formulario con contexto.
- Test de validación: buyer no puede enviar oferta si email/teléfono no están completados.

Oferta y panel owner:

- Test funcional: envío de oferta con subconjunto válido vs inválido (manipulación del checklist) → 4xx en inválido.
- Test de autorización: owner no puede ofertar; buyer no puede leer contacto.
- Test anti-doble: doble click o reintentos no duplican respuesta.
- Test de velocidad: calcular “&lt;24h” usando timestamps reales (y zona horaria consistente).

Coordinación y contacto:

- Test de estados: Sí → coordinación pendiente → Coordinado con timestamp; el buyer ve el estado actualizado.
- Test de compartición: el owner solo ve email/teléfono para ofertas aceptadas; no se muestran antes.

Analítica:

- Verificar que cada evento requerido se registra con mudanza_id y timestamps para poder calcular KPIs en ventana de 7 días.

Performance básico:

- Prueba de carga ligera para la página pública (tiempo de render con X ítems) y para el panel owner con N ofertas, asegurando que el orden cronológico y la paginación/listado no degraden la experiencia.