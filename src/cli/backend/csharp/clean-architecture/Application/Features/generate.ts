// Gerar pasta para cada UC não CRUD
  // Gerar pasta para cada evento
    // Gerar Service, DTO, Interface e pasta UseCase para cada pasta
      // Gerar Command e Handler do evento dentro da pasta UseCase

import { Attribute, isLocalEntity, LocalEntity, Model, UseCase } from "../../../../../../language/generated/ast.js";
import { processRelations, RelationInfo } from "../../../../../util/relations.js";
import { generateCrudClass } from "./CRUD/generate.js"
import { generateGetClass } from "./CRUD/generate.js"
import { generate as generateGenericService } from "./Services/generate.js"
import { generate as generateGenericDTO } from "./DTOs/generate.js"
import { generate as generateGenericInterface } from "./Interfaces/generate.js"
import { generate as generateGenericUseCase } from "./UseCases/generate.js"
import fs from "fs"

export function generate (model: Model, listClassCRUD: LocalEntity[], listRefCRUD: LocalEntity[], listUCsNotCRUD: UseCase[], target_folder: string) : void {

    const Crud_Folder = target_folder + "/CRUD"
    
    fs.mkdirSync(Crud_Folder, {recursive: true})

    const listClassRefCRUD = listClassCRUD.concat(listRefCRUD)
    const relation_maps = processRelations(listClassRefCRUD)

    for (const cls of listClassCRUD) {
        const { relations } = getAttrsAndRelations(cls, relation_maps)
        const Cls_Folder = Crud_Folder + `/${cls.name}Entity`
        fs.mkdirSync(Cls_Folder, {recursive: true})
        generateCrudClass(model, cls, relations, Cls_Folder)
    }

    for (const cls of listRefCRUD) {
        const { relations } = getAttrsAndRelations(cls, relation_maps)
        const Cls_Folder = Crud_Folder + `/${cls.name}Entity`
        fs.mkdirSync(Cls_Folder, {recursive: true})
        generateGetClass(model, cls, relations, Cls_Folder)
    }

    let UC_Folder = target_folder
    
    //Gera as pastas para os casos de uso não CRUD
    for(const uc of listUCsNotCRUD) {
        UC_Folder = UC_Folder + `/${uc.name_fragment}Case`
        fs.mkdirSync(UC_Folder, {recursive: true})

        for (const event of uc.events) {
            const Event_Folder = UC_Folder + `/${event.name_fragment}`
            fs.mkdirSync(Event_Folder, {recursive: true})

            fs.mkdirSync(Event_Folder + "/Services", {recursive: true})
            fs.mkdirSync(Event_Folder + "/DTOs", {recursive: true})
            fs.mkdirSync(Event_Folder + "/Interfaces", {recursive: true})
            fs.mkdirSync(Event_Folder + "/UseCases", {recursive: true})

            generateGenericService(model, event, uc, Event_Folder + "/Services",)
            generateGenericDTO(model, event, uc, Event_Folder + "/DTOs",)
            generateGenericInterface(model, event, uc, Event_Folder + "/Interfaces")
            generateGenericUseCase(model, event, uc, Event_Folder + "/UseCases")
        }
    }

}

/**
 * Retorna todos os atributos e relações de uma Class, incluindo a de seus supertipos
 */
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
