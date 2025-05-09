import { IGenerator } from "../../../shared/igenerator.js";
import { GraphQLGenerator } from "../generators/graphql-generator.js";
import { AbstractGeneratorFactory } from "../../factories/abstract-generator-factory.ts.js";

export class GraphQLGeneratorFactory extends AbstractGeneratorFactory {
  createGenerator(): IGenerator {
    return new GraphQLGenerator();
  }
}