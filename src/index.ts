enum TokenType {
  Alpha = 0,
  Number = 1,

  Equals = 2,
  BinaryOperator = 3,

  OpeningParenthesis = 4,
  ClosingParenthesis = 5,

  Let = 6,
  Const = 7,
}

interface Token {
  type: TokenType;
  value: string;
}

function toToken(type: TokenType, value: string): Token {
  return { type, value };
}

function isAlpha(value: string): boolean {
  return /^[A-Z]$/i.test(value);
}

function isNumber(value: string): boolean {
  return /^[0-9]$/.test(value);
}

const canBeSkippedValues: string[] = [" ", "\n", "\t"];

function shouldBeSkipped(value: string): boolean {
  return canBeSkippedValues.includes(value);
}

const reservedKeywordsMap: { [key: string]: TokenType } = {
  let: TokenType.Let,
  const: TokenType.Const,
};

function tokenize(sourceCode: string): Token[] {
  const tokens: Token[] = [];
  const source: string[] = sourceCode.split("");

  while (source.length > 0) {
    switch (source[0]) {
      case "=":
        // biome-ignore lint/style/noNonNullAssertion: temporary
        tokens.push(toToken(TokenType.Equals, source.shift()!));
        break;
      case "*":
      case "+":
      case "-":
      case "/":
        // biome-ignore lint/style/noNonNullAssertion: temporary
        tokens.push(toToken(TokenType.BinaryOperator, source.shift()!));
        break;
      case "(":
        // biome-ignore lint/style/noNonNullAssertion: temporary
        tokens.push(toToken(TokenType.OpeningParenthesis, source.shift()!));
        break;
      case ")":
        // biome-ignore lint/style/noNonNullAssertion: temporary
        tokens.push(toToken(TokenType.ClosingParenthesis, source.shift()!));
        break;
      default:
        if (isAlpha(source[0])) {
          let a = "";

          while (source.length > 0 && isAlpha(source[0])) {
            a += source.shift();
          }

          tokens.push(toToken(reservedKeywordsMap[a] ?? TokenType.Alpha, a));

          break;
        }

        if (isNumber(source[0])) {
          let n = "";

          while (source.length > 0 && isNumber(source[0])) {
            n += source.shift();
          }

          tokens.push(toToken(TokenType.Number, n));

          break;
        }

        if (shouldBeSkipped(source[0])) {
          source.shift();

          break;
        }

        console.error(`Found something weird: ${source[0]}`);

      // TODO: Exit process
    }
  }

  return tokens;
}

export { tokenize };
