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


document.getElementById("btnVerMas").addEventListener("click", function() {
  const masHabilidades = document.getElementById("masHabilidades");
  masHabilidades.classList.toggle("d-none");

  // cambiar texto del botón
  if (masHabilidades.classList.contains("d-none")) {
    this.textContent = "Ver más";
  } else {
    this.textContent = "Ver menos";
  }
});

