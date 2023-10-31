var buttons = document.querySelectorAll('.mas-btn');
buttons.forEach(function(button) {
  button.addEventListener('click', function() {
    // Obtén el valor del atributo "data" del botón
    var dataValue = button.getAttribute('data-propiedad-id');
    
    // Crea la URL con el valor de dataValue
    var url = '/api/propiedad/' + dataValue;

// Redirige a la nueva página con la URL
window.location.href = url;
  })})