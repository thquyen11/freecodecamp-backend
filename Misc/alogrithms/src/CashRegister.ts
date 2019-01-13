function checkCashRegister(price: number, cash: number, cid) {
  let change: number = cash - price;
  const changeArr = [];
  interface resultObj {
    status?: string;
    change?: any[];
  }
  const result: resultObj = {};
  const currency: number[] = [0.01, 0.05, 0.1, 0.25, 1, 5, 10, 20, 100];
  // Here is your change, ma'am.
  for (let i: number = cid.length - 1; i >= 0; i--) {
    if (change >= currency[i]) {
      if (change >= cid[i][1]) {
        changeArr.push([cid[i][0], cid[i][1]]);
        change -= cid[i][1];
      } else if (change < cid[i][1]) {
        changeArr.push([
          cid[i][0],
          Math.floor(change / currency[i]) * currency[i]
        ]);
        change -= Math.floor(change / currency[i]) * currency[i];
      }
    }
    change = Math.round(change * 100) / 100;
  }

  if (change !== 0) {
    result.status = "INSUFFICIENT_FUNDS";
    result.change = [];
  } else {
    let totalCash: number = 0;
    for (let j: number = 0; j < cid.length; j++) {
      totalCash += cid[j][1];
    }

    if (totalCash === cash - price) {
      result.status = "CLOSED";
      result.change = cid;
    } else {
      result.status = "OPEN";
      result.change = changeArr;
    }
  }
  return result;
}

checkCashRegister(3.26, 100, [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
]);
