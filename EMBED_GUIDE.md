# 📦 Guía Completa para Embeber la Concordancia Bíblica en Otras Webs

Esta guía te muestra **3 opciones** para integrar tu Concordancia Bíblica Inteligente en cualquier sitio web.

---

## 📋 Índice

1. [Opción 1: iFrame Simple](#opción-1-iframe-simple)
2. [Opción 2: Widget Emergente (Recomendado)](#opción-2-widget-emergente-recomendado)
3. [Opción 3: Script Embed Profesional](#opción-3-script-embed-profesional)
4. [Configuración en Vercel (IMPORTANTE)](#configuración-en-vercel-importante)
5. [Troubleshooting](#troubleshooting)

---

## Opción 1: iFrame Simple

### ✅ Lo Mejor Para:
- Páginas dedicadas a la concordancia
- Sitios donde quieres mostrar el chat a pantalla completa
- Implementación rápida (5 minutos)

### 🔧 Configuración Necesaria:

#### **Paso 1: Actualizar `vercel.json` en tu proyecto**

Abre el archivo `vercel.json` y reemplaza su contenido con:

```json
{
  "buildCommand": null,
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/public/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "ALLOWALL"
        },
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors *"
        }
      ]
    }
  ]
}
```

#### **Paso 2: Commit y Deploy a Vercel**

```bash
git add vercel.json
git commit -m "Config: Permitir embed en iframe"
git push origin main
vercel --prod
```

⏱️ **Espera 1-2 minutos** para que el deploy se complete.

#### **Paso 3: Usar el código en tu otra web**

Copia y pega este código en cualquier página HTML:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Concordancia Bíblica</title>
</head>
<body>
    <h1>Concordancia Bíblica Inteligente</h1>

    <!-- iFrame Básico -->
    <iframe
      src="https://rag-openai-chatbot-g0n7sftzz-davidmedinap-4196s-projects.vercel.app"
      width="100%"
      height="800px"
      frameborder="0"
      style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"
      title="Concordancia Bíblica Inteligente"
    ></iframe>
</body>
</html>
```

### 📱 Versión Responsive:

```html
<div style="position: relative; width: 100%; padding-bottom: 75%; max-width: 1400px; margin: 0 auto;">
  <iframe
    src="https://rag-openai-chatbot-g0n7sftzz-davidmedinap-4196s-projects.vercel.app"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; border-radius: 10px;"
    title="Concordancia Bíblica"
  ></iframe>
</div>
```

### ✅ Ventajas:
- Súper simple
- No requiere JavaScript
- Funciona inmediatamente

### ⚠️ Desventajas:
- Ocupa espacio fijo en la página
- No se puede minimizar

---

## Opción 2: Widget Emergente (Recomendado) ⭐

### ✅ Lo Mejor Para:
- Cualquier sitio web (blogs, e-commerce, institucionales)
- Cuando quieres que el chat sea accesible pero no invasivo
- Mejor experiencia de usuario

### 🔧 Configuración Necesaria:

#### **Paso 1: Actualizar `vercel.json` (igual que Opción 1)**

Si ya hiciste el Paso 1 de la Opción 1, **sáltate este paso**.

Si no, abre `vercel.json` y actualiza según la [Opción 1 - Paso 1](#paso-1-actualizar-verceljson-en-tu-proyecto).

#### **Paso 2: Deploy a Vercel**

```bash
git add vercel.json
git commit -m "Config: Permitir embed en iframe"
git push origin main
vercel --prod
```

⏱️ **Espera 1-2 minutos** para que el deploy se complete.

#### **Paso 3: Agregar el widget a tu web**

**🎯 TODO EN UNO:** Copia y pega este código completo justo antes del `</body>` de tu página:

```html
<!-- Widget de Concordancia Bíblica - Inicio -->
<style>
  #sinode-chatbot-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
    font-size: 30px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 9998;
    transition: transform 0.2s;
  }

  #sinode-chatbot-btn:hover {
    transform: scale(1.1);
  }

  #sinode-chatbot-container {
    display: none;
    position: fixed;
    bottom: 90px;
    right: 20px;
    width: 400px;
    height: 600px;
    z-index: 9999;
    box-shadow: 0 8px 40px rgba(0,0,0,0.3);
    border-radius: 20px;
    overflow: hidden;
    background: white;
  }

  #sinode-chatbot-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0,0,0,0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    font-size: 20px;
    z-index: 10000;
    transition: background 0.2s;
  }

  #sinode-chatbot-close:hover {
    background: rgba(0,0,0,0.7);
  }

  /* Responsive móvil */
  @media (max-width: 768px) {
    #sinode-chatbot-container {
      width: 95vw;
      height: 80vh;
      right: 2.5vw;
      bottom: 10px;
    }

    #sinode-chatbot-btn {
      width: 50px;
      height: 50px;
      font-size: 24px;
    }
  }
