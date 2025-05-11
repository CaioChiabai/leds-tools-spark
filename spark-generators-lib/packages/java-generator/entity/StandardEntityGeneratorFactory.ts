import { IJavaGenerator } from "../interfaces/IJavaGenerator.js";
import { ConfigGenerator } from "./ConfigGenerator.js";
import { ModuleGenerator } from "./ModuleGenerator.js";
import { SQLGenerator } from "./SQLGenerator.js";
import { DebeziumGenerator } from "./DebeziumGenerator.js";
import { EntityGeneratorFactory } from "./AbstractEntityGeneratorFactory.js";

export class StandardEntityGeneratorFactory extends EntityGeneratorFactory{
  protected createGenerators(): IJavaGenerator[] {
          return [
              new ConfigGenerator(),
              new ModuleGenerator(),
              new SQLGenerator(),
              new DebeziumGenerator()
          ];
      }
}