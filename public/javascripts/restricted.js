const propiedadesContainer = document.getElementById("propiedades-container");
const imgElement = document.getElementById("imgElement");
const divReserva = document.getElementById("cardReserva");

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

//Obtiene todas las propiedades para mostrarlas en el dropdown y obtener el id para subir la foto a esa propiedad especifica
fetch("api/propiedades")
  .then((response) => response.json())
  .then((data) => {
    const propiedadDropdown = document.getElementById("propiedadIdFechas");
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

// Crea las propiedades
document.getElementById("propiedadForm").addEventListener("submit", (event) => {
  event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

  // Obtiene los valores ingresados por el usuario
  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value;
  const descripcioncorta = document.getElementById("descripcioncorta").value;
  const direccion = document.getElementById("direccion").value;
  const divisa = document.getElementById("divisa").value;
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
      divisa,
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

// sube las fotos de propiedades
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
      console.log(data);
      // Puedes realizar alguna acción adicional después de enviar las fotos
    })
    .catch((error) => {
      console.error("Error al enviar las fotos:", error);
      alert("Error al enviar las fotos");
    });
  // location.reload();
});

// Modifica las porpiedades termporales

document.getElementById("btnPatch").addEventListener("click", (event) => {
  event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

  // Obtiene los valores ingresados por el usuario
  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value;
  const descripcioncorta = document.getElementById("descripcioncorta").value;
  const direccion = document.getElementById("direccion").value;
  const divisa = document.getElementById("divisaDate").value;
  const precio = document.getElementById("precioDate").value;
  const esDestacado = document.getElementById("esDestacado").checked;
  const mapa = document.getElementById("mapaDate").value;
  const tipo = document.getElementById("tipoDate").value;

  const propiedadId = document.getElementById("propiedadIdFechas").value;

  // Crear un objeto para almacenar los datos que se enviarán en la solicitud fetch
  const data = {
    propiedadId,
  };

  // Agregar valores no vacíos al objeto de datos
  if (nombre) data.nombre = nombre;
  if (descripcion) data.descripcion = descripcion;
  if (descripcioncorta) data.descripcioncorta = descripcioncorta;
  if (divisa) data.divisa = divisa;
  if (precio) data.precio = precio;
  if (mapa) data.mapa = mapa;
  if (tipo) data.tipo = tipo;

  // Realiza una solicitud HTTP al servidor para modificar la propiedad
  fetch("/api/modificarPropiedades", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Propiedad modificada exitosamente", data);
      // Puedes redirigir al usuario a otra página o realizar alguna acción adicional después de modificar la propiedad
    })
    .catch((error) => {
      console.error("Error al modificar la propiedad:", error);
      alert("Error al modificar la propiedad");
    });
  // location.reload();
});

// elimina las porpiedades termporales
document.getElementById("btnDelete").addEventListener("click", (event) => {
  event.preventDefault();

  const propiedadId = document.getElementById("propiedadIdFechas").value;
  console.log(propiedadId);
  fetch("/eliminar-propiedad", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      propiedadId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Propiedad eliminada exitosamente", data);
      // Puedes redirigir al usuario a otra página o realizar alguna acción adicional después de crear la propiedad
    })
    .catch((error) => {
      console.error("Error al eliminar la propiedad:", error);
      alert("Error al eliminada la propiedad");
    });
});

