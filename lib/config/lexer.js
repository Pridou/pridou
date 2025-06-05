import { LexerTokenType } from "../types/lexer.js";
export const SKIPPED_TOKENS = new Set([
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
export const CLASSIC_TOKENS = new Map([
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
export const RESERVED_TOKENS = new Map([
    [LexerTokenType.Fix, LexerTokenType.Fix],
    [LexerTokenType.For, LexerTokenType.For],
    [LexerTokenType.Fun, LexerTokenType.Fun],
    [LexerTokenType.Mut, LexerTokenType.Mut],
    [LexerTokenType.Ret, LexerTokenType.Ret],
    [LexerTokenType.Wil, LexerTokenType.Wil],
]);
