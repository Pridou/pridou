export enum LexerTokenType {
  Alpha = "Alpha",
  Number = "Number",

  Let = "Let",
  Const = "Const",

  Equals = "Equals",
  BinaryOperator = "BinaryOperator",

  Comma = "Comma",
  Colon = "Colon",
  Semicolon = "Semicolon",

  OpeningParenthesis = "OpeningParenthesis",
  ClosingParenthesis = "ClosingParenthesis",
  OpeningCurlyBracket = "OpeningCurlyBracket",
  ClosingCurlyBracket = "ClosingCurlyBracket",
  OpeningSquareBracket = "OpeningSquareBracket",
  ClosingSquareBracket = "ClosingSquareBracket",

  EOF = "EOF",
}

export interface LexerToken {
  type: LexerTokenType;
  value: string;
}
