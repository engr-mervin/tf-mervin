"use strict";

const inputNumber = [...document.querySelectorAll(".number")];
const navButtons = [...document.querySelectorAll(".navigation__item")];

let currentTab;

console.log(navButtons);

const round = function (val, dec) {
  return Math.round(val * 10 ** dec) / 10 ** dec;
};
navButtons.forEach((el) => {
  el.addEventListener("click", function (e) {
    e.preventDefault();

    navButtons.forEach((a) => {
      if (a.hasAttribute("activated")) {
        a.removeAttribute("activated");
        a.classList.remove("nav-active");
      }
    });

    el.setAttribute("activated", "");
    el.classList.add("nav-active");
    currentTab = el;
  });
});

const changeOnExit = function (e) {
  e.preventDefault();
  this.value = round(this.value, this.dataset.round).toFixed(
    this.dataset.round
  );
  console.log(this.value);

  if (this.value < Number(this.min)) {
    this.value = Number(this.min).toFixed(this.dataset.round);
  }

  if (this.value > Number(this.max)) {
    this.value = Number(this.max).toFixed(this.dataset.round);
  }
};

inputNumber.forEach((el) => {
  el.addEventListener("focusout", changeOnExit);
});

const handleEnter = function (event) {
  if (event.key !== "Enter") return;

  const next = Number(event.target.dataset.sequence) + 1;

  const nextEl = document.querySelector(`[data-sequence="${next.toString()}"]`);
  if (!nextEl) return;
  nextEl.focus();
};
