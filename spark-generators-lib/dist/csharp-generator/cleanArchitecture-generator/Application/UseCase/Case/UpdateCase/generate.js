import { expandToString } from "langium/generate";
import fs from "fs";
import path from "path";
import { capitalizeString } from "../../../../../../shared/generator-utils.js";
export function generate(model, target_folder, cls, relations) {
    fs.writeFileSync(path.join(target_folder, `Update${cls.name}Handler.cs`), generateHandler(model, cls));
    fs.writeFileSync(path.join(target_folder, `Update${cls.name}Command.cs`), generateCommand(model, cls, relations));
    fs.writeFileSync(path.join(target_folder, `Update${cls.name}Validator.cs`), generateValidator(model, cls));
}
function generateHandler(model, cls) {
    return expandToString `
using AutoMapper;
using ${model.configuration?.name}.Application.DTOs.Entities.Request;
using ${model.configuration?.name}.Application.DTOs.Entities.Response;
using ${model.configuration?.name}.Application.Interfaces.Entities;
using ${model.configuration?.name}.Application.UseCase.BaseCase;
using ${model.configuration?.name}.Domain.Entities;
using ${model.configuration?.name}.Domain.Interfaces.Common;

namespace ${model.configuration?.name}.Application.UseCase.Entities.${cls.name}Case.Update
{
    public class Update${cls.name}Handler : UpdateHandler<I${cls.name}Service, Update${cls.name}Command, ${cls.name}RequestDTO, ${cls.name}ResponseDTO, ${cls.name}>
    {
        public Update${cls.name}Handler(IUnitOfWork unitOfWork, I${cls.name}Service service, IMapper mapper) : base(unitOfWork, service, mapper) { }
    }
}`;
}
function generateValidator(model, cls) {
    return expandToString `
using FluentValidation;

namespace ${model.configuration?.name}.Application.UseCase.Entities.${cls.name}Case.Update
{
    public class Update${cls.name}Validator : AbstractValidator<Update${cls.name}Command>
    {
        public Update${cls.name}Validator()
        {

        }
    }
}`;
}
function generateCommand(model, cls, relations) {
    return expandToString `
using ${model.configuration?.name}.Application.DTOs.Common;
using MediatR;
using ${model.configuration?.name}.Domain.Enums;

namespace ${model.configuration?.name}.Application.UseCase.Entities.${cls.name}Case.Update
{
    public record Update${cls.name}Command(
      Guid Id,
      ${slicer(cls, relations).slice(0, slicer(cls, relations).lastIndexOf(','))}
    ) : IRequest<ApiResponse>;
}`;
}
function slicer(cls, relations) {
    return expandToString `
    ${cls.attributes.map(a => generateAttribute(a)).join('\n')}
    ${generateEnum(cls)}
    ${generateRelationsRequest(cls, relations)}`;
}
function generateAttribute(attribute) {
    return expandToString `
    ${generateTypeAttribute(attribute) ?? 'NOTYPE'} ${capitalizeString(attribute.name)},
    `;
}
function generateTypeAttribute(attribute) {
    if (attribute.type.toString().toLowerCase() === "date") {
        return "DateTime";
    }
    if (attribute.type.toString().toLowerCase() === "cpf") {
        return "String";
    }
    if (attribute.type.toString().toLowerCase() === "boolean") {
        return "bool";
    }
    if (attribute.type.toString().toLowerCase() === "email") {
        return "String";
    }
    if (attribute.type.toString().toLowerCase() === "file") {
        return "Byte[]";
    }
    if (attribute.type.toString().toLowerCase() === "mobilephonenumber") {
        return "String";
    }
    if (attribute.type.toString().toLowerCase() === "zipcode") {
        return "String";
    }
    if (attribute.type.toString().toLowerCase() === "phonenumber") {
        return "String";
    }
    if (attribute.type.toString().toLowerCase() === "integer") {
        return "int";
    }
    return attribute.type;
}
function generateRelationsRequest(cls, relations) {
    let node = '';
    for (const rel of relations) {
        node += (generateRelation(cls, rel)) + '\n';
    }
    return node;
}
function generateRelation(cls, { tgt, card, owner }) {
    switch (card) {
        case "OneToOne":
            if (owner) {
                return expandToString `
            Guid ${capitalizeString(tgt.name)}Id,`;
            }
            else {
                return expandToString `
            Guid ${capitalizeString(tgt.name)}Id,`;
            }
        case "OneToMany":
            if (owner) {
                return '';
            }
            else {
                return '';
            }
        case "ManyToOne":
            if (owner) {
                return expandToString `
            Guid ${capitalizeString(tgt.name)}Id,`;
            }
            else {
                return '';
            }
        case "ManyToMany":
            if (owner) {
                return expandToString `
            Guid ${capitalizeString(tgt.name)}Id,`;
            }
            else {
                return '';
            }
    }
}
function generateEnum(cls) {
    return expandToString `
    ${cls.enumentityatributes.map(enumEntityAtribute => UpdateEnum(enumEntityAtribute)).join("\n")}
    `;
}
function UpdateEnum(enumEntityAtribute) {
    return expandToString `
    ${enumEntityAtribute.type.ref?.name} ${enumEntityAtribute.type.ref?.name.toLowerCase()},
    `;
}
