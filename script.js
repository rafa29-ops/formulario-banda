/* ============================================
   app.js — Lógica de la Invitación de Diana
   ============================================ */

// ============================================
// PARTÍCULAS FLOTANTES DE FONDO
// ============================================
(function crearParticulas() {
  const colores = ['#C9A227', '#E8CE8B', '#E8A9B8'];

  for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}vw;
      background: ${colores[i % colores.length]};
      animation-duration: ${6 + Math.random() * 8}s;
      animation-delay: ${Math.random() * 8}s;
      width: ${3 + Math.random() * 4}px;
      height: ${3 + Math.random() * 4}px;
    `;
    document.body.appendChild(p);
  }
})();


// ============================================
// MOSTRAR / OCULTAR CAMPOS SEGÚN LA RESPUESTA
// ============================================
function toggleAttendanceFields() {
  const respuesta = document.getElementById('f-attendance').value;
  const detalles = document.getElementById('attendance-details');
  detalles.style.display = (respuesta === 'si') ? 'block' : 'none';
}


// ============================================
// LANZAR CONFETI DE CELEBRACIÓN
// ============================================
function lanzarConfeti() {
  const colores = ['#C9A227', '#E8CE8B', '#E8A9B8', '#F6D9DE', '#ffffff', '#2E2430'];
  for (let i = 0; i < 80; i++) {
    setTimeout(function() {
      const pieza = document.createElement('div');
      pieza.className = 'confetti-piece';
      pieza.style.cssText = `
        left: ${Math.random() * 100}vw;
        background: ${colores[Math.floor(Math.random() * colores.length)]};
        width: ${6 + Math.random() * 10}px; height: ${6 + Math.random() * 10}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        --dx: ${(Math.random() - 0.5) * 200}px;
        animation-duration: ${2 + Math.random() * 2}s;
      `;
      document.body.appendChild(pieza);
      setTimeout(function() { pieza.remove(); }, 4000);
    }, i * 40);
  }
}


// ============================================
// MOSTRAR MENSAJE DE CONFIRMACIÓN
// ============================================
function mostrarConfirmacion(nombre) {
  document.getElementById('form-container').innerHTML =
    '<div style="text-align:center; padding:2rem 0;">' +
      '<p style="font-size:1.3rem; font-family:\'Cormorant Garamond\', serif; font-style:italic; color:var(--charcoal); margin-bottom:0.8rem;">¡Gracias, ' + nombre + '! ✦</p>' +
      '<p style="font-size:1rem; color:var(--charcoal-soft);">Tu asistencia quedó confirmada. ¡Nos vemos en la fiesta!</p>' +
    '</div>';
  lanzarConfeti();
}


// ============================================
// VALIDAR Y ENVIAR EL FORMULARIO
// ============================================
function submitForm() {
  const asistencia = document.getElementById('f-attendance').value;

  if (!asistencia) { alert('Cuéntanos si vienes o no, porfa 🙏'); return; }

  if (asistencia === 'no') {
    document.getElementById('form-container').innerHTML =
      '<p style="text-align:center; font-size:1.1rem; padding:2rem 0;">Gracias por avisarnos. ¡Te vamos a extrañar en la fiesta!</p>';
    return;
  }

  const nombre = document.getElementById('f-name').value.trim();

  if (!nombre) { alert('Escribe tu nombre para saber quién eres 😊'); return; }

  const boton = document.getElementById('submit-btn');
  boton.disabled = true; boton.textContent = 'PROCESANDO...';

  enviarAGoogleSheets({
    nombre: nombre,
    fecha: new Date().toLocaleDateString('es-MX')
  });

  setTimeout(function() {
    mostrarConfirmacion(nombre);
  }, 1400);
}


// ============================================
// ENVÍO A GOOGLE SHEETS
// ============================================
function enviarAGoogleSheets(datos) {
  const URL_GOOGLE_SHEETS = 'https://script.google.com/macros/s/AKfycbyub3TK23YxxspzOgLfOrIoR1BdxBFrw6BZDoEcT797KkwBMB4Vm1YcL0VYGFffLqK8zQ/exec';

  if (!URL_GOOGLE_SHEETS) {
    console.info('📋 Datos (Google Sheets no configurado):', datos);
    return;
  }

  fetch(URL_GOOGLE_SHEETS, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(datos)
  }).catch(e => console.error('Error:', e));
}


// ============================================
// REPRODUCTOR DE MÚSICA DE FONDO (AUTO AL PRIMER TOQUE)
// ============================================
const reproductor = document.getElementById('bg-music');
const botonMusica = document.getElementById('music-toggle-btn');
const textoMusica = document.getElementById('music-status-text');

function intentarAutoPlay() {
  reproductor.play().then(() => {
    botonMusica.classList.add('is-playing');
    if (textoMusica) textoMusica.textContent = "Pausar";
    
    // Una vez empiece a reproducir, eliminamos los listeners globales
    document.removeEventListener('click', intentarAutoPlay);
    document.removeEventListener('touchstart', intentarAutoPlay);
    document.removeEventListener('scroll', intentarAutoPlay);
  }).catch(error => {
    console.log("Esperando la primera interacción del usuario.");
  });
}

// Escucha activa para reproducir al primer toque, clic o scroll en cualquier parte de la web
document.addEventListener('click', intentarAutoPlay);
document.addEventListener('touchstart', intentarAutoPlay);
document.addEventListener('scroll', intentarAutoPlay, { passive: true });

// Control manual del botón flotante
function controlarMusica(event) {
  event.stopPropagation(); // Evita interferir con los disparadores globales
  
  if (reproductor.paused) {
    reproductor.play();
    botonMusica.classList.add('is-playing');
    if (textoMusica) textoMusica.textContent = "Pausar";
  } else {
    reproductor.pause();
    botonMusica.classList.remove('is-playing');
    if (textoMusica) textoMusica.textContent = "Reproducir";
  }
}