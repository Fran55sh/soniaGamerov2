let selectedDates = [];
let totalDays = [];
let fechasCoincidentes = [];
let propiedad = []



document.getElementById("checkin-date").textContent =
          moment().format('DD/MM/YYYY');
        document.getElementById("checkout-date").textContent =
        moment().format('DD/MM/YYYY');


function getCookieInt(nombre) {
  var cookies = document.cookie.split(";"); // Divide la cadena de cookies en un array
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim(); // Elimina espacios en blanco alrededor de la cookie
    // Verifica si la cookie comienza con el nombre buscado
    if (cookie.indexOf(nombre + "=") === 0) {
      // Devuelve el valor de la cookie como un entero
      return parseInt(cookie.substring(nombre.length + 1), 10);
    }
  }
  // Devuelve null si la cookie no se encontró
  return null;
}

// Llama a la función para obtener el valor de la cookie 'id' como entero
var valorId = getCookieInt("id");

if (!isNaN(valorId)) {
  id = valorId;
} else {
  console.log('La cookie "id" no se encontró o no es un entero válido.');
}
let dispDays = [];

fetch(`/api/propiedadesDateJson/${id}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("La solicitud no fue exitosa");
    }
    return response.json(); // Parsea la respuesta JSON
  })
  .then((result) => {
    // Ahora "result" es el objeto JSON que puedes utilizar
    propiedad = result
    propiedad[0].fechasDisponibilidad.forEach((element) => {
      // Agregar fechas a dispDays
      dispDays.push(element.fecha);
    });

    // Ahora dispDays contiene las fechas disponibles
  })
  .catch((error) => console.log("Error:", error));

  function getSelectedDates(startDate, endDate) {
    var currentDate = startDate.clone();

    while (currentDate.isSameOrBefore(endDate)) {
      selectedDates.push(currentDate.format("YYYY-MM-DD"));
      currentDate.add(1, "day");
    }

    return selectedDates;
  }

$(function () {
  // Función para bloquear fechas no disponibles
  function bloquearFechasNoDisponibles(dispDays) {
    
    $('input[name="daterange"]').daterangepicker({
        "locale": {
            "format": "DD/MM/YYYY",
            "separator": " / ",
            "applyLabel": "Apply",
            "cancelLabel": "Cancel",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "weekLabel": "W",
            "daysOfWeek": [
                "Do",
                "Lu",
                "Ma",
                "Mi",
                "Ju",
                "Vi",
                "Sa"
            ],
            "monthNames": [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Jinio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre"
            ],
            "firstDay": 0
        },
        startDate: moment(),
        opens: "left",
        isInvalidDate: function (date) {
          // Convierte la fecha seleccionada a un formato comparable con las fechas disponibles
          var fechaSeleccionada = date.format("YYYY-MM-DD");

          // Comprueba si la fecha seleccionada no está en el array de fechas disponibles
          return !dispDays.includes(fechaSeleccionada);
          // Función para obtener todas las fechas entre un rango dado
          
        },
      },
      function (start, end, label) {
        selectedDates = [];
        console.log(    
          "A new date selection was made: " +
            start.format("DD/MM/YYYY") +
            " to " +
            end.format("DD/MM/YYYY")
        );
        document.getElementById("checkin-date").textContent =
          start.format("DD/MM/YYYY");
        document.getElementById("checkout-date").textContent =
          end.format("DD/MM/YYYY");
            
            getSelectedDates(start, end);
            fechasCoincidentes = selectedDates.filter(function (fecha) {
              return dispDays.includes(fecha);
            });
            var precioDia = propiedad[0].precio;
        totalDays = fechasCoincidentes.length;
        totalPrice = precioDia * totalDays;

        document.getElementById("total-price").textContent = totalPrice;
        document.getElementById("reserv-price").textContent = Math.round(totalPrice*(propiedad[0].reserva/100));

      },
      
    );
  }

  // Llama a la función para bloquear las fechas no disponibles
  bloquearFechasNoDisponibles(dispDays);

  

});
async function reservar(){
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const telefono = document.getElementById('telefono').value;
  const id = propiedad[0].id;
  const fechas = fechasCoincidentes;
     // Comprobaciones
     if (!nombre) {
      alert('Por favor, ingrese un nombre válido.');
      return;
  }
  if (!telefono) {
    alert('Por favor, ingrese un telefono válido.');
    return;
}

  if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Por favor, ingrese un correo electrónico válido.');
      return;
  }
  if (!telefono.match(/^\d{10}$/)) {
    alert('Por favor, ingrese un número de teléfono válido (debe tener 10 dígitos).');
    return;
}

  if (fechas.length < 1) {
      alert('Por favor, seleccione una fecha.');
      return;
  }
  
  
  // Genera un código de identificación único para la reserva
  function generarCodigoReserva(nombreCliente) {
    const fechaReserva = new Date(); // Obtiene la fecha actual al momento de la reserva
    
    const nombreSinEspacios = nombreCliente.replace(/\s/g, ''); // Elimina los espacios del nombre del cliente
    const fechaFormateada = fechaReserva.toISOString().replace(/-|:|\.\d+/g, ''); // Formatea la fecha como una cadena sin caracteres especiales
    
    const codigoUnico = nombreSinEspacios.slice(0, 3) + fechaFormateada; // Combina los primeros 3 caracteres del nombre con la fecha formateada
    return codigoUnico;
  }
  
  let codigoUnico = generarCodigoReserva(nombre)
  
  const datos = {
    id,
    fechas,
    nombre,
    email,
    telefono,
    codigoUnico,


  };
// Realiza la solicitud utilizando fetch
await fetch(`/api/propiedadesDate/reservar`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(datos) // Convierte los datos a formato JSON
})
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Error en la solicitud');
    }
  })
  .then(data => {
    console.log('Respuesta del servidor:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
  // window.location.href = "/date";
}