import { expandToString } from "langium/generate";
import { Model, UseCase, Event } from "../../../../../../../language/generated/ast.js"
import fs from "fs"
import path from "path";

export function generate(model: Model, event: Event, uc: UseCase, target_folder: string) : void {

    fs.writeFileSync(path.join(target_folder,`${event.name_fragment}Command.cs`), generateGenericCommand(model, event, uc))
    fs.writeFileSync(path.join(target_folder,`${event.name_fragment}Handler.cs`), generateGenericHandler(model, event, uc))
}

function generateGenericCommand (model: Model, event: Event, uc: UseCase): string {
    return expandToString`
using ${model.configuration?.name}.Application.Features.${uc.name_fragment}Case.${event.name_fragment}.DTOs;
using ConectaFapes.Common.Domain;
using MediatR;

namespace ${model.configuration?.name}.Application.Features.${uc.name_fragment}Case.${event.name_fragment}.UseCases
{
    public record ${event.name_fragment}Command() : IRequest<TResult<ICollection<${event.name_fragment}Dto>>>;
}`
}

function generateGenericHandler (model: Model, event: Event, uc: UseCase): string {
    return expandToString`
using ${model.configuration?.name}.Application.Features.${uc.name_fragment}Case.${event.name_fragment}.DTOs;
using ${model.configuration?.name}.Application.Features.${uc.name_fragment}Case.${event.name_fragment}.Interfaces;
using ConectaFapes.Common.Domain.ResultEntities;
using ConectaFapes.Common.Domain;
using MediatR;

namespace ${model.configuration?.name}.Application.Features.${uc.name_fragment}Case.${event.name_fragment}.UseCases
{
    public class ${event.name_fragment}Handler :
        IRequestHandler<${event.name_fragment}Command, TResult<ICollection<${event.name_fragment}Dto>>>
    {
        private readonly I${event.name_fragment}Service _service;

        public ${event.name_fragment}Handler(I${event.name_fragment}Service service)
        {
            _service = service;
        }

        public async Task<TResult<ICollection<${event.name_fragment}Dto>>> Handle(${event.name_fragment}Command request, CancellationToken cancellationToken)
        {
            return await _service.Execute(request);
        }

        
    }
}`
}

