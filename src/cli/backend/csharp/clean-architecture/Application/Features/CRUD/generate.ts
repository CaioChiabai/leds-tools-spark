// Gerar pasta para cada entidade
  // Gerar Service, DTO, Interface, e pasta UseCase para cada entidade
    // Gerar pastas CreateEntidade, Delete", GetAll", GetById" e Update" para 
    // cada entidade
      // Gerar Command, Handler e Validator em cada pasta

import { Attribute, EnumEntityAtribute, LocalEntity, Model } from "../../../../../../../language/generated/ast.js";
import fs from "fs"
import { CompositeGeneratorNode, expandToString, expandToStringWithNL, Generated } from "langium/generate";
import path from "path"
import { capitalizeString } from "../../../../../../util/generator-utils.js";
import { RelationInfo } from "../../../../../../util/relations.js";
import { generateCrudCase } from "./CrudCase/generateCrudUC.js"
import { generateGetCase } from "./GetCase/generateGetUC.js"

export function generateCrudClass(model: Model, cls: LocalEntity, relations: RelationInfo[], target_folder: string): void {
    const DTO_Folder = target_folder + "/DTOs"
    const Interface_Folder = target_folder + "/Interface"
    const Service_Folder = target_folder + "/Service"
    const Case_Folder = target_folder + `/${cls.name}Case`

    fs.mkdirSync(DTO_Folder, {recursive: true})
    fs.mkdirSync(Interface_Folder, {recursive: true})
    fs.mkdirSync(Service_Folder, {recursive: true})
    fs.mkdirSync(Case_Folder, {recursive: true})
    
    generateDTO(model, cls, relations, DTO_Folder)
    generateCrudCase(model, cls, relations, Case_Folder)
    
    fs.writeFileSync(path.join(Interface_Folder, `I${cls.name}Service.cs`), generateCrudInterface(model, cls))
    fs.writeFileSync(path.join(Service_Folder, `${cls.name}Service.cs`), generateCrudService(model, cls))
}

export function generateGetClass(model: Model, cls: LocalEntity, relations: RelationInfo[], target_folder: string): void {
    const DTO_Folder = target_folder + "/DTOs"
    const Interface_Folder = target_folder + "/Interface"
    const Service_Folder = target_folder + "/Service"
    const Case_Folder = target_folder + `/${cls.name}Case`

    fs.mkdirSync(DTO_Folder, {recursive: true})
    fs.mkdirSync(Interface_Folder, {recursive: true})
    fs.mkdirSync(Service_Folder, {recursive: true})
    fs.mkdirSync(Case_Folder, {recursive: true})
    
    generateDTO(model, cls, relations, DTO_Folder)
    generateGetCase(model, cls, Case_Folder)
    
    fs.writeFileSync(path.join(Interface_Folder, `I${cls.name}Service.cs`), generateGetInterface(model, cls))
    fs.writeFileSync(path.join(Service_Folder, `${cls.name}Service.cs`), generateGetService(model, cls))
}

function generateDTO (model: Model, cls: LocalEntity, relations: RelationInfo[], target_folder: string) : void {
    fs.writeFileSync(path.join(target_folder, `${cls.name}RequestDTO.cs`), generateRequestDTO(model, relations, cls))
    fs.writeFileSync(path.join(target_folder, `${cls.name}ResponseDTO.cs`), generateResponseDTO(model, relations, cls))
}

function generateRequestDTO (model: Model, relations: RelationInfo[], cls: LocalEntity) : string {
    return expandToStringWithNL`
using MediatR;
using ConectaFapes.Common.Domain;

namespace ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.DTOs
{
    public class ${cls.name}RequestDTO : IRequest<TResult<${cls.name}ResponseDTO>>
    {
        public Guid Id {get; set;}
        ${cls.attributes.map(a => generateAttribute(a)).join('\n')}
        ${generateEnum(cls)}
        ${generateRelationsRequest(cls, relations)}
    }
}`
}

function generateResponseDTO (model: Model, relations: RelationInfo[], cls: LocalEntity) : string {
    return expandToStringWithNL`
using ConectaFapes.Common.Application.DTO;
${generateRelationsImportResponse(model, cls, relations)}

namespace ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.DTOs
{
    public class ${cls.name}ResponseDTO : BaseDto
    {
        ${cls.attributes.map(a => generateAttribute(a)).join('\n')}
        ${generateRelationsResponse(cls, relations)}
        ${generateEnum(cls)}
    }
}`
}

function generateCrudInterface (model: Model, cls: LocalEntity) : string {
    return expandToString`
using ${model.configuration?.name}.Domain.Entities;
using ConectaFapes.Common.Application.Interfaces.Services;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.DTOs;

namespace ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.Interface
{
    public interface I${cls.name}Service : IBaseCrudService<${cls.name}RequestDTO, ${cls.name}ResponseDTO, ${cls.name}>
    {
    }
}
`
}

function generateCrudService (model: Model, cls: LocalEntity) : string {
    return expandToString`
using AutoMapper;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.Interface;
using ${model.configuration?.name}.Domain.Entities;
using ${model.configuration?.name}.Domain.Interfaces.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ConectaFapes.Common.Application.Services.BaseCrudService;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.DTOs;

namespace ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.Service
{
    public class ${cls.name}Service :
        BaseCrudService<
            ${cls.name}RequestDTO,
            ${cls.name}ResponseDTO,
            ${cls.name},
            I${cls.name}Repository>, I${cls.name}Service
    {

        public ${cls.name}Service(IMediator mediator, IMapper mapper, I${cls.name}Repository repository) : base(mediator, mapper, repository) { }

    }
}
`
}

