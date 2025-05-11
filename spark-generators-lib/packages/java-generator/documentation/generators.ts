import { Model } from "../../shared/ast.js";
import { StandardDocumentationGeneratorFactory } from "./StandardDocumentationGeneratorFactory.js"

export function generate(model: Model, target_folder: string, type: string = "standard"): void {
    let factory = new StandardDocumentationGeneratorFactory();
    
    factory.generate(model, target_folder);
}