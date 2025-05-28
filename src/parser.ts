import { InvalidTokenError } from "@/src/errs";
import { tokenize } from "@/src/lexer";
import {
  type ASTAlpha,
  type ASTArray,
  type ASTAssignmentExpression,
  type ASTBinaryExpression,
  type ASTExpression,
  type ASTIndex,
  ASTNodeType,
  type ASTNumber,
  type ASTObject,
  type ASTObjectAttribute,
  type ASTUnaryExpression,
  type ASTProgram,
  type ASTStatement,
  type ASTString,
  type ASTVariableDeclaration,
  type ASTModule,
  type ASTImport,
  type ASTBlockStatement,
  type ASTBlock,
  type LexerToken,
  LexerTokenType,
type ASTIfStatement,
type ASTSwitchStatement,
type ASTCase
} from "@/types";

const additiveOperators: Set<string> = new Set<string>(["+", "-"]);
const multiplicativeOperators: Set<string> = new Set<string>(["%", "*", "/"]);
const comparisonOperators: Set<string> = new Set<string>([
  ">",
  "<",
  "==",
  "===",
  "<=",
  ">=",
  "!=",
  "!==",
  "and",
  "or",
]);

export default class Parser {
  #tokens: LexerToken[] = [];

  private peek(offset = 0): LexerToken {
    return this.#tokens[offset];
  }

  private parseVariableDeclaration(): ASTStatement {
    const isConstant: boolean =
      this.#tokens.shift()?.type === LexerTokenType.Const;

    const alpha: string | undefined = this.#tokens.shift()?.value;

    if (!alpha) {
      throw new InvalidTokenError("Expected identifier after let/const");
    }

    if (this.peek().type === LexerTokenType.Semicolon) {
      this.#tokens.shift();

      if (isConstant) {
        throw new InvalidTokenError("Missing initializer in const declaration");
      }

      return <ASTVariableDeclaration>{
        type: ASTNodeType.VariableDeclaration,
        alpha,
        metadata: {
          isConstant: false,
        },
      };
    }

    if (this.#tokens.shift()?.type !== LexerTokenType.Equals) {
      throw new InvalidTokenError("Expected '=' in variable declaration");
    }

    const variableDeclaration: ASTVariableDeclaration = {
      type: ASTNodeType.VariableDeclaration,
      alpha,
      value: this.parseExpression(),
      metadata: {
        isConstant,
      },
    };

    if (this.#tokens.shift()?.type !== LexerTokenType.Semicolon) {
      throw new InvalidTokenError("Expected ';' after variable declaration");
    }

    return variableDeclaration;
  }

  private parseAssignmentExpression(): ASTExpression {
    const leftExpression: ASTExpression = this.parseComparisonExpression();

    if (this.peek().type === LexerTokenType.Equals) {
      this.#tokens.shift();

      const assignment: ASTAssignmentExpression = {
        type: ASTNodeType.AssignmentExpression,
        value: this.parsePrimitiveExpression(),
        assignee: leftExpression,
      };

      if (this.#tokens.shift()?.type !== LexerTokenType.Semicolon) {
        throw new InvalidTokenError("Expected ';' after assignment expression");
      }

      return assignment;
    }

    return leftExpression;
  }

  private parseComparisonExpression(): ASTExpression {
    let leftExpression: ASTExpression = this.parseAdditiveExpression();
    while (comparisonOperators.has(this.peek()?.value)) {
      const binaryOperator: string | undefined = this.#tokens.shift()?.value;
      if (!binaryOperator) {
        throw new InvalidTokenError("Expected comparison operator");
      }

      const rightExpression: ASTExpression = this.parsePrimitiveExpression();

      leftExpression = <ASTBinaryExpression>{
        type: ASTNodeType.BinaryExpression,
        binaryOperator,
        leftExpression,
        rightExpression,
      };
    }

    return leftExpression;
  }

