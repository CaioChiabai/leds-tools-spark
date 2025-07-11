import { expandToString } from "langium/generate"
import { Model, UseCase, Event } from "../../../../../../../language/generated/ast.js"
import fs from "fs"
import path from "path"

export function generate(model: Model, event: Event, uc: UseCase, target_folder: string) : void {

    fs.writeFileSync(path.join(target_folder,`I${event.name_fragment}Service.cs`), generateService(model, event, uc))

}

function generateService (model: Model, event: Event, uc: UseCase): string {
    return expandToString`
﻿using ${model.configuration?.name}.Application.Features.${uc.name_fragment}Case.${event.name_fragment}.DTOs;
using ${model.configuration?.name}.Application.Features.${uc.name_fragment}Case.${event.name_fragment}.UseCases;
using ConectaFapes.Common.Domain;

namespace ${model.configuration?.name}.Application.Features.${uc.name_fragment}Case.${event.name_fragment}.Interfaces
{
    public interface I${event.name_fragment}Service
    {
        Task<TResult<ICollection<${event.name_fragment}Dto>>> Execute(${event.name_fragment}Command request);
    }
}`
}
