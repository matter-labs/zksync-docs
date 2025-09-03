<template>
  <div class="orbit">
    <ul class="orbit-wrap">
      <li class="orbit-center">
        <img
          src="/logos/Blob-icon_black.png"
          alt="ZKsync"
          class="orbit-center__icon light-mode-icon"
        />
        <img
          src="/logos/Blob-icon_white.png"
          alt="ZKsync"
          class="orbit-center__icon dark-mode-icon"
        />
      </li>

      <li>
        <ul class="ring-0">
          <li class="black-hole bg-white dark:bg-black" />
          <li>
            <img
              src="https://www.zksync.io/ecosystem/era.png"
              class="orbit-icon"
              alt="ZKsync Era"
            />
          </li>
          <li>
            <img
              src="/logos/abstract.svg"
              class="orbit-icon"
              alt="Abstract"
            />
          </li>
          <li>
            <img
              src="https://www.zksync.io/ecosystem/cronos-zkevm.png"
              class="orbit-icon"
              alt="Cronos zkEVM"
            />
          </li>
          <li>
            <img
              src="https://www.zksync.io/ecosystem/grvt.png"
              class="orbit-icon"
              alt="GRVT"
            />
          </li>
        </ul>
      </li>

      <li>
        <ul class="ring-1">
          <li class="black-hole bg-white dark:bg-black" />
          <li>
            <img
              src="https://www.zksync.io/ecosystem/lens.png"
              class="orbit-icon"
              alt="Lens"
            />
          </li>
          <li>
            <img
              src="/logos/sophon.svg"
              class="orbit-icon"
              alt="Sophon"
            />
          </li>
          <li>
            <img
              src="https://www.zksync.io/ecosystem/space-and-time.png"
              class="orbit-icon"
              alt="Space and Time"
            />
          </li>
        </ul>
      </li>
      <li>
        <ul class="ring-2">
          <li class="black-hole bg-white dark:bg-black" />
          <li>
            <img
              src="/logos/openzk.png"
              class="orbit-icon"
              alt="OpenZK"
            />
          </li>
          <li>
            <img
              src="https://www.zksync.io/ecosystem/xpla.png"
              class="orbit-icon"
              alt="XPLA"
            />
          </li>
          <li>
            <img
              src="https://www.zksync.io/ecosystem/zero.png"
              class="orbit-icon"
              alt="Zero Network"
            />
          </li>
          <li>
            <img
              src="https://www.zksync.io/ecosystem/zkcandy.png"
              class="orbit-icon"
              alt="ZKcandy"
            />
          </li>
          <li>
            <img
              src="https://www.zksync.io/ecosystem/memento.png"
              class="orbit-icon"
              alt="Memento Chain"
            />
          </li>
          <li>
            <img
              src="https://www.zksync.io/ecosystem/ripio-lachain.png"
              class="orbit-icon"
              alt="Ripio LaChain"
            />
          </li>
          <li>
            <img
              src="https://www.zksync.io/ecosystem/xsolla.png"
              class="orbit-icon"
              alt="Xsolla Chain"
            />
          </li>
        </ul>
      </li>
      <li>
        <ul class="ring-3">
          <li class="black-hole bg-white dark:bg-black" />
          <li>
            <img
              src="/logos/genlayer.jpg"
              class="orbit-icon"
              alt="GenLayer"
            />
          </li>
          <li>
            <img
              src="https://www.zksync.io/ecosystem/heurist.png"
              class="orbit-icon"
              alt="Heurist"
            />
          </li>
          <li>
            <img
              src="/logos/wonderfi_logo.jpeg"
              class="orbit-icon"
              alt="Wonderfi"
            />
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
* {
  box-sizing: border-box;
}

html {
  font-size: 100%;
}

.orbit {
  background: transparent;
  width: 100%;
  height: 55vh;
  max-height: 650px;
  min-height: 300px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0;
  overflow: hidden;
}

