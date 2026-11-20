document.addEventListener('DOMContentLoaded', () => {
    const listaEquipos = document.getElementById('lista-equipos');
    const formEquipo = document.getElementById('form-equipo');
    const inputBuscar = document.getElementById('input-buscar');
    const contador = document.getElementById('contador');
    const btnModo = document.getElementById('btn-modo');
    const mensajeError = document.getElementById('mensaje-error');

    let equiposGlobales = [];

    // 1. Cargar equipos desde la API (GET)
    async function obtenerEquipos() {
        try {
            const respuesta = await fetch('/api/equipos');
            if (!respuesta.ok) throw new Error('Error al cargar los equipos');
            equiposGlobales = await respuesta.json();
            renderizarEquipos(equiposGlobales);
        } catch (error) {
            console.error(error);
        }
    }

    // 2. Renderizar equipos en el DOM
    function renderizarEquipos(equipos) {
        listaEquipos.innerHTML = '';
        contador.textContent = `Equipos: ${equipos.length}`;

        if (equipos.length === 0) {
            listaEquipos.innerHTML = '<li>No hay equipos registrados.</li>';
            return;
        }

        equipos.forEach(eq => {
            const li = document.createElement('li');
            li.className = 'tarjeta';

            const imagenSrc = eq.imagen ? eq.imagen : 'https://via.placeholder.com/220x120?text=Sin+Imagen';

            li.innerHTML = `
                <div>
                    <img src="${imagenSrc}" alt="${eq.nombre}">
                    <h3>${eq.nombre}</h3>
                    <p><strong>Tipo:</strong> ${eq.tipo}</p>
                    <p><strong>Specs:</strong> ${eq.especificaciones || 'N/D'}</p>
                </div>
                <button class="btn-eliminar" data-id="${eq.id}">Eliminar</button>
            `;
            listaEquipos.appendChild(li);
        });
    }

    // 3. Enviar nuevo equipo (POST)
    formEquipo.addEventListener('submit', async (e) => {
        e.preventDefault();
        mensajeError.textContent = '';

        const nuevoEquipo = {
            nombre: document.getElementById('nombre').value,
            tipo: document.getElementById('tipo').value,
            imagen: document.getElementById('imagen').value,
            especificaciones: document.getElementById('especificaciones').value
        };

        try {
            const respuesta = await fetch('/api/equipos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoEquipo)
            });

            if (!respuesta.ok) {
                const errData = await respuesta.json();
                throw new Error(errData.error || 'Error al guardar');
            }

            formEquipo.reset();
            obtenerEquipos();
        } catch (error) {
            mensajeError.textContent = error.message;
        }
    });

    // 4. Eliminar equipo (DELETE)
    listaEquipos.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-eliminar')) {
            const id = e.target.getAttribute('data-id');

            try {
                const respuesta = await fetch(`/api/equipos/${id}`, {
                    method: 'DELETE'
                });

                if (!respuesta.ok) throw new Error('No se pudo eliminar');
                obtenerEquipos();
            } catch (error) {
                console.error(error);
            }
        }
    });

    // 5. Filtro de búsqueda en tiempo real
    inputBuscar.addEventListener('input', (e) => {
        const texto = e.target.value.toLowerCase();
        const filtrados = equiposGlobales.filter(eq => 
            eq.nombre.toLowerCase().includes(texto) || 
            eq.tipo.toLowerCase().includes(texto)
        );
        renderizarEquipos(filtrados);
    });

    // 6. Modo oscuro extra
    btnModo.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        btnModo.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    // Inicializar carga al arrancar
    obtenerEquipos();
});