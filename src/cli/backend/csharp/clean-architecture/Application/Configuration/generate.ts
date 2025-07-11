import { expandToString } from "langium/generate"
import { LocalEntity, Model, UseCase} from "../../../../../../language/generated/ast.js"
import fs from "fs"
import path from "path"

export function generate(model: Model, listClassRefCRUD: LocalEntity[], listUCsNotCRUD: UseCase[], target_folder: string) : void {

    fs.writeFileSync(path.join(target_folder,"ServiceExtensions.cs"), 
    generateServiceExtensions(model, listClassRefCRUD, listUCsNotCRUD))
}

function generateAdd(model: Model, listClassRefCRUD: LocalEntity[], listUCsNotCRUD: UseCase[]) : string {

    let adds = ""

    for(const cls of listClassRefCRUD) {
        adds += `services.AddScoped<I${cls.name}Service, ${cls.name}Service>();\n`
    }

    for(const uc of listUCsNotCRUD) {
        for(const event of uc.events) {
            adds += `services.AddScoped<I${event.name_fragment}Service, ${event.name_fragment}Service>();\n`
        }
    }
    return adds
}

function generateAddImports(model: Model, listClassRefCRUD: LocalEntity[], listUCsNotCRUD: UseCase[]): string {
    let addImport = ""

    for (const cls of listClassRefCRUD) {
        addImport += `using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.Interface;\n`
        addImport += `using ${model.configuration?.name}.Application.Features.CRUD.${cls.name}Entity.Service;\n`
    }

    for (const uc of listUCsNotCRUD) {
        for (const event of uc.events) {
            addImport += `using ${model.configuration?.name}.Application.Features.${uc.name_fragment}Case.${event.name_fragment}.Interfaces;\n`
            addImport += `using ${model.configuration?.name}.Application.Features.${uc.name_fragment}Case.${event.name_fragment}.Services;\n`
        }
    }

    return addImport
}

function generateServiceExtensions(model: Model, listClassRefCRUD: LocalEntity[], listUCsNotCRUD: UseCase[]) : string {
    return expandToString`
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
${generateAddImports(model, listClassRefCRUD, listUCsNotCRUD)}

using ${model.configuration?.name}.Application.Shared.Behavior;
using System.Reflection;

namespace ${model.configuration?.name}.Application.Services
{
    public static class ServiceExtensions
    {
        public static void ConfigureApplicationApp(this IServiceCollection services)
        {
            services.AddAutoMapper(Assembly.GetExecutingAssembly());
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

            ${generateAdd(model, listClassRefCRUD, listUCsNotCRUD)}
        }
    }
}`
}