import { LocalEntity, Model } from "../../../../../language/generated/ast.js"
import fs from "fs";
import { createPath } from "../../../../util/generator-utils.js";
import { generate as generateModel } from "./model/generate.js";
import { generate as generateAuthentication } from "./authentication/generate.js";
import { expandToString } from "langium/generate";
import path from "path";

export function generate(model: Model, listClassCRUD: LocalEntity[], target_folder: string) : void {

    const authentication_folder = createPath(target_folder, "authentication")
    const model_folder = createPath(target_folder, `${model.configuration?.name}`)
    const dashboard_folder = createPath(target_folder, "dashboards")

    fs.mkdirSync(authentication_folder, {recursive:true})
    fs.mkdirSync(model_folder, {recursive:true})
    fs.mkdirSync(dashboard_folder, {recursive:true})

    generateModel(model, listClassCRUD, model_folder)
    generateAuthentication(model, authentication_folder)

    fs.writeFileSync(path.join(target_folder, `index.vue`), generateIndex())

}  

function generateIndex(): string {
    return expandToString`
<template>
</template>`
}