</style>

<!-- Botón flotante -->
<button id="sinode-chatbot-btn">📖</button>

<!-- Modal del chat -->
<div id="sinode-chatbot-container">
  <iframe
    src="https://rag-openai-chatbot-g0n7sftzz-davidmedinap-4196s-projects.vercel.app"
    style="width: 100%; height: 100%; border: 0;"
    title="Concordancia Bíblica Inteligente"
  ></iframe>
  <button id="sinode-chatbot-close">×</button>
</div>

<script>
  (function() {
    const openBtn = document.getElementById('sinode-chatbot-btn');
    const closeBtn = document.getElementById('sinode-chatbot-close');
    const modal = document.getElementById('sinode-chatbot-container');

    openBtn.addEventListener('click', function() {
      modal.style.display = 'block';
      openBtn.style.display = 'none';
    });

    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
      openBtn.style.display = 'block';
    });
  })();
</script>
<!-- Widget de Concordancia Bíblica - Fin -->
```

### 🎨 Personalización:

#### **Cambiar posición del botón (esquina inferior izquierda):**

Modifica el CSS:

```css
#sinode-chatbot-btn {
  left: 20px;  /* Agregar esta línea */
  right: auto; /* Cambiar de 20px a auto */
}

#sinode-chatbot-container {
  left: 20px;  /* Agregar esta línea */
  right: auto; /* Cambiar de 20px a auto */
}
```

#### **Cambiar colores:**

```css
#sinode-chatbot-btn {
  background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
}
```

#### **Cambiar tamaño del modal:**

```css
#sinode-chatbot-container {
  width: 500px;  /* Cambiar de 400px */
  height: 700px; /* Cambiar de 600px */
}
```

#### **Cambiar icono del botón:**

```html
<button id="sinode-chatbot-btn">💬</button>
<!-- Otros iconos: ✝️ 📚 🤖 💬 📖 -->
```

### ✅ Ventajas:
- No molesta visualmente
- Usuario puede abrir/cerrar cuando quiera
- Responsive automático
- Profesional

### ⚠️ Desventajas:
- Requiere un poco de código (pero es copy-paste)

---

## Opción 3: Script Embed Profesional

### ✅ Lo Mejor Para:
- Distribuir el widget a múltiples sitios
- Cuando quieres actualizaciones centralizadas
- Máxima flexibilidad y control

### 🔧 Configuración Necesaria:

#### **Paso 1: Actualizar `vercel.json`**

Si ya lo hiciste en opciones anteriores, **sáltate este paso**.

Ver [Opción 1 - Paso 1](#paso-1-actualizar-verceljson-en-tu-proyecto).

#### **Paso 2: Crear el archivo `public/embed.js`**

En tu proyecto local, crea el archivo `public/embed.js` con este contenido:

```javascript
// public/embed.js
(function() {
  'use strict';

  // Configuración
  const CHATBOT_URL = 'https://rag-openai-chatbot-g0n7sftzz-davidmedinap-4196s-projects.vercel.app';
  const config = window.SinodeChatbotConfig || {};

  // Posición (por defecto: esquina inferior derecha)
  const position = config.position || 'bottom-right';
  const positionStyles = {
    'bottom-right': { bottom: '20px', right: '20px', left: 'auto', top: 'auto' },
    'bottom-left': { bottom: '20px', left: '20px', right: 'auto', top: 'auto' },
    'top-right': { top: '20px', right: '20px', left: 'auto', bottom: 'auto' },
    'top-left': { top: '20px', left: '20px', right: 'auto', bottom: 'auto' }
  };

  const pos = positionStyles[position];

  // Crear estilos
  const style = document.createElement('style');
  style.textContent = `
    #sinode-chatbot-btn {
      position: fixed;
      ${pos.bottom ? 'bottom: ' + pos.bottom + ';' : ''}
      ${pos.top ? 'top: ' + pos.top + ';' : ''}
      ${pos.right ? 'right: ' + pos.right + ';' : ''}
      ${pos.left ? 'left: ' + pos.left + ';' : ''}
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: white;
      font-size: 30px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 9998;
      transition: transform 0.2s;
    }
    #sinode-chatbot-btn:hover {
      transform: scale(1.1);
    }
    #sinode-chatbot-container {
      display: none;
      position: fixed;
      ${position.includes('bottom') ? 'bottom: 90px;' : 'top: 90px;'}
      ${pos.right ? 'right: ' + pos.right + ';' : ''}
      ${pos.left ? 'left: ' + pos.left + ';' : ''}
      width: 400px;
      height: 600px;
      z-index: 9999;
      box-shadow: 0 8px 40px rgba(0,0,0,0.3);
      border-radius: 20px;
      overflow: hidden;
      background: white;
    }
    #sinode-chatbot-close {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.5);
      color: white;
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      cursor: pointer;
      font-size: 20px;
      z-index: 10000;
      transition: background 0.2s;
    }
    #sinode-chatbot-close:hover {
      background: rgba(0,0,0,0.7);
    }
    @media (max-width: 768px) {
      #sinode-chatbot-container {
        width: 95vw;
        height: 80vh;
        right: 2.5vw;
        left: 2.5vw;
        bottom: 10px;
      }
      #sinode-chatbot-btn {
        width: 50px;
        height: 50px;
        font-size: 24px;
      }
    }
  `;
  document.head.appendChild(style);

  // Crear botón
  const button = document.createElement('button');
  button.id = 'sinode-chatbot-btn';
  button.innerHTML = config.icon || '📖';

  // Crear contenedor
  const container = document.createElement('div');
  container.id = 'sinode-chatbot-container';

  // Crear iframe
  const iframe = document.createElement('iframe');
  iframe.src = CHATBOT_URL;
  iframe.style.cssText = 'width: 100%; height: 100%; border: 0;';
  iframe.title = 'Concordancia Bíblica Inteligente';

  // Crear botón cerrar
  const closeBtn = document.createElement('button');
  closeBtn.id = 'sinode-chatbot-close';
  closeBtn.innerHTML = '×';

  // Eventos
  button.addEventListener('click', function() {
    container.style.display = 'block';
    button.style.display = 'none';
  });

  closeBtn.addEventListener('click', function() {
    container.style.display = 'none';
    button.style.display = 'block';
  });

  // Ensamblar
  container.appendChild(iframe);
  container.appendChild(closeBtn);

  // Agregar al DOM cuando esté listo
  if (document.body) {
    document.body.appendChild(button);
    document.body.appendChild(container);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      document.body.appendChild(button);
      document.body.appendChild(container);
    });
  }
})();
```

#### **Paso 3: Commit y Deploy**

```bash
git add public/embed.js vercel.json
git commit -m "Feat: Agregar script embed para integración externa"
git push origin main
vercel --prod
```

⏱️ **Espera 1-2 minutos** para que el deploy se complete.

#### **Paso 4: Usar en cualquier web**

**Opción A: Básico**

```html
<script src="https://rag-openai-chatbot-g0n7sftzz-davidmedinap-4196s-projects.vercel.app/embed.js"></script>
```

**Opción B: Con configuración personalizada**

```html
<!-- Configuración personalizada -->
<script>
  window.SinodeChatbotConfig = {
    position: 'bottom-left',  // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    icon: '💬'                 // Cualquier emoji
  };
