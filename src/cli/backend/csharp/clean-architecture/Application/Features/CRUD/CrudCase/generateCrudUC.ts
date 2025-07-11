import { LocalEntity, Model } from "../../../../../../../../language/generated/ast.js";
import fs from "fs"
import { generate as generateCreate } from "./generateCreate.js"
import { generate as generateDelete } from "./generateDelete.js"
import { generate as generateUpdate } from "./generateUpdate.js"
import { generate as generateGetAll } from "./generateGetAll.js"
import { generate as generateGetById } from "./generateGatById.js" 
import { RelationInfo } from "../../../../../../../util/relations.js";

export function generateCrudCase (model: Model, cls: LocalEntity, relatons: RelationInfo[], target_folder: string): void {
    const Create_Folder = target_folder + `/Create${cls.name}`
    const Delete_Folder = target_folder + `/Delete${cls.name}`
    const Update_Folder = target_folder + `/Update${cls.name}`
    const GetAll_Folder = target_folder + `/GetAll${cls.name}`
    const GetById_Folder = target_folder + `/GetById${cls.name}`
    
    fs.mkdirSync(Create_Folder, {recursive: true})
    fs.mkdirSync(Delete_Folder, {recursive: true})
    fs.mkdirSync(Update_Folder, {recursive: true})
    fs.mkdirSync(GetAll_Folder, {recursive: true})
    fs.mkdirSync(GetById_Folder, {recursive: true})

    generateCreate(model, cls, relatons, Create_Folder)
    generateDelete(model, cls, Delete_Folder)
    generateUpdate(model, cls, relatons, Update_Folder)
    generateGetAll(model, cls, GetAll_Folder)
    generateGetById(model, cls, GetById_Folder)
}