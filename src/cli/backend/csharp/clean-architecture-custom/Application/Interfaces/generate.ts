// Gerar apenas Interfaces de uso comum

import { expandToString } from "langium/generate"
import { LocalEntity, Model } from "../../../../../../language/generated/ast.js"
import fs from "fs"
import path from "path"

export function generate(model: Model, listClassCRUD: LocalEntity[], listRefCRUD: LocalEntity[], target_folder: string) : void {

    const BaseGet_Folder = target_folder + '/BaseGetInterface'

    fs.mkdirSync(BaseGet_Folder, {recursive: true})

    fs.writeFileSync(path.join(BaseGet_Folder,`IBaseGetService.cs`), generateBaseGetService(model))
}

function generateBaseGetService (model : Model): string {
    return expandToString`
using ConectaFapes.Common.Domain;

namespace ${model.configuration?.name}.Application.Interfaces.BaseGetInterface
{
    public interface IBaseGetService<Request, Response, Entity>
    {
        ICollection<Response> GetAll();
        Response GetById(Guid id);

    }
}    
`
}