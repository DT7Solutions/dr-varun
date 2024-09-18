// Preloader
$(window).on('load', function() { 
  $('.loader').fadeOut();
  $('.loader-mask').delay(350).fadeOut('slow');
});

// AOS Initialization
AOS.init();

// Scroll to Top Button
var btn = $('#button');
$(window).scroll(function() {
  if ($(window).scrollTop() > 300) {
      btn.addClass('show');
  } else {
      btn.removeClass('show');
  }
});
btn.on('click', function(e) {
  e.preventDefault();
  $('html, body').animate({scrollTop: 0}, '300');
});

// Owl Carousel Initialization
$('#owl-carousel').owlCarousel({
    loop: true,
    margin: 30,
    nav: true,
    responsive: {
        0: { items: 1 },
        500: { items: 1 },
        600: { items: 1 },
        700: { items: 1 },
        1000: { items: 1 }
    }
  });
$('#owl-carouselone').owlCarousel({
  loop: true,
  margin: 30,
  nav: true,
  responsive: {
      0: { items: 1 },
      500: { items: 2, margin: 15 },
      600: { items: 3, margin: 15 },
      1000: { items: 3 },
      1400: { items: 3 },
      1600: { items: 4 }
  }
});
$('#owl-carouseltwo').owlCarousel({
  loop: true,
  margin: 30,
  nav: true,
  responsive: {
      0: { items: 1 },
      500: { items: 2, margin: 15 },
      600: { items: 3, margin: 15 },
      700: { items: 3, margin: 15 },
      1000: { items: 3 }
  }
});
$('#owl-carouselfour').owlCarousel({
  loop: true,
  margin: 30,
  nav: true,
  responsive: {
      0: { items: 1 },
      500: { items: 2, margin: 15 },
      600: { items: 2, margin: 15 },
      700: { items: 2, margin: 15 },
      1000: { items: 3 }
  }
});

$('#owl-carouselfive').owlCarousel({
    loop: true,
    margin: 30,
    nav: true,
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 1
        },
        1000: {
            items: 1
        }
    }
})

// Lightbox for Video
function lightbox_open() {
  var lightBoxVideo = document.getElementById("VisaChipCardVideo");
  document.getElementById('light').style.display = 'block';
  document.getElementById('fade1').style.display = 'block';
  lightBoxVideo.play();
}
function lightbox_close() {
  var lightBoxVideo = document.getElementById("VisaChipCardVideo");
  document.getElementById('light').style.display = 'none';
  document.getElementById('fade1').style.display = 'none';
  lightBoxVideo.pause();
}

// Counter Animation
$(document).ready(function () {
  var counters = $(".count");
  var countersQuantity = counters.length;
  var counter = [];

  for (var i = 0; i < countersQuantity; i++) {
      counter[i] = parseInt(counters[i].innerHTML);
  }

  var count = function(start, value, id) {
      var localStart = start;
      setInterval(function () {
          if (localStart < value) {
              localStart++;
              counters[id].innerHTML = localStart;
          }
      }, 40);
  };

  for (var j = 0; j < countersQuantity; j++) {
      count(0, counter[j], j);
  }

  $('.count').each(function () {
      $(this).prop('Counter', 0).animate({
          Counter: $(this).text()
      }, {
          duration: 3300,
          easing: 'swing',
          step: function (now) {
              $(this).text(Math.ceil(now));
          }
      });
  });
});

// Dropdown Hover and Click
const $dropdown = $(".dropdown");
const $dropdownToggle = $(".dropdown-toggle");
const $dropdownMenu = $(".dropdown-menu");
const showClass = "show";

$(window).on("load resize", function() {
  if (this.matchMedia("(min-width: 768px)").matches) {
      $dropdown.hover(
          function() {
              const $this = $(this);
              $this.addClass(showClass);
              $this.find($dropdownToggle).attr("aria-expanded", "true");
              $this.find($dropdownMenu).addClass(showClass);
          },
          function() {
              const $this = $(this);
              $this.removeClass(showClass);
              $this.find($dropdownToggle).attr("aria-expanded", "false");
              $this.find($dropdownMenu).removeClass(showClass);
          }
      );
  } else {
      $dropdown.off("mouseenter mouseleave");
  }
});

$(window).on("load resize", function() {
  if (this.matchMedia("(max-width: 991px)").matches) {
      $dropdown.click(
          function() {
              const $this = $(this);
              $this.addClass(showClass);
              $this.find($dropdownToggle).attr("aria-expanded", "true");
              $this.find($dropdownMenu).addClass(showClass);
          },
          function() {
              const $this = $(this);
              $this.removeClass(showClass);
              $this.find($dropdownToggle).attr("aria-expanded", "false");
              $this.find($dropdownMenu).removeClass(showClass);
          }
      );
  }
});

// Sticky Navbar
document.addEventListener('DOMContentLoaded', function() {
  var header = document.querySelector('.index3-header-con');
  window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
          header.classList.add('sticky-navbar');
      } else {
          header.classList.remove('sticky-navbar');
      }
  });
});

// faqs
let question = document.querySelectorAll(".question");

question.forEach(question => {
  question.addEventListener("click", event => {
    const active = document.querySelector(".question.active");
    if(active && active !== question ) {
      active.classList.toggle("active");
      active.nextElementSibling.style.maxHeight = 0;
    }
    question.classList.toggle("active");
    const answer = question.nextElementSibling;
    if(question.classList.contains("active")){
      answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
      answer.style.maxHeight = 0;
    }
  })
})

