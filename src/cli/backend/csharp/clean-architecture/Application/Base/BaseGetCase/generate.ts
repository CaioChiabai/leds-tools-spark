import { Model } from "../../../../../../../language/generated/ast.js";
import fs from "fs";
import { expandToString } from "langium/generate";
import path from "path";

// Criar Handlers base de Create, Delete, GetAll, GetById e Update
export function generate (model: Model, target_folder: string) : void {
    fs.writeFileSync(path.join(target_folder,`GetAllHandler.cs`), generateBaseGetAllHandler(model))
    fs.writeFileSync(path.join(target_folder,`GetByIdHandler.cs`), generateBaseGetbyIdHandler(model))
}

function generateBaseGetAllHandler (model: Model) : string {
    return expandToString`
using ConectaFapes.Common.Application.DTO;
using ConectaFapes.Common.Domain.BaseEntities;
using ConectaFapes.Common.Domain;
using MediatR;
using ${model.configuration?.name}.Application.Interfaces.BaseGetInterface;

namespace ${model.configuration?.name}.Application.Base.BaseGetCase
{
    public class GetAllHandler<IService, GetRequest, Request, Response, Entity> : IRequestHandler<GetRequest, ICollection<Response>>
        where Entity : BaseEntity
        where Response : BaseDto
        where GetRequest : IRequest<ICollection<Response>>
        where Request : IRequest<TResult<Response>>
        where IService : IBaseGetService<Request, Response, Entity>
    {
        protected readonly IService _service;

        public GetAllHandler(IService service)
        {
            _service = service;
        }


        public async Task<ICollection<Response>> Handle(GetRequest getRequest, CancellationToken cancellationToken)
        {
            return await Task.Run(() => _service.GetAll(), cancellationToken);
        }
    }
}
`
}

function generateBaseGetbyIdHandler (model: Model) : string {
    return expandToString`
using AutoMapper;
using ConectaFapes.Common.Application.DTO;
using ConectaFapes.Common.Domain;
using ConectaFapes.Common.Domain.BaseEntities;
using MediatR;
using ${model.configuration?.name}.Application.Interfaces.BaseGetInterface;

namespace ${model.configuration?.name}.Application.Base.BaseGetCase
{
    public class GetByIdHandler<IService, GetRequest, Request, Response, Entity> : IRequestHandler<GetRequest, Response>
        where Entity : BaseEntity
        where Response : BaseDto
        where GetRequest : IRequest<Response>
        where Request : IRequest<TResult<Response>>
        where IService : IBaseGetService<Request, Response, Entity>
    {

        protected readonly IService _service;
        protected readonly IMapper _mapper;

        public GetByIdHandler(IService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        public async Task<Response> Handle(GetRequest request, CancellationToken cancellationToken)
        {
            var entity = _mapper.Map<Entity>(request);
            return await Task.Run(() => _service.GetById(entity.Id), cancellationToken);
        }
    }
}
`
}