</script>

<!-- Cargar el script -->
<script src="https://rag-openai-chatbot-g0n7sftzz-davidmedinap-4196s-projects.vercel.app/embed.js"></script>
```

### ✅ Ventajas:
- Una sola línea de código para implementar
- Configuración centralizada (actualizas una vez, cambia en todos los sitios)
- Máxima flexibilidad
- Fácil de distribuir

### ⚠️ Desventajas:
- Requiere crear archivo adicional en tu proyecto
- Más complejo de implementar inicialmente

---

## Configuración en Vercel (IMPORTANTE) ⚙️

**⚠️ OBLIGATORIO para todas las opciones**

### **¿Por qué es necesario?**

Por defecto, los navegadores bloquean que tu aplicación se muestre dentro de un iframe por seguridad. Necesitas configurar Vercel para permitirlo.

### **Paso 1: Actualizar `vercel.json`**

En tu proyecto local, abre o crea el archivo `vercel.json` en la raíz y reemplaza todo su contenido con:

```json
{
  "buildCommand": null,
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/public/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "ALLOWALL"
        },
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors *"
        }
      ]
    }
  ]
}
```

### **Paso 2: Commit y Deploy**

```bash
git add vercel.json
git commit -m "Config: Permitir embed en iframe en todos los dominios"
git push origin main
vercel --prod
```

### **Paso 3: Verificar**

Espera 1-2 minutos y abre tu URL de Vercel en un iframe de prueba:

```html
<iframe src="https://rag-openai-chatbot-g0n7sftzz-davidmedinap-4196s-projects.vercel.app"></iframe>
```

Si se muestra correctamente, **¡está listo!** ✅

### **🔒 Configuración Más Segura (Opcional)**

Si solo quieres permitir tu aplicación en dominios específicos:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors https://tudominio.com https://otrodominio.org"
        }
      ]
    }
  ]
}
```

