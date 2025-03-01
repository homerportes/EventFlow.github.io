// index.js

// Recupera los eventos del localStorage o inicializa un arreglo vacío
let eventos = JSON.parse(localStorage.getItem('eventos')) || [];

// Gestión de estado básica
const state = {
  eventos: eventos,
  loading: false,
  error: null
};

function actualizarEstado(nuevoEstado) {
  Object.assign(state, nuevoEstado);
  cargarEventos();
}

// DOM Elements
const elementos = {
  navLinks: document.getElementById('navLinks'),
  hamburger: document.getElementById('hamburger'),
  eventsGrid: document.querySelector('.events-grid'),
  notification: document.getElementById('notification'),
  btnAsistirEvento: document.getElementById('btnAsistirEvento')
};

// Utilidades
function sanitizarInput(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

function logError(mensaje, error) {
  console.error(`${mensaje}:`, error);
  // Opcional: enviar a un servidor de monitoreo
}

function guardarEventos() {
  try {
    localStorage.setItem('eventos', JSON.stringify(eventos));
    state.eventos = eventos;
  } catch (error) {
    logError('Error en guardarEventos', error);
    mostrarNotificacion('Error al guardar los datos', 'error');
  }
}

function mostrarNotificacion(mensaje, tipo) {
  elementos.notification.setAttribute('role', 'alert');
  elementos.notification.textContent = mensaje;
  elementos.notification.className = `notification ${tipo}`;
  elementos.notification.style.display = 'block';
  setTimeout(() => {
    elementos.notification.style.display = 'none';
  }, 3000);
}

// Componente reutilizable: crea la tarjeta de evento
function crearCardEvento(evento) {
  const card = document.createElement('div');
  card.className = 'event-card';
  card.innerHTML = `
      <h3>${sanitizarInput(evento.titulo)}</h3>
      <p><i class="fas fa-calendar-day"></i> ${new Date(evento.fecha).toLocaleDateString()}</p>
      <p><i class="fas fa-map-marker-alt"></i> ${sanitizarInput(evento.ubicacion)}</p>
      <p class="descripcion">${sanitizarInput(evento.descripcion)}</p>
      <p><i class="fas fa-user"></i> Organizador: ${evento.organizador?.nombre || 'N/A'}</p>
      <p><i class="fas fa-envelope"></i> ${evento.organizador?.contacto?.email || 'N/A'}</p>
      <p><i class="fas fa-phone"></i> ${evento.organizador?.contacto?.telefono || 'N/A'}</p>
      <p><i class="fas fa-user-friends"></i> Asistentes: ${evento.asistentes?.length || 0}</p>
      <div class="event-actions">
        <button class="btn-attend" onclick="asistirAEvento(${evento.id})">
          <i class="fas fa-check"></i>
        </button>
        <button class="btn-delete" onclick="eliminarEvento(${evento.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
  `;
  return card;
}

// Renderización optimizada: uso de DocumentFragment
function cargarEventos() {
  const fragment = document.createDocumentFragment();
  eventos.forEach(evento => {
    if (!Array.isArray(evento.asistentes)) {
      evento.asistentes = [];
    }
    const card = crearCardEvento(evento);
    fragment.appendChild(card);
  });
  elementos.eventsGrid.innerHTML = '';
  elementos.eventsGrid.appendChild(fragment);
}

// Función dummy para asistir a evento (opcional, se recomienda usar la página AsistirEvento.html)
function asistirAEvento(id) {
  const evento = eventos.find(e => e.id === id);
  if (!evento) {
    mostrarNotificacion('Evento no encontrado', 'error');
    return;
  }
  if (!Array.isArray(evento.asistentes)) {
    evento.asistentes = [];
  }
  if (evento.asistentes.length >= 200) {
    mostrarNotificacion('Este evento ya alcanzó el límite de 200 asistentes', 'error');
    return;
  }
  const asistente = {
    id: Date.now(),
    nombre: "Asistente",
    email: "dummy@example.com",
    telefono: "0000000000",
    fechaRegistro: new Date().toISOString()
  };
  evento.asistentes.push(asistente);
  guardarEventos();
  cargarEventos();
  const codigoAcceso = 'EVT-' + evento.id + '-' + Date.now().toString().slice(-4);
  mostrarNotificacion(`Asistencia confirmada. Tu código de acceso es: ${codigoAcceso}`, 'success');
}

// Eliminar evento
function eliminarEvento(id) {
  eventos = eventos.filter(evento => evento.id !== id);
  guardarEventos();
  cargarEventos();
  mostrarNotificacion('Evento eliminado', 'warning');
}

// Menú móvil
function initMobileMenu() {
  elementos.hamburger.addEventListener('click', () => {
    elementos.navLinks.classList.toggle('active');
  });
}

// En lugar de hacer scroll, redirige a AsistirEvento.html
function initAsistirEventoButton() {
  elementos.btnAsistirEvento.addEventListener('click', () => {
    window.location.href = 'AsistirEvento.html';
  });
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  cargarEventos();
  initMobileMenu();
  initAsistirEventoButton();
});
