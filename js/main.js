// =========================
// 1. ACTIVAR ENLACE DEL MENÚ (click + scroll)
// =========================
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-item-link');
  const sections = document.querySelectorAll('section[id]');

  // Al hacer click
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(item => item.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Al hacer scroll
  window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.pageYOffset >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
});


// =========================
// 2. ANIMACIONES CON GSAP
// =========================

// Títulos en scroll
gsap.utils.toArray(".titulo-seccion").forEach((titulo) => {
  gsap.from(titulo, {
    scrollTrigger: {
      trigger: titulo,
      start: "top 80%",
    },
    opacity: 0,
    y: 40,
    duration: 0.6
  });
});

// Tarjetas animadas
gsap.utils.toArray(".card").forEach((card) => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 85%"
    },
    opacity: 0,
    scale: 0.9,
    duration: 0.5
  });
});


// =========================
// 3. SECCIÓN HABILIDADES
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".skill-card");
  const btnVerMas = document.getElementById("btnVerMas");
  const masHabilidades = document.getElementById("masHabilidades");

  // Animación de rebote constante
  cards.forEach((card, index) => {
    const delay = index * 300;
    setTimeout(() => card.classList.add("bounce-card"), delay);
  });

  // Efecto de flotación aleatoria
  cards.forEach((card) => {
    let x = 0;
    let y = 0;

    setInterval(() => {
      const randomX = Math.random() * 6 - 3;
      const randomY = Math.random() * 6 - 3;

      x += randomX;
      y += randomY;

      x = Math.max(-10, Math.min(10, x));
      y = Math.max(-10, Math.min(10, y));

      card.style.transform = `translate(${x}px, ${y}px)`;
    }, 700);
  });

  // Botón Ver Más
  if (btnVerMas && masHabilidades) {
    btnVerMas.addEventListener("click", () => {
      const isHidden = masHabilidades.classList.contains("d-none");

      if (isHidden) {
        masHabilidades.classList.remove("d-none");
        masHabilidades.style.opacity = 0;

        setTimeout(() => {
          masHabilidades.style.transition = "opacity 0.6s ease";
          masHabilidades.style.opacity = 1;
        }, 10);

        btnVerMas.textContent = "Ver menos";
      } else {
        masHabilidades.style.opacity = 0;

        setTimeout(() => {
          masHabilidades.classList.add("d-none");
        }, 600);

        btnVerMas.textContent = "Ver más";
      }
    });
  }
});


// =========================
// 4. SECCIÓN EXPERIENCIAS (Ver Más)
// =========================
document.addEventListener('DOMContentLoaded', function() {
  const btnVerMasExp = document.querySelector('#experiencias .btn-ver-mas');
  const masExperiencias = document.getElementById('masExperiencias');

  if (btnVerMasExp && masExperiencias) {
    masExperiencias.addEventListener('show.bs.collapse', function () {
      btnVerMasExp.innerHTML = 'VER MENOS <i class="bi bi-chevron-up"></i>';
    });

    masExperiencias.addEventListener('hide.bs.collapse', function () {
      btnVerMasExp.innerHTML = 'VER MÁS <i class="bi bi-chevron-down"></i>';
    });
  }
});


// =========================
// 5. TEMA DARK/LIGHT (Opcional)
// =========================
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    const icon = this.querySelector('i');
    
    if (document.body.classList.contains('dark-theme')) {
      icon.classList.remove('bi-moon-stars');
      icon.classList.add('bi-sun-fill');
    } else {
      icon.classList.remove('bi-sun-fill');
      icon.classList.add('bi-moon-stars');
    }
  });
}