// Essa pasta vai de arrasta pra cima

import { expandToStringWithNL } from "langium/generate";
import { LocalEntity, Model, UseCase, /*Event*/ } from "../../../../../../language/generated/ast.js"
import fs from "fs"
import path from "path";
export function generate(model: Model, listClassCRUD: LocalEntity[], listRefCRUD: LocalEntity[], listUCsNotCRUD: UseCase[], target_folder: string) : void {
    const BaseGet_Folder = target_folder + "/BaseGetService"

    fs.mkdirSync(BaseGet_Folder, {recursive: true})

    fs.writeFileSync(path.join(target_folder,`BaseGetService.cs`), generateBaseGetService(model))
    // fs.writeFileSync(path.join(target_folder,`BaseService.cs`), generateBaseService(model))

    // for(const uc of listUCsNotCRUD) {
    //     let uc_folder = `${target_folder}/${uc.name_fragment}` 
    //     fs.mkdirSync(uc_folder, {recursive: true})
    //     for (const event of uc.events){
    //         fs.writeFileSync(path.join(uc_folder,`${event.name_fragment}Service.cs`), generateGenericService(model, event))
    //     }
    // }
}

// function generateGenericService(model: Model, event: Event) : string {
//     return expandToStringWithNL`
// using AutoMapper;
// using ${model.configuration?.name}.Application.DTOs.Entities.Request;
// using ${model.configuration?.name}.Application.DTOs.Entities.Response;
// using ${model.configuration?.name}.Application.DTOs.Common;
// using ${model.configuration?.name}.Application.Interfaces.Entities;
// using ${model.configuration?.name}.Domain.Entities;
// using ${model.configuration?.name}.Domain.Interfaces.Entities;
// using MediatR;
// using Microsoft.EntityFrameworkCore;

// namespace ${model.configuration?.name}.Application.Services.Entities
// {
//     public class ${event.name_fragment}Service :
//         BaseService<
//             BaseRequestDTO,
//             BaseResponseDTO,         
//             IBaseRepository>
//     {

//         public ${event.name_fragment}Service(IMediator mediator, IMapper mapper, IBaseRepository repository) : base(mediator, mapper, repository) { }

//     }
// }`
// }

function generateBaseGetService(model: Model): string {
    return expandToStringWithNL`
using AutoMapper;
using AutoMapper.QueryableExtensions;

using MediatR;
using Microsoft.EntityFrameworkCore;
using ConectaFapes.Common.Application.DTO;
using ConectaFapes.Common.Domain.BaseEntities;
using ConectaFapes.Common.Infrastructure.Interfaces;
using ${model.configuration?.name}.Application.Interfaces.BaseGetInterface;

namespace ${model.configuration?.name}.Application.Services.BaseGetService
{
    public class BaseGetService<Request, Response, Entity, Repository> : IBaseGetService<Request, Response, Entity>
       where Entity : BaseEntity
       where Response : BaseDto
       where Repository : IBaseRepository<Entity>
    {
        protected readonly IMediator _mediator;
        protected readonly IMapper _mapper;
        protected readonly Repository _repository;

        public BaseGetService(IMediator mediator, IMapper mapper, Repository repository)
        {
            _mediator = mediator;
            _mapper = mapper;
            _repository = repository;
        }
        public virtual ICollection<Response> GetAll()
        {
            var result = _mapper.Map<ICollection<Response>>(_repository.GetAllAsNoTracking());
            return result;
        }

        public virtual Response GetById(Guid id)
        {
            var result = _mapper.Map<Response>(_repository.GetByIdAsNoTracking(id).FirstOrDefault());
            return result;
        }
    }
}`
}

// function generateBaseService(model: Model): string {
//     return expandToStringWithNL`
// using AutoMapper;
// using AutoMapper.QueryableExtensions;
// using ConectaFapes.Common.Application.DTO;
// using ConectaFapes.Common.Domain.BaseEntities;
// using ConectaFapes.Common.Infrastructure.Interfaces;
// using ${model.configuration?.name}.Application.Interfaces;
// using MediatR;
// using Microsoft.EntityFrameworkCore;

// namespace ${model.configuration?.name}.Application.Services
// {
//     public class BaseService<Request, Response, Repository>
//        where Response : BaseDto
//        where Repository : IBaseRepository<Entity>
//     {
//         protected readonly IMediator _mediator;
//         protected readonly IMapper _mapper;
//         protected readonly Repository _repository;

//         public BaseService(IMediator mediator, IMapper mapper, Repository repository)
//         {
//             _mediator = mediator;
//             _mapper = mapper;
//             _repository = repository;
//         }
//     }
// }`
// }