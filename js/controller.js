//Responsible for Logic of Execution

//Persist Active Tab in Navigation

import * as view from "./view.js";
import * as util from "./utilities.js";
import * as model from "./model.js";
import * as CONFIG from "./config.js";

//Switch active inputs

const subsNavButtons = function () {
  const navButtons = [...document.querySelectorAll(CONFIG.NAV_ITEM)];

  navButtons.forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      view.toggleNavButton(el, navButtons);
    });
  });
};

const subsInputNumbers = function () {
  const inputNumbers = [...document.querySelectorAll(CONFIG.AUTO_ROUND)];

  console.log("start");
  inputNumbers.forEach((el) => {
    el.addEventListener("focusout", function (e) {
      e.preventDefault();
      console.log("out", el.value);
      if (el.value === "") return;
      console.log("out", el.value);
      el.value = util.clampAndConvertToString(Number(el.value), Number(el.min), Number(el.max), Number(el.dataset.round));
    });
  });
};

///////////////DROPDOWN LOGIC

const subsDropDowns = function () {
  const dropdowns = document.querySelectorAll(CONFIG.DROP_DOWN);
  dropdowns.forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      view.dropDownClick(el);
    });
  });
};

const subsCompute = function () {
  document.getElementById(CONFIG.COMPUTE_BTN).addEventListener("click", function (e) {
    e.preventDefault();

    //VALIDATE ALL FIELDS
    if (view.validateInputs() === false) {
      console.log("invalidated");
      view.showMessage("Please fill in all the fields.");
      return;
    }
    console.log("validated");
    //GET ALL INPUTS
    const inputs = view.getInput();

    //UPDATE ALL INTERMEDIATE VARIABLES
    const inters = model.computeIntermediate(inputs);

    console.log(inters);
    //COMPUTE RESULTS
    const results = model.compute(inputs, inters);

    //UPDATE CALCULATIONS
    view.dispResults(results);

    //GET ALL WASTAGE FACTORS
    const swc = view.getWastage();

    //COMPUTE TAKEOFF
    const takeoff = model.takeoff(results, swc, inters);

    //DISPLAY TAKEOFF
    view.dispTakeoff(takeoff);
  });
};

//
//CLEAR

const subsClearBtn = function () {
  const clear = document.getElementById("btn-clear");

  clear.addEventListener("click", function (e) {
    e.preventDefault();
    console.log("clear button clicked");
    view.clearInputs();
  });
};

const subsCloseBtn = function () {
  const close = document.querySelectorAll(".close-modal");

  close.forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      view.closeModal("message-box");
    });
  });
};

const subsPopulateBtn = function () {
  const popu = document.getElementById("populate-btn");

  popu.addEventListener("click", function (e) {
    e.preventDefault();

    view.populateInputs();
  });
};

const subsClearOutputBtn = function () {
  const clear = document.getElementById("clear-btn");

  clear.addEventListener("click", function (e) {
    e.preventDefault();

    view.clearOutputs();
  });
};
//
//

//
//

//
//

//
//

//
//

(function () {
  subsNavButtons();
  subsInputNumbers();
  subsDropDowns();
  subsCompute();
  subsClearBtn();
  subsCloseBtn();
  subsPopulateBtn();
  subsClearOutputBtn();
})();