//renderiza toas las propiedades listadas
function renderPropiedades(propiedades) {
  propiedades.forEach((propiedad) => {
    const mostrarReservas = document.createElement("div");

    // Genera el contenido HTML del <tbody>
    mostrarReservas.innerHTML = `
    
      <p>${reserva.montoADepositar}
    
  `;
    tbodyElement.appendChild(tableElement);
  });
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

// Obtén todas las propiedades para mostrarlas en el dropdown y obtener el ID para subir la foto a esa propiedad específica
fetch("api/propiedadesDateJson")
  .then((response) => response.json())
  .then((data) => {
    const propiedadDateDropdown = document.getElementById("propiedadDateId");
    data.forEach((propiedad) => {
      const option = document.createElement("option");
      option.value = propiedad.id;
      option.textContent = propiedad.nombre;
      propiedadDateDropdown.appendChild(option);
    });
  })
  .catch((error) => {
    console.error("Error al obtener las propiedades Temporales:", error);
  });

fetch("api/propiedadesDateJson")
  .then((response) => response.json())
  .then((data) => {
    const propiedadDateDropdownFechas = document.getElementById(
      "propiedadDateIdFechas"
    );
    data.forEach((propiedad) => {
      const option = document.createElement("option");
      option.value = propiedad.id;
      option.textContent = propiedad.nombre;
      propiedadDateDropdownFechas.appendChild(option);
    });
  })
  .catch((error) => {
    console.error("Error al obtener las propiedades Temporales:", error);
  });

// ------------------------------------------------  ALQUILERES TEMPORALES ----------------------------------------------------- //

// Función para obtener propiedades temporales
async function getPropiedadesDate() {
  try {
    const response = await fetch("/api/propiedadesDateJson");
    const data = await response.json();
    renderPropiedades(data);
  } catch (error) {
    console.error("Error al obtener las propiedades Temporales:", error);
  }
}

// crea las porpiedades termporales

document
  .getElementById("propiedadTemporalForm")
  .addEventListener("submit", (event) => {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    // Obtiene los valores ingresados por el usuario
    const nombre = document.getElementById("nombreDate").value;
    const descripcion = document.getElementById("descripcionDate").value;
    const descripcioncorta = document.getElementById(
      "descripcioncortaDate"
    ).value;
    const ciudad = document.getElementById("ciudad").value;
    const provincia = document.getElementById("provincia").value;
    const direccion = document.getElementById("direccionDate").value;
    const divisa = document.getElementById("divisaDate").value;
    const precio = document.getElementById("precioDate").value;
    const distanciaAlCentro =
      document.getElementById("distanciaAlCentro").value;
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
    const cantidadAmbientes =
      document.getElementById("cantidadAmbientes").value;
    const mapa = document.getElementById("mapaDate").value;
    const reserva = document.getElementById("reserva").value;
    const diasMinimos = document.getElementById("diasMinimos").value;
    const plazo = document.getElementById("plazo").value;
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
        diasMinimos,
        plazo,
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

// sube las fotos de las propiedades temporales
document.getElementById("fotosFormDate").addEventListener("submit", (event) => {
  event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

  // Obtiene el ID de la propiedad seleccionada
  const propiedadDateId = document.getElementById("propiedadDateId").value;

  // Obtiene los archivos de imagen seleccionados
  const fotosDate = document.getElementById("fotosDate");
  const fotoDate = fotosDate.files;

  // Crea un objeto FormData para enviar los datos
  const formDataDate = new FormData();
  formDataDate.append("propiedadDateId", propiedadDateId);
  for (let i = 0; i < fotoDate.length; i++) {
    console.log(fotoDate[i]);
    formDataDate.append("fotos", fotoDate[i]);
  }

  // Realiza una solicitud HTTP al servidor para subir las fotos
  fetch("/subir-fotosDate", {
    method: "POST",
    body: formDataDate,
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Fotos enviadas exitosamente", data);
      console.log(data);
      // Puedes realizar alguna acción adicional después de enviar las fotos
    })
    .catch((error) => {
      console.error("Error al enviar las fotos:", error);
      alert("Error al enviar las fotos");
    });
  // location.reload();
});

document.getElementById('myForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Previene el comportamiento por defecto del formulario

  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch('/api/crearFechas', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.reloadPage) {
      alert("Fechas asignadas correctamente")
    }
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
  }
});

// Modifica las porpiedades termporales

document.getElementById("btnPatchDate").addEventListener("click", (event) => {
  event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

  // Obtiene los valores ingresados por el usuario
  const nombre = document.getElementById("nombreDate").value;
  const descripcion = document.getElementById("descripcionDate").value;
  const descripcioncorta = document.getElementById(
    "descripcioncortaDate"
  ).value;
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
  const diasMinimos = document.getElementById("diasMinimos").value;
  const plazo = document.getElementById("plazo").value;
  const alias = document.getElementById("alias").value;
  const titular = document.getElementById("titular").value;
  const Cuenta = document.getElementById("Cuenta").value;
  const tipo = document.getElementById("tipoDate").value;

  const propiedadDateId = document.getElementById(
    "propiedadDateIdFechas"
  ).value;
  if (cantidadAmbientes === "") {
    console.log("es un espacio");
  } else {
    console.log("es un '' ");
  }
  // Crear un objeto para almacenar los datos que se enviarán en la solicitud fetch
  const data = {
    propiedadDateId,
  };

  // Agregar valores no vacíos al objeto de datos
  if (nombre) data.nombre = nombre;
  if (descripcion) data.descripcion = descripcion;
  if (descripcioncorta) data.descripcioncorta = descripcioncorta;
  if (ciudad) data.ciudad = ciudad;
  if (provincia) data.provincia = provincia;
  if (direccion) data.direccion = direccion;
  if (divisa) data.divisa = divisa;
  if (precio) data.precio = precio;
  if (distanciaAlCentro) data.distanciaAlCentro = distanciaAlCentro;
  if (distanciaAlMar) data.distanciaAlMar = distanciaAlMar;
  if (mapa) data.mapa = mapa;
  if (reserva) data.reserva = reserva;
  if (diasMinimos) data.diasMinimos = diasMinimos;
  if (plazo) data.plazo = plazo;
  if (alias) data.alias = alias;
  if (titular) data.titular = titular;
  if (Cuenta) data.Cuenta = Cuenta;
  if (tipo) data.tipo = tipo;
  if (wifi !== undefined) data.wifi = wifi;
  if (tv !== undefined) data.tv = tv;
  if (cochera !== undefined) data.cochera = cochera;
  if (mascotas !== undefined) data.mascotas = mascotas;
  if (pileta !== undefined) data.pileta = pileta;
  if (conBlanco !== undefined) data.conBlanco = conBlanco;
  if (lavarropa !== undefined) data.lavarropa = lavarropa;
  if (parrilla !== undefined) data.parrilla = parrilla;
  if (esDestacado !== undefined) data.esDestacado = esDestacado;
  if (cantidadPersonas !== "") data.cantidadPersonas = cantidadPersonas;
  if (cantidadAmbientes !== "") data.cantidadAmbientes = cantidadAmbientes;

  // Realiza una solicitud HTTP al servidor para modificar la propiedad
  fetch("/api/modificarPropiedadesDate", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Propiedad modificada exitosamente", data);
      // Puedes redirigir al usuario a otra página o realizar alguna acción adicional después de modificar la propiedad
    })
    .catch((error) => {
      console.error("Error al modificar la propiedad:", error);
      alert("Error al modificar la propiedad");
    });
  // location.reload();
});

