import { type LexerToken, LexerTokenType } from "../../src/types";

export const T = LexerTokenType;

export const t = (type: LexerTokenType, value: string): LexerToken => ({
  type,
  value,
});

export const tokens = (...entries: [LexerTokenType, string][]): LexerToken[] =>
  entries.map(([type, value]) => t(type, value));
