import Environment from "@/src/environment";
import { InvalidNodeError, InvalidTokenError, RuntimeError } from "@/src/errs";
import { getNumber, getString, isNumeric, isString } from "@/src/utils";
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
  type ASTProgram,
  type ASTStatement,
  type ASTString,
  type ASTBlockStatement,
  type ASTBlock,
  type ASTUnaryExpression,
  type ASTVariableDeclaration,
  type InterpreterArray,
  type InterpreterNull,
  type InterpreterNumber,
  type InterpreterObject,
  type InterpreterString,
  type InterpreterValue,
  InterpreterValueType,
type ASTIfStatement,
type InterpreterBoolean,
type ASTSwitchStatement,
type ASTWhileStatement,
type InterpreterComparison} from "@/types";

function getArrayIndex(
  array: InterpreterArray,
  indexNode: ASTExpression,
  environment: Environment
): number {
  const index = evaluate(indexNode, environment);
  if (index.type !== InterpreterValueType.Number) {
    throw new InvalidTokenError("Array index must be a number");
  }

  const arrayLength = array.elements.length;
  let actualIndex = (<InterpreterNumber>index).value;

  if (actualIndex < 0) {
    actualIndex = arrayLength + actualIndex;
  }

  if (actualIndex < 0 || actualIndex >= arrayLength) {
    throw new InvalidTokenError("Array index out of bounds");
  }

  return actualIndex;
}

