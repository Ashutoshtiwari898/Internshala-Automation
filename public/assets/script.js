document.addEventListener('DOMContentLoaded', () => {
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    carouselContainer.innerHTML = `
      <div class="carousel-wrapper">
        <div class="carousel-slide">
          <img src="assets/image1.txt.jpg" alt="Carousel Image 1">
        </div>
        <div class="carousel-slide">
          <img src="assets/image2.txt.jpg" alt="Carousel Image 2">
        </div>
        <div class="carousel-slide">
          <img src="assets/image3.txt.jpg" alt="Carousel Image 3">
        </div>
      </div>
      <button class="carousel-button prev">❮</button>
      <button class="carousel-button next">❯</button>
    `;

    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.style.display = (i === index) ? 'block' : 'none';
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    }

    document.querySelector('.carousel-button.next').addEventListener('click', nextSlide);
    document.querySelector('.carousel-button.prev').addEventListener('click', prevSlide);

    showSlide(currentSlide);
    setInterval(nextSlide, 3000); // Auto-advance every 3 seconds
  }
});
