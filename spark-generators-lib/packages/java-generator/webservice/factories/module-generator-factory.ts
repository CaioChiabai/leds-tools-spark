import { AbstractGeneratorFactory } from "../../factories/abstract-generator-factory.ts.js";
import { IGenerator } from "../../../shared/igenerator.js";
import { ModuleGenerator } from "../generators/module-generator.js";

export class ModuleGeneratorFactory extends AbstractGeneratorFactory {
  createGenerator(): IGenerator {
    return new ModuleGenerator();
  }
}