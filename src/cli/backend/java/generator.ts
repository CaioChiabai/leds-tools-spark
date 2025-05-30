import fs from "fs";

import { GeneratorStrategyFactory } from "spark-generators-lib";
import { Model as LibModel} from "spark-generators-lib";

export function generate(model: LibModel.Model, target_folder: string, language: string) : void {
    const target_folder_back = target_folder+"/backend"
    fs.mkdirSync(target_folder_back, {recursive:true})
    
    const generator = GeneratorStrategyFactory.get(language)
    generator.generate(model, target_folder_back);
}  