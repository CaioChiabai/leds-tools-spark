// generator-factory.ts
import { Model } from "packages/shared/ast.js";
import { IGenerator } from "../../shared/iGenerator.js";

export abstract class GeneratorFactory {
  abstract createGenerator(): IGenerator;

  run(model: Model, targetFolder: string): void {
    const generator = this.createGenerator();
    generator.generate(model, targetFolder);
  }
}
