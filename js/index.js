"use strict";

const inputNumber = [...document.querySelectorAll(".auto-round")];
const navButtons = [...document.querySelectorAll(".navigation__item")];

let currentTab;

console.log(navButtons);

//Persist Active Tab in Navigation
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

//Round on Exit, Clamp to Max and Min Values
const round = function (val, dec) {
  return Math.round(val * 10 ** dec) / 10 ** dec;
};
const formatNumber = function (num, dec = 2) {
  return num.toFixed(dec);
};

const changeOnExit = function (e) {
  e.preventDefault();

  let val = Number(this.value);
  const dec = Number(this.dataset.round);

  val = round(this.value, dec);

  if (val < Number(this.min)) {
    val = Number(this.min);
  }

  if (val > Number(this.max)) {
    val = Number(this.max);
  }

  this.value = formatNumber(val, dec);
};

inputNumber.forEach((el) => {
  el.addEventListener("focusout", changeOnExit);
});

//Switch active inputs
const handleEnter = function (event) {
  if (event.key !== "Enter") return;

  const next = Number(event.target.dataset.sequence) + 1;

  const nextEl = document.querySelector(`[data-sequence="${next.toString()}"]`);
  if (!nextEl) return;
  nextEl.focus();
};

///////////////DROPDOWN LOGIC
const dropdowns = document.querySelectorAll(".item__title-box");

dropdowns.forEach((el) => {
  el.addEventListener("click", function (e) {
    e.preventDefault();
    el.classList.toggle("closed");
  });
});

//Value Update
const get = function (str) {
  if (document.getElementById(str).value) return Number(document.getElementById(str).value);

  return Number(document.getElementById(str).dataset.value);
};
//set textcontent to val
const set = function (str, val) {
  const el = document.getElementById(str);

  el.dataset.value = formatNumber(val, 4);
  el.textContent = formatNumber(val);
};

////AGGREGATE BASE COURSE COMPUTATIONS
//COMPUTATIONS

const computeBaseCourse = function () {
  const length = get("inp-length");
  const laneWidth = get("inp-lane-width");
  const shoulderWidth = get("inp-shoulder-width");
  const numOfLanes = get("inp-num-of-lanes");
  const numOfSides = get("inp-num-of-sides");
  const abcThickness = get("inp-abc-thick");
  const pccpThickness = get("inp-pccp-thick");
  const shinkageFactor = get("inp-abc-shrinkage");

  // const widthB = laneWidth * numOfLanes + shoulderWidth * numOfSides;

  set("abc-width-b", laneWidth * numOfLanes + shoulderWidth * numOfSides);
  set("abc-thick-b", abcThickness);
  set("abc-area-b", abcThickness * get("abc-width-b"));

  set("abc-width-s", shoulderWidth);
  set("abc-thick-s", pccpThickness);
  set("abc-area-s", 0.5 * numOfSides * shoulderWidth * pccpThickness);

  set("abc-totalarea", get("abc-area-s") + get("abc-area-b"));
  set("abc-length", length);

  set("abc-volume", length * get("abc-totalarea"));
  set("abc-adj-volume", get("abc-volume") * (1 + shinkageFactor / 100));
};

const takeOffBaseCourse = function () {};

const compute = function () {
  computeBaseCourse();
};

document.getElementById("btn-compute").addEventListener("click", compute);
