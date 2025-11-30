// js/slider.js - 支持多个轮播图
document.addEventListener("DOMContentLoaded", function () {
  // 获取所有轮播图容器
  const sliders = document.querySelectorAll(".slider");

  sliders.forEach((slider, index) => {
    const slides = slider.querySelectorAll(".slide");
    const dots = slider.querySelectorAll(".dot");
    let currentSlide = 0;
    let slideInterval;

    // 显示指定幻灯片
    function showSlide(n) {
      // 隐藏所有幻灯片
      slides.forEach((slide) => slide.classList.remove("active"));
      dots.forEach((dot) => dot.classList.remove("active"));

      // 显示当前幻灯片
      slides[n].classList.add("active");
      dots[n].classList.add("active");

      currentSlide = n;
    }

    // 下一张幻灯片
    function nextSlide() {
      let next = (currentSlide + 1) % slides.length;
      showSlide(next);
    }

    // 开始自动轮播
    function startSlider() {
      slideInterval = setInterval(nextSlide, 4000); // 每2秒切换一次
    }

    // 停止自动轮播（当鼠标悬停时）
    function pauseSlider() {
      clearInterval(slideInterval);
    }

    // 初始化：显示第一张幻灯片并开始轮播
    showSlide(0);
    startSlider();

    // 点击指示点切换幻灯片
    dots.forEach((dot, dotIndex) => {
      dot.addEventListener("click", () => {
        showSlide(dotIndex);
      });
    });

    // 鼠标悬停时暂停轮播，离开时恢复
    slider.addEventListener("mouseenter", pauseSlider);
    slider.addEventListener("mouseleave", startSlider);
  });
});
