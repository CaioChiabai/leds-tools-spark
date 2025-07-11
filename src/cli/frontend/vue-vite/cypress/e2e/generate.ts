import { LocalEntity, Model } from "../../../../../language/generated/ast.js"
import fs from "fs";
import { createPath } from "../../../../util/generator-utils.js";
import { generate as generateStepDefinitions } from "./step_definitions/generate.js";

export function generate(model: Model, listClassCRUD: LocalEntity[], target_folder: string) : void {

    const step_definitions_folder = createPath(target_folder, "step_definitions")

    fs.mkdirSync(step_definitions_folder, {recursive:true})

    generateStepDefinitions(model, listClassCRUD, step_definitions_folder);
}

