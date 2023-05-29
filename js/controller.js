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
      view.dispNavButtons(el, navButtons);
    });
  });
};

const subsInputNumbers = function () {
  const inputNumbers = [...document.querySelectorAll(CONFIG.AUTO_ROUND)];

  console.log("start");
  inputNumbers.forEach((el) => {
    el.addEventListener("focusout", function (e) {
      e.preventDefault();
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
//

(function () {
  subsNavButtons();
  subsInputNumbers();
  subsDropDowns();
  subsCompute();
})();
