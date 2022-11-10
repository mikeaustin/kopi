import { KopiValue, ASTNode, ASTPatternNode, Evaluate, Environment, BindValues, Context } from "../../shared";
import { Applicative } from "../../shared";

class KopiFunction extends KopiValue {
  static override traits = [Applicative];

  constructor(parameterPattern: ASTPatternNode, bodyExpression: ASTNode, environment: Environment, name?: string) {
    super();

    this.parameterPattern = parameterPattern;
    this.bodyExpression = bodyExpression;
    this.environment = environment;
    this.name = name;
  }

  async apply(
    thisArg: KopiValue,
    [argument, context]: [KopiValue, Context]
  ): Promise<KopiValue> {
    const { evaluate, bindValues } = context;

    const matches = await this.parameterPattern.match(argument, context);

    const newEnvironment = {
      ...this.environment,
      ...matches,
      ...(this.name ? { [this.name]: this } : {}),
    };

    Object.setPrototypeOf(newEnvironment, Object.getPrototypeOf(this.environment));

    return evaluate(this.bodyExpression, newEnvironment, bindValues);
  }

  parameterPattern: ASTPatternNode;
  bodyExpression: ASTNode;
  environment: Environment;
  name?: string;
}

export default KopiFunction;
