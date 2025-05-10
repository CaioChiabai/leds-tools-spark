import { Model } from "../../shared/ast.js";

export interface IJavaGenerator {
  generate(model: Model, targetFolder: string): void;
}