import { Model } from "./ast.js";

export interface IGenerator {
  generate(model: Model, targetFolder: string): void;
}