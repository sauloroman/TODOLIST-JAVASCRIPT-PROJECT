// ##################################
// VARIABLES Y SELECTORES
// ##################################

const contenedorAlertas = document.querySelector("#alertas");
const btnAgregar = document.querySelector("#btnAgregar");
const listaTareas = document.querySelector("#listaTareas");
const btnBorrarTareas = document.querySelector("#btnBorrarTareas");
let tareas = [];

const tareaObjeto = {
  id: "",
  texto: "",
  fechaActual: "",
  deshabilitada: false,
};

// ##################################
// EVENTOS
// ##################################
eventListeners();
function eventListeners() {
  btnAgregar.addEventListener("click", agregarTarea);

  document.addEventListener("DOMContentLoaded", () => {
    tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareasHTML();
  });

  btnBorrarTareas.addEventListener("click", borrarTareas);
}

// ##################################
// FUNCIONES
// ##################################
function agregarTarea(e) {
  e.preventDefault();
  // Contenido del campo donde se ingresan las tareas
  const campoTarea = document.querySelector("#campoTarea").value;

  if (campoTarea.trim() === "") {
    mostrarAlertas("No se puede agregar una tarea vacia", "error");
    return;
  }

  // Llenado del objeto de tarea
  tareaObjeto.id = Date.now();
  tareaObjeto.texto = campoTarea;
  tareaObjeto.fechaActual = `Publicado: ${new Date().toLocaleDateString()} Hora: ${new Date().getHours()}:${new Date().getMinutes()}`;

  // Se llena el objeto con copias del objeto global
  tareas = [...tareas, { ...tareaObjeto } ];

  mostrarAlertas("Tarea agregada", "exito");

  formulario.reset();

  tareasHTML();
}

function mostrarAlertas(mensaje, tipo) {
  // Se encarga de mostrar los mensajes de exito o error en pantalla
  const posiblesAlertas = document.querySelectorAll(".alerta");

  if ( !posiblesAlertas.length ) {
    const alerta = document.createElement("P");
    alerta.textContent = mensaje;
    alerta.classList.add("alerta");

    if (tipo === "error") {
      alerta.classList.add("alerta--error");
    } else {
      alerta.classList.add("alerta--exito");
    }

    contenedorAlertas.appendChild(alerta);

    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

function tareasHTML() {
  limpiarHTML();

  if (tareas.length) {
    tareas.forEach((tarea) => {
      const { id, texto, fechaActual, deshabilitada } = tarea;

      // CHECKBOX
      const input = document.createElement("INPUT");
      input.classList.add("tarea__input");
      input.type = "checkbox";

      // SI SE PRESIONA EL CHECKBOX
      input.onclick = () => {
        deshabilitarTarea(nuevaTarea);
      };

      // CONTENEDOR DE LA NUEVA TAREA
      const nuevaTarea = document.createElement("LI");
      nuevaTarea.classList.add("lista__tarea");
      nuevaTarea.setAttribute("id", id);

      // CONTENIDO DE LA NUEVA TAREA
      nuevaTarea.innerHTML = `
        <div>
          <p class="tarea">${texto}</p>
          <p class="tarea__fecha">${fechaActual}</p>
        </div>
      `;

      // AGREGANDO EL CHECKBOX A LA TAREA
      nuevaTarea.appendChild(input);

      if (deshabilitada) {
        nuevaTarea.querySelector("div").classList.add("tarea--deshabilitada");
        nuevaTarea.querySelector("input").checked = true;
      }

      listaTareas.appendChild(nuevaTarea);
    });
  } else {
    // CONTENEDOR DE LA NUEVA TAREA
    const nuevaTarea = document.createElement("LI");
    nuevaTarea.classList.add("lista__tarea");

    // CONTENIDO DE LA NUEVA TAREA
    nuevaTarea.innerHTML = `
            <div>
              <p>No hay tareas agregadas</p>
            </div>
    `;

    listaTareas.appendChild(nuevaTarea);
  }

  sincronizarStorage();
}

function limpiarHTML() {
  while (listaTareas.firstElementChild) {
    listaTareas.removeChild(listaTareas.firstElementChild);
  }
}

function sincronizarStorage() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function deshabilitarTarea(tarea) {
  // EXTRAE EL PRIMER Y UNICO DIV DE LA TAREA Y SU ID
  const divTarea = tarea.querySelector("div");
  const id = Number(tarea.getAttribute("id"));

  if (divTarea.classList.contains("tarea--deshabilitada")) {
    divTarea.classList.remove("tarea--deshabilitada");
    deshabilitarTareaArray(id, false);
  } else {
    divTarea.classList.add("tarea--deshabilitada");
    deshabilitarTareaArray(id, true);
  }
}

function deshabilitarTareaArray(id, booleno) {
  // Actualiza el array de tareas dependiendo de si se presiona el botón de habilitado o deshabilitado
  const tareasModificadas = tareas.map((tarea) => {
    if (tarea.id === id) {
      tarea.deshabilitada = booleno;
      return tarea;
    } else {
      return tarea;
    }
  });

  tareas = [...tareasModificadas];

  sincronizarStorage();
}

function borrarTareas(e) {
  e.preventDefault();

  const tareasEnPantalla = document.querySelectorAll(".lista__tarea");

  tareasEnPantalla.forEach((tarea) => {
    const id = Number(tarea.getAttribute("id"));

    if (tarea.querySelector("div").classList.contains("tarea--deshabilitada")) {
      tarea.remove();
      tareas = tareas.filter((tarea) => tarea.id !== id);
    }
  });

  switch (true) {
    case !tareas.length:
      tareasHTML();
      mostrarAlertas(
        "Todas las tareas fueron eliminidas exitosamente",
        "exito"
      );
      break;
    case tareasEnPantalla.length > tareas.length:
      mostrarAlertas(
        `Se eliminaron ${tareasEnPantalla.length - tareas.length} tareas`,
        "exito"
      );
      break;
    default:
      mostrarAlertas("No se han completado tareas", "error");
  }

  sincronizarStorage();
}
