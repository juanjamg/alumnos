// ==========================================
// 1. GESTIÓN DEL ESTADO EN MEMORIA
// ==========================================
let registroAlumnos = JSON.parse(sessionStorage.getItem('registroAlumnos')) || [];

function guardarEnMemoria() {
    sessionStorage.setItem('registroAlumnos', JSON.stringify(registroAlumnos));
}

// ==========================================
// 2. LÓGICA DE FORMULARIO A y C (Alta/Edición)
// ==========================================
const formA = document.getElementById('formA');
if (formA) {
    const inputNombre = document.getElementById('nombre');
    const inputCategoria = document.getElementById('categoria');
    const inputDescripcion = document.getElementById('descripcion');
    const mensajes = document.getElementById('mensajes');
    const editIdInput = document.getElementById('editId');
    const btnSubmit = document.getElementById('btnSubmit');
    const formTitle = document.getElementById('formTitle');

    // Simulación GET para Edición
    const params = new URLSearchParams(window.location.search);
    const idEditar = params.get('edit');
    if (idEditar) {
        const alumno = registroAlumnos.find(a => a.id == idEditar);
        if (alumno) {
            formTitle.innerText = "Modificar Expediente del Alumno";
            btnSubmit.innerText = "Actualizar Expediente";
            editIdInput.value = alumno.id;
            inputNombre.value = alumno.nombre;
            inputCategoria.value = alumno.categoria;
            inputDescripcion.value = alumno.descripcion;
        }
    }

    // Evento Submit (Simulación POST)
    formA.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        document.querySelectorAll('.error-input').forEach(el => el.classList.remove('error-input'));

        // 5. VALIDACIONES OBLIGATORIAS
        let errores = [];
        let nombre = inputNombre.value.trim();
        let categoria = inputCategoria.value;
        let descripcion = inputDescripcion.value.trim();

        if (nombre.length < 5) {
            errores.push("El nombre completo debe tener al menos 5 caracteres.");
            inputNombre.classList.add('error-input');
        }
        if (categoria === "") {
            errores.push("Debes asignar una carrera al alumno.");
            inputCategoria.classList.add('error-input');
        }
        if (descripcion.length === 0 || descripcion.length > 250) {
            errores.push("Los comentarios son obligatorios (escribe 'Ninguno' si no hay) y no deben exceder 250 caracteres.");
            inputDescripcion.classList.add('error-input');
        }

        // Validación personalizada: Evitar alumnos duplicados en la misma carrera (solo en Alta)
        if (!editIdInput.value) {
            const duplicado = registroAlumnos.some(a => a.nombre.toLowerCase() === nombre.toLowerCase() && a.categoria === categoria);
            if (duplicado) {
                errores.push("Este alumno ya se encuentra inscrito en esa carrera.");
                inputNombre.classList.add('error-input');
            }
        }

        if (errores.length > 0) {
            mostrarMensaje("⚠️ " + errores.join("<br>"), "error");
            return;
        }

        if (editIdInput.value) {
            // Edición
            const index = registroAlumnos.findIndex(a => a.id == editIdInput.value);
            registroAlumnos[index].nombre = nombre;
            registroAlumnos[index].categoria = categoria;
            registroAlumnos[index].descripcion = descripcion;
            mostrarMensaje("✅ Expediente actualizado correctamente.", "success");
        } else {
            // Alta
            let matriculaGenerada = Date.now().toString().slice(-6); 
            const nuevoAlumno = {
                id: Date.now(), 
                matricula: "ALU" + matriculaGenerada,
                nombre: nombre,
                categoria: categoria,
                descripcion: descripcion
            };
            registroAlumnos.push(nuevoAlumno);
            mostrarMensaje(`✅ Alumno inscrito con éxito. Matrícula: ${nuevoAlumno.matricula}`, "success");
        }

        guardarEnMemoria();
        formA.reset();
        editIdInput.value = '';
        btnSubmit.innerText = "Guardar Expediente";
        formTitle.innerText = "Inscribir Nuevo Alumno";
    });
}

function mostrarMensaje(texto, tipo) {
    const contenedor = document.getElementById('mensajes');
    contenedor.innerHTML = `<div class="${tipo}-msg">${texto}</div>`;
    setTimeout(() => contenedor.innerHTML = '', 5000);
}

// ==========================================
// 3. LÓGICA DE CRUD.HTML (Lectura GET)
// ==========================================
const tbodyCrud = document.getElementById('tbodyCrud');
if (tbodyCrud) {
    const msgContenedor = document.getElementById('resultadosMsg');
    
    // Capturar parámetros GET
    const params = new URLSearchParams(window.location.search);
    const busqueda = params.get('busqueda')?.toLowerCase() || "";
    const categoriaFiltro = params.get('categoria') || "";

    // Filtrar array
    let resultados = registroAlumnos.filter(a => {
        let matchNombre = a.nombre.toLowerCase().includes(busqueda);
        let matchCategoria = categoriaFiltro === "" || a.categoria === categoriaFiltro;
        return matchNombre && matchCategoria;
    });

    if (resultados.length === 0) {
        msgContenedor.innerHTML = `<div class="error-msg">⚠️ No se encontraron alumnos con esos criterios.</div>`;
    }

    // Renderizar
    resultados.forEach(a => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${a.matricula || "N/A"}</strong></td>
            <td>${a.nombre}</td>
            <td><span class="badge">${a.categoria}</span></td>
            <td>${a.descripcion}</td>
            <td>
                <button onclick="editarRegistro(${a.id})" class="btn btn-secondary btn-sm">Editar</button>
                <button onclick="eliminarRegistro(${a.id})" class="btn btn-danger btn-sm">Baja</button>
            </td>
        `;
        tbodyCrud.appendChild(tr);
    });
}

function editarRegistro(id) {
    window.location.href = `formulario.html?edit=${id}`;
}

function eliminarRegistro(id) {
    if (confirm("¿Estás seguro de dar de baja a este alumno del sistema?")) {
        registroAlumnos = registroAlumnos.filter(a => a.id !== id);
        guardarEnMemoria();
        window.location.reload(); 
    }
}