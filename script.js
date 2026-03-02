// ========== ACTIVE NAV LINK ON SCROLL ==========
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".header-nav ul li a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if(link.getAttribute("href").includes(current)){
      link.classList.add("active");
    }
  });
});

// ========== SMOOTH SCROLLING ==========
document.querySelectorAll('.header-nav ul li a').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if(target){
      target.scrollIntoView({behavior:'smooth'});
    }
  });
});

// ========== SLIDE-IN ANIMATIONS ==========
const revealElements = document.querySelectorAll(".animate-slide");

window.addEventListener("scroll", () => {
  revealElements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if(top < windowHeight - 100){
      el.classList.add("active");
    }
  });
});

// ========== BACK TO TOP BUTTON ==========
const backToTop = document.createElement("button");
backToTop.id = "backToTop";
backToTop.textContent = "↑ Top";
document.body.appendChild(backToTop);

backToTop.style.cssText = `
  position:fixed; bottom:30px; right:30px;
  padding:10px 15px; background:gold; color:#0b1f3a;
  border:none; border-radius:4px; cursor:pointer; display:none; z-index:1000;
`;
backToTop.addEventListener("click", () => {
  window.scrollTo({top:0, behavior:"smooth"});
});

window.addEventListener("scroll", () => {
  if(window.scrollY > 300){
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
});

// ========== DEPARTMENT / LEADER CARD TOGGLE ==========
function toggleDepartment(element){
  const info = element.querySelector(".department-info");
  if(!info) return;
  if(info.style.maxHeight){
    info.style.maxHeight = null;
    element.querySelector("span").textContent = "+";
  } else {
    info.style.maxHeight = info.scrollHeight + "px";
    element.querySelector("span").textContent = "-";
  }
}

// ========== CONTACT FORM VALIDATION ==========
const contactForm = document.getElementById("contact-form");
if(contactForm){
  contactForm.addEventListener("submit", function(e){
    const email = contactForm.email.value;
    const message = contactForm.message.value;

    if(!email.includes("@") || message.length < 10){
      alert("Please enter a valid email and a message with at least 10 characters.");
      e.preventDefault();
    }
  });
}

// ========== DYNAMIC YEAR IN FOOTER ==========
const footerYear = document.querySelector(".footer-bottom");
if(footerYear){
  footerYear.innerHTML = `© ${new Date().getFullYear()} Cornerstone Leadership Academy | Official Institutional Portal`;
}
