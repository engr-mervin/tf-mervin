//Takes care of data structure, modifying data logic, writing data , fetching data etc.
//NOTE! The internal functions here can only be called by the controller
//The model is only responsible for the data logic, the controller is for execution
import * as util from "./utilities.js";
import * as INPUT from "./constants/inputs.js";
import * as OUTPUT from "./constants/outputs.js";
import * as INTER from "./constants/intermediate.js";

//////////////////INTERMEDIATE/////////////////////////////////
export const computeIntermediate = function (inp) {
  const inters = {};
  if (inp[INPUT.MIXTURE_CLASS] === "AA") {
    inters[INTER.MIXTURE] = 12.0;
  } else if (inp[INPUT.MIXTURE_CLASS] === "A") {
    inters[INTER.MIXTURE] = 9.0;
  } else if (inp[INPUT.MIXTURE_CLASS] === "B") {
    inters[INTER.MIXTURE] = 7.2;
  } else if (inp[INPUT.MIXTURE_CLASS] === "C") {
    inters[INTER.MIXTURE] = 6.0;
  } else {
    inters[INTER.MIXTURE] = 9.0;
  }

  inters[INTER.PCCP_AREA_CROSS] = inp[INPUT.LANE_WIDTH] * inp[INPUT.PCCP_THICKNESS];

  inters[INTER.OUTPUT_METER_PER_DAY] = util.roundNear(inp[INPUT.OUTPUT_PER_DAY] / inters[INTER.PCCP_AREA_CROSS], 1.5);

  return inters;
};

//////////////////CALCULATIONS/////////////////////////////////
const computeBaseCourse = function (inp) {
  const results = {};
  results[OUTPUT.ABC_WIDTH_BASE] = inp[INPUT.LANE_WIDTH] * inp[INPUT.NUMBER_OF_LANES] + inp[INPUT.SHOULDER_WIDTH] * inp[INPUT.NUMBER_OF_SIDES];
  results[OUTPUT.ABC_THICK_BASE] = inp[INPUT.ABC_THICKNESS];
  results[OUTPUT.ABC_AREA_BASE] = inp[INPUT.ABC_THICKNESS] * results[OUTPUT.ABC_WIDTH_BASE];

  results[OUTPUT.ABC_WIDTH_SHOULDER] = inp[INPUT.SHOULDER_WIDTH];
  results[OUTPUT.ABC_THICK_SHOULDER] = inp[INPUT.PCCP_THICKNESS];
  results[OUTPUT.ABC_AREA_SHOULDER] = 0.5 * inp[INPUT.NUMBER_OF_SIDES] * inp[INPUT.SHOULDER_WIDTH] * inp[INPUT.PCCP_THICKNESS];

  results[OUTPUT.ABC_TOTALAREA] = results[OUTPUT.ABC_AREA_BASE] + results[OUTPUT.ABC_AREA_SHOULDER];
  results[OUTPUT.ABC_LENGTH] = inp[INPUT.LENGTH];

  results[OUTPUT.ABC_VOLUME] = inp[INPUT.LENGTH] * results[OUTPUT.ABC_TOTALAREA];
  results[OUTPUT.ABC_ADJVOLUME] = results[OUTPUT.ABC_VOLUME] * (1 + inp[INPUT.SHRINKAGE_FACTOR] / 100);

  return results;
};

const computePCCP = function (inp, inters) {
  const results = {};
  results[OUTPUT.PCCP_LENGTH] = inp[INPUT.LENGTH];
  results[OUTPUT.PCCP_WIDTH] = inp[INPUT.LANE_WIDTH] * inp[INPUT.NUMBER_OF_LANES];
  results[OUTPUT.PCCP_THICK] = inp[INPUT.PCCP_THICKNESS];
  results[OUTPUT.PCCP_AREA_TOP] = results[OUTPUT.PCCP_LENGTH] * results[OUTPUT.PCCP_WIDTH];

  results[OUTPUT.PCCP_OUTPUT] = inters[INTER.OUTPUT_METER_PER_DAY];
  console.log(results[OUTPUT.PCCP_OUTPUT]);
  results[OUTPUT.PCCP_VOLUME] = results[OUTPUT.PCCP_AREA_TOP] * inp[INPUT.PCCP_THICKNESS];
  return results;
};

