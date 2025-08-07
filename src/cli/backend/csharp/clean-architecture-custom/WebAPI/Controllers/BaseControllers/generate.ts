import path from "path"
import { expandToStringWithNL } from "langium/generate"
import { Model } from "../../../../../../../language/generated/ast.js"
import fs from "fs"

export function generate(model: Model, target_folder: string) : void {
  fs.writeFileSync(path.join(target_folder, `BaseController.cs`), generateBaseController(model))
  fs.writeFileSync(path.join(target_folder, `ControllerResult.cs`), generateControllerResult(model))
  fs.writeFileSync(path.join(target_folder, `CrudController.cs`), generateCrudController(model))
  fs.writeFileSync(path.join(target_folder, `GetController.cs`), generateGetController(model))
}

function generateBaseController(model: Model) : string {
  return expandToStringWithNL`
﻿using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace ${model.configuration?.name}.WebApi.Controllers.BaseControllers
{
    public abstract class BaseController : BaseControllerResult
    {

        protected readonly IMapper _mapper;
        protected readonly ILogger _logger;
        protected readonly IMediator _mediator;

        public BaseController(IMediator mediator, IMapper mapper, ILogger<BaseController> logger)
        {
            _mediator = mediator;
            _mapper = mapper;
            _logger = logger;
        }
    }
}
`
}

function generateControllerResult(model: Model) : string {
  return expandToStringWithNL`
﻿using ConectaFapes.Common.Domain;
using ConectaFapes.Common.Domain.ResultEntities.Enum;
using ConectaFapes.Common.Utils.Responses;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ${model.configuration?.name}.WebApi.Controllers.BaseControllers
{
    public abstract class BaseControllerResult : Controller
    {
        /// <summary>
        /// Caso de sucesso: OkResult
        /// Caso de Erro: BadRequest
        /// </summary>
        /// <param name="result"></param>
        /// <returns>ObjectResult</returns>
        public virtual ObjectResult ApiOkResult<T>(TResult<T> result)
        {
            if (!result.IsSuccess)
            {
                return ApiBadRequestResult(result);
            }

            var apiResponse = result.Value is null ? new ApiResponse(200, "Requisicao realizada com sucesso!") :
                new ApiResponse(200, "Requisicao realizada com sucesso!", result.Value!);

            if (apiResponse != null)
            {
                var objectResult = new OkObjectResult(apiResponse);
                objectResult.StatusCode = apiResponse.StatusCode;
                return objectResult;
            }

            return Ok(apiResponse);
        }

        /// <summary>
        /// Caso de Sucesso: Retorna um CreateResult com URI.
        /// Caso de Erro: Retorna um BadRequest.
        /// </summary>
        /// <param name="result"></param>
        /// <returns>ObjectResult</returns>
        public virtual ObjectResult ApiCreateResult<T>(TResult<T> result, Guid EntityId, HttpRequest request)
        {
            if (!result.IsSuccess || result.Value == null)
            {
                return ApiBadRequestResult(result);
            }

            var apiResponse = new ApiResponse(201, EntityId.ToString(), "Item criado com sucesso!");

            if (result != null)
            {
                adicionarURI(apiResponse.StatusCode);
                var objectResult = new OkObjectResult(apiResponse);
                objectResult.StatusCode = apiResponse.StatusCode;
                return objectResult;
            }

            void adicionarURI(int statusCode)
            {
                apiResponse.Uri = statusCode == 201 ? string.Concat(request.Path, "/", apiResponse.Uri) : request.Path;
            }

            return Ok(apiResponse);
        }

        /// <summary>
        /// Retorna um BadRequest
        /// </summary>
        /// <param name="result"></param>
        /// <returns>ObjectResult</returns>
        public virtual ObjectResult ApiBadRequestResult<T>(TResult<T> result)
        {
            int statusCode = result.Type.Equals(ResultType.BAD_REQUEST) ? 400 : 404;
            var apiResponse = new ApiResponse(statusCode, result.Type.ToString()!, result.Errors);
            var badRequest = new BadRequestObjectResult(apiResponse);
            badRequest.StatusCode = apiResponse.StatusCode;
            return badRequest;
        }
    }
}`
}

