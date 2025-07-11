import { expandToString } from "langium/generate"
import { LocalEntity, Model } from "../../../../../../../language/generated/ast.js"

export function generateCRUD(model: Model, cls: LocalEntity): string {
    return expandToString`
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.${cls.name}Case.Create;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.${cls.name}Case.Delete;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.${cls.name}Case.GetAll;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.${cls.name}Case.GetById;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.${cls.name}Case.Update;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.DTOs;
using ${model.configuration?.name}.WebApi.Controllers.BaseControllers;

namespace ${model.configuration?.name}.WebApi.Controllers.Entities
{
    [Route("api/${model.configuration?.name}/${cls.name}")]
    [ApiController]
    public class ${cls.name}Controller : BaseCrudController
        <GetAll${cls.name}Command,
        GetById${cls.name}Command,
        Create${cls.name}Command,
        Update${cls.name}Command,
        Delete${cls.name}Command,
        ${cls.name}ResponseDTO>
    {
        public ${cls.name}Controller(IMediator mediator, IMapper mapper, ILogger<BaseController> logger) : base(mediator, mapper, logger)
        {
        }
    }
}`
}

export function generateGet(model: Model, cls: LocalEntity): string {
    return expandToString`
using AutoMapper;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.DTOs;
using ${model.configuration?.name}.WebApi.Controllers.BaseControllers;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.${cls.name}Case.GetAll;
using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.${cls.name}Case.GetById;

namespace ${model.configuration?.name}.WebApi.Controllers.Entities
{
    [Route("api/${model.configuration?.name}/${cls.name}")]
    [ApiController]
    public class ${cls.name}Controller : BaseGetController
        <GetAll${cls.name}Command,
        GetById${cls.name}Command,
        ${cls.name}ResponseDTO>
    {
        public ${cls.name}Controller(IMediator mediator, IMapper mapper, ILogger<BaseController> logger) : base(mediator, mapper, logger)
        {
        }
    }
}`
}