import { LocalEntity, Model } from "../../../../../../../../language/generated/ast.js";
import fs from "fs"
import { expandToString } from "langium/generate";
import path from "path"

export function generate ( model: Model, cls: LocalEntity, target_folder: string) : void {
    fs.writeFileSync(path.join(target_folder, `Delete${cls.name}Handler.cs`), generateHandler(model, cls))
    fs.writeFileSync(path.join(target_folder, `Delete${cls.name}Command.cs`), generateCommand(model, cls))
    fs.writeFileSync(path.join(target_folder, `Delete${cls.name}Validator.cs`), generateValidator(model, cls))
}

function generateHandler(model: Model, cls: LocalEntity) : string {
    return expandToString`
using AutoMapper;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.Interface;
using ${model.configuration?.name}.Domain.Entities;
using ${model.configuration?.name}.Domain.Enums;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.DTOs;
using ConectaFapes.Common.Infrastructure.Interfaces;
using ${model.configuration?.name}.Application.Base.BaseCase;

namespace ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.${cls.name}Case.Delete
{
    public class Delete${cls.name}Handler : DeleteHandler<I${cls.name}Service, Delete${cls.name}Command, ${cls.name}RequestDTO, ${cls.name}ResponseDTO, ${cls.name}>
    {
        public Delete${cls.name}Handler(IUnitOfWork unitOfWork, I${cls.name}Service service, IMapper mapper) : base(unitOfWork, service, mapper)
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
using ${model.configuration?.name}.Domain.Enums;

namespace ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.${cls.name}Case.Delete
{
    public record Delete${cls.name}Command(Guid Id) : IRequest<TResult<${cls.name}ResponseDTO>>
    {
    }
}
`
}

function generateValidator(model: Model, cls: LocalEntity) : string {
    return expandToString`
using FluentValidation;

namespace ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.${cls.name}Case.Delete
{
    public class Delete${cls.name}Validator : AbstractValidator<Delete${cls.name}Command>
    {
        public Delete${cls.name}Validator()
        {

        }
    }
}
`
}