.orbit-icon {
  width: 2.2em;
  height: 2.2em;
  line-height: 2.2em;
  font-size: 1.2em;
  border-radius: 50%;
  background: transparent !important;
  color: #fff;
  text-align: center;
  display: block;
  object-fit: contain;
  object-position: center;
  padding: 0.25em;
  box-sizing: border-box;
  border: none !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.orbit-wrap {
  height: 35em;
  list-style: none;
  font-size: 1.1em;
  position: relative;
}
.orbit-wrap > li {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

ul[class^='ring'] {
  transition: all 300ms ease-in-out;
  box-shadow: none !important;
}
ul[class^='ring'] li:not(.black-hole) {
  transition: all 300ms ease-in-out;
}

.light img {
  background: rgb(215, 241, 251) !important;
}

.ring-0 {
  width: 42em;
  height: 42em;
  animation: clockwiseRotate 75s linear infinite;
}
.ring-0 i,
.ring-0 img {
  animation: counterClockwiseRotate 75s linear infinite;
  width: 2.2em;
  height: 2.2em;
  background: transparent !important;
}
.ring-0 .black-hole {
  transform: none !important;
  position: absolute;
  width: 41.8em;
  height: 41.8em;
  position: absolute;
  top: 2px;
  left: 2px;
  border-radius: 50%;
  box-sizing: content-box;
}

.ring-0 > *:nth-of-type(1) {
  transform: rotate(95deg) translate(21em) rotate(-95deg);
}

.ring-0 > *:nth-of-type(2) {
  transform: rotate(190deg) translate(21em) rotate(-190deg);
}

.ring-0 > *:nth-of-type(3) {
  transform: rotate(285deg) translate(21em) rotate(-285deg);
}

.ring-0 > *:nth-of-type(4) {
  transform: rotate(380deg) translate(21em) rotate(-380deg);
}

.ring-0 > *:nth-of-type(5) {
  transform: rotate(475deg) translate(21em) rotate(-475deg);
}

.ring-1 {
  width: 34em;
  height: 34em;
  animation: clockwiseRotate 63s linear infinite;
}
.ring-1 i,
.ring-1 img {
  animation: counterClockwiseRotate 63s linear infinite;
  width: 2.2em;
  height: 2.2em;
  background: transparent !important;
}
.ring-1 .black-hole {
  transform: none !important;
  position: absolute;
  width: 33.8em;
  height: 33.8em;
  position: absolute;
  top: 2px;
  left: 2px;
  border-radius: 50%;
  box-sizing: content-box;
}

.ring-1 > *:nth-of-type(1) {
  transform: rotate(126.6666666667deg) translate(17em) rotate(-126.6666666667deg);
}

.ring-1 > *:nth-of-type(2) {
  transform: rotate(253.3333333333deg) translate(17em) rotate(-253.3333333333deg);
}

.ring-1 > *:nth-of-type(3) {
  transform: rotate(380deg) translate(17em) rotate(-380deg);
}

.ring-1 > *:nth-of-type(4) {
  transform: rotate(506.6666666667deg) translate(17em) rotate(-506.6666666667deg);
}

.ring-2 {
  width: 26em;
  height: 26em;
  animation: clockwiseRotate 63s linear infinite;
}
.ring-2 i,
.ring-2 img {
  animation: counterClockwiseRotate 63s linear infinite;
  width: 2.2em;
  height: 2.2em;
  background: transparent !important;
}
.ring-2 .black-hole {
  transform: none !important;
  position: absolute;
  width: 25.8em;
  height: 25.8em;
  position: absolute;
  top: 2px;
  left: 2px;
  border-radius: 50%;
  box-sizing: content-box;
}

.ring-2 > *:nth-of-type(1) {
  transform: rotate(47.5deg) translate(13em) rotate(-47.5deg);
}

.ring-2 > *:nth-of-type(2) {
  transform: rotate(95deg) translate(13em) rotate(-95deg);
}

.ring-2 > *:nth-of-type(3) {
  transform: rotate(142.5deg) translate(13em) rotate(-142.5deg);
}

.ring-2 > *:nth-of-type(4) {
  transform: rotate(190deg) translate(13em) rotate(-190deg);
}

.ring-2 > *:nth-of-type(5) {
  transform: rotate(237.5deg) translate(13em) rotate(-237.5deg);
}

.ring-2 > *:nth-of-type(6) {
  transform: rotate(285deg) translate(13em) rotate(-285deg);
}

.ring-2 > *:nth-of-type(7) {
  transform: rotate(332.5deg) translate(13em) rotate(-332.5deg);
}

.ring-2 > *:nth-of-type(8) {
  transform: rotate(380deg) translate(13em) rotate(-380deg);
}

.ring-2 > *:nth-of-type(9) {
  transform: rotate(427.5deg) translate(13em) rotate(-427.5deg);
}

.ring-3 {
  width: 18em;
  height: 18em;
  animation: clockwiseRotate 60s linear infinite;
}
.ring-3 i,
.ring-3 img {
  animation: counterClockwiseRotate 60s linear infinite;
  width: 2.2em;
  height: 2.2em;
  background: transparent !important;
}
.ring-3 .black-hole {
  transform: none !important;
  position: absolute;
  width: 17.8em;
  height: 17.8em;
  position: absolute;
  top: 2px;
  left: 2px;
  border-radius: 50%;
  box-sizing: content-box;
}

.ring-3 > *:nth-of-type(1) {
  transform: rotate(126.6666666667deg) translate(9em) rotate(-126.6666666667deg);
}

.ring-3 > *:nth-of-type(2) {
  transform: rotate(253.3333333333deg) translate(9em) rotate(-253.3333333333deg);
}

.ring-3 > *:nth-of-type(3) {
  transform: rotate(380deg) translate(9em) rotate(-380deg);
}

.ring-3 > *:nth-of-type(4) {
  transform: rotate(506.6666666667deg) translate(9em) rotate(-506.6666666667deg);
}

ul[class^='ring'] {
  background: linear-gradient(
    to bottom right,
    rgba(184, 39, 252, 0.5) 0%,
    rgba(44, 144, 252, 0.5) 25%,
    rgba(184, 253, 51, 0.5) 50%,
    rgba(254, 200, 55, 0.5) 75%,
    rgba(253, 24, 146, 0.5) 100%
  );
  position: relative;
  padding: 0;
  border-radius: 50%;
  list-style: none;
  box-sizing: content-box;
}

ul[class^='ring'] li:not(.black-hole) {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2.5em;
  height: 2.5em;
  margin: -1.25em;
}

/*
  center;
*/
.orbit-center {
  z-index: 5;
  font-size: 2em;
  width: 8em;
  height: 8em;
  line-height: 8em;
  text-align: center;
  background: transparent !important;
  background-color: transparent !important;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none !important;
  border: none !important;
}

.orbit-center__icon {
  width: 7em;
  height: 7em;
  transform: rotateZ(-360deg);
  transition: all 300ms ease-in-out;
  position: absolute;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

/* Comprehensive overrides to prevent any background colors */
.orbit-center,
.orbit-center:hover,
.orbit-center:focus,
.orbit-center:active,
.orbit-center:visited {
  background: none !important;
  background-color: transparent !important;
  background-image: none !important;
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}

.orbit-center__icon,
.orbit-center__icon:hover,
.orbit-center__icon:focus,
.orbit-center__icon:active,
.orbit-center__icon:visited {
  background: none !important;
  background-color: transparent !important;
  background-image: none !important;
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}

/* Override any potential CSS framework styles */
li.orbit-center {
  background: none !important;
  background-color: transparent !important;
  background-image: none !important;
}

/* Override any list item styles */
ul li.orbit-center {
  background: none !important;
  background-color: transparent !important;
  background-image: none !important;
}

/* Override .light img styles specifically */
.light .orbit-center__icon,
.light img.orbit-center__icon,
.light .light-mode-icon,
.light .dark-mode-icon {
  background: none !important;
  background-color: transparent !important;
  background-image: none !important;
}

/* Additional img tag overrides */
img.orbit-center__icon {
  background: none !important;
  background-color: transparent !important;
  background-image: none !important;
}

/* Theme switching for icons */
/* Light mode - show black icon, hide white icon */
.light-mode-icon {
  display: block;
}

.dark-mode-icon {
  display: none;
}

/* Dark mode - show white icon, hide black icon */
.dark .light-mode-icon {
  display: none;
}

.dark .dark-mode-icon {
  display: block;
}

/* Dark mode styling for orbit icons */
.dark .orbit-icon {
  background: transparent !important;
  border: none !important;
}

/* Override the light blue background from .light img */
.light .orbit-icon,
.light img.orbit-icon {
  background: transparent !important;
}

/* Additional overrides for orbit icons */
ul[class^='ring'] img.orbit-icon {
  background: transparent !important;
  border: none !important;
}

/* Ensure no background on any orbit icon images */
img.orbit-icon {
  background: transparent !important;
  border: none !important;
}

/*
animations
*/
@keyframes clockwiseRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes counterClockwiseRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
</style>
