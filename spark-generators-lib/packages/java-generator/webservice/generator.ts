import { Model } from "../../shared/ast.js";
import { StandardWebServiceGeneratorFactory } from "./StandardWebServiceGeneratorFactory.js"

export function generate(model: Model, target_folder: string, type: string = "standard"): void {
    let factory = new StandardWebServiceGeneratorFactory();
    
    factory.generate(model, target_folder);
}