// elimina las porpiedades termporales
document.getElementById("btnDeleteDate").addEventListener("click", (event) => {
  event.preventDefault();

  const propiedadDateId = document.getElementById(
    "propiedadDateIdFechas"
  ).value;

  fetch("/api/deletePropiedadesDate", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      propiedadDateId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Propiedad eliminada exitosamente", data);
      // Puedes redirigir al usuario a otra página o realizar alguna acción adicional después de crear la propiedad
    })
    .catch((error) => {
      console.error("Error al eliminar la propiedad:", error);
      alert("Error al eliminada la propiedad");
    });
});

// elimina las fechas disponibles en las porpiedades termporales

document.getElementById("btnDeleteFecha").addEventListener("click", (event) => {
  event.preventDefault();
  const propiedadDateId = document.getElementById(
    "propiedadDateIdFechas"
  ).value;

  fetch("/api/deleteFechas", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      propiedadDateId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Fechas eliminada exitosamente", data);
      // Puedes redirigir al usuario a otra página o realizar alguna acción adicional después de crear la propiedad
    })
    .catch((error) => {
      console.error("Error al eliminar las fechas:", error);
      alert("Error al eliminada las fechas");
    });
});
// Obtén una lista de todos los botones de eliminación de propiedades

// ---------------------------------------------------------  RERERVAS  -------------------------------------------------------- //