---

## 🧪 Probar Localmente

### **Probar el widget en tu máquina:**

1. Crea un archivo `test.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Test Widget</title>
</head>
<body>
    <h1>Prueba del Widget</h1>
    <p>El widget debería aparecer en la esquina inferior derecha.</p>

    <!-- Pega aquí el código de la opción que elijas -->

</body>
</html>
```

2. Abre `test.html` en tu navegador
3. Haz clic en el botón flotante 📖
4. Verifica que el chat se abra correctamente

---

## 📊 Comparación de Opciones

| Característica | Opción 1<br/>iFrame Simple | Opción 2<br/>Widget Popup | Opción 3<br/>Script Embed |
|----------------|---------------------------|--------------------------|-------------------------|
| **Dificultad** | ⭐ Muy Fácil | ⭐⭐ Fácil | ⭐⭐⭐ Media |
| **Tiempo Setup** | 5 min | 10 min | 20 min |
| **Código requerido** | 5 líneas | ~100 líneas | 1 línea + archivo |
| **Personalización** | Baja | Alta | Muy Alta |
| **UX** | ⭐⭐ Regular | ⭐⭐⭐⭐ Excelente | ⭐⭐⭐⭐⭐ Premium |
| **Responsive** | ⚠️ Manual | ✅ Automático | ✅ Automático |
| **Minimizable** | ❌ No | ✅ Sí | ✅ Sí |
| **Actualizaciones centralizadas** | ❌ No | ❌ No | ✅ Sí |
| **Mejor para** | Página dedicada | Sitio web general | Distribución múltiple |

---

## 🎯 Recomendación

### **Para un solo sitio web:**
👉 **Opción 2 (Widget Popup)** - Equilibrio perfecto entre simplicidad y UX

### **Para distribuir a múltiples sitios:**
👉 **Opción 3 (Script Embed)** - Mejor control y actualizaciones centralizadas

### **Para página dedicada:**
👉 **Opción 1 (iFrame Simple)** - Más rápido y directo

---

## 🆘 Troubleshooting

### **Problema: El iframe no se muestra (pantalla en blanco)**

**Causa:** Headers de seguridad no configurados

**Solución:**
1. Verifica que actualizaste `vercel.json`
2. Haz commit y push: `git push origin main`
3. Deploy: `vercel --prod`
4. Espera 2 minutos
5. Limpia caché del navegador (Ctrl + Shift + R)

### **Problema: Error "Refused to display in a frame"**

