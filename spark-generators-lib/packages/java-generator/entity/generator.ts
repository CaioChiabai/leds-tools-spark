import { Model } from "../../shared/ast.js";
import { StandardEntityGeneratorFactory } from "./StandardEntityGeneratorFactory.js"

export function generate(model: Model, target_folder: string, type: string = "standard"): void {
    let factory = new StandardEntityGeneratorFactory();
    
    factory.generateWebService(model, target_folder);
}
  