const computeSteel = function (inp, inters) {
  const results = {};

  results[OUTPUT.STL_NUM_OF_CJ] =
    util.roundAt(inp[INPUT.LENGTH] / inters[INTER.OUTPUT_METER_PER_DAY], 1.5 / inters[INTER.OUTPUT_METER_PER_DAY]) * inp[INPUT.NUMBER_OF_SIDES];

  results[OUTPUT.STL_NUM_OF_DOWELS_PER_CJ] = util.roundup((inp[INPUT.LANE_WIDTH] - 0.1) / inp[INPUT.DOWELS_CJ_S], 0);

  results[OUTPUT.STL_TOTAL_NUM_OF_DOWELS_CJ] = results[OUTPUT.STL_NUM_OF_CJ] * results[OUTPUT.STL_NUM_OF_DOWELS_PER_CJ];

  results[OUTPUT.STL_NUM_OF_DOWELS_PER_BAR_CJ] = util.rounddown(6 / inp[INPUT.DOWELS_CJ], 0);

  results[OUTPUT.STL_BARS_FOR_CJ] = util.roundup(results[OUTPUT.STL_TOTAL_NUM_OF_DOWELS_CJ] / results[OUTPUT.STL_NUM_OF_DOWELS_PER_BAR_CJ], 0);

  results[OUTPUT.STL_TOTAL_NUM_OF_DOWELS_LI] = util.roundup((inp[INPUT.LENGTH] - 0.1) / inp[INPUT.DOWELS_LI_S], 0);

  results[OUTPUT.STL_NUM_OF_DOWELS_PER_BAR_LI] = util.rounddown(6 / inp[INPUT.DOWELS_LI], 0);

  results[OUTPUT.STL_BARS_FOR_LI] = util.roundup(results[OUTPUT.STL_TOTAL_NUM_OF_DOWELS_LI] / results[OUTPUT.STL_NUM_OF_DOWELS_PER_BAR_LI], 0);

  return results;
};

export const compute = function (inp, inters) {
  let results = {};

  results = { ...results, ...computeBaseCourse(inp, inters), ...computePCCP(inp, inters), ...computeSteel(inp, inters) };

  return results;
};

//////////////////TAKEOFF/////////////////////////////////
const takeOffBaseCourse = function (res, swc, inters) {
  const results = {};

  results[OUTPUT.ABC_MAT_ABC] = util.roundup(res[OUTPUT.ABC_ADJVOLUME] * (1 + swc[OUTPUT.ABC_MAT_ABC] / 100));

  return results;
};
const takeOffPCCP = function (res, swc, inters) {
  const results = {};

  results[OUTPUT.PCCP_MAT_PC] = util.roundup(res[OUTPUT.PCCP_VOLUME] * inters[INTER.MIXTURE] * (1 + swc[OUTPUT.PCCP_MAT_PC] / 100));
  results[OUTPUT.PCCP_MAT_SAND] = util.roundup(res[OUTPUT.PCCP_VOLUME] * 0.5 * (1 + swc[OUTPUT.PCCP_MAT_SAND] / 100));
  results[OUTPUT.PCCP_MAT_GRAVEL] = util.roundup(res[OUTPUT.PCCP_VOLUME] * (1 + swc[OUTPUT.PCCP_MAT_GRAVEL] / 100));

  return results;
};

const takeOffSteel = function (res, swc, inters) {
  const results = {};

  results[OUTPUT.STL_MAT_CJ] = util.roundup(res[OUTPUT.STL_BARS_FOR_CJ] * (1 + swc[OUTPUT.STL_MAT_CJ] / 100));

  results[OUTPUT.STL_MAT_LI] = util.roundup(res[OUTPUT.STL_BARS_FOR_LI] * (1 + swc[OUTPUT.STL_MAT_LI] / 100));

  return results;
};

export const takeoff = function (res, swc, inters) {
  return { ...takeOffBaseCourse(res, swc, inters), ...takeOffPCCP(res, swc, inters), ...takeOffSteel(res, swc) };
};