export function evaluate(
  node: ASTStatement,
  environment: Environment
): InterpreterValue {
  switch (node.type) {
    case ASTNodeType.Program: {
      let lastEvaluatedValue: InterpreterValue = {
        type: InterpreterValueType.Null,
        value: null,
      } as InterpreterNull;

      for (const statement of (<ASTProgram>node).body) {
        lastEvaluatedValue = evaluate(statement, environment);
      }

      return lastEvaluatedValue;
    }
    case ASTNodeType.VariableDeclaration:
      return environment.addVariable(
        (<ASTVariableDeclaration>node).alpha,
        // FIXME:
        evaluate((<ASTVariableDeclaration>node).value!, environment) ??
          <InterpreterNull>{
            type: InterpreterValueType.Null,
            value: null,
          },
        (<ASTVariableDeclaration>node).metadata.isConstant
      );
    case ASTNodeType.Alpha:
      return environment.getVariable((<ASTAlpha>node).value);
    case ASTNodeType.Number:
      return <InterpreterNumber>{
        type: InterpreterValueType.Number,
        value: (<ASTNumber>node).value,
      };

    case ASTNodeType.BinaryExpression: {
      const leftHandSide = evaluate(
        (<ASTBinaryExpression>node).leftExpression,
        environment
      );
      const rightHandSide = evaluate(
        (<ASTBinaryExpression>node).rightExpression,
        environment
      );
      const operator = (<ASTBinaryExpression>node).binaryOperator;

      if (
        operator === "+" &&
        isString(leftHandSide) &&
        isString(rightHandSide)
      ) {
        return <InterpreterString>{
          type: InterpreterValueType.String,
          value: getString(leftHandSide).concat(getString(rightHandSide)),
        };
      }

      if (
        operator === "*" &&
        ((isString(leftHandSide) && isNumeric(rightHandSide)) ||
          (isNumeric(leftHandSide) && isString(rightHandSide)))
      ) {
        const str = isString(leftHandSide)
          ? getString(leftHandSide)
          : getString(rightHandSide);
        const count = isNumeric(leftHandSide)
          ? getNumber(leftHandSide)
          : getNumber(rightHandSide);

        if (count < 0) {
          throw new InvalidTokenError(
            "Cannot multiply a string by a negative number"
          );
        }

        return <InterpreterString>{
          type: InterpreterValueType.String,
          value: str.repeat(count),
        };
      }

      try {
        const leftValue = getNumber(leftHandSide);
        const rightValue = getNumber(rightHandSide);
        let value = 0;

        switch ((<ASTBinaryExpression>node).binaryOperator) {
          case "%":
            value = leftValue % rightValue;
            break;
          case "*":
            value = leftValue * rightValue;
            break;
          case "+":
            value = leftValue + rightValue;
            break;
          case "-":
            value = leftValue - rightValue;
            break;
          case "/":
            value = leftValue / rightValue;
            break;
          case "<":
            value = +(leftValue < rightValue);
            break;

          case ">":
            value = +(leftValue > rightValue);
            break;

          case ">=":
            value = +(leftValue >= rightValue);
            break;

          case "<=":
            value = +(leftValue <= rightValue);
            break;

          case "!=":
            value = +(leftValue != rightValue);
            break;

          case "!==":
            value = +(leftValue !== rightValue);
            break;

          case "==":
            value = +(leftValue == rightValue);
            break;

          case "===":
            value = +(leftValue === rightValue);
            break;
        }

        return <InterpreterNumber>{
          type: InterpreterValueType.Number,
          value,
        };
      } catch (error) {
        return <InterpreterNull>{
          type: InterpreterValueType.Null,
          value: null,
        };
      }
    }

    case ASTNodeType.UnaryExpression: {
      const value = evaluate(
        (<ASTUnaryExpression>node).expression,
        environment
      );

      if ((<ASTUnaryExpression>node).operator === "!") {
        const boolValue =
          value.type === InterpreterValueType.String
            ? true
            : isNumeric(value)
            ? getNumber(value) !== 0
            : false;
        return <InterpreterNumber>{
          type: InterpreterValueType.Number,
          value: boolValue ? 0 : 1,
        };
      }

      throw new InvalidTokenError(
        `Unknown unary operator: ${(<ASTUnaryExpression>node).operator}`
      );
    }

    case ASTNodeType.AssignmentExpression: {
      const assignee = (<ASTAssignmentExpression>node).assignee;

      if (assignee.type === ASTNodeType.ObjectAttribute) {
        const object = evaluate(
          (<ASTObjectAttribute>assignee).object,
          environment
        );
        if (object.type !== InterpreterValueType.Object) {
          throw new InvalidTokenError(
            "Cannot assign to property of non-object value"
          );
        }

        const propertyName = (<ASTAlpha>(<ASTObjectAttribute>assignee).property)
          .value;
        const value = evaluate(
          (<ASTAssignmentExpression>node).value,
          environment
        );

        (<InterpreterObject>object).properties[propertyName] = value;
        (<InterpreterObject>object).environment.setVariable(
          propertyName,
          value
        );

        return value;
      }

      if (assignee.type === ASTNodeType.Index) {
        const array = evaluate((<ASTIndex>assignee).array, environment);
        if (array.type !== InterpreterValueType.Array) {
          throw new InvalidTokenError(
            "Cannot assign to index of non-array value"
          );
        }

        const value = evaluate(
          (<ASTAssignmentExpression>node).value,
          environment
        );
        const actualIndex = getArrayIndex(
          <InterpreterArray>array,
          (<ASTIndex>assignee).index,
          environment
        );

        (<InterpreterArray>array).elements[actualIndex] = value;
        return value;
      }

      if (assignee.type === ASTNodeType.Alpha) {
        return environment.setVariable(
          (<ASTAlpha>assignee).value,
          evaluate((<ASTAssignmentExpression>node).value, environment)
        );
      }

      throw new InvalidTokenError("Invalid assignment target");
    }

    case ASTNodeType.String:
      return <InterpreterString>{
        type: InterpreterValueType.String,
        value: (<ASTString>node).value,
      };

    case ASTNodeType.Array: {
      const elements: InterpreterValue[] = [];
      for (const expression of (<ASTArray>node).body) {
        elements.push(evaluate(expression, environment));
      }

      return <InterpreterArray>{ type: InterpreterValueType.Array, elements };
    }

    case ASTNodeType.Index: {
      const array = evaluate((<ASTIndex>node).array, environment);
      if (array.type !== InterpreterValueType.Array) {
        throw new InvalidTokenError(
          "Cannot use index operator on non-array value"
        );
      }

      const actualIndex = getArrayIndex(
        <InterpreterArray>array,
        (<ASTIndex>node).index,
        environment
      );
      return (<InterpreterArray>array).elements[actualIndex];
    }

    case ASTNodeType.Object: {
      const properties: { [key: string]: InterpreterValue } = {};
      const objectEnv = new Environment(environment);

      for (const [key, expr] of Object.entries((<ASTObject>node).properties)) {
        const value = evaluate(expr, environment);
        properties[key] = value;
        objectEnv.addVariable(key, value, false);
      }

      return <InterpreterObject>{
        type: InterpreterValueType.Object,
        properties,
        environment: objectEnv,
      };
    }

    

    case ASTNodeType.ObjectAttribute: {
      const object = evaluate((<ASTObjectAttribute>node).object, environment);
      if (object.type !== InterpreterValueType.Object) {
        throw new InvalidTokenError(
          "Cannot access property of non-object value"
        );
      }

      const propertyName = (<ASTAlpha>(<ASTObjectAttribute>node).property)
        .value;
      const property = (<InterpreterObject>object).properties[propertyName];

      if (!property) {
        throw new InvalidTokenError(
          `Property '${propertyName}' does not exist`
        );
      }

      return property;
    }

  case ASTNodeType.Block: {
  const block = node as ASTBlock;

  let result: InterpreterValue = {
    type: InterpreterValueType.Null,
    value: null,
  }as InterpreterNull;

  for (const stmt of block.body) {
    result = evaluate(stmt, environment);
  }

  return result;
}




    case ASTNodeType.Index: {
      const array = evaluate((<ASTIndex>node).array, environment);
      if (array.type !== InterpreterValueType.Array) {
        throw new InvalidTokenError(
          "Cannot use index operator on non-array value"
        );
      }

      const actualIndex = getArrayIndex(
        <InterpreterArray>array,
        (<ASTIndex>node).index,
        environment
      );
      return (<InterpreterArray>array).elements[actualIndex];
    }

    

    case ASTNodeType.If: {
      const { condition, trueCase, falseCase } = node as ASTIfStatement;

      const conditionValue = evaluate(condition, environment);
      if (!isNumeric(conditionValue)) {
        throw new Error("Condition in 'if' must evaluate to a boolean");
      }

      const scopedEnv = new Environment(environment);

      if ((conditionValue as InterpreterBoolean).value === 1) {
        return evaluate(trueCase, scopedEnv);
      } else if (falseCase) {
        return evaluate(falseCase, scopedEnv);
      } else {
        return {
          type: InterpreterValueType.Null,
          value: null,
        } as InterpreterNull;

      }
}

case ASTNodeType.Switch: {
  const { discriminant, cases, defaultCase } = node as ASTSwitchStatement;
  const value = evaluate(discriminant, environment);

  for (const caseNode of cases) {
    const caseValue = evaluate(caseNode.test, environment);

  if (
  value.type === caseValue.type &&
  (
    (value.type === InterpreterValueType.Number && (value as InterpreterNumber).value === (caseValue as InterpreterNumber).value) ||
    (value.type === InterpreterValueType.String && (value as InterpreterString).value === (caseValue as InterpreterString).value)
  )
) {
      const caseEnv = new Environment(environment);
      return evaluate(caseNode.consequent, caseEnv);
    }
  }

  if (defaultCase) {
    const defaultEnv = new Environment(environment);
    return evaluate(defaultCase, defaultEnv);
  }

  return {
  type: InterpreterValueType.Null,
  value: null,
} as InterpreterNull;

}


case ASTNodeType.While: {
  const { condition, body } = node as ASTWhileStatement;

  let result: InterpreterValue = { type: InterpreterValueType.Null, value: null } as InterpreterNull;

  while ((evaluate(condition, environment) as InterpreterBoolean).value === 1) {
    const loopEnv = new Environment(environment); 
    result = evaluate(body, loopEnv);
  }

  return result;
}






    default:
      throw new InvalidNodeError(`Unexpected AST node type: '${node.type}'`);
  }
}
