document.addEventListener('DOMContentLoaded', () => {
  const eventoForm = document.getElementById('eventoForm');
  const notification = document.getElementById('notification');
  const btnCancelar = document.getElementById('btnCancelar');
  let eventos = JSON.parse(localStorage.getItem('eventos')) || [];

  // Utilidades
  function sanitizarInput(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  }

  function logError(mensaje, error) {
    console.error(`${mensaje}:`, error);
  }

  function guardarEventos() {
    try {
      localStorage.setItem('eventos', JSON.stringify(eventos));
    } catch (error) {
      logError('Error en guardarEventos', error);
      mostrarNotificacion('Error al guardar los datos', 'error');
    }
  }

  function mostrarNotificacion(mensaje, tipo) {
    notification.textContent = mensaje;
    notification.className = `notification ${tipo}`;
    notification.style.display = 'block';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 3000);
  }

  // Validaciones avanzadas
  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validarTelefono(tel) {
    return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(tel);
  }

  function validarEvento(evento) {
    if (
      !evento.titulo ||
      !evento.fecha ||
      !evento.ubicacion ||
      !evento.descripcion ||
      !evento.organizador.nombre ||
      !evento.organizador.contacto.email ||
      !evento.organizador.contacto.telefono
    ) {
      mostrarNotificacion('Complete todos los campos', 'error');
      return false;
    }
    if (!validarEmail(evento.organizador.contacto.email)) {
      mostrarNotificacion('Formato de email inválido', 'error');
      return false;
    }
    if (!validarTelefono(evento.organizador.contacto.telefono)) {
      mostrarNotificacion('Formato de teléfono inválido', 'error');
      return false;
    }
    return true;
  }

  // Botón Cancelar
  btnCancelar.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que deseas cancelar? Los datos no guardados se perderán.')) {
      window.location.href = 'index.html';
    }
  });

  // Envío del formulario (único listener)
  eventoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nuevoEvento = {
      id: Date.now(),
      titulo: sanitizarInput(document.getElementById('titulo').value),
      fecha: document.getElementById('fecha').value,
      ubicacion: sanitizarInput(document.getElementById('ubicacion').value),
      descripcion: sanitizarInput(document.getElementById('descripcion').value),
      organizador: {
        nombre: sanitizarInput(document.getElementById('organizador').value),
        contacto: {
          email: sanitizarInput(document.getElementById('email').value),
          telefono: sanitizarInput(document.getElementById('telefono').value)
        }
      },
      asistentes: []  // Inicializa como array vacío
    };

    if (validarEvento(nuevoEvento)) {
      eventos.push(nuevoEvento);
      guardarEventos();
      mostrarNotificacion('Evento creado exitosamente', 'success');
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    }
  });
});
