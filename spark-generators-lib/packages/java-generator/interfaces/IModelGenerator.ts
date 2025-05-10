import { Generated } from "langium/generate"
import { ImportedEntity, LocalEntity, ModuleImport } from "../../shared/ast.js"
import { RelationInfo } from "../../shared/relations.js"

export interface IModelGenerator {
  generate(
    cls: LocalEntity,
    is_supertype: boolean,
    relations: RelationInfo[],
    package_name: string,
    importedEntities: Map<ImportedEntity, ModuleImport | undefined>
  ): Generated;
}