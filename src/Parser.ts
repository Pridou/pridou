import { LexerToken, LexerTokenType } from "@/types/lexer";
import {
	ASTAssignmentExpression,
	ASTBinaryExpression,
	ASTComparisonExpression,
	ASTFunctionCallExpression,
	ASTFunctionDeclarationStatement,
	ASTIdentifier,
	ASTNode,
	ASTNodeType,
	ASTNumber,
	ASTProgram,
	ASTReturnStatement,
	ASTString,
	ASTVariableDeclarationStatement,
	ASTWhileStatement,
} from "@/types/parser";

import Lexer from "@/src/Lexer";

import {
	ADDITIVE_OPERATORS,
	COMPARISON_OPERATORS,
	MULTIPLICATIVE_OPERATORS,
} from "@/src/else/parser";

import InvalidTokenError from "@/src/errs/InvalidTokenError";

export default class Parser {
	#tokens: LexerToken[] = [];

	private peek(offset: number = 0): LexerToken {
		return this.#tokens[offset];
	}

	private shift(): LexerToken {
		const token: LexerToken | undefined = this.#tokens.shift();

		if (!token) {
			throw new InvalidTokenError("Unexpected end of file.");
		}

		return token;
	}

	private expect(value: string): void {
		const token: LexerToken = this.shift();

		if (token.value !== value) {
			throw new InvalidTokenError(`Invalid token "${token.value}" was found.`);
		}
	}

	private parseFunctionCallExpression(
		identifier: string,
	): ASTFunctionCallExpression {
		const functionCallExpression: ASTFunctionCallExpression = {
			type: ASTNodeType.FunctionCallExpression,
			identifier,
			arguments: [],
		};

		this.expect(LexerTokenType.LeftRoundBracket);

		while (this.peek().type !== LexerTokenType.RightRoundBracket) {
			functionCallExpression.arguments.push(this.parseAssignmentExpression());

			if (this.peek().type === LexerTokenType.Comma) {
				this.expect(LexerTokenType.Comma);
			}
		}

		this.expect(LexerTokenType.RightRoundBracket);

		return functionCallExpression;
	}

	private parseVariableDeclarationStatement(): ASTVariableDeclarationStatement {
		const isConstant: boolean = this.shift().type === LexerTokenType.Fix;

		const identifier: string = this.shift().value;

		if (this.peek().type === LexerTokenType.Semicolon) {
			if (isConstant) {
				throw new InvalidTokenError(
					"Cannot declare a constant without an initializer.",
				);
			}

			this.expect(LexerTokenType.Semicolon);

			return {
				type: ASTNodeType.VariableDeclarationStatement,
				identifier,
				metadata: {
					isConstant,
				},
			};
		}

		this.expect(LexerTokenType.Assignment);

		const variableDeclarationStatement: ASTVariableDeclarationStatement = {
			type: ASTNodeType.VariableDeclarationStatement,
			value: this.parseAssignmentExpression(),
			identifier,
			metadata: {
				isConstant,
			},
		};

		this.expect(LexerTokenType.Semicolon);

		return variableDeclarationStatement;
	}

	private parseBlockBody(): ASTNode[] {
		this.expect(LexerTokenType.LeftCurlyBracket);

		const body: ASTNode[] = [];

		while (this.peek().type !== LexerTokenType.RightCurlyBracket) {
			body.push(this.parseStatement());
		}

		this.expect(LexerTokenType.RightCurlyBracket);

		return body;
	}

	private parseFunctionDeclarationStatement(): ASTFunctionDeclarationStatement {
		this.expect(LexerTokenType.Fun);

		const identifier: string = this.shift().value;

		this.expect(LexerTokenType.LeftRoundBracket);

		const functionDeclarationStatement: ASTFunctionDeclarationStatement = {
			type: ASTNodeType.FunctionDeclarationStatement,
			identifier,
			parameters: [],
		};

		while (this.peek().type !== LexerTokenType.RightRoundBracket) {
			if (this.peek().type !== LexerTokenType.Identifier) {
				throw new InvalidTokenError(`Expected parameter's identifier.`);
			}

			functionDeclarationStatement.parameters.push(this.shift().value);

			if (this.peek().type === LexerTokenType.Comma) {
				this.expect(LexerTokenType.Comma);
			}
		}

		this.expect(LexerTokenType.RightRoundBracket);

		return {
			...functionDeclarationStatement,
			body: this.parseBlockBody(),
		};
	}

	private parseReturnStatement(): ASTReturnStatement {
		this.expect(LexerTokenType.Ret);

		// TODO: Same for typing
		const expression: ASTNode = this.parseAssignmentExpression();

		this.expect(LexerTokenType.Semicolon);

		return <ASTReturnStatement>{
			type: ASTNodeType.ReturnStatement,
			value: expression,
		};
	}

	private parseComparisonExpression(): ASTComparisonExpression | ASTNode {
		let leftExpression: ASTNode = this.parseAdditiveExpression();

		while (COMPARISON_OPERATORS.has(this.peek().type)) {
			const comparisonOperator: string = this.shift().value;
			const rightExpression: ASTNode = this.parseAdditiveExpression();

			leftExpression = <ASTComparisonExpression>{
				type: ASTNodeType.ComparisonExpression,
				comparisonOperator,
				leftExpression,
				rightExpression,
			};
		}

		return leftExpression;
	}

