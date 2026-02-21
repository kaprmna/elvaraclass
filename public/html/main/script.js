const text = "Welcome to Main Page";
const typewriter = document.querySelector(".typewriter");

let index = 0;
let isDeleting = false;

function typeLoop() {
    if (!isDeleting) {
        typewriter.textContent = text.substring(0, index++);
        if (index > text.length) {
            isDeleting = true;
            setTimeout(typeLoop, 1000);
            return;
        }
    } else {
        typewriter.textContent = text.substring(0, index--);
        if (index === 0) {
            isDeleting = false;
        }
    }

    setTimeout(typeLoop, isDeleting ? 50 : 80);
}

window.onload = typeLoop;

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 2;
        this.dx = (Math.random() - 0.5) * 0.5;
        this.dy = (Math.random() - 0.5) * 0.5;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(76,201,255,0.7)";
        ctx.fill();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.dy *= -1;

        this.draw();
    }
}

function initParticles() {
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => p.update());
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
