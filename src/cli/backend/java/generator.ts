import fs from "fs";

import { backend } from "leds-spark-lib"

export import LibModel = backend.Model;
export const generators = backend.csharp.generators;

export function generate(model: LibModel.Model, target_folder: string) : void {
    const target_folder_back = target_folder+"/backend"

    //creating folders
    fs.mkdirSync(target_folder_back, {recursive:true})
    
    generators.springboot.generate(model, target_folder_back)
    
}  