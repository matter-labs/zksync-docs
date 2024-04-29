<template>
  <ClientOnly>
    <template #default>
      <button class="underline" @click="addZeek()">
        {{ text }}
      </button>
      <div ref="el" class="fixed z-10 w-full h-full inset-0 pointer-events-none isolate" />
    </template>
    <template #fallback>
      {{ text }}
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useElementSize, useRafFn } from "@vueuse/core";

defineProps({
  text: {
    type: String,
    default: 'Zeek',
  },
});

const images = ["zeek-astronaut.svg", "zeek-banker.svg", "zeek-champion.svg", "zeek-coffee.svg", "zeek-davinci.svg", "zeek-dj.svg", "zeek-firstmate.svg", "zeek-foundry.svg", "zeek-ice-cream.svg", "zeek-indiana-jones.svg", "zeek-matrix.svg", "zeek-passport.svg", "zeek-pirate.svg"]
const el = ref<HTMLElement | null>(null);

const { width, height } = useElementSize(el);

class Particle {
  size: number;
  x: number;
  y: number;
  vx: number = 0;
  vy: number = 0;
  image: HTMLImageElement;
  loaded: boolean = false;
  static gravity = 0.5;

  constructor() {
    this.size = Math.random() * 90 + 70; // Customise emoji size. Increase for larger emojis, decrease for smaller.
    this.x = Math.random() * width.value - this.size;
    this.y = Math.random() * height.value - this.size;
    this.generateRandomSpeed();
    this.image = new Image();
    this.image.onload = () => {
      this.loaded = true;
      this.image.classList.add("absolute");
      this.image.style.width = `${this.size}px`;
      this.image.style.height = `${this.size}px`;
      this.image.style.willChange = `transform`;
      this.image.style.pointerEvents = `auto`;
      this.image.style.cursor = `crosshair`;
      this.image.style.margin = `0`;
      this.image.style.userSelect = `none`;
      this.image.draggable = false;
      el.value?.appendChild(this.image);
    };
    this.image.onclick = () => this.destroy();
    this.image.src = `/images/zeek/${images[Math.floor(Math.random() * images.length)]}`;
  }
  generateRandomSpeed() {
    this.vx = Math.random() * Particle.gravity * (Math.random() > 0.5 ? -1 : 1); // Adjust speed for more lively or calm movement.
    this.vy = Math.random() * Particle.gravity * (Math.random() > 0.5 ? -1 : 1);
    if (Math.abs(this.vx) <= 0.01 || Math.abs(this.vy) <= 0.01) {
      this.generateRandomSpeed();
    }
  }
  update(delta: number) {
    // Reverse direction upon hitting canvas edges to keep emojis within view
    if (this.x < 0 || this.x + this.size > width.value) {
      this.vx = -this.vx;
      this.x = this.x < 0 ? 0 : width.value - this.size;
    } else {
      this.x += this.vx * delta;
    }
    if (this.y < 0 || this.y + this.size > height.value) {
      this.vy = -this.vy;
      this.y = this.y < 0 ? 0 : height.value - this.size;
    } else {
      this.y += this.vy * delta;
    }
  }
  draw() {
    if (this.loaded) {
      this.image.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
  }
  destroy() {
    // remove image and from particles array
    this.image.remove();
    const index = particles.indexOf(this);
    particles.splice(index, 1);
  }
}

const addZeek = () => {
  for (let a = 0; a < 2; a++) {
    particles.push(new Particle());
  }
}

const particles: Particle[] = [];

function animate(_delta: number) {
  particles.forEach(particle => {
    particle.update(_delta);
    particle.draw();
  });
}

useRafFn(
  ({ delta }) => {
    animate(delta);
  },
  { fpsLimit: 100 }
);
</script>