function generateGetInterface (model: Model, cls: LocalEntity): string {
    return expandToString`
using ${model.configuration?.name}.Domain.Entities;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.DTOs;
using ${model.configuration?.name}.Application.Interfaces.BaseGetInterface;

namespace ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.Interface
{
    public interface I${cls.name}Service : IBaseGetService<${cls.name}RequestDTO, ${cls.name}ResponseDTO, ${cls.name}>
    {
    }
}
`
}

function generateGetService (model: Model, cls: LocalEntity): string {
    return expandToString`
using AutoMapper;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.Interface;
using ${model.configuration?.name}.Domain.Entities;
using ${model.configuration?.name}.Domain.Interfaces.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.DTOs;
using ${model.configuration?.name}.Application.Services.BaseGetService;

namespace ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.Service
{
    public class ${cls.name}Service :
        BaseGetService<
            ${cls.name}RequestDTO,
            ${cls.name}ResponseDTO,
            ${cls.name},
            I${cls.name}Repository>, I${cls.name}Service
    {

        public ${cls.name}Service(IMediator mediator, IMapper mapper, I${cls.name}Repository repository) : base(mediator, mapper, repository) { }

    }
}
`
}



function generateAttribute(attribute:Attribute): string{
    return expandToString`
    public ${generateTypeAttribute(attribute) ?? 'NOTYPE'} ${capitalizeString(attribute.name)} { get; set; }
    `
}

function generateTypeAttribute(attribute:Attribute): string | undefined {

    if (attribute.type.toString().toLowerCase() === "date"){
        return "DateTime"
    }
    if (attribute.type.toString().toLowerCase() === "cpf"){
        return "String"
    }
    if (attribute.type.toString().toLowerCase() === "boolean"){
      return "bool"
    } 
    if (attribute.type.toString().toLowerCase() === "email"){
        return "String"
    }
    if (attribute.type.toString().toLowerCase() === "file"){
        return "Byte[]"
    }
    if (attribute.type.toString().toLowerCase() === "mobilephonenumber"){
        return "String"
    }
    if (attribute.type.toString().toLowerCase() === "zipcode"){
        return "String"
    }
    if (attribute.type.toString().toLowerCase() === "phonenumber"){
        return "String"
    }
    if (attribute.type.toString().toLowerCase() === "integer"){
      return "int"
    }
    return attribute.type

}

function generateEnum (cls: LocalEntity):string {
    return expandToString`
    ${cls.enumentityatributes.map(enumEntityAtribute =>createEnum(enumEntityAtribute)).join("\n")}
    `
  }

function createEnum(enumEntityAtribute: EnumEntityAtribute):string {
    return expandToString`
    public ${enumEntityAtribute.type.ref?.name} ${capitalizeString(enumEntityAtribute.type.ref?.name || "")} { get; set; }
    `
  }

  function generateRelationsRequest(cls: LocalEntity, relations: RelationInfo[]) : Generated {
  
    const node = new CompositeGeneratorNode()
  
    for(const rel of relations) {
      node.append(generateRelationRequest(cls, rel))
      node.appendNewLine()
    }
    return node
  }

  function generateRelationsResponse(cls: LocalEntity, relations: RelationInfo[]) : Generated {
  
    const node = new CompositeGeneratorNode()
  
    for(const rel of relations) {
      node.append(generateRelation(cls, rel))
      node.appendNewLine()
    }
    return node
  }

  // using Morango.Application.Features.CRUD.AgricultorEntity.DTOs;
  function generateRelationsImportResponse(model: Model, cls: LocalEntity, relations: RelationInfo[]): string {
    let addImport = ""

    for (const rel of relations) {
      addImport += `using ${model.configuration?.name}.Application.Features.CRUD.${rel.tgt.name}Entity.DTOs;\n`
    }

    return addImport
  }
  
  function generateRelation(cls: LocalEntity, {tgt, card, owner}: RelationInfo) : Generated {
    switch(card) {
    case "OneToOne":
      if(owner) {
        return expandToString`
          public Guid ${cls.name}${capitalizeString(tgt.name)}Id { get; set; }
          public virtual ${tgt.name}ResponseDTO ${tgt.name} { get; set; }`
      } else {
        return ''
      }
    case "OneToMany":
      if(owner) {
        return ''
      } else {
        return ''
      }
    case "ManyToOne":
      if(owner) {
        return expandToString`
          public virtual ${tgt.name}ResponseDTO ${tgt.name} { get; set; }
          public Guid ${cls.name}${capitalizeString(tgt.name)}Id { get; set; }`
      } else {
        return ''
      }
    case "ManyToMany":
      if(owner) {
        return expandToString`
          public virtual ICollection<${tgt.name}ResponseDTO>? ${tgt.name}s { get; set;}`
      } else {
        return ''
      }
    }
  }
  
  function generateRelationRequest(cls: LocalEntity, {tgt, card, owner}: RelationInfo) : Generated {
    switch(card) {
    case "OneToOne":
      if(owner) {
        return expandToString`
          public Guid ${cls.name}${capitalizeString(tgt.name)}Id { get; set; }`
      } else {
        return ''
      }
    case "OneToMany":
      if(owner) {
        return ''
      } else {
        return ''
      }
    case "ManyToOne":
      if(owner) {
        return expandToString`
          public Guid ${cls.name}${capitalizeString(tgt.name)}Id { get; set; }`
      } else {
        return ''
      }
    case "ManyToMany":
      if(owner) {
        return ''
      } else {
        return ''
      }
    }
  }