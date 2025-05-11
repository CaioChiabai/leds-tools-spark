import { IJavaGenerator } from "../interfaces/IJavaGenerator.js";
import { AbstractDocumentationGeneratorFactory } from "./AbstractDocumentationGeneratorFactory.js";
import { DocumentationGenerator } from "./DocumentationGenerator.js";

export class StandardDocumentationGeneratorFactory extends AbstractDocumentationGeneratorFactory {
    protected createGenerators(): IJavaGenerator[] {
        return [
            new DocumentationGenerator()
        ];
    }
}