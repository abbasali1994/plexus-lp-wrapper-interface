import BigNumber from "big-number";

export function isInViewport(el, box) {
  const rect = el.getBoundingClientRect();
  const boxRect = box.getBoundingClientRect();
  return rect.top >= boxRect.top && rect.bottom <= boxRect.bottom;
}

export function formatAmount(amount, decimals = 4) {
    if(amount === undefined) return "";

  if (typeof amount !== "number") amount = parseFloat(amount.replace(",", ""));
  if (amount > 10 ** 9)
  {
    amount = amount/(10**9)
    return amount.toLocaleString("en-US", { maximumFractionDigits: 3 })+" B"
  }
  if (amount > 10)
    return amount.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (amount > 10 ** (-1 * decimals))
    return amount.toLocaleString("en-US", { maximumFractionDigits: decimals });
  return amount.toExponential(decimals);
}

export function formatTimestamp(timestamp) {
  var d = new Date(parseFloat(timestamp) * 1000),
    yyyy = d.getFullYear(),
    mm = ("0" + (d.getMonth() + 1)).slice(-2),
    dd = ("0" + d.getDate()).slice(-2),
    hh = d.getHours(),
    h = hh,
    min = ("0" + d.getMinutes()).slice(-2),
    ampm = "AM",
    time;

  if (hh > 12) {
    h = hh - 12;
    ampm = "PM";
  } else if (hh === 12) {
    h = 12;
    ampm = "PM";
  } else if (hh === 0) {
    h = 12;
  }

  time = mm + "-" + dd + "-" + yyyy + " " + h + ":" + min + " " + ampm;

  return time;
}

export function convertAmountToString(amount, decimals) {
  let amountString = amount.toString();
  let amountDecimals = 0;
  if (amountString.split(".")[1])
    amountDecimals = amountString.split(".")[1].length;
  amount = BigNumber(
    parseInt(amount * 10 ** Math.min(amountDecimals, decimals))
  );
  amountString = pad(amount, Math.max(0, decimals - amountDecimals));
  return amountString;
}

function pad(number, length) {
  var str = "" + number;
  for (let i = 1; i <= length; i++) {
    str = str + "0";
  }
  return str;
}