import { LexerTokenType } from "@/types/lexer";

export const SKIPPED_TOKENS: Set<string> = new Set<string>([
  " ",
  "\0",
  "\b",
  "\f",
  "\n",
  "\r",
  "\t",
  "\v",
  "\\",
]);

export const CLASSIC_TOKENS: Map<string, LexerTokenType> = new Map<
  string,
  LexerTokenType
>([
  [LexerTokenType.Dot, LexerTokenType.Dot],
  [LexerTokenType.Comma, LexerTokenType.Comma],
  [LexerTokenType.Colon, LexerTokenType.Colon],
  [LexerTokenType.Semicolon, LexerTokenType.Semicolon],

  [LexerTokenType.LeftRoundBracket, LexerTokenType.LeftRoundBracket],
  [LexerTokenType.RightRoundBracket, LexerTokenType.RightRoundBracket],
  [LexerTokenType.LeftCurlyBracket, LexerTokenType.LeftCurlyBracket],
  [LexerTokenType.RightCurlyBracket, LexerTokenType.RightCurlyBracket],
  [LexerTokenType.LeftSquareBracket, LexerTokenType.LeftSquareBracket],
  [LexerTokenType.RightSquareBracket, LexerTokenType.RightSquareBracket],
]);

export const RESERVED_TOKENS: Map<string, LexerTokenType> = new Map<
  string,
  LexerTokenType
>([
  [LexerTokenType.Fix, LexerTokenType.Fix],
  [LexerTokenType.For, LexerTokenType.For],
  [LexerTokenType.Fun, LexerTokenType.Fun],
  [LexerTokenType.Mut, LexerTokenType.Mut],
  [LexerTokenType.Ret, LexerTokenType.Ret],
  [LexerTokenType.Wil, LexerTokenType.Wil],
]);
