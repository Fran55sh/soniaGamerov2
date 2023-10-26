var buttons = document.querySelectorAll('.masDate-btn');
console.log(buttons)
buttons.forEach(function(button) {
  button.addEventListener('click', function() {
    // Obtén el valor del atributo "data" del botón
    var dataValue = button.getAttribute('data-propiedad-id');
    
    // Crea la URL con el valor de dataValue
    var url = '/api/propiedadesDate/' + dataValue;

    console.log(url)
    console.log(dataValue)


// Redirige a la nueva página con la URL
window.location.href = url;
  })})