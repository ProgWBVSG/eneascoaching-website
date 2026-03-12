# DIRECTIVA: INTEGRACION_MAILERLITE

> **ID:** 2026-03-12-001
> **Script Asociado:** `scripts/mailerlite_helper.py`
> **Última Actualización:** 2026-03-12
> **Estado:** ACTIVO

---

## 1. Objetivos y Alcance
- **Objetivo Principal:** Crear una función asíncrona en TypeScript (para React) que envíe el correo de un usuario a la API de MailerLite (grupo "Clientes Web"), sin recargar la página.
- **Criterio de Éxito:** Un usuario puede ingresar su email en la web, el dato viaja a MailerLite de forma asíncrona mediante fetch/axios, y se inscribe en el grupo correspondiente sin errores visuales de CORS ni demoras.

## 2. Especificaciones de Entrada/Salida (I/O)

### Entradas (Inputs)
- **Token API:** El token de MailerLite (`Bearer eyJ0eXA...`).
- **Datos enviados por el usuario:** `email` (string) y opcionalmente `name` (string).
- **ID de Grupo (Segmento):** Obtenido dinámicamente o pre-configurado para "Clientes Web".

### Salidas (Outputs)
- **Artefactos Generados:**
  - `src/services/mailerlite.ts`: Función `subscribeToMailerLite`.
  - Componente de UI en React (ej. `NewsletterForm.tsx`) para interactuar con la función.

## 3. Flujo Lógico (Algoritmo)

1. El usuario completa el formulario en la web y da click a enviar.
2. Al dispararse el evento `onSubmit`:
   - Prevenir la recarga (`e.preventDefault()`).
   - Mostrar estado de carga ("Suscribiendo...").
3. Llamar a la función asíncrona `subscribeToMailerLite(email, name)`.
4. La función ejecuta un `fetch` hacia el endpoint de MailerLite o mediante un proxy en el entorno para evitar bloqueos CORS.
5. El servidor de MailerLite recibe el request con el `Bearer token` y añade el email al grupo "Clientes Web".
6. Actualizar el estado de la UI (Éxito o Error).

## 4. Herramientas y Librerías
- **Librerías TypeScript/React:** `fetch` API nativo, hooks (`useState`).
- **Librerías auxiliares (Python):** `requests` (para scripts internos de DevOps/Consulta).
- **APIs Externas:** MailerLite API (Version 2 o superior).

## 5. Restricciones y Casos Borde (Edge Cases)
- **CORS:** Las llamadas directas del frontend a APIs de terceros suelen estar bloqueadas. MailerLite lo bloquea para evitar la exposición del token.
- **Solución implementada:** Uso de Netlify Functions, Vercel Serverless, o API proxy local en Vite. Dependiendo de las capacidades del entorno del usuario, se creará un fetch estructurado.

## 6. Protocolo de Errores y Aprendizajes (Memoria Viva)

| Fecha | Error Detectado | Causa Raíz | Solución/Parche Aplicado |
|-------|-----------------|------------|--------------------------|
|       |                 |            |                          |

## 7. Ejemplos de Uso
```typescript
import { subscribeToMailerLite } from '../services/mailerlite';

const handleSubmit = async () => {
  const result = await subscribeToMailerLite({ email, name });
  if (result.success) { // éxito }
};
```
