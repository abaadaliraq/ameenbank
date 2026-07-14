"use strict";

document.addEventListener("DOMContentLoaded", function () {
  setCurrentYear();
  duplicateSliderItems();
  initializeSlidePanel();
  initializeWhatsAppWidget();
  initializeRipple();
  initializeReveal();
  initializeShare();
});

/* Current year */

function setCurrentYear() {
  const yearElement = document.getElementById("currentYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/* Duplicate slider cards for continuous movement */

function duplicateSliderItems() {
  const sliderTrack = document.getElementById("sliderTrack");

  if (!sliderTrack) {
    return;
  }

  const originalCards = Array.from(sliderTrack.children);

  originalCards.forEach(function (card) {
    const clone = card.cloneNode(true);

    clone.setAttribute("aria-hidden", "true");

    sliderTrack.appendChild(clone);
  });
}

/* Slider details panel */

function initializeSlidePanel() {
  const sliderTrack = document.getElementById("sliderTrack");
  const panel = document.getElementById("slidePanel");
  const overlay = document.getElementById("slidePanelOverlay");
  const closeButton = document.getElementById("slidePanelClose");

  if (!sliderTrack || !panel || !overlay || !closeButton) {
    return;
  }

  sliderTrack.addEventListener("click", function (event) {
    const card = event.target.closest(".slide-card");

    if (!card || !sliderTrack.contains(card)) {
      return;
    }

    openSlidePanel(card);
  });

  overlay.addEventListener("click", closeSlidePanel);
  closeButton.addEventListener("click", closeSlidePanel);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeSlidePanel();
    }
  });
}

function openSlidePanel(card) {
  const panel = document.getElementById("slidePanel");
  const overlay = document.getElementById("slidePanelOverlay");
  const image = document.getElementById("slidePanelImage");
  const category = document.getElementById("slidePanelCategory");
  const title = document.getElementById("slidePanelTitle");
  const description = document.getElementById("slidePanelDescription");
  const action = document.getElementById("slidePanelAction");
  const cardImage = card.querySelector("img");

  if (
    !panel ||
    !overlay ||
    !image ||
    !category ||
    !title ||
    !description ||
    !action ||
    !cardImage
  ) {
    return;
  }

  image.src = cardImage.currentSrc || cardImage.src;
  image.alt = cardImage.alt || card.dataset.title || "";

  category.textContent = card.dataset.category || "";
  title.textContent = card.dataset.title || "";
  description.textContent = card.dataset.description || "";

  updateSlidePanelAction(action, card);

  document.body.classList.add("slide-panel-open");
  panel.classList.add("is-open");
  overlay.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
  overlay.setAttribute("aria-hidden", "false");
}

function closeSlidePanel() {
  const panel = document.getElementById("slidePanel");
  const overlay = document.getElementById("slidePanelOverlay");

  if (!panel || !overlay) {
    return;
  }

  document.body.classList.remove("slide-panel-open");
  panel.classList.remove("is-open");
  overlay.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
  overlay.setAttribute("aria-hidden", "true");
}

function updateSlidePanelAction(action, card) {
  const link = card.dataset.link || "";
  const buttonText = card.dataset.buttonText || "";

  if (!link) {
    action.classList.add("is-hidden");
    action.removeAttribute("href");
    action.textContent = "";
    return;
  }

  action.href = link;
  action.textContent = buttonText || "عرض التفاصيل";
  action.classList.remove("is-hidden");
}

/* WhatsApp widget */

function initializeWhatsAppWidget() {
  const widget = document.getElementById("whatsappWidget");
  const dismissButton = document.getElementById("whatsappDismiss");

  if (!widget || !dismissButton) {
    return;
  }

  if (getStoredValue("whatsappWidgetHidden") === "true") {
    widget.classList.add("is-hidden");
  }

  dismissButton.addEventListener("click", function () {
    widget.classList.add("is-hidden");
    setStoredValue("whatsappWidgetHidden", "true");
  });
}

function getStoredValue(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function setStoredValue(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    return;
  }
}

/* Ripple effect */

function initializeRipple() {
  const elements = document.querySelectorAll(".ripple");

  elements.forEach(function (element) {
    element.addEventListener("pointerdown", function (event) {
      createRipple(element, event);
    });
  });
}

function createRipple(element, event) {
  const previousRipple =
    element.querySelector(".ripple-circle");

  if (previousRipple) {
    previousRipple.remove();
  }

  const rectangle = element.getBoundingClientRect();

  const size = Math.max(
    rectangle.width,
    rectangle.height
  );

  const ripple = document.createElement("span");

  ripple.className = "ripple-circle";

  ripple.style.width = size + "px";
  ripple.style.height = size + "px";

  ripple.style.left =
    event.clientX -
    rectangle.left -
    size / 2 +
    "px";

  ripple.style.top =
    event.clientY -
    rectangle.top -
    size / 2 +
    "px";

  element.appendChild(ripple);

  ripple.addEventListener("animationend", function () {
    ripple.remove();
  });
}

/* Scroll reveal */

function initializeReveal() {
  const elements = document.querySelectorAll(".reveal");

  if (!elements.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    elements.forEach(function (element) {
      element.classList.add("visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  elements.forEach(function (element) {
    observer.observe(element);
  });
}

/* Share */

function initializeShare() {
  const shareButton = document.getElementById("shareButton");

  if (!shareButton) {
    return;
  }

  shareButton.addEventListener("click", async function () {
    const shareData = {
      title: "مصرف أمين العراق الإسلامي",
      text: "الروابط والخدمات الرسمية لمصرف أمين العراق الإسلامي",
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await copyCurrentLink();
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        showToast("تعذر مشاركة الرابط");
      }
    }
  });
}

async function copyCurrentLink() {
  try {
    await navigator.clipboard.writeText(
      window.location.href
    );

    showToast("تم نسخ رابط الصفحة");
  } catch (error) {
    fallbackCopy();
  }
}

function fallbackCopy() {
  const input = document.createElement("textarea");

  input.value = window.location.href;
  input.style.position = "fixed";
  input.style.opacity = "0";

  document.body.appendChild(input);

  input.focus();
  input.select();

  document.execCommand("copy");

  input.remove();

  showToast("تم نسخ رابط الصفحة");
}

/* Toast */

let toastTimer;

function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) {
    return;
  }

  clearTimeout(toastTimer);

  toast.textContent = message;
  toast.classList.add("show");

  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2400);
}
