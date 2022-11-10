import { KopiValue, ASTNode, ASTPatternNode, Evaluate, Environment } from "../../shared";
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
    [argument, evaluate, _environment]: [KopiValue, Evaluate, Environment]
  ): Promise<KopiValue> {
    const matches = await this.parameterPattern.match(argument, evaluate, _environment);

    const newEnvironment = {
      ...this.environment,
      ...matches,
      ...(this.name ? { [this.name]: this } : {}),
    };

    Object.setPrototypeOf(newEnvironment, Object.getPrototypeOf(this.environment));

    return evaluate(this.bodyExpression, newEnvironment);
  }

  parameterPattern: ASTPatternNode;
  bodyExpression: ASTNode;
  environment: Environment;
  name?: string;
}

export default KopiFunction;
