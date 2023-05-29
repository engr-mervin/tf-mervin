//Manages displaying data in the UI, takes data from model and writes it into the screen
//NOTE! The internal functions here can only be called by the controller
//The view is only responsible for the view logic, the controller is for execution

import * as util from "./utilities.js";

import * as INPUT from "./constants/inputs.js"; //GET INPUTS
import * as OUTPUT from "./constants/outputs.js"; //DISPLAY OUTPUTS

export const dispNavButtons = function (navButton, navButtons) {
  navButtons.forEach((el) => {
    if (el.hasAttribute("activated")) {
      el.removeAttribute("activated");
      el.classList.remove("nav-active");
    }
  });

  navButton.setAttribute("activated", "");
  navButton.classList.add("nav-active");
};

export const dropDownClick = function (el) {
  el.classList.toggle("closed");
};

//Get Element
const getEl = function (str) {
  return document.getElementById(str);
};

//GET INTERMEDIATE VARIABLE
const getRes = function (str) {
  const el = document.getElementById(str);
  const elName = el.nodeName;

  if (elName === "TD") return +el.dataset.value;
  else return null;
};

const getSWC = function (str) {
  // const el = document.querySelector(`[data-for:"${str}"]`);
  const selector = `[data-for-el="${str}"]`;
  const el = document.querySelector(selector);

  return +el.value;
};

const get = function (str) {
  const el = document.getElementById(str);
  const elName = el.nodeName;
  if (elName === "INPUT") {
    if (isNaN(el.value)) {
      return el.value;
    } else {
      return +el.value;
    }
  }

  if (elName === "SELECT") {
    if (isNaN(el.value)) {
      return el.value;
    } else {
      return +el.value;
    }
  }

  return null;
};

//set textcontent to val
const set = function (str, val) {
  const el = document.getElementById(str);
  el.dataset.value = val;
  el.textContent = util.formatNumber(util.round(val, 2), 2);
};

export const getInput = function () {
  const allInput = {};

  allInput[INPUT.LENGTH] = get(INPUT.LENGTH);
  allInput[INPUT.LANE_WIDTH] = get(INPUT.LANE_WIDTH);
  allInput[INPUT.NUMBER_OF_LANES] = get(INPUT.NUMBER_OF_LANES);
  allInput[INPUT.PCCP_THICKNESS] = get(INPUT.PCCP_THICKNESS);
  allInput[INPUT.SHOULDER_WIDTH] = get(INPUT.SHOULDER_WIDTH);
  allInput[INPUT.OUTPUT_PER_DAY] = get(INPUT.OUTPUT_PER_DAY);
  allInput[INPUT.MIXTURE_CLASS] = get(INPUT.MIXTURE_CLASS);

  allInput[INPUT.DOWELS_CJ] = get(INPUT.DOWELS_CJ);
  allInput[INPUT.DOWELS_CJ_S] = get(INPUT.DOWELS_CJ_S);
  allInput[INPUT.DOWELS_LI] = get(INPUT.DOWELS_LI);
  allInput[INPUT.DOWELS_LI_S] = get(INPUT.DOWELS_LI_S);

  allInput[INPUT.LUMBER_USE] = get(INPUT.LUMBER_USE);
  allInput[INPUT.BAG_USE] = get(INPUT.BAG_USE);
  allInput[INPUT.PINBOLTS] = get(INPUT.PINBOLTS);
  allInput[INPUT.PINBOLTS_S] = get(INPUT.PINBOLTS_S);

  allInput[INPUT.NUMBER_OF_SIDES] = get(INPUT.NUMBER_OF_SIDES);
  allInput[INPUT.ABC_THICKNESS] = get(INPUT.ABC_THICKNESS);
  allInput[INPUT.SHRINKAGE_FACTOR] = get(INPUT.SHRINKAGE_FACTOR);

  return allInput;
};

export const getWastage = function () {
  const allSWC = {};

  //ABC
  allSWC[OUTPUT.ABC_MAT_ABC] = getSWC(OUTPUT.ABC_MAT_ABC);

  //PCCP
  allSWC[OUTPUT.PCCP_MAT_PC] = getSWC(OUTPUT.PCCP_MAT_PC);
  allSWC[OUTPUT.PCCP_MAT_SAND] = getSWC(OUTPUT.PCCP_MAT_SAND);
  allSWC[OUTPUT.PCCP_MAT_GRAVEL] = getSWC(OUTPUT.PCCP_MAT_GRAVEL);

  //STEEL
  allSWC[OUTPUT.STL_MAT_CJ] = getSWC(OUTPUT.STL_MAT_CJ);
  allSWC[OUTPUT.STL_MAT_LI] = getSWC(OUTPUT.STL_MAT_LI);
  allSWC[OUTPUT.STL_MAT_GI] = getSWC(OUTPUT.STL_MAT_GI);

  console.log(allSWC);
  return allSWC;
};

export const dispResults = function (res) {
  Object.entries(res).forEach((entry) => {
    const [key, val] = entry;

    if (getEl(key) === null) return;

    //LOGIC WHEN CHANGED
    if (val !== getRes(key) && !isNaN(getRes(key))) {
      getEl(key).style.fontWeight = 700;
    } else {
      getEl(key).style.fontWeight = 400;
    }

    set(key, val);
  });
};

export const dispTakeoff = function (takeoff) {
  Object.entries(takeoff).forEach((entry) => {
    const [key, val] = entry;

    //LOGIC WHEN CHANGED
    if (val !== getRes(key) && !isNaN(getRes(key))) {
      console.log(val, getRes(key));
      console.log(key, "changed");
      getEl(key).style.fontWeight = 700;
    } else {
      getEl(key).style.fontWeight = 400;
    }
    set(key, val);
  });
};