	private parseWhileStatement(): ASTWhileStatement {
		this.expect(LexerTokenType.Wil);

		this.expect(LexerTokenType.LeftRoundBracket);

		const comparison: ASTComparisonExpression | ASTNode =
			this.parseComparisonExpression();

		this.expect(LexerTokenType.RightRoundBracket);

		return <ASTWhileStatement>{
			type: ASTNodeType.WhileStatement,
			body: this.parseBlockBody(),
			comparison,
		};
	}

	private parsePrimitiveExpression(): ASTNode {
		switch (this.peek().type) {
			case LexerTokenType.Number:
				return <ASTNumber>{
					type: ASTNodeType.Number,
					value: +this.shift().value,
				};
			case LexerTokenType.String:
				return <ASTString>{
					type: ASTNodeType.String,
					value: this.shift().value,
				};
			case LexerTokenType.Identifier:
				const identifier: string = this.shift().value;

				if (this.peek().type === LexerTokenType.LeftRoundBracket) {
					return this.parseFunctionCallExpression(identifier);
				}

				return <ASTIdentifier>{
					type: ASTNodeType.Identifier,
					value: identifier,
				};
			default:
				throw new InvalidTokenError(`Invalid token ${this.peek()} was found.`);
		}
	}

	private parseMultiplicativeExpression(): ASTBinaryExpression {
		let leftExpression: ASTBinaryExpression = <ASTBinaryExpression>(
			this.parsePrimitiveExpression()
		);

		while (MULTIPLICATIVE_OPERATORS.has(this.peek().type)) {
			const binaryOperator: string = this.shift().value;
			const rightExpression: ASTNode = this.parsePrimitiveExpression();

			leftExpression = {
				type: ASTNodeType.BinaryExpression,
				binaryOperator,
				leftExpression,
				rightExpression,
			};
		}

		return leftExpression;
	}

	private parseAdditiveExpression(): ASTBinaryExpression {
		let leftExpression: ASTBinaryExpression =
			this.parseMultiplicativeExpression();

		while (ADDITIVE_OPERATORS.has(this.peek().type)) {
			const binaryOperator: string = this.shift().value;
			const rightExpression: ASTNode = this.parseMultiplicativeExpression();

			leftExpression = {
				type: ASTNodeType.BinaryExpression,
				leftExpression,
				rightExpression,
				binaryOperator,
			};
		}

		return leftExpression;
	}

	private parseAssignmentExpression(): ASTAssignmentExpression | ASTNode {
		const leftExpression: ASTComparisonExpression | ASTNode =
			this.parseComparisonExpression();

		if (this.peek().type === LexerTokenType.Assignment) {
			this.expect(LexerTokenType.Assignment);

			const expression: ASTAssignmentExpression = {
				type: ASTNodeType.AssignmentExpression,
				value: this.parseComparisonExpression(),
				leftExpression,
			};

			this.expect(";");

			return expression;
		}

		// TODO: Support complex assignment operators
		/* if (ASSIGNMENT_OPERATORS.has(this.peek().type)) {
			this.#tokens = [
				{
					type: LexerTokenType.Identifier,
					value: (<ASTIdentifier>leftExpression).value,
				},
				{
					type: LexerTokenType.BinaryOperator,
					value: this.shift().value.split("")[0],
				},
				...this.#tokens,
			];

			const assignmentExpression: ASTAssignmentExpression = {
				type: ASTNodeType.AssignmentExpression,
				value: this.parseComparisonExpression(),
				leftExpression,
			};

			this.expect(";");

			return assignmentExpression;
		} */

		return leftExpression;
	}

	private parseStatement(): ASTNode {
		// Parse function calls
		if (this.peek().type === LexerTokenType.Identifier) {
			if (this.peek(1).type === LexerTokenType.LeftRoundBracket) {
				const expression: ASTFunctionCallExpression =
					this.parseFunctionCallExpression(this.shift().value);

				this.expect(LexerTokenType.Semicolon);

				return expression;
			}
		}

		switch (this.peek().type) {
			case LexerTokenType.Fix:
			case LexerTokenType.Mut:
				return this.parseVariableDeclarationStatement();
			case LexerTokenType.Fun:
				return this.parseFunctionDeclarationStatement();
			case LexerTokenType.Ret:
				return this.parseReturnStatement();
			case LexerTokenType.Wil:
				return this.parseWhileStatement();
			default:
				return this.parseAssignmentExpression();
		}
	}

	public toAST(tokens: LexerToken[]): ASTProgram {
		this.#tokens = tokens;

		const program: ASTProgram = {
			type: ASTNodeType.Program,
			body: new Set<ASTNode>(),
		};

		while (this.peek()) {
			program.body.add(this.parseStatement());
		}

		return program;
	}

	public sourceCodeToAST(sourceCode: string): ASTProgram {
		return this.toAST(new Lexer().toTokens(sourceCode));
	}
}
