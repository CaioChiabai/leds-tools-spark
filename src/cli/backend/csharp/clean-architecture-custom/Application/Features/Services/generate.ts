import { expandToStringWithNL } from "langium/generate";
import { Model, UseCase, Event } from "../../../../../../../language/generated/ast.js"
import fs from "fs"
import path from "path";

export function generate(model: Model, event: Event, uc: UseCase, target_folder: string) : void {

    fs.writeFileSync(path.join(target_folder,`${event.name_fragment}Service.cs`), generateService(model, event, uc))
}

function generateService (model: Model, event: Event, uc: UseCase): string {
    return expandToStringWithNL`
﻿using ${model.configuration?.name}.Application.Features.${uc.name_fragment}Case.${event.name_fragment}.DTOs;
using ${model.configuration?.name}.Application.Features.${uc.name_fragment}Case.${event.name_fragment}.Interfaces;
using ${model.configuration?.name}.Application.Features.${uc.name_fragment}Case.${event.name_fragment}.UseCases;
using ConectaFapes.Common.Domain;
using ConectaFapes.Common.Domain.ResultEntities;
using ${model.configuration?.name}.Domain.Entities;
using ${model.configuration?.name}.Domain.Interfaces.Entities;

namespace ${model.configuration?.name}.Application.Features.${uc.name_fragment}Case.${event.name_fragment}.Services
{
    /// <summary>
    /// ${event.description}
    /// </summary>
    public class ${event.name_fragment}Service : I${event.name_fragment}Service
    {

        public ${event.name_fragment}Service()
        {

        }

        public async Task<TResult<ICollection<${event.name_fragment}Dto>>> Execute(${event.name_fragment}Command request)
        {
            throw new NotImplementedException();
        }

    }
}
    `
}
