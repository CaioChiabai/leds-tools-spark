import { Model } from "../../shared/ast.js";
import { IGenerator } from "../../shared/igenerator.js";

export abstract class AbstractGeneratorFactory {
  // Fábricas concretas precisam implementar este método
  abstract createGenerator(): IGenerator;

  run(model: Model, targetFolder: string): void {
    const generator = this.createGenerator();
    generator.generate(model, targetFolder);
  }

  static createAll?(): IGenerator[];
}