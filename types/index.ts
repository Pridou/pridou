export enum TokenType {
  Alpha = 0,
  Number = 1,

  Equals = 2,
  BinaryOperator = 3,

  OpeningParenthesis = 4,
  ClosingParenthesis = 5,

  Let = 6,
  Const = 7,
}

export interface Token {
  type: TokenType;
  value: string;
}
