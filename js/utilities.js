//Round on Exit, Clamp to Max and Min Values

export const roundup = function (val, dec = 0) {
  return Math.ceil(val * 10 ** dec) / 10 ** dec;
};
export const rounddown = function (val, dec = 0) {
  return Math.floor(val * 10 ** dec) / 10 ** dec;
};

export const round = function (val, dec) {
  return Math.round(val * 10 ** dec) / 10 ** dec;
};
export const formatNumber = function (num, dec = 2) {
  return num.toFixed(dec);
};

export const clampAndConvertToString = function (val, min, max, dec) {
  val = round(val, dec);

  if (val < Number(min)) {
    val = Number(min);
  }

  if (val > Number(max)) {
    val = Number(max);
  }

  return formatNumber(val, dec);
};

export const roundNear = function (val, near) {
  return round(val / near, 0) * near;
};

export const roundAt = function (val, near) {
  const remainder = val - rounddown(val);

  if (remainder >= near) return roundup(val);

  return rounddown(val);
};
