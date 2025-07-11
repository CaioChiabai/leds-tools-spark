import { Attribute, isLocalEntity, LocalEntity, Model } from "../../../../../language/generated/ast.js"
import fs from "fs";
import { processRelations, RelationInfo } from "../../../../util/relations.js";
import { generate as generateDetails } from "./generateDetails.js"
import { generate as generateIndex } from "./generateIndex.js"
import { generate as generateForm } from "./generateForms.js"
import path from "path";

export function generate(model: Model, listClassCRUD: LocalEntity[], target_folder: string) : void {
  
    const relation_maps = processRelations(listClassCRUD)

    //const enumx = mod.elements.filter(isEnumX)
    for(const cls of listClassCRUD) {
        const {} = getAttrsAndRelations(cls, relation_maps)

        fs.writeFileSync(path.join(target_folder, `Details${cls.name}.ts`), generateDetails(cls))
        fs.writeFileSync(path.join(target_folder, `Index${cls.name}.ts`), generateIndex(cls))
        fs.writeFileSync(path.join(target_folder, `Form${cls.name}.ts`), generateForm(cls))
    }
}  

function getAttrsAndRelations(cls: LocalEntity, relation_map: Map<LocalEntity, RelationInfo[]>) : {attributes: Attribute[], relations: RelationInfo[]} {
  // Se tem superclasse, puxa os atributos e relações da superclasse
  if(cls.superType?.ref != null && isLocalEntity(cls.superType?.ref)) {
    const parent =  cls.superType?.ref
    const {attributes, relations} = getAttrsAndRelations(parent, relation_map)

    return {
      attributes: attributes.concat(cls.attributes),
      relations: relations.concat(relation_map.get(cls) ?? [])
    }
  } else {
    return {
      attributes: cls.attributes,
      relations: relation_map.get(cls) ?? []
    }
  }
}