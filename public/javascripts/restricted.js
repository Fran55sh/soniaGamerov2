const propiedadesContainer = document.getElementById("propiedades-container");
const imgElement = document.getElementById("imgElement");
getPropiedades();

//Obtiene todas las propiedades para mostrarlas en el dropdown y obtener el id para subir la foto a esa propiedad especifica
fetch("api/propiedades")
  .then((response) => response.json())
  .then((data) => {
    const propiedadDropdown = document.getElementById("propiedadId");
    data.forEach((propiedad) => {
      const option = document.createElement("option");
      option.value = propiedad.id;
      option.textContent = propiedad.nombre;
      propiedadDropdown.appendChild(option);
    });
  })
  .catch((error) => {
    console.error("Error al obtener las propiedades:", error);
  });

// Agrega un listener al evento submit del formulario
document.getElementById("fotosForm").addEventListener("submit", (event) => {
  event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

  // Obtiene el ID de la propiedad seleccionada
  const propiedadId = document.getElementById("propiedadId").value;

  // Obtiene los archivos de imagen seleccionados
  const fotosInput = document.getElementById("fotos");
  const fotos = fotosInput.files;

  // Crea un objeto FormData para enviar los datos
  const formData = new FormData();
  formData.append("propiedadId", propiedadId);
  for (let i = 0; i < fotos.length; i++) {
    formData.append("fotos", fotos[i]);
  }

  // Realiza una solicitud HTTP al servidor para subir las fotos
  fetch("/subir-fotos", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Fotos enviadas exitosamente", data);
      // Puedes realizar alguna acción adicional después de enviar las fotos
    })
    .catch((error) => {
      console.error("Error al enviar las fotos:", error);
      alert("Error al enviar las fotos");
    });
  // location.reload();
});

//renderiza toas las propiedades listadas
function renderPropiedades(propiedades) {
  propiedades.forEach((propiedad) => {
    const propiedadElement = document.createElement("div");
    const imgElement = document.createElement("div");

    const tbodyElement = document.querySelector("tbody");
    const tableElement = document.createElement('tr')
    // Genera el contenido HTML del <tbody>
    tableElement.innerHTML= `
    
      <td class="column1">${propiedad.nombre}</td>
      <td class="column2">${propiedad.descripcion.slice(0,60)}...</td>
      <td class="column3">${propiedad.precio}</td>
      <td class="column4">${propiedad.tipo.nombre}</td>
      <td class="column5">${propiedad.condicione.nombre}</td>
      <td class="column6"><button class="eliminarPropiedadBtn" data-propiedad-id=${propiedad.id}>Eliminar Propiedad</button></td>
    
  `;
  tbodyElement.appendChild(tableElement);
      })


}

async function getPropiedades() {
  await fetch("api/propiedades")
    .then((response) => response.json())
    .then((data) => renderPropiedades(data));

  const eliminarPropiedadBtns = document.querySelectorAll(
    ".eliminarPropiedadBtn"
  );

  // Agrega un evento click a cada botón de eliminación de propiedad
  eliminarPropiedadBtns.forEach((btn) => {
    const propiedadId = btn.dataset.propiedadId; // Obtén el ID de la propiedad del atributo data

    btn.addEventListener("click", () => {
      // Aquí puedes enviar el propiedadId al servidor utilizando una solicitud HTTP
      fetch("/eliminar-propiedad", {
        method: "DELETE",
        body: JSON.stringify({ propiedadId }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Maneja la respuesta del servidor aquí
          location.reload();
        })
        .catch((error) => {
          // Maneja los errores aquí
          console.error(error);
        });
    });
  });
}

// Agrega un listener al evento submit del formulario
document.getElementById("propiedadForm").addEventListener("submit", (event) => {
  event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

  // Obtiene los valores ingresados por el usuario
  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value;
  const descripcioncorta = document.getElementById("descripcioncorta").value;
  const direccion = document.getElementById("direccion").value;
  const precio = document.getElementById("precio").value;
  const esDestacado = document.getElementById("esDestacado").checked;
  const mapa = document.getElementById("mapa").value;
  const tipo = document.getElementById("tipo").value;
  const condicion = document.getElementById("condicion").value;

  // Realiza una solicitud HTTP al servidor para crear la nueva propiedad

  fetch("/crear-propiedad", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre,
      descripcion,
      descripcioncorta,
      direccion,
      precio,
      esDestacado,
      mapa,
      tipo,
      condicion,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Propiedad creada exitosamente", data);
      // Puedes redirigir al usuario a otra página o realizar alguna acción adicional después de crear la propiedad
    })
    .catch((error) => {
      console.error("Error al crear la propiedad:", error);
      alert("Error al crear la propiedad");
    });
  location.reload();
});




// -----------------------  ALQUILERES TEMPORALES --------------------------------- //


document.getElementById("propiedadTemporalForm").addEventListener("submit", (event) => {
  event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

  // Obtiene los valores ingresados por el usuario
  const nombre = document.getElementById("nombreDate").value;
  const descripcion = document.getElementById("descripcionDate").value;
  const descripcioncorta = document.getElementById("descripcioncortaDate").value;
  const ciudad = document.getElementById("ciudad").value;
  const provincia = document.getElementById("provincia").value;
  const direccion = document.getElementById("direccionDate").value;
  const divisa = document.getElementById("divisaDate").value;
  const precio = document.getElementById("precioDate").value;
  const distanciaAlCentro = document.getElementById("distanciaAlCentro").value;
  const distanciaAlMar = document.getElementById("distanciaAlMar").value;
  const wifi = document.getElementById("wifi").checked;
  const tv = document.getElementById("tv").checked;
  const cochera = document.getElementById("cochera").checked;
  const mascotas = document.getElementById("mascotas").checked;
  const pileta = document.getElementById("pileta").checked;
  const conBlanco = document.getElementById("conBlanco").checked;
  const lavarropa = document.getElementById("lavarropa").checked;
  const parrilla = document.getElementById("parrilla").checked;
  const esDestacado = document.getElementById("esDestacado").checked;
  const cantidadPersonas = document.getElementById("cantidadPersonas").value;
  const cantidadAmbientes = document.getElementById("cantidadAmbientes").value;
  const mapa = document.getElementById("mapaDate").value;
  const reserva = document.getElementById("reserva").value;
  const alias = document.getElementById("alias").value;
  const titular = document.getElementById("titular").value;
  const Cuenta = document.getElementById("Cuenta").value;
  const tipo = document.getElementById("tipoDate").value;

  // Realiza una solicitud HTTP al servidor para crear la nueva propiedad

  fetch("/api/crearPropiedadesDate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre,
  descripcion,
  descripcioncorta,
  ciudad,
  provincia,
  direccion,
  divisa,
  precio,
  distanciaAlCentro,
  distanciaAlMar,
  wifi,
  tv,
  cochera,
  mascotas,
  pileta,
  conBlanco,
  lavarropa,
  parrilla,
  esDestacado,
  cantidadPersonas,
  cantidadAmbientes,
  mapa,
  reserva,
  alias,
  titular,
  Cuenta,
  tipo,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Propiedad creada exitosamente", data);
      // Puedes redirigir al usuario a otra página o realizar alguna acción adicional después de crear la propiedad
    })
    .catch((error) => {
      console.error("Error al crear la propiedad:", error);
      alert("Error al crear la propiedad");
    });
  location.reload();
});
// Obtén una lista de todos los botones de eliminación de propiedades
