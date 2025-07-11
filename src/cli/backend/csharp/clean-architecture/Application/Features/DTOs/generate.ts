import { expandToStringWithNL } from "langium/generate"
import { Model, UseCase, Event} from "../../../../../../../language/generated/ast.js"
import fs from "fs"
import path from "path"

export function generate(model: Model, event: Event, uc: UseCase, target_folder: string) : void {

    fs.writeFileSync(path.join(target_folder, `${event.name_fragment}DTO.cs`), generateGenericDTO(model, event, uc))
  
}

function generateGenericDTO(model : Model, event : Event, uc : UseCase) : string {
    return expandToStringWithNL`
﻿using ConectaFapes.Common.Application.DTO;

namespace ${model.configuration?.name}.Application.Features.${uc.name_fragment}Case.${event.name_fragment}.DTOs
{
    public class ${event.name_fragment}Dto : BaseDto
    {
        public ${event.name_fragment}Dto()            
        {

        }
    }
}`
}
