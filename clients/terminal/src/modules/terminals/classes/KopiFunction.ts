import { KopiValue, ASTNode, ASTPatternNode, Evaluate, Environment } from "../../shared";
import { Applicative } from "../../shared";

class KopiFunction extends KopiValue {
  static override traits = [Applicative];

  constructor(parameterPattern: ASTPatternNode, bodyExpression: ASTNode, environment: Environment) {
    super();

    this.parameterPattern = parameterPattern;
    this.environment = environment;
    this.bodyExpression = bodyExpression;
  }

  async apply(
    thisArg: KopiValue,
    [argument, evaluate, environment]: [KopiValue, Evaluate, Environment]
  ): Promise<KopiValue> {
    const matches = await this.parameterPattern.match(argument, evaluate, environment);

    return evaluate(this.bodyExpression, {
      ...this.environment,
      ...matches
    });
  }

  parameterPattern: ASTPatternNode;
  environment: Environment;
  bodyExpression: ASTNode;
}

export default KopiFunction;
