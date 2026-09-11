# Reglas de Soleando DR para Antigravity

## Contexto del producto

Soleando DR es una plataforma pública de viajes construida con Next.js App Router, React, TypeScript, Drizzle ORM, PostgreSQL/Supabase, Better Auth, Vercel y el proveedor hotelero Grupo González. El catálogo público se administra desde el panel interno: hoteles, excursiones nacionales, excursiones internacionales, paquetes y cruceros. Instagram no es fuente de sincronización ni de renderizado.

Lee `AGENTS.md` y `GEMINI.md` antes de actuar. Si hay conflicto entre instrucciones, aplica la más restrictiva y pide dirección al usuario.

## Forma de trabajo obligatoria

1. Inspecciona primero los archivos, contratos y flujos afectados. No supongas que una carpeta o módulo es obsoleto.
2. Explica el alcance, acoplamientos y riesgos antes de proponer cambios relevantes.
3. Modifica lo mínimo necesario. No combines una funcionalidad con una refactorización no solicitada.
4. Tras editar, ejecuta validaciones proporcionales: al menos `pnpm typecheck` y las pruebas o el build que correspondan.
5. Informa con claridad qué se modificó, qué se validó y qué queda pendiente. Distingue hechos comprobados de supuestos.

## No tocar sin autorización explícita

- Backend y contratos: `app/api/**`, `app/actions/**`, `features/**` de servidor, rutas, webhooks y respuestas de API.
- Autenticación, sesiones, roles, permisos, RLS, usuarios administradores, cookies, redirecciones y proveedores OAuth.
- Base de datos: `lib/db/**`, `supabase/**`, SQL, migraciones, esquemas Drizzle y datos persistidos.
- Variables de entorno, secretos, dominios, Vercel, despliegues, cron, PWA, service worker, caché, analítica e integraciones externas.
- Proveedor hotelero Grupo González, su contrato de búsqueda o el flujo que redirige a su entorno de reserva.
- Dependencias, `package.json`, `pnpm-lock.yaml`, configuración de Next, TypeScript, Tailwind, scripts o herramientas de CI.
- Rutas públicas, copy, tracking, la identidad visual Soleando o el comportamiento actual, salvo que el usuario lo pida expresamente.

## Prohibiciones

- No inventes ni repongas datos de demostración, ofertas, precios, disponibilidad, reseñas o experiencias.
- No reintroduzcas sincronización, scraping, login automatizado ni llamadas de cliente a Instagram/Meta.
- No expongas, imprimas, subas ni cambies secretos, credenciales, JWT, URLs privadas o contenido de `.env*`.
- No borres archivos, datos, migraciones, dependencias o configuraciones por intuición. Antes demuestra que no tienen consumidores y muestra el alcance exacto.
- No instales paquetes, SDKs, plantillas, UI kits, servicios, bases de datos o integraciones por preferencia.
- No hagas refactors masivos, cambios de versión, conversiones de arquitectura ni rediseños completos sin aprobación.
- No uses comandos destructivos (`git reset --hard`, `git clean`, borrados recursivos, sobrescrituras) ni modifiques historial Git.
- No hagas commit, push, despliegue ni cambios remotos sin una solicitud explícita del usuario.

## Frontend

- Conserva la identidad de Soleando: paleta actual, tipografías, tono y navegación. No copies diseños o contenido de sitios de referencia.
- Para cambios visuales, valida en móvil y escritorio; protege foco de teclado, touch targets, imágenes, overflow, estados vacíos, carga y error.
- Usa Server Components cuando no se requiera interacción y no muevas lógica de negocio al cliente sin motivo.

## Datos y catálogo

- El tipo de elemento administrado es la fuente de verdad para clasificar el catálogo público.
- La web pública consulta datos persistidos; no depende de Instagram ni de datos simulados.
- Si no hay publicaciones, muestra un estado vacío útil y honesto, no contenido ficticio.

## Git y calidad

- Preserva cambios existentes del usuario y no los reformatees o reviertas.
- Confirma que `.env*`, artefactos locales y archivos temporales permanezcan ignorados antes de preparar un commit.
- Haz commits pequeños, descriptivos y limitados a la solicitud. Antes de subir, revisa `git diff --check`, estado, secretos y pruebas.
