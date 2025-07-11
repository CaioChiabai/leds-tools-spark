import { LocalEntity, Model } from "../../../../../../../../language/generated/ast.js";
import fs from "fs"
import { expandToString } from "langium/generate";
import path from "path"

export function generate ( model: Model, cls: LocalEntity, target_folder: string) : void {
    fs.writeFileSync(path.join(target_folder, `GetAll${cls.name}Handler.cs`), generateHandler(model, cls))
    fs.writeFileSync(path.join(target_folder, `GetAll${cls.name}Command.cs`), generateCommand(model, cls))
    fs.writeFileSync(path.join(target_folder, `GetAll${cls.name}Validator.cs`), generateValidator(model, cls))
}

function generateHandler(model: Model, cls: LocalEntity) : string {
    return expandToString`
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.DTOs;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.Interface;
using ${model.configuration?.name}.Domain.Entities;
using ${model.configuration?.name}.Application.Base.BaseGetCase;

namespace ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.${cls.name}Case.GetAll
{
    public class GetAll${cls.name}Handler : GetAllHandler<I${cls.name}Service, GetAll${cls.name}Command, ${cls.name}RequestDTO, ${cls.name}ResponseDTO, ${cls.name}>
    {
        public GetAll${cls.name}Handler(I${cls.name}Service service) : base(service)
        {
        }
    }
}
`
}

function generateCommand(model: Model, cls: LocalEntity) : string {
    return expandToString`
using ConectaFapes.Common.Domain;
using MediatR;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.DTOs;

namespace ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.${cls.name}Case.GetAll
{
    public record GetAll${cls.name}Command() : IRequest<ICollection<${cls.name}ResponseDTO>>;
}
`
}

function generateValidator(model: Model, cls: LocalEntity) : string {
    return expandToString`
using FluentValidation;

namespace ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.${cls.name}Case.GetAll
{
    public class GetAll${cls.name}Validator : AbstractValidator<GetAll${cls.name}Command>
    {
        public GetAll${cls.name}Validator()
        {
        }
    }
}
`
}