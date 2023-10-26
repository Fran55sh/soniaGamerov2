const ultimasCards = document.getElementById('ultimasCards')





  var buttons = document.querySelectorAll('.search-card-button');
  console.log(buttons)
  buttons.forEach(function(button) {
    button.addEventListener('click', function() {
      // Obtén el valor del atributo "data" del botón
      var dataValue = button.getAttribute('data-propiedad-tipo');
      
      // Crea la URL con el valor de dataValue
      var url = '/api/propiedades/' + dataValue;


// Redirige a la nueva página con la URL
window.location.href = url;
    })})


    function redirectToSection() {

       
        if (window.location.pathname === "http://www.soniagameropropiedades.com/") {
        
        var sectionElement = document.getElementById("contacto");
        sectionElement.scrollIntoView({ behavior: 'smooth' });
      }else{

        window.location.href = "http://www.soniagameropropiedades.com/#contacto";
      }

    }
    
      function redirectToSectionAbout() {
    
       
        if (window.location.pathname === "/") {
        
        var sectionElement = document.getElementById("about");
        sectionElement.scrollIntoView({ behavior: 'smooth' });
      }else{

        window.location.href = "/#about";
      }

    }
    
          function redirectToSectionSearch() {
    
       
        if (window.location.pathname === "/") {
        
        var sectionElement = document.getElementById("search");
        sectionElement.scrollIntoView({ behavior: 'smooth' });
      }else{

        window.location.href = "/#search";
      }

    }



         function redirectToSectionContacto() {
    
       
        if (window.location.pathname === "/") {
        
        var sectionElement = document.getElementById("contacto");
        sectionElement.scrollIntoView({ behavior: 'smooth' });
      }else{

        window.location.href = "/#contacto";
      }

    }

    var requestOptions = {
      method: 'GET',
      redirect: 'manual'
    };
    
    fetch("/api/propiedades/ultimas", requestOptions)
      .then(response => response.json())
      .then(result => renderUltimas(result))
      .catch(error => console.log('error', error));


      function renderUltimas(propiedades) {
        propiedades.forEach(propiedad => {
          let fotos = '';
          propiedad.fotos.forEach(foto => {
            fotos += `
              <div class="swiper-slide">
                <img class="swiper-slide-img" src="/images/propiedades/${foto.nombre}" alt="">
              </div>
            `;
          });
      
          const condicion = propiedad.condicione.nombre;
          let newElement = document.createElement('div');
          newElement.classList.add('card');
          newElement.innerHTML = `
          <div class="swiper">
          <div class="swiper-wrapper">
                  ${fotos}
          </div>
          <!-- If we need navigation buttons -->
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
      </div>

      <p class="card-condition">
      ${propiedad.condicione.nombre}
      <button class="mas-btn" data-propiedad-id=${propiedad.id}>Ver mas</button>
      </p>
      <div class="card-description">
          <p class="card-description-type">
          ${ propiedad.tipo.nombre }
          </p>
          <p class="card-description-name">
              ${ propiedad.nombre }
          </p>
          <p class="card-description-price">
              ${ propiedad.precio }
          </p>
          <p class="card-description-specs">
              ${ propiedad.descripcioncorta }
          </p>

      </div>
  </div>
</div>
          `;
      
          ultimasCards.appendChild(newElement);
        });
      }
      
  

document.addEventListener('DOMContentLoaded', function() {
  let contitions = document.querySelectorAll('.card-condition')
console.log(contitions)

contitions.forEach((element) => {
  if (element.textContent.includes('Venta')) {
    element.classList.add('for-sale');
  } else if (element.textContent.includes('Alquiler')) {
    element.classList.add('for-rent');
  } 
});
const ultimasCards = document.getElementById('ultimasCards')
});