# Reglas del Proyecto (Soleando DR)

## 1. Restricción Estricta de Backend
- **Prohibido modificar el backend sin permiso previo explícito**: No se debe realizar ningún cambio, edición ni refactorización en código o servicios de backend sin antes consultar y recibir la aprobación explícita del usuario.
- **Áreas consideradas backend**:
  - `app/api/**` (Endpoints y rutas de API)
  - `app/actions/**` (Server actions)
  - `lib/db/**` (Modelos, esquemas Drizzle, conexiones)
  - `lib/auth.ts` / configuración de autenticación del servidor
  - `supabase/**` (Esquemas, migraciones, scripts de base de datos)
  - Archivos de configuración o scripts de backend y base de datos
- **Protocolo**: Si alguna tarea de UI/Frontend requiere cambios en backend, se debe explicar detalladamente la necesidad al usuario y esperar su autorización antes de tocar cualquier archivo de backend.

## 2. Excelencia Estética y Diseño Visual
- **Prioridad en la estética y el diseño**: La interfaz debe ser moderna, pulida, atractiva y de alta calidad visual ("wow factor").
- **Estándares visuales**:
  - Paletas de colores armoniosas, consistentes y profesionales.
  - Tipografía moderna, jerarquías visuales claras y espaciado consistente.
  - Micro-interacciones sutiles, transiciones fluidas y estados hover/active cuidados.
  - Acabados prémium (glassmorphism sutil, sombras cuidadas, bordes refinados).
  - Experiencia completamente responsiva y adaptada a dispositivos móviles y desktop.