**Causa:** Mismo que arriba

**Solución:**
1. Abre la consola del navegador (F12)
2. Verifica el error exacto
3. Confirma que `vercel.json` tiene los headers correctos
4. Redeploy: `vercel --prod`

### **Problema: El widget no aparece en móvil**

**Causa:** z-index o CSS conflictivo

**Solución:**
```css
/* Aumenta el z-index */
#sinode-chatbot-btn {
  z-index: 99999 !important;
}

#sinode-chatbot-container {
  z-index: 100000 !important;
}
```

### **Problema: El botón está detrás de otros elementos**

**Solución:**
```css
#sinode-chatbot-btn {
  z-index: 999999 !important;
}
```

### **Problema: Quiero que el widget se abra automáticamente**

**Solución:** Agrega este código al final del JavaScript:

```javascript
// Auto-abrir después de 3 segundos
setTimeout(function() {
  document.getElementById('sinode-chatbot-btn').click();
}, 3000);
```

### **Problema: El iframe no se carga en algunos navegadores**

**Causa:** Cookies de terceros bloqueadas

**Solución:** No hay solución perfecta, pero puedes:
1. Informar al usuario que habilite cookies de terceros
2. Usar Opción 1 (página dedicada) en lugar de widget

---

## 📞 URLs Importantes

- **Tu app en producción:** https://rag-openai-chatbot-g0n7sftzz-davidmedinap-4196s-projects.vercel.app
- **Dashboard Vercel:** https://vercel.com/dashboard
- **Script embed (Opción 3):** https://rag-openai-chatbot-g0n7sftzz-davidmedinap-4196s-projects.vercel.app/embed.js

---

## ✅ Checklist de Implementación

### **Opción 1 (iFrame Simple):**
- [ ] Actualizar `vercel.json`
- [ ] Commit y push a GitHub
- [ ] Deploy a Vercel (`vercel --prod`)
- [ ] Esperar 2 minutos
- [ ] Copiar código HTML
- [ ] Pegar en tu sitio web
- [ ] Probar en navegador
- [ ] Verificar responsive en móvil

### **Opción 2 (Widget Popup):**
- [ ] Actualizar `vercel.json`
- [ ] Commit y push a GitHub
- [ ] Deploy a Vercel (`vercel --prod`)
- [ ] Esperar 2 minutos
- [ ] Copiar código completo (HTML + CSS + JS)
- [ ] Pegar antes de `</body>` en tu sitio
- [ ] Personalizar colores/posición (opcional)
- [ ] Probar funcionalidad abrir/cerrar
- [ ] Verificar responsive en móvil

### **Opción 3 (Script Embed):**
- [ ] Crear archivo `public/embed.js`
- [ ] Actualizar `vercel.json`
- [ ] Commit y push a GitHub
- [ ] Deploy a Vercel (`vercel --prod`)
- [ ] Esperar 2 minutos
- [ ] Verificar que `/embed.js` sea accesible
- [ ] Agregar script tag a tu sitio
- [ ] Configurar opciones (opcional)
- [ ] Probar en múltiples navegadores

---

## 🎨 Ejemplos de Personalización

### **Cambiar a tema oscuro:**

```css
#sinode-chatbot-btn {
  background: linear-gradient(135deg, #2C3E50 0%, #000000 100%);
}
```

### **Botón más grande:**

```css
#sinode-chatbot-btn {
  width: 80px;
  height: 80px;
  font-size: 40px;
}
```

### **Modal pantalla completa en móvil:**

```css
@media (max-width: 768px) {
  #sinode-chatbot-container {
    width: 100vw;
    height: 100vh;
    right: 0;
    bottom: 0;
    border-radius: 0;
  }
}
```

### **Agregar texto al botón:**

```html
<button id="sinode-chatbot-btn" style="width: auto; padding: 0 20px; border-radius: 30px;">
  📖 Ayuda Bíblica
</button>
```

---

## 📄 Licencia

Esta guía es parte del proyecto Concordancia Bíblica Inteligente de SINODE © 2025

---

**¡Listo para embeber tu concordancia en cualquier sitio web!** 🚀
