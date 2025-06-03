import {LexerToken, LexerTokenType} from "@/types/lexer";
import {
	ASTAssignmentExpression,
	ASTFunctionCallExpression,
	ASTFunctionDeclarationStatement,
	ASTIdentifier,
	ASTNode,
	ASTNodeType,
	ASTNumber,
	ASTProgram,
	ASTReturnStatement,
	ASTString,
	ASTVariableDeclarationStatement
} from "@/types/parser";

import Lexer from "@/src/Lexer";

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

	private parseFunctionCallExpression(identifier: string): ASTFunctionCallExpression {
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

		this.expect(LexerTokenType.LeftRoundBracket);

		return functionCallExpression;
	}

	private parseVariableDeclarationStatement(): ASTVariableDeclarationStatement {
		const isConstant: boolean = this.shift().type === LexerTokenType.Fix;

		const identifier: string = this.shift().value;

		if (this.peek().type === LexerTokenType.Semicolon) {
			if (isConstant) {
				throw new InvalidTokenError("Cannot declare a constant without an initializer.");
			}

			this.expect(LexerTokenType.Semicolon);

			return {
				type: ASTNodeType.VariableDeclarationStatement,
				identifier,
				metadata: {
					isConstant,
				}
			};
		}

		this.expect(LexerTokenType.Assignment);

		const variableDeclarationStatement: ASTVariableDeclarationStatement = {
			type: ASTNodeType.VariableDeclarationStatement,
			value: this.parseStatement(),
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

		const blockBody: ASTNode[] = [];

		while (this.peek().type !== LexerTokenType.RightCurlyBracket) {
			blockBody.push(this.parseStatement());
		}

		this.expect(LexerTokenType.RightCurlyBracket);

		return blockBody;
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
		}
	}

	private parseReturnStatement(): ASTReturnStatement {
		this.expect(LexerTokenType.Ret);

		// TODO: Same for typing
		const assignmentExpression: ASTNode = this.parseAssignmentExpression()

		this.expect(LexerTokenType.Semicolon);

		return <ASTReturnStatement>{
			type: ASTNodeType.ReturnExpression,
			value: assignmentExpression,
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
				return <ASTIdentifier>{
					type: ASTNodeType.Identifier,
					value: this.shift().value,
				};
			default:
				throw new InvalidTokenError(`Invalid token ${this.peek()} was found.`);
		}
	}

	private parseMultiplicativeExpression() {
	}

	private parseAdditiveExpression() {}

	private parseComparisonExpression() {
	}

	private parseAssignmentExpression(): ASTAssignmentExpression | ASTNode {
		const leftExpression: ASTNode = this.parseComparisonExpression();

		if (this.peek().type === LexerTokenType.Assignment) {
			this.expect(LexerTokenType.Assignment);

			return {
				type: ASTNodeType.AssignmentExpression,
				value: this.parseAssignmentExpression(),
				leftExpression,
			};
		}

		return leftExpression;
	}

	private parseStatement(): ASTNode {
		// Parse function calls
		if (this.peek().type === LexerTokenType.Identifier) {
			if (this.peek(1).type === LexerTokenType.LeftRoundBracket) {
				const functionCall: ASTFunctionCallExpression = this.parseFunctionCallExpression(this.shift().value);

				this.expect(LexerTokenType.Semicolon);

				return functionCall;
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
