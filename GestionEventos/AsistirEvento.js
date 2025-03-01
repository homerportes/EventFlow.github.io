document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registroForm');
    const notification = document.getElementById('notification');
    const eventoSelect = document.getElementById('eventoSelect');
    let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
  
    function logError(mensaje, error) {
      console.error(`${mensaje}:`, error);
    }
  
    function mostrarNotificacion(mensaje, tipo) {
      notification.textContent = mensaje;
      notification.className = `notification ${tipo}`;
      notification.setAttribute('role', 'alert');
      notification.style.display = 'block';
      setTimeout(() => {
        notification.style.display = 'none';
      }, 3000);
    }
  
    function guardarEventos() {
      try {
        localStorage.setItem('eventos', JSON.stringify(eventos));
      } catch (error) {
        logError('Error en guardarEventos', error);
        mostrarNotificacion('Error al guardar los datos', 'error');
      }
    }
  
    function validarEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  
    function validarTelefono(tel) {
      return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(tel);
    }
  
    // Poblar el select con los eventos existentes
    function populateEventos() {
      eventoSelect.innerHTML = '<option value="">-- Selecciona un evento --</option>';
      eventos.forEach(evento => {
        const option = document.createElement('option');
        option.value = evento.id;
        option.textContent = `${evento.titulo} - ${new Date(evento.fecha).toLocaleDateString()}`;
        eventoSelect.appendChild(option);
      });
    }
  
    populateEventos();
  
    registroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const eventoId = eventoSelect.value;
      if (!eventoId) {
        mostrarNotificacion('Por favor, selecciona un evento', 'error');
        return;
      }
      
      const evento = eventos.find(e => e.id == eventoId);
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
      
      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const telefono = document.getElementById('telefono').value.trim();
      
      if (!nombre || !email || !telefono) {
        mostrarNotificacion('Complete todos los campos', 'error');
        return;
      }
      
      if (!validarEmail(email)) {
        mostrarNotificacion('Formato de email inválido', 'error');
        return;
      }
      
      if (!validarTelefono(telefono)) {
        mostrarNotificacion('Formato de teléfono inválido', 'error');
        return;
      }
      
      const asistente = {
        id: Date.now(),
        nombre,
        email,
        telefono,
        fechaRegistro: new Date().toISOString()
      };
      
      evento.asistentes.push(asistente);
      guardarEventos();
      mostrarNotificacion('Registro exitoso! Recibirás un correo de confirmación', 'success');
      registroForm.reset();
      populateEventos(); // Actualiza el select si es necesario
    });
  });
  