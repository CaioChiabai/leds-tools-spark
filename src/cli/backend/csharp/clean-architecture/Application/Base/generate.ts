import { Model } from "../../../../../../language/generated/ast.js";
import fs from "fs"
import { generate as generateBaseCase } from "./BaseCase/generate.js"
import { generate as generateBaseGetCase } from "./BaseGetCase/generate.js"

export function generate(model : Model, target_folder: string) {
    const BaseCase_Folder = target_folder + "/BaseCase"
    const BaseGetCase_Folder = target_folder + "/BaseGetCase"

    fs.mkdirSync(BaseCase_Folder, {recursive: true})
    fs.mkdirSync(BaseGetCase_Folder, {recursive: true})

    generateBaseCase(model, BaseCase_Folder)
    generateBaseGetCase(model, BaseGetCase_Folder)
}