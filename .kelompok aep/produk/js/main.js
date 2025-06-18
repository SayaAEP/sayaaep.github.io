const mainJs = (function () {
  'strict'
  const navBtn = document.querySelector('.top-header__left .nav-btn')
  const mainNav = document.querySelector('.top-header__left .main-nav')
  const mainNavCloseBtn = document.querySelector('.main-nav__close-btn')
  const mainNavContentContainer = document.querySelector('.main-nav__content-container')
  const btnUser = document.querySelector('.top-header .user-container')
  const originalProductSlider = document.querySelector('.product__slider')
  const lightbox = document.querySelector('.lightbox')

  var modalLightbox = null
  var productIndex = 0
  adjustAriaAttributesOnBtnMenu()
  initProductSliders()

  if (navBtn) {
      navBtn.addEventListener('click', toggleMenu)
  }
  if (mainNavCloseBtn) {
      mainNavCloseBtn.addEventListener('click', toggleMenu)
  }
  if (btnUser) {
      btnUser.addEventListener('click', toggleBtnCheckout)
  }

  function initProductSliders() {
      updateLightboxContent()
      document.querySelectorAll('.product__slider').forEach(element => {
          element.addEventListener('click', manageProductClicks)
          element.addEventListener('keydown', manageProductClicks)
      })
      autoSelectFirstThumbItem()
  }

  function updateLightboxContent() {
      if (originalProductSlider && lightbox) {
          const clonedElement = originalProductSlider.cloneNode(true)
          clonedElement.classList.add('--lightbox-active')
          lightbox.appendChild(clonedElement)
      }
  }

  function adjustAriaAttributesOnBtnMenu() {
      if (window.matchMedia(`(min-width: 992px)`).matches && navBtn) {
          navBtn.removeAttribute('aria-controls')
          navBtn.removeAttribute('aria-expanded')
      }
  }

  function autoSelectFirstThumbItem() {
      document.querySelectorAll('.product__thumbs').forEach(listThumbs => {
          let hasThumbSelected = false
          Array.from(listThumbs).forEach(element => {
              if (element.querySelector('.thumb-item__btn').classList.contains('--selected')) {
                  hasThumbSelected = true
              }
          })
          if (hasThumbSelected === false) {
              listThumbs.children[0].querySelector('.thumb-item__btn').classList.add('--selected')
          }
      })
  }

  function toggleDocumentOverflow() {
      document.documentElement.classList.toggle('--overflow-hidden')
      document.body.classList.toggle('--overflow-hidden')
  }

  function toggleMenu() {
      toggleDocumentOverflow()
      if (mainNav && mainNavContentContainer) {
          mainNav.classList.toggle('active')
          mainNavContentContainer.classList.toggle('active')
          if (mainNav.classList.contains('active')) {
              navBtn.setAttribute('aria-expanded', true)
          }
          else {
              navBtn.setAttribute('aria-expanded', false)
          }
      }
  }

  function toggleBtnCheckout() {
      const btnCheckout = document.querySelector('.cart-section__btn-checkout')
      if (btnCheckout) {
          btnCheckout.classList.toggle('--active')
      }
  }

  function manageProductClicks(event) {
      let element = event.target
      let key = event.key
      const actionCondition = (event.type === "keydown" && key === "Enter") || event.type === "click"
      if (element.matches(`p`)) {
          element = element.parentElement
      }
      if (element.matches(`.image-box__src[tabindex='0']`) && window.matchMedia(`(min-width: 992px)`).matches && actionCondition) {
          event.preventDefault()
          zoomProductImage(event)
      }
      else if (actionCondition) {
          event.preventDefault()
          if (element.matches(`[data-thumb-index], .thumb-item__btn`)) {
              const localProductSlider = element.closest(`.product__slider`)
              const product = localProductSlider.querySelector('.image-box__src')
              if (element.classList.contains('thumb-item__btn')) {
                  element = element.querySelector('[data-thumb-index]')
              }
              productIndex = parseInt(element.getAttribute('data-thumb-index'))
              slideProductImage('', product.getAttribute('data-product-id'), product)
          }
          else if (element.matches(`.icon-previous, .icon-next, .btn-previousImage, .btn-nextImage`)) {
              if (element.classList.contains(`icon`)) {
                  element = element.closest('button')
              }
              const product = element.closest('.image-box').querySelector('.image-box__src')
              let operation = element.classList.contains('btn-nextImage') ? '+' : '-'
              slideProductImage(operation, product.getAttribute('data-product-id'), product)
          }
          else if (element.matches(`.icon-close, .product__slider___btn-close-lightbox`)) {
              setTimeout(() => {
                  lightbox.style.display = ''
                  modalLightbox.removeEvents()
              })
          }
      }

  }

  function zoomProductImage() {
      if (lightbox) {
          lightbox.classList.add('--active')
          setTimeout(() => {
              lightbox.style.display = 'flex'
              modalLightbox = new Modal(lightbox)
          }, 200)
      }
  }

  function slideProductImage(operator, productId, image) {
    // Array of image URLs to cycle through
    const imageUrls = [
        '../images/arrival-1.jpg',
        '../images/arrival-2.jpg',
        '../images/arrival-3.jpg',
        '../images/arrival-4.jpg',
        '../images/arrival-5.jpg'
    ];

    let productImagesLength = imageUrls.length - 1; // Updated to use the length of imageUrls array

    // Adjust productIndex based on operator
    if (operator === '+') {
        productIndex = productIndex < productImagesLength ? productIndex + 1 : 0;
    } else if (operator === '-') {
        productIndex = productIndex > 0 ? productIndex - 1 : productImagesLength;
    }

    const localProductSlider = image.closest('.product__slider');
    localProductSlider.querySelector('.thumb-item__btn.--selected').classList.remove('--selected');
    let elementToSelect = localProductSlider.querySelector(`[data-thumb-index='${productIndex}']`).parentElement;
    elementToSelect.classList.add('--selected');

    // Update image src and srcset to the new image URL
    image.srcset = imageUrls[productIndex];
    image.src = imageUrls[productIndex];
}

})()
