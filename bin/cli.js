#!/usr/bin/env node

import fs, { watch } from "node:fs";
import { createRequire } from "node:module";
import { createInterface } from "node:readline";
import chalk from "chalk";
import { Command, Option } from "commander";
import Interpreter, { Environment } from "../lib/index.js";

const require = createRequire(import.meta.url);

const { name, description, version } = require("../package.json");
const program = new Command();
const interpreter = new Interpreter();

const runWatch = (filePath, options) => {
  const now = new Date().toLocaleTimeString();
  let isError = false;

  console.clear();
  console.log(`[${now}] Restarting: ${filePath}`);

  try {
    const data = fs.readFileSync(filePath, options.encoding);
    //TODO: temporary
    console.log(interpreter.evaluateSourceCode(data));
  } catch (err) {
    isError = true;
    console.log(chalk.red(`[ERROR] ${err.message}`));
  }

  console.log(
    isError
      ? chalk.red(`[${now}] Failed running '${filePath}'`)
      : chalk.green(`[${now}] Finished running '${filePath}'`),
  );
};

const run = (filePath) => {
  const options = program.opts();

  const exists = fs.existsSync(filePath);
  if (!exists) program.error("error: the specified path does not exist");

  const stats = fs.statSync(filePath);
  if (!stats.isFile()) program.error("error: the specified path is not a file");

  if (options.watch) {
    runWatch(filePath, options);
    watch(filePath, { persistent: true }, () => runWatch(filePath, options));

    return;
  }

  try {
    const data = fs.readFileSync(filePath, options.encoding);
    //TODO: temporary
    console.log(interpreter.evaluateSourceCode(data));
  } catch (err) {
    console.log(chalk.red(`[ERROR] ${err.message}`));
  }
};

const repl = (filePath) => {
  if (filePath) {
    run(filePath);
    return;
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const environment = new Environment();

  console.log(`Welcome to ${name} v${version}.`);
  rl.prompt();

  rl.on("line", (line) => {
    try {
      //TODO: temporary
      console.log(interpreter.evaluateSourceCode(line, environment));
    } catch (err) {
      console.log(chalk.red(`[ERROR] ${err.message}`));
    }

    rl.prompt();
  });
};

program
  .name(name)
  .description(description)
  .version(version)
  .argument("[file]", "file to execute")
  .addOption(new Option("-w, --watch", "watch mode").default(false))
  .addOption(
    new Option("-e, --encoding <encoding>", "file encoding").default("utf8"),
  )
  .action(repl);

program
  .command("run")
  .description("Run a pridou file.")
  .argument("<file>", "file to execute")
  .action(run);

program.helpCommand(true);

program.parse();
