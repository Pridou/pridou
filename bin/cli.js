#!/usr/bin/env node

import Lexer from "../lib/index.js";

const lexer = new Lexer();

console.log(lexer.toTokens("const ok = 3;"));
