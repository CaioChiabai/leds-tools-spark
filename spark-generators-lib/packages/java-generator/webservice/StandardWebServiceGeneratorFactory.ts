import { IJavaGenerator } from "../interfaces/IJavaGenerator.js";
import { ConfigGenerator } from "./ConfigGenerator.js";
import { ModuleGenerator } from "./ModuleGenerator.js";
import { GraphQLGenerator } from "./GraphQLGenerator.js";
import { WebServiceGeneratorFactory } from "./WebServiceGeneratorFactory.js";

export class StandardWebServiceGeneratorFactory extends WebServiceGeneratorFactory {
    protected createGenerators(): IJavaGenerator[] {
        return [
            new ConfigGenerator(),
            new ModuleGenerator(),
            new GraphQLGenerator()
        ];
    }
}