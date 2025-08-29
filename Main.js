// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Particles.js setup
let particleCount = window.innerWidth < 768 ? 30 : 80;
particlesJS("particles-js", {
  particles: { number: { value: particleCount }, color: { value: ["#0077cc","#00c8ff","#ffffff"] }, shape: { type: "circle" }, opacity: { value: 0.5 }, size: { value: 3 }, line_linked: { enable: window.innerWidth >= 768, distance: 150, color: "#0077cc", opacity: 0.3, width: 1 }, move: { enable: true, speed: 2.5, out_mode: "out" } },
  interactivity: { detect_on: "canvas", events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" } }, modes: { grab: { distance: 200, line_linked: { opacity: 0.8 } }, push: { particles_nb: 10 } } },
  retina_detect: true
});

// Animate section elements
function animateSection(section) {
  const portrait = section.querySelector(".portrait");
  const header = section.querySelector("h2");
  const paragraph = section.querySelector("p");
  const galleryItems = section.querySelectorAll(".gallery-grid img");
  const formInputs = section.querySelectorAll("input, textarea, button, .socialss");
  const socials = section.querySelector(".socialss");
  let tl = gsap.timeline();
  if (portrait) tl.from(portrait, { y: -50, opacity: 0, duration: 0.6, ease: "power2.out" });
  if (header) tl.from(header, { y: 30, opacity: 0, duration: 0.6, ease: "power2.out" }, "<0.2");
  if (paragraph) tl.from(paragraph, { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" }, "<0.2");
  if (galleryItems.length > 0) tl.from(galleryItems, { y: 20, opacity: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" }, "<0.2");
  if (formInputs.length > 0) tl.from(formInputs, { y: 50, opacity: 0, duration: 1.5, stagger: 0.1, ease: "power2.out" }, "<0.2");
  gsap.set(formInputs, { opacity: 1 });

}

// SPA Navigation
const sections = document.querySelectorAll("section");
let currentSection = document.querySelector("section.active");
function showSection(id) {
  if(currentSection.id === id) return;
  const next = document.getElementById(id);
  next.style.display = "flex";
  gsap.fromTo(next,{x:"100%",opacity:0},{x:"0%",opacity:1,duration:0.8,ease:"power2.out",onComplete:()=>{animateSection(next);if(id==="gallery") initGalleryParallax();}});
  gsap.to(currentSection,{x:"-100%",opacity:0,duration:0.8,ease:"power2.in",onComplete:()=>{currentSection.classList.remove("active");currentSection.style.display="none";currentSection.style.x="0%";next.classList.add("active");currentSection=next;}});
}
document.querySelectorAll("nav a").forEach(link=>{link.addEventListener("click",e=>{e.preventDefault();showSection(link.dataset.target);gsap.to(window,{duration:1,scrollTo:0,ease:"power2.inOut"});});});
document.getElementById("logo").addEventListener("click",()=>{showSection("home");gsap.to(window,{duration:1,scrollTo:0});});

// Dark mode toggle
document.getElementById("toggleMode").addEventListener("click",()=>{document.body.classList.toggle("dark-mode");});

// Gallery
const galleryContainer = document.querySelector(".gallery-container");

// Load gallery from CSV
async function loadGallery() {
    // Fetch CSV
    const response = await fetch("gallery-links.csv");
    const csvText = await response.text();
    const rows = csvText.trim().split("\n").map(line => line.split(","));

    // Group images by album
    const galleryGroups = {};
    rows.forEach(([group, href, src]) => {
        if (!galleryGroups[group]) galleryGroups[group] = [];
        galleryGroups[group].push({ href });
    });

    // Clear container
    galleryContainer.innerHTML = "";

    // Loop through albums
    for (const [groupName, images] of Object.entries(galleryGroups)) {
        // Album title
        const h2 = document.createElement("h2");
        h2.textContent = groupName;
        galleryContainer.appendChild(h2);

        // Album grid
        const groupDiv = document.createElement("div");
        groupDiv.classList.add("gallery-grid");
        galleryContainer.appendChild(groupDiv);

        // Add images
        images.forEach(({ href }) => {
            const a = document.createElement("a");
            a.href = href; // full-size image or video
            a.classList.add("gallery-lightbox");
            a.setAttribute("data-gallery", groupName);

            const img = document.createElement("img");
            img.alt = "Photo of Vishwa Praveen Lankesha";
            img.loading = "lazy"; // lazy-load

            const isVideo = href.match(/\.(mp4|mov)$/i);

            if (href.includes("/upload/") && !isVideo) {
                // Regular Cloudinary image
                const parts = href.split("/upload/");
                img.src = `${parts[0]}/upload/w_300,c_scale,f_auto,q_auto/${parts[1]}`;
            }
            else if (href.includes("mp4")) {
                img.src = `https://res.cloudinary.com/vishwa-website/image/upload/v1755961951/gallery/images/Passing-Out/Passing-out-vid-1-thumb.png`;
            }
            else if (href.includes("/upload/") && isVideo) {
                // Cloudinary video thumbnail (first frame)
                const parts = href.split("/upload/");
                // remove extension from the video filename
                const fileWithoutExt = parts[1].replace(/\.(mp4|mov)$/i, "");
                img.src = `${parts[0]}/upload/w_300,c_scale,so_0,f_auto,q_auto/${fileWithoutExt}.jpg`;
            }
            else {
                // fallback for non-Cloudinary URL
                img.src = href;
            }

            a.appendChild(img);
            groupDiv.appendChild(a);
        });


        // Apply comic/random effects for this album only
        applyGalleryEffects(groupDiv);
    }

    // Bind GLightbox
    GLightbox({
        selector: '.gallery-lightbox',
        touchNavigation: true,
        loop: true,
        zoomable: true,
        autoplayVideos: false
    });
}


// Comic/random effects
function applyGalleryEffects(grid) {
  grid.querySelectorAll("a").forEach((a) => {
    
      // Random rotation 
    a.style.transform = `rotate(${(Math.random() * 20 - 10).toFixed(2)}deg)`;
    a.style.zIndex = Math.floor(Math.random() * 10) + 1;    

    // Random grid spans
    const spanRow = Math.floor(Math.random() * 3) + 1;
    const spanCol = Math.floor(Math.random() * 3) + 1;
    a.style.gridRowEnd = `span ${spanRow}`;
    a.style.gridColumnEnd = `span ${spanCol}`; 

    // Random offset
    
    if (Math.random() > 0.7) {
      a.style.position = "relative";
      a.style.left = `${(Math.random() * 40 - 20).toFixed(2)}px`;
      a.style.top = `${(Math.random() * 40 - 20).toFixed(2)}px`;
    } 

    // Comic color overlay
    const tints = [
      "rgba(255, 0, 0, 0.18)",
      "rgba(0, 255, 255, 0.18)",
      "rgba(255, 255, 0, 0.18)",
      "rgba(0, 255, 0, 0.18)",
      "rgba(255, 128, 0, 0.18)",
      "rgba(128, 0, 255, 0.18)"
    ];
    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.inset = "0";
    overlay.style.background = tints[Math.floor(Math.random() * tints.length)];
    overlay.style.pointerEvents = "none";
    overlay.style.mixBlendMode = "overlay";
    overlay.style.borderRadius = "6px";
    overlay.style.transition = "background 0.3s";
    a.appendChild(overlay);
  });
}

// Load gallery on page load
window.addEventListener("load", () => {
  loadGallery();
});


// Parallax
function initGalleryParallax(){gsap.utils.toArray(".gallery-grid img").forEach(img=>{gsap.set(img,{y:0,opacity:1});gsap.to(img,{y:"+="+20,scrollTrigger:{trigger:img.closest("section"),start:"top bottom",end:"bottom top",scrub:0.5}});});}
gsap.utils.toArray(".portrait").forEach(p=>{gsap.to(p,{y:"+=15",scrollTrigger:{trigger:p.closest("section"),start:"top bottom",end:"bottom top",scrub:0.5}});});

window.addEventListener("load",()=>{
  loadGallery();
  animateSection(currentSection);
  gsap.set(".gallery-grid img",{opacity:1,y:0});
});