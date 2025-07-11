import { Attribute, isEnumX, isLocalEntity, isModule, LocalEntity, Model } from "../../../../../../language/generated/ast.js"
import fs from "fs";
import path from "path";
import { createPath } from "../../../../../util/generator-utils.js";
import { generate as generateForms } from "./generateForms.js";
import { generate as generateIndex } from "./generateIndex.js";
import { processRelations, RelationInfo } from "../../../../../util/relations.js";
import { generate as generateDetails } from "./generateDetails.js";

export function generate(model: Model, listClassCRUD: LocalEntity[], target_folder: string) : void {

    const modules =  model.abstractElements.filter(isModule);
  
    const all_entities = modules.map(module => module.elements.filter(isLocalEntity)).flat()
  
    const relation_maps = processRelations(all_entities)

    for(const mod of modules) {
      const enumx = mod.elements.filter(isEnumX)
      for(const cls of mod.elements.filter(isLocalEntity)) {
          const {relations} = getAttrsAndRelations(cls, relation_maps)
          const cls_folder = createPath(target_folder, `${cls.name}`)

          fs.mkdirSync(cls_folder, {recursive:true})

          fs.writeFileSync(path.join(cls_folder, `Form${cls.name}.vue`), generateForms(cls, enumx, relations))
          fs.writeFileSync(path.join(cls_folder, `Index${cls.name}.vue`), generateIndex(cls, relations))
          fs.writeFileSync(path.join(cls_folder, `Details${cls.name}.vue`), generateDetails(cls, enumx, relations))
      }
        
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