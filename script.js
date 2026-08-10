/* ============================================
   app.js — Lógica del Formulario de Casting
   BANDA LATINA INDEPENDIENTE USPANTAN
   ============================================ */

// ============================================
// TELÉFONO: SOLO NÚMEROS MIENTRAS SE ESCRIBE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const campoTelefono = document.getElementById('f-phone');
  if (campoTelefono) {
    campoTelefono.addEventListener('input', function() {
      this.value = this.value.replace(/\D/g, '').slice(0, 8);
    });
  }
});


// ============================================
// VALIDAR Y ENVIAR EL FORMULARIO
// ============================================
function submitForm() {
  const nombreCompleto = document.getElementById('f-name').value.trim();
  const edad = document.getElementById('f-age').value.trim();
  const telefono = document.getElementById('f-phone').value.trim();
  const disponibilidad = document.getElementById('f-availability').value.trim();

  if (!nombreCompleto) { alert('Escribe tu nombre y apellido, porfa 🙏'); return; }
  if (!edad) { alert('Indica tu edad.'); return; }
  if (!/^\d{8}$/.test(telefono)) { alert('El número de teléfono debe tener exactamente 8 dígitos, solo números.'); return; }
  if (!disponibilidad) { alert('Cuéntanos tu disponibilidad de tiempo para los ensayos.'); return; }

  const boton = document.getElementById('submit-btn');
  boton.disabled = true; boton.textContent = 'ENVIANDO...';

  enviarAGoogleSheets({
    nombreCompleto: nombreCompleto,
    edad: edad,
    telefono: telefono,
    disponibilidad: disponibilidad,
    fecha: new Date().toLocaleDateString('es-MX')
  });

  setTimeout(function() {
    mostrarConfirmacion(nombreCompleto);
  }, 1400);
}


// ============================================
// MOSTRAR MENSAJE DE CONFIRMACIÓN
// ============================================
function mostrarConfirmacion(nombre) {
  document.getElementById('form-container').innerHTML =
    '<div style="text-align:center; padding:2rem 0;">' +
      '<p style="font-size:1.3rem; font-family:\'Cormorant Garamond\', serif; font-style:italic; color:var(--charcoal); margin-bottom:0.8rem;">¡Gracias, ' + nombre + '! ✦</p>' +
      '<p style="font-size:1rem; color:var(--charcoal-soft);">Tu postulación fue recibida. Pronto nos pondremos en contacto contigo.</p>' +
    '</div>';
}


// ============================================
// ENVÍO A GOOGLE SHEETS
// ============================================
function enviarAGoogleSheets(datos) {
  const URL_GOOGLE_SHEETS = 'https://script.google.com/macros/s/AKfycbwH13-6aFhnpcY2tfeFAqJrZ2E2SXt5PLkIVzd51vYN_5-rETxKSZdFRjE6TN_J-W7OtA/exec';

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