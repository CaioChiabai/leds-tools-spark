import path from "path"
import { LocalEntity, Model } from "../../../../../../language/generated/ast.js"
import fs from "fs"
import { expandToString } from "langium/generate";

export function generate(model: Model, listClassCRUD: LocalEntity[], target_folder: string) : void {
    
    for(const cls of listClassCRUD) {
        fs.writeFileSync(path.join(target_folder, `${cls.name}Requires.ts`), generateRequires(cls))
    }
}

function generateRequires(cls: LocalEntity): string{
    return expandToString`
import serviceFactory from './factory.js'

export default function ${cls.name}Service() {
  return serviceFactory('api/${cls.name}')
}`
}