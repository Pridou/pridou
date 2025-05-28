import type Environment from "@/src/environment";

// Lexer

export enum LexerTokenType {
  Alpha = "Alpha",
  Number = "Number",
  And = "And",
  Or = "Or",
  Not = "Not",

  BlockStatement = "BlockStatement",

  Let = "Let",
  Const = "Const",
  Function = "Function",
  While = "While",

  String = "String",

  Equals = "Equals",
  BinaryOperator = "BinaryOperator",
  ComparisonOperator = "ComparisonOperator",

  Comma = "Comma",
  Colon = "Colon",
  Semicolon = "Semicolon",
  Dot = "Dot",

  OpeningParenthesis = "OpeningParenthesis",
  ClosingParenthesis = "ClosingParenthesis",
  OpeningCurlyBracket = "OpeningCurlyBracket",
  ClosingCurlyBracket = "ClosingCurlyBracket",
  OpeningSquareBracket = "OpeningSquareBracket",
  ClosingSquareBracket = "ClosingSquareBracket",

  Import = "Import",
  Export = "Export",
  Module = "Module",
  EOF = "EOF",
}

export interface LexerToken {
  type: LexerTokenType;
  value: string;
}

// AST
// Parser

export enum ASTNodeType {
  Program = "Program",

  FunctionDeclaration = "FunctionDeclaration",
  VariableDeclaration = "VariableDeclaration",

  Alpha = "Alpha",
  Number = "Number",

	String = "String",

	If = "If",
	Switch = "Switch",
          Case = "Case",

	While = "While",

	BlockStatement="BlockStatement",
	Block="Block",



  Array = "Array",
  Index = "Index",

  BinaryExpression = "BinaryExpression",
  AssignmentExpression = "AssignmentExpression",
  UnaryExpression = "UnaryExpression",

  Object = "Object",
  ObjectProperty = "ObjectProperty",
  ObjectAttribute = "Attribute",

  Import = "Import",
  Export = "Export",
  Module = "Module",
}

export interface ASTStatement {
  type: ASTNodeType;
}

export interface ASTExpression extends ASTStatement {}

export interface ASTProgram extends ASTStatement {
  type: ASTNodeType.Program;
  body: ASTStatement[];
}

export interface ASTArray extends ASTStatement {
  type: ASTNodeType.Array;
  body: ASTStatement[];
}

export interface ASTIndex extends ASTStatement {
  type: ASTNodeType.Index;
  array: ASTExpression;
  index: ASTExpression;
}


export interface ASTBlockStatement {
  type: ASTNodeType.BlockStatement;
  body: ASTStatement[];
}


export interface ASTFunctionDeclaration extends ASTStatement {
  type: ASTNodeType.FunctionDeclaration;
}

export interface ASTVariableDeclaration extends ASTStatement {
  type: ASTNodeType.VariableDeclaration;
  alpha: string;
  value?: ASTExpression;
  metadata: {
    isConstant: boolean;
  };
}

export interface ASTAlpha extends ASTStatement {
  type: ASTNodeType.Alpha;
  value: string;
}

export interface ASTNumber extends ASTStatement {
  type: ASTNodeType.Number;
  value: number;
}

export interface ASTBinaryExpression extends ASTStatement {
  type: ASTNodeType.BinaryExpression;
  binaryOperator: string;
  leftExpression: ASTExpression;
  rightExpression: ASTExpression;
}

export interface ASTUnaryExpression extends ASTStatement {
  type: ASTNodeType.UnaryExpression;
  operator: string;
  expression: ASTExpression;
}

export interface ASTAssignmentExpression extends ASTStatement {
  type: ASTNodeType.AssignmentExpression;
  value: ASTExpression;
  assignee: ASTExpression;
}

export interface ASTString extends ASTStatement {
  type: ASTNodeType.String;
  value: string;
}

export interface ASTObject extends ASTStatement {
  type: ASTNodeType.Object;
  properties: { [key: string]: ASTExpression };
}

export interface ASTObjectProperty extends ASTStatement {
  type: ASTNodeType.ObjectProperty;
  key: string;
  value: ASTExpression;
}

export interface ASTObjectAttribute extends ASTStatement {
  type: ASTNodeType.ObjectAttribute;
  object: ASTExpression;
  property: ASTExpression;
}

export interface ASTIfStatement extends ASTStatement {
  type: ASTNodeType.If;
  condition: ASTExpression;
  trueCase: ASTStatement;
  falseCase?: ASTStatement;
}

export interface ASTImport extends ASTStatement {
  type: ASTNodeType.Import;
  path: string;
  imports: string[];
}

export interface ASTExport extends ASTStatement {
  type: ASTNodeType.Export;
  declaration: ASTStatement;
}

export interface ASTModule extends ASTStatement {
  type: ASTNodeType.Module;
  name: string;
  body: ASTStatement[];
}

export interface ASTBlock {
  type: ASTNodeType.Block;
  body: ASTStatement[];
}

export interface ASTCase extends ASTStatement {
  type: ASTNodeType.Case;
  test: ASTExpression; 
  consequent: ASTBlock; 
}

export interface ASTSwitchStatement extends ASTStatement {
  type: ASTNodeType.Switch;
  discriminant: ASTExpression; 
  cases: ASTCase[];
  defaultCase?: ASTBlock; 
}

export interface ASTWhileStatement extends ASTStatement {
  type: ASTNodeType.While;
  condition: ASTExpression;
  body: ASTBlock;
}




// Interpreter

export enum InterpreterValueType {
  Null = "Null",
  Array = "Array",
  Number = "Number",
  Boolean = "Boolean",
  String = "String",
  Object = "Object",
  Comparison = "Comparison",
}

export interface InterpreterValue {
  type: InterpreterValueType;
}

export interface InterpreterNull extends InterpreterValue {
  type: InterpreterValueType.Null;
  value: null;
}

export interface InterpreterNumber extends InterpreterValue {
  type: InterpreterValueType.Number;
  value: number;
}

export interface InterpreterBoolean extends InterpreterValue {
  type: InterpreterValueType.Boolean;
  value: number;
}

export interface InterpreterArray extends InterpreterValue {
  type: InterpreterValueType.Array;
  elements: InterpreterValue[];
}

export interface InterpreterString extends InterpreterValue {
  type: InterpreterValueType.String;
  value: string;
}

export interface InterpreterObject extends InterpreterValue {
  type: InterpreterValueType.Object;
  properties: { [key: string]: InterpreterValue };
  environment: Environment;
}

export interface InterpreterComparison extends InterpreterValue {
  type: InterpreterValueType.Comparison;
  value: number;
}
