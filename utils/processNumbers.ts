export function trimNumber(num: number): number {
  num = Number(num);
  let key = 2;
  let isNegative = false;

  if (num < 0) {
    num = -num;
    isNegative = true;
  }

  if (num < 1) {
    const rightSide = `${num}`.split(".")[1]; //get right side of number

    if (rightSide?.length > 1) {
      const splittedRightSide = rightSide.split("");

      for (let i = 0; i < splittedRightSide.length; i++) {
        if (splittedRightSide[i] !== "0" && splittedRightSide[i + 1] !== "0") {
          key = i + 2;
          break;
        }
      }
    }
  }

  num = +(num ? num.toFixed(key) : 0);

  if (isNegative) num = -num;

  return num;
}

// optionally shows 2 non-zero numbers after decimal point
export function trimNumberBitzaim(num: number): string | number {
  const oldVal = String(num);
  let key = 2;

  if (+num < 1) {
    const stringNum = `${num}`; //to string
    const rightSide = stringNum.split(".")[1]; //get right side of number

    if (rightSide?.length > 1) {
      const splittedRightSide = rightSide.split("");

      for (let i = 0; i < splittedRightSide.length; i++) {
        if (splittedRightSide[i] !== "0" && splittedRightSide[i + 1] !== "0") {
          key = i + 2;
          break;
        }
      }

      num = parseFloat(oldVal);
    }
  }

  return num ? num.toFixed(key) : 0;
}

export function trimFloatNumber(num: number, end = 8): number | string {
  let result: number | string = num;

  if (typeof Number(num) === "number" && !isNaN(Number(num)) && num !== null) {
    const stringNum = `${num}`;
    let leftSide, rightSide;

    const separator = stringNum.includes(".") ? "." : stringNum.includes(",") ? "," : false;

    if (separator) {
      leftSide = stringNum.split(separator)[0];
      rightSide = stringNum.split(separator)[1];
      rightSide = rightSide.substring(0, end);
      result = `${leftSide}.${rightSide}`;
    }
  }

  return result;
}

// function that validates @keypress event of inputs and prevents if is not Number
export function validateWholeNumbers(e: KeyboardEvent) {
  if (!e) {
    throw Error("you must use this function on keypress handler");
  }
  if (e.keyCode < 48 || e.keyCode > 57) {
    e?.preventDefault();
    return;
  }
}
