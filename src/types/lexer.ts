export enum LexerTokenType {
  Fix = "fix",
  For = "for",
  Fun = "fun",
  Mut = "mut",
  Ret = "ret",
  Wil = "wil",

  Number = "Number",
  String = "String",

  Identifier = "Identifier",

  Modulus = "%",
  Multiply = "*",
  Plus = "+",
  Minus = "-",
  Divide = "/",

  Increment = "++",
  Decrement = "--",

  Assignment = "=",
  ModulusEquals = "%=",
  MultiplyEquals = "*=",
  PlusEquals = "+=",
  MinusEquals = "-=",
  DivideEquals = "/=",

  LessThan = "<",
  LessThanOrEqual = "<=",
  Equality = "==",
  GreaterThan = ">",
  GreaterThanOrEqual = ">=",

  Dot = ".",
  Comma = ",",
  Colon = ":",
  Semicolon = ";",
  SingleQuote = "'",
  DoubleQuote = '"',

  LeftRoundBracket = "(",
  RightRoundBracket = ")",
  LeftCurlyBracket = "{",
  RightCurlyBracket = "}",
  LeftSquareBracket = "[",
  RightSquareBracket = "]",
}

export interface LexerToken {
  type: LexerTokenType;
  value: string;
}
