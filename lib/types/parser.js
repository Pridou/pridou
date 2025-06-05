export var ASTNodeType;
(function (ASTNodeType) {
    ASTNodeType["Program"] = "Program";
    ASTNodeType["Number"] = "Number";
    ASTNodeType["String"] = "String";
    // TODO: Support booleans
    ASTNodeType["Identifier"] = "Identifier";
    ASTNodeType["FunctionCallExpression"] = "FunctionCallExpression";
    ASTNodeType["VariableDeclarationStatement"] = "VariableDeclarationStatement";
    ASTNodeType["FunctionDeclarationStatement"] = "FunctionDeclarationStatement";
    ASTNodeType["ReturnStatement"] = "ReturnStatement";
    ASTNodeType["BinaryExpression"] = "BinaryExpression";
    ASTNodeType["ComparisonExpression"] = "ComparisonExpression";
    ASTNodeType["WhileStatement"] = "WhileStatement";
    ASTNodeType["AssignmentExpression"] = "AssignmentExpression";
})(ASTNodeType || (ASTNodeType = {}));