function generateCrudController(model: Model) : string {
  return expandToStringWithNL`
﻿using AutoMapper;
using ConectaFapes.Common.Application.DTO;
using ConectaFapes.Common.Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace ${model.configuration?.name}.WebApi.Controllers.BaseControllers
{
    public abstract class BaseCrudController<GetAllCommand, GetByIdCommand, CreateCommand, UpdateCommand, DeleteCommand, Response>
        : BaseController
        where Response : BaseDto
        where GetAllCommand : IRequest<ICollection<Response>>, new()
        where GetByIdCommand : IRequest<Response>
        where CreateCommand : IRequest<TResult<Response>>
        where UpdateCommand : IRequest<TResult<Response>>
        where DeleteCommand : IRequest<TResult<Response>>
    {
        public BaseCrudController(IMediator mediator, IMapper mapper, ILogger<BaseController> logger) : base(mediator, mapper, logger)
        {
        }

        [HttpGet]
        public virtual async Task<ICollection<Response>> GetAll()
        {
            _logger.LogInformation($"Requisicao: {Request.Method} - {Request.Path}");

            var stopwatch = Stopwatch.StartNew();
            var response = await _mediator.Send(new GetAllCommand(), new CancellationToken());
            stopwatch.Stop();

            _logger.LogInformation($"A requisicao foi realizada com sucesso | Tempo: {stopwatch.ElapsedMilliseconds} ms");
            return response;
        }

        [HttpGet("{id}")]
        public virtual async Task<Response> GetById(Guid id)
        {
            _logger.LogInformation($"Requisicao: {Request.Method} - {Request.Path}");

            var stopwatch = Stopwatch.StartNew();
            var response = await _mediator.Send(_mapper.Map<GetByIdCommand>(id), new CancellationToken());
            stopwatch.Stop();

            _logger.LogInformation($"A requisicao foi realizada com sucesso | Tempo: {stopwatch.ElapsedMilliseconds} ms");
            return response;
        }

        [HttpPost]
        public virtual async Task<ActionResult> Create(CreateCommand Command, CancellationToken cancellationToken)
        {
            _logger.LogInformation($"Requisicao: {Request.Method} - {Request.Path} | Recebeu como parametro: {Command}");

            if (Command == null)
            {
                string error = "O corpo da requisicao nao pode ser vazio";
                _logger.LogError(error);
                return BadRequest(error);
            }

            var stopwatch = Stopwatch.StartNew();
            var response = await _mediator.Send(Command, cancellationToken);
            stopwatch.Stop();

            if (!response.IsSuccess || response.Value == null || response.Value.Id == Guid.Empty)
            {
                _logger.LogError($"O processo falhou, Mensagem: {response.Errors.FirstOrDefault()} - Erros: {response.Errors}");
                return ApiBadRequestResult(response);
            }

            _logger.LogInformation($"A requisicao foi realizada com sucesso | Item Criado: {response.Value} | Tempo: {stopwatch.ElapsedMilliseconds} ms");
            return ApiCreateResult(response, response.Value.Id, Request);
        }

        [HttpPut("{id}")]
        public virtual async Task<ActionResult> Update(Guid id, UpdateCommand Command, CancellationToken cancellationToken)
        {
            _logger.LogInformation($"Requisicao: {Request.Method} - {Request.Path} | Recebeu como parametro: {Command}");

            if (Command == null)
            {
                string error = "O corpo da requisicao nao pode ser vazio";
                _logger.LogError(error);
                return BadRequest(error);
            }

            var stopwatch = Stopwatch.StartNew();
            var response = await _mediator.Send(Command, cancellationToken);
            stopwatch.Stop();

            if (!response.IsSuccess)
            {
                _logger.LogError($"O processo falhou, Mensagem: {response.Errors.FirstOrDefault()} - Erros: {response.Errors}");
                return ApiBadRequestResult(response);
            }

            _logger.LogInformation($"A requisicao foi realizada com sucesso | Item Atualizado: {response.Value} | Tempo: {stopwatch.ElapsedMilliseconds} ms");
            return ApiOkResult(response);
        }

        [HttpDelete("{id}")]
        public virtual async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            _logger.LogInformation($"Requisicao:  {Request.Method} -  {Request.Path} recebeu como parametro: {id}");

            if (id == Guid.Empty)
            {
                string error = "Id nao pode ser vazio";
                _logger.LogError(error);
                return BadRequest(error);
            }

            var stopwatch = Stopwatch.StartNew();
            var Command = _mapper.Map<DeleteCommand>(id);
            var response = await _mediator.Send(Command, cancellationToken);
            stopwatch.Stop();

            if (!response.IsSuccess)
            {
                _logger.LogError($"O processo falhou, Mensagem: {response.Errors.FirstOrDefault()} - Erros: {response.Errors}");
                return ApiBadRequestResult(response);
            }

            _logger.LogInformation($"A requisicao foi realizada com sucesso | Item Deletado: {id} | Tempo: {stopwatch.ElapsedMilliseconds} ms");
            return ApiOkResult(response);
        }
    }
}
  `
}

function generateGetController(model: Model) : string {
    return expandToStringWithNL`
using AutoMapper;
using ConectaFapes.Common.Application.DTO;
using ConectaFapes.Common.Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace ${model.configuration?.name}.WebApi.Controllers.BaseControllers
{
    public abstract class BaseGetController<GetAllCommand, GetByIdCommand, Response>
        : BaseController
        where Response : BaseDto
        where GetAllCommand : IRequest<ICollection<Response>>, new()
        where GetByIdCommand : IRequest<Response>
    {
        public BaseGetController(IMediator mediator, IMapper mapper, ILogger<BaseController> logger) : base(mediator, mapper, logger)
        {
        }

        [HttpGet]
        public virtual async Task<ICollection<Response>> GetAll()
        {
            _logger.LogInformation($"Requisicao: {Request.Method} - {Request.Path}");

            var stopwatch = Stopwatch.StartNew();
            var response = await _mediator.Send(new GetAllCommand(), new CancellationToken());
            stopwatch.Stop();

            _logger.LogInformation($"A requisicao foi realizada com sucesso | Tempo: {stopwatch.ElapsedMilliseconds} ms");
            return response;
        }

        [HttpGet("{id}")]
        public virtual async Task<Response> GetById(Guid id)
        {
            _logger.LogInformation($"Requisicao: {Request.Method} - {Request.Path}");

            var stopwatch = Stopwatch.StartNew();
            var response = await _mediator.Send(_mapper.Map<GetByIdCommand>(id), new CancellationToken());
            stopwatch.Stop();

            _logger.LogInformation($"A requisicao foi realizada com sucesso | Tempo: {stopwatch.ElapsedMilliseconds} ms");
            return response;
        }
    }
}
    `
}
