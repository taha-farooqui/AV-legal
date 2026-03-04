gsap.registerPlugin(ScrollTrigger)

const header = document.querySelector('header')

// Active Nav State on Scroll
const navLinks = document.querySelectorAll('nav > a, nav .nav-dropdown > .nav-dropdown-trigger')
const sections = document.querySelectorAll('section[id]')

function updateActiveNav() {
  const scrollPos = window.scrollY + 200

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute('id')

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove('active')
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active')
        }
      })
    }
  })
}

window.addEventListener('scroll', updateActiveNav)
window.addEventListener('load', updateActiveNav)

// Mobile Menu Toggle - Initialize immediately
;(function () {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn')
  const mobileNav = document.querySelector('.mobile-nav')

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', function (e) {
      e.preventDefault()
      e.stopPropagation()
      this.classList.toggle('active')
      mobileNav.classList.toggle('active')
      document.body.style.overflow = mobileNav.classList.contains('active')
        ? 'hidden'
        : ''
    })

    // Close mobile menu when a link is clicked
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active')
        mobileNav.classList.remove('active')
        document.body.style.overflow = ''
      })
    })

    // Mobile platforms dropdown toggle
    const mobileDropdownTrigger = mobileNav.querySelector('.mobile-nav-dropdown-trigger')
    if (mobileDropdownTrigger) {
      mobileDropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation()
        mobileDropdownTrigger.closest('.mobile-nav-dropdown').classList.toggle('open')
      })
    }
  }
})()

// All sections with white backgrounds that need light header
const whiteSections = [
  document.querySelector(".impact-stats-section"),
  document.querySelector(".trusted-by"),
  document.querySelector(".implementation-section"),
  document.querySelector(".case-studies-section"),
  document.querySelector(".contact-section"),
  document.querySelector(".footer"),
  document.querySelector(".content-area"),
  document.querySelector(".work-cta-section"),

  // Work page sections
  document.querySelector(".work-hero-section"),
  document.querySelector(".work-grid-section"),
];

let currentState = 'none'
const isLightPage = header.classList.contains('scrolled-light')

// Helper function to check if scroll position is within any white section
function isInWhiteSection(scrollY) {
  const offset = 100
  return whiteSections.some((section) => {
    if (!section) return false
    const top = section.offsetTop
    const bottom = top + section.offsetHeight
    return scrollY + offset >= top && scrollY + offset < bottom
  })
}

// Use GSAP ScrollTrigger for smooth, flicker-free header state changes

// Trigger for when we start scrolling (dark background)
ScrollTrigger.create({
  start: 50,
  end: 'max',
  onUpdate: (self) => {
    const scrollY = window.scrollY

    let newState = 'none'

    // Determine state based on position
    if (isLightPage) {
      newState = 'light'
    } else if (isInWhiteSection(scrollY)) {
      newState = 'light'
    } else if (scrollY > 50) {
      newState = 'dark'
    }

    // Only update if state actually changed
    if (newState !== currentState) {
      currentState = newState

      // Use GSAP for smooth class transitions
      if (newState === 'light') {
        header.classList.remove('scrolled-dark')
        header.classList.add('scrolled-light')
      } else if (newState === 'dark') {
        header.classList.remove('scrolled-light')
        header.classList.add('scrolled-dark')
      } else {
        header.classList.remove('scrolled-dark', 'scrolled-light')
      }
    }
  },
})

// Infinite Logo Slider
;(function () {
  const logoTrack = document.querySelector('.logo-track')
  if (!logoTrack) return

  const logos = logoTrack.querySelectorAll('img')
  if (logos.length === 0) return

  // Clone logos to fill the track
  const cloneLogos = () => {
    const trackWidth = logoTrack.scrollWidth
    const viewportWidth = window.innerWidth
    const clonesNeeded = Math.ceil((viewportWidth * 2) / trackWidth) + 1

    for (let i = 0; i < clonesNeeded; i++) {
      logos.forEach((logo) => {
        const clone = logo.cloneNode(true)
        logoTrack.appendChild(clone)
      })
    }
  }

  cloneLogos()

  // Get the width of one set of logos
  let logoSetWidth = 0
  logos.forEach((logo) => {
    logoSetWidth += logo.offsetWidth + 80 // 80 is the gap
  })

  let currentX = 0
  const speed = 1 // pixels per frame

  function animate() {
    currentX -= speed
    if (Math.abs(currentX) >= logoSetWidth) {
      currentX = 0
    }
    logoTrack.style.transform = `translateX(${currentX}px)`
    requestAnimationFrame(animate)
  }

  // Start animation after images load
  window.addEventListener('load', () => {
    // Recalculate logo set width after images are loaded
    logoSetWidth = 0
    logos.forEach((logo) => {
      logoSetWidth += logo.offsetWidth + 80
    })
    animate()
  })
})()

// Testimonials Swiper
const testimonialsSwiper = new Swiper('.testimonials-swiper', {
  slidesPerView: 1,
  spaceBetween: 30,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.testimonial-next',
    prevEl: '.testimonial-prev',
  },
})

// What We Do Accordion
;(function () {
  const accordionItems = document.querySelectorAll('.accordion-item')
  const featureImages = document.querySelectorAll('.feature-image')

  if (!accordionItems.length || !featureImages.length) return

  accordionItems.forEach((item) => {
    item.addEventListener('click', () => {
      const imageIndex = item.getAttribute('data-image')

      // Remove active class from all items
      accordionItems.forEach((otherItem) => {
        otherItem.classList.remove('active')
      })

      // Add active class to clicked item
      item.classList.add('active')

      // Switch images
      featureImages.forEach((image) => {
        image.classList.remove('active')
        if (image.getAttribute('data-index') === imageIndex) {
          image.classList.add('active')
        }
      })
    })
  })
})()
