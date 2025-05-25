import type { Token } from "../index.js";
import { TokenType } from "../index.js";
import { type ASTNode, NodeType } from "./types/ast.js";

class Parser {
  private tokens: Token[];
  private current = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): ASTNode {
    const program: ASTNode = {
      type: NodeType.Program,
      children: [],
    };

    while (this.current < this.tokens.length) {
      const statement = this.parseStatement();
      program.children?.push(statement);
    }

    return program;
  }

  private parseExpressionStatement(): ASTNode {
    const expression = this.parseExpression();

    return {
      type: NodeType.ExpressionStatement,
      children: [expression],
    };
  }

  private parseStatement(): ASTNode {
    const token = this.tokens[this.current];

    switch (token.type) {
      case TokenType.Let:
      case TokenType.Const:
        return this.parseVariableDeclaration();
      default:
        return this.parseExpressionStatement();
    }
  }

  private parseVariableDeclaration(): ASTNode {
    const kind = this.tokens[this.current++];

    if (this.tokens[this.current].type !== TokenType.Alpha) {
      throw new Error("Expected identifier after let/const");
    }

    const identifier = this.tokens[this.current++];

    if (this.tokens[this.current].type !== TokenType.Equals) {
      throw new Error("Expected = in variable declaration");
    }

    const initializer = this.parseExpression();

    return {
      type: NodeType.VariableDeclaration,
      value: kind.value,
      children: [
        { type: NodeType.Identifier, value: identifier.value },
        initializer,
      ],
    };
  }

  private parseExpression(): ASTNode {
    let left = this.parsePrimary();

    while (
      this.current < this.tokens.length &&
      this.tokens[this.current].type === TokenType.BinaryOperator
    ) {
      const operator = this.tokens[this.current++].value;
      const right = this.parsePrimary();

      left = {
        type: NodeType.BinaryExpression,
        value: operator,
        children: [left, right],
      };
    }

    return left;
  }

  private parsePrimary(): ASTNode {
    const token = this.tokens[this.current++];

    switch (token.type) {
      case TokenType.Number:
        return {
          type: NodeType.NumericLiteral,
          value: Number(token.value),
        };
      case TokenType.Alpha:
        return {
          type: NodeType.Identifier,
          value: token.value,
        };

      case TokenType.Equals:
        return {
          type: NodeType.Assignement,
          value: token.value,
        };

      case TokenType.OpeningParenthesis: {
        const expr = this.parseExpression();
        if (this.tokens[this.current].type !== TokenType.ClosingParenthesis) {
          throw new Error("Expected closing parenthesis");
        }
        this.current++;

        return expr;
      }

      default:
        throw new Error(`Unexpected token: ${token.value}`);
    }
  }
}

export { Parser };