  private parsePrimitiveExpression(): ASTExpression {
    let expression: ASTExpression;

    switch (this.peek().type) {
      case LexerTokenType.BinaryOperator:
        if (
          this.peek().value === "-" &&
          (this.#tokens[1]?.type === LexerTokenType.Number ||
            this.#tokens[1]?.type === LexerTokenType.OpeningParenthesis ||
            this.#tokens[1]?.type === LexerTokenType.Alpha)
        ) {
          this.#tokens.shift();
          const expr = this.parsePrimitiveExpression();
          return <ASTBinaryExpression>{
            type: ASTNodeType.BinaryExpression,
            binaryOperator: "-",
            leftExpression: <ASTNumber>{ type: ASTNodeType.Number, value: 0 },
            rightExpression: expr,
          };
        }
        throw new InvalidTokenError(
          `Unexpected binary operator: ${this.peek().value}`
        );

      case LexerTokenType.Number:
        const numberToken = this.#tokens.shift();
        expression = <ASTNumber>{
          type: ASTNodeType.Number,
          value: Number(numberToken?.value),
        };
        break;

      case LexerTokenType.Alpha:
        const alphaToken = this.#tokens.shift();
        expression = <ASTAlpha>{
          type: ASTNodeType.Alpha,
          value: alphaToken?.value,
        };
        break;

      case LexerTokenType.String:
        const stringToken = this.#tokens.shift();
        expression = <ASTString>{
          type: ASTNodeType.String,
          value: stringToken?.value,
        };
        break;

      case LexerTokenType.Not:
        this.#tokens.shift();
        return <ASTUnaryExpression>{
          type: ASTNodeType.UnaryExpression,
          operator: "!",
          expression: this.parsePrimitiveExpression(),
        };

      case LexerTokenType.OpeningParenthesis: {
        this.#tokens.shift();
        expression = this.parseAdditiveExpression();

        if (this.#tokens.shift()?.type !== LexerTokenType.ClosingParenthesis) {
          throw new InvalidTokenError("Expected ')' after expression");
        }
        break;
      }

      case LexerTokenType.OpeningSquareBracket: {
        this.#tokens.shift();
        const body: ASTExpression[] = [];

        while (this.peek().type !== LexerTokenType.ClosingSquareBracket) {
          body.push(this.parseExpression());

          if (this.peek().type === LexerTokenType.Comma) {
            this.#tokens.shift();
          } else if (this.peek().type !== LexerTokenType.ClosingSquareBracket) {
            throw new InvalidTokenError(
              "Expected ',' or ']' in array expression"
            );
          }
        }

        if (
          this.#tokens.shift()?.type !== LexerTokenType.ClosingSquareBracket
        ) {
          throw new InvalidTokenError("Expected ']' after array elements");
        }

        expression = <ASTArray>{ type: ASTNodeType.Array, body };
        break;
      }

      case LexerTokenType.OpeningCurlyBracket:
        expression = this.parseObjectExpression();
        break;

      default:
        throw new InvalidTokenError(
          `Unexpected token type: ${this.peek().type}`
        );
    }

    while (this.peek().type === LexerTokenType.Dot) {
      this.#tokens.shift();

      const property = this.#tokens.shift();
      if (
        property?.type !== LexerTokenType.Alpha &&
        property?.type !== LexerTokenType.String
      ) {
        throw new InvalidTokenError("Expected identifier after dot");
      }

      expression = <ASTObjectAttribute>{
        type: ASTNodeType.ObjectAttribute,
        object: expression,
        property: <ASTAlpha>{
          type: ASTNodeType.Alpha,
          value: property.value,
        },
      };
    }

    while (this.peek().type === LexerTokenType.OpeningSquareBracket) {
      this.#tokens.shift();
      const index = this.parseExpression();

      if (this.peek().type !== LexerTokenType.ClosingSquareBracket) {
        throw new InvalidTokenError("Expected ']' after array index");
      }
      this.#tokens.shift();

      expression = <ASTIndex>{
        type: ASTNodeType.Index,
        array: expression,
        index,
      };
    }

    return expression;
  }

  private parseAdditiveExpression(): ASTExpression {
    let leftExpression: ASTExpression = this.parseMultiplicativeExpression();

    while (additiveOperators.has(this.peek()?.value)) {
      const binaryOperator: string | undefined = this.#tokens.shift()?.value;

      if (!binaryOperator) {
        throw new InvalidTokenError("Expected binary operator");
      }

      const rightExpression: ASTExpression =
        this.parseMultiplicativeExpression();

      leftExpression = <ASTBinaryExpression>{
        type: ASTNodeType.BinaryExpression,
        binaryOperator,
        leftExpression,
        rightExpression,
      };
    }

    return leftExpression;
  }

  private parseMultiplicativeExpression(): ASTExpression {
    let leftExpression: ASTExpression = this.parsePrimitiveExpression();

    while (multiplicativeOperators.has(this.peek()?.value)) {
      const binaryOperator: string | undefined = this.#tokens.shift()?.value;
      if (!binaryOperator) {
        throw new InvalidTokenError("Expected binary operator");
      }

      const rightExpression: ASTExpression = this.parsePrimitiveExpression();

      leftExpression = <ASTBinaryExpression>{
        type: ASTNodeType.BinaryExpression,
        binaryOperator,
        leftExpression,
        rightExpression,
      };
    }

    return leftExpression;
  }

  private parseIfStatement(): ASTIfStatement {
  this.#tokens.shift(); // consume "if"

  if (this.#tokens.shift()?.type !== LexerTokenType.OpeningParenthesis) {
    throw new InvalidTokenError("Expected '(' after 'if'");
  }

  const condition = this.parseExpression();

  if (this.#tokens.shift()?.type !== LexerTokenType.ClosingParenthesis) {
    throw new InvalidTokenError("Expected ')' after condition");
  }

  const trueCase = this.parseBlockStatement();

  let falseCase: ASTStatement | undefined = undefined;
  if (this.peek()?.type === LexerTokenType.Alpha && this.peek().value === "else") {
    this.#tokens.shift(); // consume "else"
    falseCase = this.parseBlockStatement(); 
  }

  return {
    type: ASTNodeType.If,
    condition,
    trueCase,
    falseCase,
  };
}

  private parseBlockStatement(): ASTBlock {
    if (this.#tokens.shift()?.type !== LexerTokenType.OpeningCurlyBracket) {
      throw new InvalidTokenError("Expected '{' at the start of block");
    }

    const body: ASTStatement[] = [];

    while (this.peek().type !== LexerTokenType.ClosingCurlyBracket) {
      body.push(this.parseExpression());
    }

    if (this.#tokens.shift()?.type !== LexerTokenType.ClosingCurlyBracket) {
      throw new InvalidTokenError("Expected '}' at the end of block");
    }
    return {
  type: ASTNodeType.Block,
  body,
};

    
  }

  

  private parseModuleDeclaration(): ASTModule {
    this.#tokens.shift();

    const name = this.#tokens.shift();
    if (!name || name.type !== LexerTokenType.Alpha) {
      throw new InvalidTokenError("Expected module name");
    }

    if (this.#tokens.shift()?.type !== LexerTokenType.OpeningCurlyBracket) {
      throw new InvalidTokenError("Expected '{' after module name");
    }

    const body: ASTStatement[] = [];
    while (this.peek().type !== LexerTokenType.ClosingCurlyBracket) {
      body.push(this.parseExpression());
    }

    if (this.#tokens.shift()?.type !== LexerTokenType.ClosingCurlyBracket) {
      throw new InvalidTokenError("Expected '}' after module body");
    }

    return {
      type: ASTNodeType.Module,
      name: name.value,
      body,
    };
  }

  private parseImportDeclaration(): ASTImport {
    this.#tokens.shift();

    if (this.#tokens.shift()?.type !== LexerTokenType.OpeningCurlyBracket) {
      throw new InvalidTokenError("Expected '{' after import");
    }

    const imports: string[] = [];
    while (this.peek().type !== LexerTokenType.ClosingCurlyBracket) {
      const name = this.#tokens.shift();
      if (!name || name.type !== LexerTokenType.Alpha) {
        throw new InvalidTokenError("Expected identifier in import statement");
      }
      imports.push(name.value);

      if (this.peek().type === LexerTokenType.Comma) {
        this.#tokens.shift();
      }
    }

    if (this.#tokens.shift()?.type !== LexerTokenType.ClosingCurlyBracket) {
      throw new InvalidTokenError("Expected '}' after import list");
    }

    if (
      this.#tokens.shift()?.type !== LexerTokenType.Alpha ||
      this.peek(-1).value !== "from"
    ) {
      throw new InvalidTokenError("Expected 'from' after import list");
    }

    const path = this.#tokens.shift();
    if (!path || path.type !== LexerTokenType.String) {
      throw new InvalidTokenError("Expected module path");
    }

    if (this.#tokens.shift()?.type !== LexerTokenType.Semicolon) {
      throw new InvalidTokenError("Expected ';' after import statement");
    }

    return {
      type: ASTNodeType.Import,
      path: path.value,
      imports,
    };
  }

  private parseExpression(): ASTExpression {
  const token = this.peek();
  

  if (token.type === LexerTokenType.Alpha && token.value === "if") {
    return this.parseIfStatement();
  }
  if (token.type === LexerTokenType.Alpha && token.value === "switch") {
  return this.parseSwitchStatement();
}


    switch (token.type) {
      case LexerTokenType.Let:
      case LexerTokenType.Const:
        return this.parseVariableDeclaration();
      case LexerTokenType.And:
      case LexerTokenType.Or:
        return this.parseComparisonExpression();
      case LexerTokenType.While:
        //
      default:
        return this.parseAssignmentExpression();
    }
  }

  private parseObjectExpression(): ASTObject {
    this.#tokens.shift();

    const properties: { [key: string]: ASTExpression } = {};

    while (this.peek().type !== LexerTokenType.ClosingCurlyBracket) {
      const key = this.#tokens.shift();
      // Accepter les clefs de type Alpha ou String
      if (
        key?.type !== LexerTokenType.Alpha &&
        key?.type !== LexerTokenType.String
      ) {
        throw new InvalidTokenError(
          "Expected identifier or string as object key"
        );
      }

      if (this.#tokens.shift()?.type !== LexerTokenType.Colon) {
        throw new InvalidTokenError("Expected ':' after object key");
      }

      properties[key.value] = this.parseExpression();

      if (this.peek().type === LexerTokenType.Comma) {
        this.#tokens.shift();
      } else if (this.peek().type !== LexerTokenType.ClosingCurlyBracket) {
        throw new InvalidTokenError("Expected ',' or '}' in object");
      }
    }

    if (this.#tokens.shift()?.type !== LexerTokenType.ClosingCurlyBracket) {
      throw new InvalidTokenError("Expected '}' after object properties");
    }

    return <ASTObject>{ type: ASTNodeType.Object, properties };
  }

  public toAST(sourceCode: string): ASTProgram {
    this.#tokens = tokenize(sourceCode);

    const program: ASTProgram = {
      type: ASTNodeType.Program,
      body: [],
    };

    while (this.peek().type !== LexerTokenType.EOF) {
      program.body.push(this.parseExpression());
    }

    return program;
  }

  



private parseSwitchStatement(): ASTSwitchStatement {
  this.#tokens.shift(); // consume 'switch'

  if (this.#tokens.shift()?.type !== LexerTokenType.OpeningParenthesis) {
    throw new InvalidTokenError("Expected '(' after 'switch'");
  }

  const discriminant = this.parseExpression();

  if (this.#tokens.shift()?.type !== LexerTokenType.ClosingParenthesis) {
    throw new InvalidTokenError("Expected ')' after switch expression");
  }

  if (this.#tokens.shift()?.type !== LexerTokenType.OpeningCurlyBracket) {
    throw new InvalidTokenError("Expected '{' to start switch block");
  }

  const cases: ASTCase[] = [];
  let defaultCase: ASTBlock | undefined = undefined;

  while (this.peek().type !== LexerTokenType.ClosingCurlyBracket) {
    const token = this.peek();

    if (token.type === LexerTokenType.Alpha && token.value === "case") {
      this.#tokens.shift(); // consume 'case'
      const test = this.parseExpression();

      if (this.#tokens.shift()?.type !== LexerTokenType.Colon) {
        throw new InvalidTokenError("Expected ':' after case test");
      }

      const statements: ASTStatement[] = [];

      while (
  !(this.peek().type === LexerTokenType.Alpha &&
    (this.peek().value === "case" || this.peek().value === "default")) &&
  this.peek().type !== LexerTokenType.ClosingCurlyBracket
)
 {
        if (this.peek().type === LexerTokenType.Alpha && this.peek().value === "break") {
          this.#tokens.shift(); // consume break
          if (this.#tokens.shift()?.type !== LexerTokenType.Semicolon) {
            throw new InvalidTokenError("Expected ';' after 'break'");
          }
          break;
        }

        statements.push(this.parseExpression());
      }

      cases.push({
        type: ASTNodeType.Case,
        test,
        consequent: {
          type: ASTNodeType.Block,
          body: statements
        }
      });
    } else if (token.type === LexerTokenType.Alpha && token.value === "default") {
      this.#tokens.shift(); // consume 'default'

      if (this.#tokens.shift()?.type !== LexerTokenType.Colon) {
        throw new InvalidTokenError("Expected ':' after default");
      }

      const statements: ASTStatement[] = [];
      while (
  !(this.peek().type === LexerTokenType.Alpha &&
    (this.peek().value === "case")) &&
  this.peek().type !== LexerTokenType.ClosingCurlyBracket
)
 {
        if (this.peek().type === LexerTokenType.Alpha && this.peek().value === "break") {
          this.#tokens.shift(); // consume break
          if (this.#tokens.shift()?.type !== LexerTokenType.Semicolon) {
            throw new InvalidTokenError("Expected ';' after 'break'");
          }
          break;
        }

        statements.push(this.parseExpression());
      }

      defaultCase = {
        type: ASTNodeType.Block,
        body: statements
      };
    } else {
      throw new InvalidTokenError(`Unexpected token '${token.value}' in switch`);
    }
  }

  this.#tokens.shift(); // consume '}'

  return {
    type: ASTNodeType.Switch,
    discriminant,
    cases,
    defaultCase,
  };
}




}
