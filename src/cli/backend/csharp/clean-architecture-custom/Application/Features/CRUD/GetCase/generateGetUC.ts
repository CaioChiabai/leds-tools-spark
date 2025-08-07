import { LocalEntity, Model } from "../../../../../../../../language/generated/ast.js";
import fs from "fs"
import { generate as generateGetAll } from "./generateGetAll.js"
import { generate as generateGetById } from "./generateGetById.js"

export function generateGetCase (model: Model, cls: LocalEntity, target_folder: string): void {
    const GetAll_Folder = target_folder + `/GetAll${cls.name}`
    const GetById_Folder = target_folder + `/GetById${cls.name}`
    
    fs.mkdirSync(GetAll_Folder, {recursive: true})
    fs.mkdirSync(GetById_Folder, {recursive: true})

    generateGetAll(model, cls, GetAll_Folder)
    generateGetById(model, cls, GetById_Folder)
}