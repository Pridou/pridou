export enum LexerTokenType {
  Equals = "Equals",
  BinaryOperator = "BinaryOperator",
  ComparisonOperator = "ComparisonOperator",

  Dot = "Dot",
  Comma = "Comma",
  Colon = "Colon",
  Semicolon = "SemiColon",
  // SingleQuote = "SingleQuote",
  // DoubleQuote = 'SingleQuote',

  OpeningParenthesis = "OpeningParenthesis",
  ClosingParenthesis = "ClosingParenthesis",
  OpeningCurlyBracket = "OpeningCurlyBracket",
  ClosingCurlyBracket = "ClosingCurlyBracket",
  OpeningSquareBracket = "OpeningSquareBracket",
  ClosingSquareBracket = "ClosingSquareBracket",

  Number = "Number",
  Identifier = "Identifier",

  String = "String",

  If = "If",
  For = "For",
  Let = "Let",
  Else = "Else",
  Const = "Const",
  While = "While",
  Return = "Return",
  Function = "Function",

  EndOfFile = "EndOfFile",
}

export interface LexerToken {
  type: LexerTokenType;
  value: string;
}
