# 📋 Guía para Clonar Frontend y Cambiar Backend

Esta guía te permite clonar la **Concordancia Bíblica Inteligente** manteniendo todo el frontend (UI/UX) pero cambiando el backend (de OpenAI Assistant API a RAG Gemini + n8n u otro).

---

## 🎯 Objetivo

Mantener **100% del frontend** (pantalla de bienvenida, conversation starters, UI, animaciones, etc.) y reemplazar solo el **backend** (`api/chat.js`) para usar:
- RAG con Gemini
- Orquestación con n8n
- O cualquier otro servicio de IA

---

## 📁 Estructura del Proyecto Actual

```
rag-openai-chatbot/
├── api/
│   └── chat.js              # ⚠️ BACKEND - Cambiar este archivo
├── public/
│   └── index.html           # ✅ FRONTEND - Mantener sin cambios
├── .env                     # Configuración de API keys
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

---

## 🚀 Pasos para Clonar y Modificar

### **Paso 1: Clonar el Repositorio**

```bash
# Opción A: Clonar desde GitHub (recomendado)
git clone https://github.com/planckc/rag-openai-chatbot-biblical-assistant.git mi-nuevo-proyecto
cd mi-nuevo-proyecto

# Opción B: Copiar la carpeta localmente
cp -r rag-openai-chatbot mi-nuevo-proyecto
cd mi-nuevo-proyecto
```

### **Paso 2: Cambiar el Repositorio Remoto**

```bash
# Eliminar el remote del proyecto original
git remote remove origin

# Crear un nuevo repositorio en GitHub (ve a github.com/new)
# Luego conecta tu proyecto al nuevo repo:
git remote add origin https://github.com/TU_USUARIO/TU_NUEVO_REPO.git
git branch -M main
git push -u origin main
```

### **Paso 3: Instalar Dependencias**

```bash
npm install
```

---

## 🔧 Modificar el Backend

### **Archivo a Modificar: `api/chat.js`**

Este es el **ÚNICO archivo del backend** que necesitas cambiar. El frontend (`public/index.html`) se mantiene **SIN CAMBIOS**.

#### **Contrato del Backend (API Contract)**

El frontend espera que `api/chat.js` cumpla con este contrato:

**Endpoint:**
- `POST /api/chat`

**Request Body:**
```json
{
  "message": "Pregunta del usuario",
  "threadId": "opcional-id-de-conversacion"
}
```

**Response (Server-Sent Events):**

El backend debe enviar eventos SSE (Server-Sent Events) en este formato:

```javascript
// 1. Enviar Thread ID (para mantener conversación)
res.write(`data: ${JSON.stringify({ type: 'thread', threadId: 'abc123' })}\n\n`);

// 2. Iniciar respuesta (opcional)
res.write(`data: ${JSON.stringify({ type: 'start' })}\n\n`);

// 3. Enviar texto en chunks (streaming)
res.write(`data: ${JSON.stringify({ type: 'text', content: 'Hola ' })}\n\n`);
res.write(`data: ${JSON.stringify({ type: 'text', content: 'mundo' })}\n\n`);

// 4. Finalizar stream
res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
res.end();

// En caso de error:
res.write(`data: ${JSON.stringify({ type: 'error', error: 'Mensaje de error' })}\n\n`);
res.end();
```

**Headers requeridos:**
```javascript
res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache, no-transform');
res.setHeader('Connection', 'keep-alive');
res.setHeader('X-Accel-Buffering', 'no');
```

---

## 📝 Plantilla de Backend

### **Opción 1: Backend con n8n Webhook**

Reemplaza `api/chat.js` con:

```javascript
// api/chat.js
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo POST permitido' });
  }

  try {
    const { message, threadId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    // Configurar SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    // Generar o usar threadId existente
    const currentThreadId = threadId || `thread_${Date.now()}`;
    res.write(`data: ${JSON.stringify({ type: 'thread', threadId: currentThreadId })}\n\n`);
    res.flush?.();

    // Llamar a tu webhook de n8n
    const n8nWebhookURL = process.env.N8N_WEBHOOK_URL;

    const response = await fetch(n8nWebhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        threadId: currentThreadId
      })
    });

    const data = await response.json();

    // Simular streaming del texto recibido
    const fullText = data.response || data.text || data.message;
    const chunkSize = 5; // Caracteres por chunk

    for (let i = 0; i < fullText.length; i += chunkSize) {
      const chunk = fullText.substring(i, i + chunkSize);
      res.write(`data: ${JSON.stringify({ type: 'text', content: chunk })}\n\n`);
      res.flush?.();

      // Delay para efecto de escritura (opcional)
      await new Promise(resolve => setTimeout(resolve, 20));
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Error:', error);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message });
    }
    res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
    res.end();
  }
}
```

### **Opción 2: Backend con Google Gemini API Directo**

```javascript
// api/chat.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo POST permitido' });
  }

  try {
    const { message, threadId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    // Configurar SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    // Thread ID
    const currentThreadId = threadId || `thread_${Date.now()}`;
    res.write(`data: ${JSON.stringify({ type: 'thread', threadId: currentThreadId })}\n\n`);
    res.flush?.();

    // Gemini streaming
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContentStream(message);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(`data: ${JSON.stringify({ type: 'text', content: chunkText })}\n\n`);
      res.flush?.();
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Error:', error);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message });
    }
    res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
    res.end();
  }
}
```

---

## 🔐 Variables de Entorno

### **Actualizar `.env`**

Según tu backend, actualiza las variables:

```bash
# Para n8n
N8N_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/tu-webhook-id

# Para Gemini
GEMINI_API_KEY=tu-api-key-de-gemini

