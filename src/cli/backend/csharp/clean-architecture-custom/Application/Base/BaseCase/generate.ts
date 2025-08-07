import { expandToString } from "langium/generate";
import { Model } from "../../../../../../../language/generated/ast.js"
import fs from "fs"
import path from "path";

export function generate(model: Model, target_folder: string) : void {
    
    fs.writeFileSync(path.join(target_folder,`CreateHandler.cs`), BaseCreateHandler(model))
    fs.writeFileSync(path.join(target_folder,`DeleteHandler.cs`), BaseDeleteHandler(model))
    fs.writeFileSync(path.join(target_folder,`UpdateHandler.cs`), BaseUpdateHandler(model))
    fs.writeFileSync(path.join(target_folder,`GetAllHandler.cs`), BaseGetAllHandler(model))
    fs.writeFileSync(path.join(target_folder,`GetByIdHandler.cs`), BaseGetbyIdHandler(model))

}

function BaseCreateHandler (model: Model): string {
    return expandToString`
using AutoMapper;
using ConectaFapes.Common.Application.DTO;
using ConectaFapes.Common.Application.Interfaces.Services;
using ConectaFapes.Common.Domain;
using ConectaFapes.Common.Domain.BaseEntities;
using ConectaFapes.Common.Infrastructure.Interfaces;
using MediatR;

namespace ${model.configuration?.name}.Application.Base.BaseCase
{
    public class CreateHandler<IService, CreateRequest, Request, Response, Entity> : IRequestHandler<CreateRequest, TResult<Response>>
        where Entity : BaseEntity
        where Response : BaseDto
        where CreateRequest : IRequest<TResult<Response>>
        where Request : IRequest<TResult<Response>>
        where IService : IBaseCrudService<Request, Response, Entity>
    {
        protected readonly IUnitOfWork _unitOfWork;
        protected readonly IService _service;
        protected readonly IMapper _mapper;

        public CreateHandler(IUnitOfWork unitOfWork, IService service, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _service = service;
            _mapper = mapper;
        }

        public async Task<TResult<Response>> Handle(CreateRequest createRequest, CancellationToken cancellationToken)
        {
            var request = _mapper.Map<Request>(createRequest);
            var response = await _service.Create(request, cancellationToken);
            await _unitOfWork.Commit(cancellationToken);
            return response;
        }
    }
}`
}

function BaseDeleteHandler (model: Model): string {
    return expandToString`
using AutoMapper;
using ConectaFapes.Common.Application.DTO;
using ConectaFapes.Common.Application.Interfaces.Services;
using ConectaFapes.Common.Domain.BaseEntities;
using ConectaFapes.Common.Domain;
using MediatR;
using ConectaFapes.Common.Infrastructure.Interfaces;

namespace ${model.configuration?.name}.Application.Base.BaseCase
{
    public class DeleteHandler<IService, DeleteRequest, Request, Response, Entity> : IRequestHandler<DeleteRequest, TResult<Response>>
        where Entity : BaseEntity
        where Response : BaseDto
        where Request : IRequest<TResult<Response>>
        where DeleteRequest : IRequest<TResult<Response>>
        where IService : IBaseCrudService<Request, Response, Entity>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IService _service;
        private readonly IMapper _mapper;

        public DeleteHandler(IUnitOfWork unitOfWork, IService service, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _service = service;
            _mapper = mapper;
        }

        public async Task<TResult<Response>> Handle(DeleteRequest deleteRequest, CancellationToken cancellationToken)
        {
            var request = _mapper.Map<Entity>(deleteRequest);
            var response = await _service.Delete(request.Id, cancellationToken);
            await _unitOfWork.Commit(cancellationToken);
            return response;
        }
    }
}`
}

function BaseUpdateHandler (model: Model): string {
    return expandToString`
using AutoMapper;
using ConectaFapes.Common.Application.DTO;
using ConectaFapes.Common.Application.Interfaces.Services;
using ConectaFapes.Common.Domain;
using ConectaFapes.Common.Domain.BaseEntities;
using ConectaFapes.Common.Infrastructure.Interfaces;
using MediatR;

namespace ${model.configuration?.name}.Application.Base.BaseCase
{
    public class UpdateHandler<IService, UpdateRequest, Request, Response, Entity> : IRequestHandler<UpdateRequest, TResult<Response>>
        where Entity : BaseEntity
        where Response : BaseDto
        where UpdateRequest : IRequest<TResult<Response>>
        where Request : IRequest<TResult<Response>>
        where IService : IBaseCrudService<Request, Response, Entity>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IService _service;
        private readonly IMapper _mapper;

        public UpdateHandler(IUnitOfWork unitOfWork, IService service, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _service = service;
            _mapper = mapper;
        }

        public async Task<TResult<Response>> Handle(UpdateRequest updateRequest, CancellationToken cancellationToken)
        {
            var request = _mapper.Map<Request>(updateRequest);
            var response = await _service.Update(request, cancellationToken);
            await _unitOfWork.Commit(cancellationToken);
            return response;
        }
    }
}`
}

function BaseGetAllHandler(model: Model){
    return expandToString`
using ConectaFapes.Common.Application.DTO;
using ConectaFapes.Common.Application.Interfaces.Services;
using ConectaFapes.Common.Domain;
using ConectaFapes.Common.Domain.BaseEntities;
using MediatR;

namespace ${model.configuration?.name}.Application.Base.BaseCase
{
    public class GetAllHandler<IService, GetRequest, Request, Response, Entity> : IRequestHandler<GetRequest, ICollection<Response>>
        where Entity : BaseEntity
        where Response : BaseDto
        where GetRequest : IRequest<ICollection<Response>>
        where Request : IRequest<TResult<Response>>
        where IService : IBaseCrudService<Request, Response, Entity>
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
}`
}

function BaseGetbyIdHandler(model: Model){
    return expandToString`
using AutoMapper;
using ConectaFapes.Common.Application.DTO;
using ConectaFapes.Common.Application.Interfaces.Services;
using ConectaFapes.Common.Domain;
using ConectaFapes.Common.Domain.BaseEntities;
using MediatR;

namespace ${model.configuration?.name}.Application.Base.BaseCase
{
    public class GetByIdHandler<IService, GetRequest, Request, Response, Entity> : IRequestHandler<GetRequest, Response>
        where Entity : BaseEntity
        where Response : BaseDto
        where GetRequest : IRequest<Response>
        where Request : IRequest<TResult<Response>>
        where IService : IBaseCrudService<Request, Response, Entity>
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
}`
}