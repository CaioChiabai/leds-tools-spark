import { GeneratorFactory } from "../../factories/generator-factory.js";
import { ConfigGenerator } from "../generators/config-generator.js";
import { IGenerator } from "../../../shared/iGenerator.js";

export class ConfigGeneratorFactory extends GeneratorFactory {
  createGenerator(): IGenerator {
    return new ConfigGenerator();
  }
}