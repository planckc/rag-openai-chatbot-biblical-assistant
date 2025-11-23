# 🤖 Chatbot Bíblico con OpenAI Assistant API

Chatbot inteligente que usa OpenAI Assistant API para responder preguntas sobre la Biblia RVR1960 y documentos teológicos.

## 📋 Características

- ✅ Interfaz web moderna y responsive
- ✅ Conversaciones persistentes (mantiene historial)
- ✅ Búsqueda en documentos (File Search)
- ✅ Deploy en Vercel (serverless)
- ✅ Cero configuración de servidor

## 🚀 Inicio Rápido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar API Key

Edita el archivo `.env.local` y reemplaza con tu API key de OpenAI:

```
OPENAI_API_KEY=sk-proj-tu-key-real-aqui
```

**Obtener API Key:**
1. Ve a https://platform.openai.com/api-keys
2. Clic en "Create new secret key"
3. Copia y pega en .env.local

### 3. Configurar Assistant ID

En `api/chat.js`, línea 8, reemplaza con tu Assistant ID:

```javascript
const ASSISTANT_ID = "asst_TuAssistantID";
```

**Tu Assistant ID actual:** `asst_1OdQqHD2pLPmc6ofIHFFfj8w`

### 4. Ejecutar en desarrollo local

```bash
# Instalar Vercel CLI (primera vez)
npm install -g vercel

# Ejecutar en modo desarrollo
vercel dev
```

Abre: http://localhost:3000

## 📦 Deploy a Producción

### Opción 1: CLI

```bash
vercel --prod
```

### Opción 2: Dashboard de Vercel

1. Ve a https://vercel.com
2. "Add New" → "Project"
3. Importa este repositorio
4. En "Environment Variables" agrega:
   - Name: `OPENAI_API_KEY`
   - Value: tu-api-key
5. Deploy

## 📁 Estructura del Proyecto

```
rag-openai-chatbot/
├── api/
│   └── chat.js           # Backend serverless (OpenAI API)
├── public/
│   └── index.html        # Frontend (interfaz del chat)
├── .env.local            # Variables de entorno (NO subir a Git)
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

## 🔧 Personalización

### Cambiar el Assistant

1. Ve a https://platform.openai.com/assistants
2. Sube tus archivos
3. Configura instrucciones
4. Copia el Assistant ID
5. Actualiza en `api/chat.js`

### Modificar el diseño

Edita `public/index.html`:
- Estilos CSS: dentro de `<style>`
- Lógica: dentro de `<script>`

### Agregar autenticación

Considera usar:
- Clerk (https://clerk.dev)
- Auth0
- NextAuth.js

## 💰 Costos Estimados

**OpenAI Assistant API:**
- Modelo GPT-4 Turbo: ~$0.01 por 1K tokens input
- File Search: $0.10 por GB/día
- Ejemplo: 100MB docs + 1000 requests/mes ≈ $10-20/mes

**Vercel:**
- Hobby (gratis): 100GB-hours/mes
- Pro ($20/mes): Unlimited

## 🐛 Troubleshooting

### Error: "Module not found: openai"

```bash
npm install openai
```

### Error: "Invalid API Key"

Verifica que tu `.env.local` tenga la key correcta y que empiece con `sk-`

### La página no carga

```bash
# Reinstalar dependencias
rm -rf node_modules
npm install

# Reiniciar servidor
vercel dev
```

### Error 500 en producción

En Vercel dashboard:
1. Settings → Environment Variables
2. Verifica que `OPENAI_API_KEY` esté configurada
3. Redeploy el proyecto

## 📚 Recursos

- [OpenAI Assistant API Docs](https://platform.openai.com/docs/assistants/overview)
- [Vercel Docs](https://vercel.com/docs)
- [OpenAI Pricing](https://openai.com/pricing)

## 📝 Licencia

MIT

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agrega nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

Hecho con ❤️ usando OpenAI Assistant API + Vercel
