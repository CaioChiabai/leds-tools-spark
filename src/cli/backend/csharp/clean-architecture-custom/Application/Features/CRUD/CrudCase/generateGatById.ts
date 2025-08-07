import { LocalEntity, Model } from "../../../../../../../../language/generated/ast.js";
import fs from "fs"
import { expandToString } from "langium/generate";
import path from "path"

export function generate ( model: Model, cls: LocalEntity, target_folder: string) : void {
    fs.writeFileSync(path.join(target_folder, `GetById${cls.name}Handler.cs`), generateHandler(model, cls))
    fs.writeFileSync(path.join(target_folder, `GetById${cls.name}Command.cs`), generateCommand(model, cls))
    fs.writeFileSync(path.join(target_folder, `GetById${cls.name}Validator.cs`), generateValidator(model, cls))
}

function generateHandler(model: Model, cls: LocalEntity) : string {
    return expandToString`
using AutoMapper;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.DTOs;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.Interface;
using ${model.configuration?.name}.Domain.Entities;
using ${model.configuration?.name}.Application.Base.BaseCase;

namespace ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.${cls.name}Case.GetById
{
    internal class GetById${cls.name}Handler : GetByIdHandler<I${cls.name}Service, GetById${cls.name}Command, ${cls.name}RequestDTO, ${cls.name}ResponseDTO, ${cls.name}>
    {
        public GetById${cls.name}Handler(I${cls.name}Service service, IMapper mapper) : base(service, mapper)
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

namespace ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.${cls.name}Case.GetById
{
    public record GetById${cls.name}Command(Guid Id) : IRequest<${cls.name}ResponseDTO>
    {
    }
}
`
}

function generateValidator(model: Model, cls: LocalEntity) : string {
    return expandToString`
using FluentValidation;

namespace ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.${cls.name}Case.GetById
{
    public class GetById${cls.name}Validator : AbstractValidator<GetById${cls.name}Command>
    {
        public GetById${cls.name}Validator()
        {

        }
    }
}
`
}