fetch("/api/obtenerReservas")
  .then((response) => response.json())
  .then((data) => {
    renderReservas(data);
  })
  .catch((error) => {
    console.error("Error al obtener las reservas:", error);
  });

function renderReservas(reservas) {
  console.log(reservas);
  if (reservas && reservas.reservas && Array.isArray(reservas.reservas)) {
    const reservasArray = reservas.reservas;
    reservasArray.forEach((reserva) => {
      const fechasString = reserva.fechas;
      const fechasArray = fechasString.split(",");
      const fechasConvertidas = fechasArray.map((fecha) => {
        const partesFecha = fecha.split("-");
        return (
          " " + partesFecha[2] + "/" + partesFecha[1] + "/" + partesFecha[0]
        );
      });

      const cadena = reserva.datosCliente;
      const datosclientearray = cadena.split(",");

      const divReserva = document.createElement("div");
      divReserva.classList.add("cardReserva");
      divReserva.innerHTML = `
  <p>Propiedad: ${reserva.propiedadDate.nombre}</p>
  <p>Propiedad: ${reserva.codigoUnico}</p>
  <p>Datos del Cliente:<br>
    ${datosclientearray[0]},<br> ${datosclientearray[1]}, <br>${datosclientearray[2]}
  </p>
  <p>Fechas: ${fechasConvertidas}</p>
  <p>Monto a Depositar: ${reserva.montoADepositar}</p>
  <p>Monto Restante: ${reserva.montoRestante}</p>
  <p>Monto Total: ${reserva.montoRestante + reserva.montoADepositar}</p>
  <p>Estado: ${reserva.estado}</p>
  ${
    reserva.estado === "pendiente de pago"
      ? `<button onclick="procesar('${reserva.id}')" style="margin-top: 10px;" id="pagoReserva" type="submit">Procesar pago Reserva</button>`
      : ''
  }
  <button onclick="efectuar('${reserva.id}', '${fechasString}', '${reserva.propiedadesDateId}')" style="margin-top: 10px;" id="efectuarReserva" type="submit">Eliminar Reserva</button>
  <button onclick="cancelar('${reserva.id}', '${fechasString}', '${reserva.propiedadesDateId}')" style="margin-top: 10px;" id="cancelarReserva" type="submit">Cancelar Reserva</button>
`;

      // Hacer algo con el divReserva aquí, como agregarlo a un contenedor existente en el DOM
      document.getElementById("mostrarReservas").appendChild(divReserva); // Por ejemplo, aquí se lo agrega al body
    });
  } else {
    console.error("El formato del objeto reservas no es el esperado.");
  }
}

function efectuar(id) {
  console.log(document.getElementById("efectuarReserva"));
  const datos = { reservaId: id };
  fetch("/api/deleteReservas", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  })
  .then(response => response.json())
  .then(data => {
    if (data.reloadPage) {
      location.reload(); // Recarga la página si la propiedad 'reloadPage' está presente en la respuesta
    }
  })
  .catch(error => console.error('Error al eliminar la reserva:', error));
}

function cancelar(id, fechas, propiedadDateId) {
  console.log(document.getElementById("efectuarReserva"));
  const datos = { reservaId: id, fechas, propiedadDateId };
  console.log(datos)
  fetch("/api/cancelReservas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  })
  .then(response => response.json())
  .then(data => {
    if (data.reloadPage) {
      location.reload(); // Recarga la página si la propiedad 'reloadPage' está presente en la respuesta
    }
  })
  .catch(error => console.error('Error al Cancelar la reserva:', error));
}

function procesar(id, ) {
  console.log(document.getElementById("pagoReserva"));
  const datos = { reservaId: id };
  console.log(datos)
  fetch("/api/pagoReservas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  })
  .then(response => response.json())
  .then(data => {
    if (data.reloadPage) {
      location.reload(); // Recarga la página si la propiedad 'reloadPage' está presente en la respuesta
    }
  })
  .catch(error => console.error('Error al Cancelar la reserva:', error));
}
