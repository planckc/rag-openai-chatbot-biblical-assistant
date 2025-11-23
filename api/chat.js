// api/chat.js
import OpenAI from 'openai';

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

    console.log('📨 Mensaje recibido:', message);
    console.log('🧵 Thread ID:', threadId || 'nuevo');

    // Crear nuevo thread o usar existente
    let thread;
    if (threadId) {
      thread = { id: threadId };
      console.log('♻️ Usando thread existente');
    } else {
      thread = await openai.beta.threads.create();
      console.log('🆕 Thread nuevo creado:', thread.id);
    }

    // Agregar mensaje del usuario al thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message
    });

    console.log('⏳ Ejecutando assistant...');

    // Ejecutar el assistant y esperar respuesta
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: ASSISTANT_ID,
    });

    console.log('✅ Run completado con estado:', run.status);

    if (run.status === 'completed') {
      // Obtener mensajes del thread
      const messages = await openai.beta.threads.messages.list(thread.id);
      
      // La respuesta más reciente del assistant
      const assistantMessage = messages.data[0];
      const responseText = assistantMessage.content[0].text.value;

      console.log('💬 Respuesta generada');

      return res.status(200).json({
        response: responseText,
        threadId: thread.id
      });
    } else if (run.status === 'failed') {
      console.error('❌ Run falló:', run.last_error);
      return res.status(500).json({ 
        error: 'El assistant falló: ' + (run.last_error?.message || 'Error desconocido')
      });
    } else {
      return res.status(500).json({ 
        error: `El assistant terminó con estado inesperado: ${run.status}` 
      });
    }

  } catch (error) {
    console.error('❌ Error en handler:', error);
    return res.status(500).json({ 
      error: error.message || 'Error interno del servidor'
    });
  }
}
