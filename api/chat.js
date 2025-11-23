// api/chat.js
import OpenAI from 'openai';

// ============================================
// CONFIGURACIÓN GLOBAL DE DEBUGGING
// ============================================
const DEBUG_MODE = false; // Cambiar a true para activar logs detallados en servidor

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Tu Assistant ID (reemplaza con el tuyo)
const ASSISTANT_ID = "asst_10dQqHD2pLPmc6of1HFFfj8w";

export default async function handler(req, res) {
  // CORS headers para desarrollo local
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo se permiten requests POST' });
  }

  try {
    const { message, threadId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    if (DEBUG_MODE) {
      console.log('📨 Mensaje recibido:', message);
      console.log('🧵 Thread ID:', threadId || 'nuevo');
    }

    // Crear nuevo thread o usar existente
    let thread;
    if (threadId) {
      thread = { id: threadId };
      if (DEBUG_MODE) console.log('♻️ Usando thread existente');
    } else {
      thread = await openai.beta.threads.create();
      if (DEBUG_MODE) console.log('🆕 Thread nuevo creado:', thread.id);
    }

    // Agregar mensaje del usuario al thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message
    });

    if (DEBUG_MODE) console.log('⏳ Ejecutando assistant con streaming...');

    // Configurar headers para Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Desactivar buffering en nginx/vercel

    // Enviar threadId primero
    res.write(`data: ${JSON.stringify({ type: 'thread', threadId: thread.id })}\n\n`);
    res.flush?.(); // Forzar envío inmediato si flush está disponible

    // Stream de la respuesta del assistant
    const stream = openai.beta.threads.runs.stream(thread.id, {
      assistant_id: ASSISTANT_ID,
    });

    // Manejar eventos del stream
    stream
      .on('textCreated', () => {
        if (DEBUG_MODE) console.log('🎬 Texto iniciado');
        res.write(`data: ${JSON.stringify({ type: 'start' })}\n\n`);
        res.flush?.();
      })
      .on('textDelta', (textDelta) => {
        const chunk = textDelta.value;
        if (chunk) {
          // Log detallado solo en modo debug
          if (DEBUG_MODE) {
            const timestamp = new Date().toISOString().split('T')[1];
            console.log(`📝 [${timestamp}] Chunk (${chunk.length} chars):`, chunk.substring(0, 50));
          }
          res.write(`data: ${JSON.stringify({ type: 'text', content: chunk })}\n\n`);
          res.flush?.(); // Forzar envío inmediato de cada chunk
        }
      })
      .on('textDone', () => {
        if (DEBUG_MODE) console.log('✅ Texto completado');
      })
      .on('end', () => {
        if (DEBUG_MODE) console.log('🏁 Stream finalizado');
        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        res.end();
      })
      .on('error', (error) => {
        // Los errores siempre se muestran (independiente de DEBUG_MODE)
        console.error('❌ Error en stream:', error);
        res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
        res.end();
      });

  } catch (error) {
    // Los errores siempre se muestran (independiente de DEBUG_MODE)
    console.error('❌ Error en handler:', error);

    // Si ya empezó el streaming, enviar error por SSE
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
      res.end();
    } else {
      // Si no, enviar error JSON normal
      return res.status(500).json({
        error: error.message || 'Error interno del servidor'
      });
    }
  }
}
