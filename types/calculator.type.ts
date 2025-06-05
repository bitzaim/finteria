export type Pair = {
  id: number;
  pair: string;
  leverage: number;
  visual_divisibility: number;
  price: string;
  numbersAfterDecimal: number;
};

export type CalculatorState = {
  id: number;
  leverage?: number;
  cryptoCurr: string;
  fiatCurr: string;
  price?: number;
  loaded: boolean;
  activePair?: Pair;
  action?: string;
  selectDisabled: boolean;
};
