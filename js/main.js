// Seleccionar todos los enlaces del menú
const enlaces = document.querySelectorAll(".enlace-menu");

enlaces.forEach(enlace => {
  enlace.addEventListener("click", function() {
    // quitamos la clase de activos de todos
    enlaces.forEach(e => e.classList.remove("activo"));
    // Agregamos la clase de activo al que le damos click
    this.classList.add("activo");
  });
});
