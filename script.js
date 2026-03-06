gsap.registerPlugin(ScrollTrigger)

const header = document.querySelector('header')

// ========== HERO PADDING ==========
;(function () {
  const hero = document.querySelector('.hero')
  if (!hero || !header) return

  function applyHeroPadding() {
    const navH = header.getBoundingClientRect().height
    const w = window.innerWidth
    const base = w <= 768 ? 60 : w <= 1024 ? 80 : 130
    hero.style.paddingTop = (base + navH) + 'px'
  }

  applyHeroPadding()
  window.addEventListener('resize', applyHeroPadding)
})()

// Active Nav State on Scroll
const navLinks = document.querySelectorAll('nav > a, nav .nav-dropdown > .nav-dropdown-trigger')
const sections = document.querySelectorAll('section[id]')

const sectionNavMap = {
  hero: 'contact',
  clients: 'contact',
}

function updateActiveNav() {
  const scrollPos = window.scrollY + 200

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute('id')

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      const targetId = sectionNavMap[sectionId] || sectionId
      navLinks.forEach((link) => {
        link.classList.remove('active')
        if (link.getAttribute('href') === `#${targetId}`) {
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
  document.querySelector(".results-section"),
  document.querySelector(".how-it-works-section"),
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

// Logo marquee — handled by CSS animation

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

      // Disable scroll anchoring so the browser doesn't shift the page
      // while the description expand/collapse transition runs
      document.documentElement.style.overflowAnchor = 'none'

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

      // Re-enable scroll anchoring after transitions finish
      setTimeout(() => {
        document.documentElement.style.overflowAnchor = ''
      }, 350)
    })
  })
})()

// ========== RESULTS TABLE CUSTOM SCROLLBAR ==========
;(function () {
  const table = document.querySelector('.results-table')
  const track = document.querySelector('.results-scrollbar')
  const thumb = document.querySelector('.results-scrollbar-thumb')
  if (!table || !track || !thumb) return

  function updateThumb() {
    const ratio = table.clientWidth / table.scrollWidth
    const thumbWidth = Math.max(ratio * track.clientWidth, 40)
    const maxScroll = table.scrollWidth - table.clientWidth
    const maxThumbLeft = track.clientWidth - thumbWidth
    const thumbLeft = maxScroll > 0 ? (table.scrollLeft / maxScroll) * maxThumbLeft : 0
    thumb.style.width = thumbWidth + 'px'
    thumb.style.left = thumbLeft + 'px'
  }

  table.addEventListener('scroll', updateThumb)
  window.addEventListener('resize', updateThumb)
  updateThumb()

  let isDragging = false
  let startX = 0
  let startScrollLeft = 0

  thumb.addEventListener('pointerdown', function (e) {
    isDragging = true
    startX = e.clientX
    startScrollLeft = table.scrollLeft
    thumb.setPointerCapture(e.pointerId)
    e.preventDefault()
  })

  thumb.addEventListener('pointermove', function (e) {
    if (!isDragging) return
    const dx = e.clientX - startX
    const thumbWidth = thumb.offsetWidth
    const maxThumbLeft = track.clientWidth - thumbWidth
    const maxScroll = table.scrollWidth - table.clientWidth
    table.scrollLeft = startScrollLeft + (dx / maxThumbLeft) * maxScroll
  })

  thumb.addEventListener('pointerup', function () { isDragging = false })
  thumb.addEventListener('pointercancel', function () { isDragging = false })

  track.addEventListener('click', function (e) {
    if (e.target === thumb) return
    const rect = track.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const thumbWidth = thumb.offsetWidth
    const maxThumbLeft = track.clientWidth - thumbWidth
    const maxScroll = table.scrollWidth - table.clientWidth
    table.scrollLeft = ((clickX - thumbWidth / 2) / maxThumbLeft) * maxScroll
  })
})()