# Para otro servicio
CUSTOM_API_URL=https://tu-api.com
CUSTOM_API_KEY=tu-key
```

### **Configurar en Vercel**

```bash
# Agregar variables de entorno en Vercel
vercel env add N8N_WEBHOOK_URL production
vercel env add GEMINI_API_KEY production
```

---

## 📦 Dependencias del Backend

### **Para n8n (no requiere dependencias adicionales)**
```json
{
  "dependencies": {}
}
```

### **Para Gemini**
```bash
npm install @google/generative-ai
```

Actualiza `package.json`:
```json
{
  "dependencies": {
    "@google/generative-ai": "^0.1.3"
  }
}
```

---

## 🎨 Frontend (NO MODIFICAR)

El archivo `public/index.html` contiene:

✅ **Componentes UI:**
- Pantalla de bienvenida con icono 📖
- 4 conversation starters
- Sistema de streaming en tiempo real
- Cursor animado con cruz ✝️
- Auto-scroll optimizado
- Footer con créditos SINODE

✅ **Funcionalidades:**
- Efecto de escritura carácter por carácter (15ms delay)
- Cola de texto (TextQueue) para streaming suave
- Sistema de debugging configurable (`DEBUG_MODE`)
- Persistencia de conversación con `threadId`
- Responsive para móvil

**⚠️ IMPORTANTE:** No modifiques `public/index.html` a menos que quieras cambiar el diseño visual.

---

## 🧪 Testing Local

```bash
# Iniciar servidor de desarrollo
vercel dev

# O con npm (si configuras script)
npm run dev
```

Abre: http://localhost:3000

**Verifica que:**
1. ✅ Aparece la pantalla de bienvenida
2. ✅ Los 4 conversation starters funcionan
3. ✅ El texto se muestra con efecto de escritura
4. ✅ El cursor ✝️ aparece mientras escribe
5. ✅ Los errores se muestran correctamente

---

## 🚀 Deploy a Producción

```bash
# Deploy a Vercel
vercel --prod

# La URL será algo como:
# https://tu-proyecto-xxx.vercel.app
```

---

## 🔍 Debugging del Backend

### **Activar modo DEBUG**

En `api/chat.js`, cambia:
```javascript
const DEBUG_MODE = true; // Activar logs detallados
```

En `public/index.html`, cambia (línea ~330):
```javascript
const DEBUG_MODE = true; // Ver logs en consola del navegador
```

### **Logs esperados en consola del navegador:**

Con `DEBUG_MODE = true`:
```
Enviando mensaje con streaming a: /api/chat
Thread ID recibido: thread_123456
🔹 [timestamp] Chunk recibido (5 chars): Hola
🔹 [timestamp] Chunk recibido (3 chars): mun
🔹 [timestamp] Chunk recibido (2 chars): do
Respuesta completada
```

---

## 📊 Checklist de Migración

- [ ] Clonar repositorio
- [ ] Cambiar remote de Git
- [ ] Instalar dependencias (`npm install`)
- [ ] Modificar `api/chat.js` con nuevo backend
- [ ] Configurar variables de entorno (`.env`)
- [ ] Probar localmente (`vercel dev`)
- [ ] Verificar streaming funciona correctamente
- [ ] Configurar variables en Vercel (`vercel env add`)
- [ ] Deploy a producción (`vercel --prod`)
- [ ] Probar en producción
- [ ] Desactivar `DEBUG_MODE` en producción

---

## 🆘 Troubleshooting

### **Problema: El texto aparece todo de golpe**

**Solución:** Asegúrate de:
1. Enviar chunks pequeños (5-10 caracteres)
2. Llamar a `res.flush?.()` después de cada `res.write()`
3. Headers SSE correctos (especialmente `X-Accel-Buffering: no`)

### **Problema: Error de CORS**

**Solución:** Verifica los headers CORS en `api/chat.js`:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

### **Problema: ThreadId no persiste**

**Solución:** Asegúrate de enviar el threadId en el primer evento:
```javascript
res.write(`data: ${JSON.stringify({ type: 'thread', threadId: yourThreadId })}\n\n`);
```

### **Problema: Streaming no funciona en producción**

**Solución:** Vercel tiene timeout de 10 segundos para Hobby plan. Asegúrate de:
1. Enviar chunks rápidamente
2. No tener delays largos entre chunks
3. Considerar Vercel Pro si necesitas más tiempo

---

## 📚 Recursos Adicionales

### **APIs Compatibles**

Este frontend funciona con cualquier backend que implemente el contrato SSE. Ejemplos:

- ✅ OpenAI API (GPT-4, GPT-3.5)
- ✅ Google Gemini API
- ✅ Anthropic Claude API
- ✅ n8n Webhooks
- ✅ Custom RAG con LangChain
- ✅ Azure OpenAI
- ✅ Ollama (local)

### **Ejemplo con LangChain**

```javascript
import { ChatOpenAI } from 'langchain/chat_models/openai';

const chat = new ChatOpenAI({
  streaming: true,
  callbacks: [{
    handleLLMNewToken(token) {
      res.write(`data: ${JSON.stringify({ type: 'text', content: token })}\n\n`);
      res.flush?.();
    }
  }]
});

await chat.call([{ role: 'user', content: message }]);
```

---

## 📞 Soporte

**Creado por:** SINODE
**Web:** https://sinode.org
**Año:** 2025

---

## 📄 Licencia

Este proyecto está bajo licencia MIT. Puedes modificarlo y distribuirlo libremente.

---

## ✨ Créditos

- **Frontend:** Diseño inspirado en ChatGPT Custom GPT
- **Backend Original:** OpenAI Assistant API
- **Framework:** Vercel Serverless Functions
- **Streaming:** Server-Sent Events (SSE)
- **Animaciones:** CSS Keyframes + JavaScript TextQueue

---

**¡Listo para clonar y modificar!** 🚀
