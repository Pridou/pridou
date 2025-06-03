import { LexerTokenType } from "@/types";

export interface Config {
  [key: string]: LexerTokenType;
}

const defaultConfig: Readonly<Config> = {
  let: LexerTokenType.Let,
};

export function defineConfig(config: Config = defaultConfig): Readonly<Config> {
  return config;
}
