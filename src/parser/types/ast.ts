enum NodeType {
  Program = "Program",
  ExpressionStatement = "ExpressionStatement",
  VariableDeclaration = "VariableDeclaration",
  Identifier = "Identifier",
  Assignement = "Assignement",
  NumericLiteral = "NumericLiteral",
  BinaryExpression = "BinaryExpression",
}

interface ASTNode {
  type: NodeType;
  value?: string | number;
  children?: ASTNode[];
}

export { NodeType };
export type { ASTNode };
