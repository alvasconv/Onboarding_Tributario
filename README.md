# 🏢 Sistema de Onboarding Tributario Automatizado

## 📖 Descripción del Proyecto
Aplicación Full-Stack diseñada para digitalizar y automatizar el proceso de recepción de nuevos clientes (Onboarding) para una firma de consultoría tributaria. El sistema captura información corporativa y documentos fiscales (PDF), realiza validaciones de seguridad en el backend y desencadena un flujo de automatización en la nube para el almacenamiento del archivo y la notificación al equipo en tiempo real.

Este proyecto fue construido con un enfoque en **Separación de Responsabilidades (Separation of Concerns)**, seguridad de variables de entorno y escalabilidad.

## 🚀 Características Principales
* **Frontend Modular:** Interfaz de usuario limpia construida en React, gestionando el envío de archivos mediante `FormData` y consumiendo servicios API abstraídos.
* **Backend Seguro:** API RESTful en Node.js/Express que implementa una cadena de middlewares para validar reglas de negocio (Zod) y procesar archivos multipart (Multer).
* **Integración No-Code:** Conexión mediante Webhooks a **n8n** para orquestar servicios de terceros sin sobrecargar el servidor principal.
* **Automatización en la Nube:** Guardado dinámico de PDFs en **Google Drive** (nombrados automáticamente por RUC) y alertas instantáneas vía **Telegram Bot API**.

## 💻 Stack Tecnológico
* **Frontend:** React, Vite, Axios, CSS (Diseño Minimalista).
* **Backend:** Node.js, Express, Zod (Validación), Multer (Manejo de Archivos), Form-Data.
* **Automatización:** n8n (Workflow Automation).
* **Servicios Externos:** Google Drive API, Telegram API.

## ⚙️ Arquitectura del Flujo de Datos
1. El usuario ingresa RUC, Razón Social y adjunta el Balance Tributario (PDF).
2. React empaca los datos y los envía al Backend.
3. El servidor Node.js intercepta la petición:
   - Valida que el RUC tenga 13 dígitos y el nombre sea válido.
   - Verifica que el archivo exista y sea estrictamente un PDF.
4. Tras la validación, el servidor empaqueta el archivo temporal y dispara un Webhook hacia n8n.
5. El servidor responde al Frontend con éxito y limpia su almacenamiento temporal.
6. En segundo plano, n8n sube el PDF a Google Drive y envía un mensaje estructurado a Telegram.