import path from "path"
import { LocalEntity, Model, UseCase } from "../../../../../../language/generated/ast.js"
import fs from "fs"
import { generateCRUD as generateCRUDEntities, generateGet as generateGetEntities } from "./Entities/generate.js"
import { generate as generateNotCRUD } from "./UseCases/generate.js"
import { generate as generateBaseController } from "./BaseControllers/generate.js"

export function generate(model: Model, listClassCRUD: LocalEntity[], listRefCRUD: LocalEntity[], listUCsNotCRUD: UseCase[], target_folder: string) : void {

    const ucsnotcrud_folder = target_folder + "/UseCases"
    const entities_folder = target_folder + "/Entities"
    const basecontrollers_folder = target_folder + "/BaseControllers"

    fs.mkdirSync(ucsnotcrud_folder, {recursive: true})
    fs.mkdirSync(entities_folder, {recursive: true})
    fs.mkdirSync(basecontrollers_folder, {recursive: true})
    
    generateBaseController(model, basecontrollers_folder)
    generateNotCRUDControllers(model, listUCsNotCRUD, ucsnotcrud_folder)
    generateLoop(model, listClassCRUD, listRefCRUD, entities_folder)
}

function generateLoop(model: Model, listClassCRUD: LocalEntity[], listRefCRUD: LocalEntity[], tgt_folder: string) : void {
    
    for(const cls of listClassCRUD) {
        fs.writeFileSync(path.join(tgt_folder, `${cls.name}Controller.cs`), generateCRUDEntities(model, cls))
    }

    for(const cls of listRefCRUD) {
        fs.writeFileSync(path.join(tgt_folder, `${cls.name}Controller.cs`), generateGetEntities(model, cls))
    }
}

function generateNotCRUDControllers(model: Model, listUCsNotCRUD: UseCase[], tgt_folder: string) : void {
    for(const uc of listUCsNotCRUD) {
        fs.writeFileSync(path.join(tgt_folder, `${uc.name_fragment}Controller.cs`), generateNotCRUD(model, uc))
    }
}

