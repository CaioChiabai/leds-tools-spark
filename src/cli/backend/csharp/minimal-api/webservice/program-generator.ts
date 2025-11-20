import path from "path";
import fs from "fs";
import { LocalEntity, Model, Module, isLocalEntity, isModule,  } from "../../../../../language/generated/ast.js";
import { expandToStringWithNL } from "langium/generate";
import { capitalizeString } from "../../../../util/generator-utils.js";

// ---------- helper: gerar XML-doc para endpoints ----------
function renderEndpointDoc(
    entityName: string,
    opName: string,
    params: Array<{ name: string; type?: string }>,
    returnType?: string,
    opts?: { layer?: string; generatedNote?: string }
): string {
    const layer = opts?.layer ?? "endpoint";
    const generatedNote = opts?.generatedNote ?? "gerado por leds-tools-spark";

    const lines: string[] = [];

    // summary
    lines.push("/// <summary>");
    let summary = "";
    switch (opName) {
        case "GetAll":
            summary = `Lista todos os ${entityName}`;
            break;
        case "GetById":
            summary = `Obtém ${entityName} por id`;
            break;
        case "Post":
            summary = `Cria um ${entityName}`;
            break;
        case "Put":
            summary = `Atualiza um ${entityName}`;
            break;
        case "Delete":
            summary = `Remove um ${entityName} por id`;
            break;
        default:
            summary = `${opName} ${entityName}`;
            break;
    }
    lines.push(`/// ${summary}`);
    lines.push("/// </summary>");

    // params
    for (const p of params) {
        lines.push(`/// <param name="${p.name}">${p.type ?? ""}</param>`);
    }

    // returns
    if (returnType && returnType.toLowerCase() !== "void") {
        lines.push(`/// <returns>${returnType}</returns>`);
    }

    // remarks
    const remarks = [
        `@generated ${generatedNote}`,
        `@layer ${layer}`,
        `@entity ${entityName}`,
        `@operation ${opName}`,
    ].join(" | ");

    lines.push(`/// <remarks>${remarks}</remarks>`);

    return lines.join("\n");
}

export function generate(model: Model, target_folder: string) : void{7
    console.log(model.configuration?.feature)

    fs.writeFileSync(path.join(target_folder, `Program.cs`), generateProgram(model, target_folder))
}

function generateProgram(model: Model, target_folder: string) : string {

    const modules = model.abstractElements.filter(isModule);
    const features = model.configuration?.feature;


    return expandToStringWithNL`
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Shared;
    
    // modules
    ${generateModuleNames(modules)}

    internal class Program
    {
        private static void Main(String[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddDbContext<ContextDb>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("${capitalizeString(model.configuration?.name || "model")}Connection")));
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            ${generateFeatureBuilder(features)}

            var app = builder.Build();

            // Automatically apply migrations at startup
            CreateDatabase(app);

            void CreateDatabase(WebApplication app)
            {
                var serviceScope = app.Services.CreateScope();
                var dataContext = serviceScope.ServiceProvider.GetService<ContextDb>();
                dataContext?.Database.EnsureCreated();
                dataContext?.Database.Migrate();
            }

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Mapgroups:
            ${generateMapGroups(features, modules, (model.configuration as any)?.gerarComentarios !== false)}
            app.MapGet("/", () => "Hello World!");
            ${generateFeatureCors(features)}
            app.Run();
        }
    }
    `
}


function generateModuleNames(modules: Module[]) : string {
    let moduleNames = "";
    for (const mod of modules) {
      moduleNames += `using ${mod.name}; \n`;
    }
    return moduleNames;
  
}
  
function generateMapGroups(
    features: string | undefined,
    modules: Module[],
    gerarComentarios = true
): string {
    let mapGroups = "";

    if (features === "authentication") {
        mapGroups += `// Authentication Mapgroup
app.MapGroup("/identity").MapIdentityApi<IdentityUser>();\n\n`;
    }

    function pluralize(n: string) {
        return `${n}s`;
    }

    function opName(entity: string, op: string) {
        switch (op) {
            case "GetAll":
                return `Listar${entity}s`;
            case "GetById":
                return `Obter${entity}PorId`;
            case "Post":
                return `Criar${entity}`;
            case "Put":
                return `Atualizar${entity}`;
            case "Delete":
                return `Remover${entity}`;
            default:
                return `${op}${entity}`;
        }
    }

    for (const mod of modules) {
        const modVar = mod.name.toLowerCase();
        mapGroups += `var ${modVar} = app.MapGroup("/${mod.name}");\n\n`;

        const entities = mod.elements.filter(isLocalEntity);

        for (const cls of entities) {
            const entity = cls.name;
            const groupVar = entity.toLowerCase();
            const dbSet = pluralize(entity);

            // HANDLER: GET ALL
            {
                const method = opName(entity, "GetAll");
                const params = [{ name: "db", type: "ContextDb" }];
                const doc = gerarComentarios
                    ? renderEndpointDoc(entity, "GetAll", params, `${entity}[]`) + "\n"
                    : "";

                mapGroups += `${doc}static async Task<IResult> ${method}(ContextDb db) =>
    Results.Ok(await db.${dbSet}.ToListAsync());\n\n`;
            }

            // HANDLER: GET BY ID
            {
                const method = opName(entity, "GetById");
                const params = [
                    { name: "id", type: "int" },
                    { name: "db", type: "ContextDb" },
                ];

                const doc = gerarComentarios
                    ? renderEndpointDoc(entity, "GetById", params, entity) + "\n"
                    : "";

                mapGroups += `${doc}static async Task<IResult> ${method}(int id, ContextDb db) =>
    await db.${dbSet}.FindAsync(id) is ${entity} item ? Results.Ok(item) : Results.NotFound();\n\n`;
            }

            // HANDLER: POST
            {
                const method = opName(entity, "Post");
                const paramName = entity.toLowerCase();

                const params = [
                    { name: paramName, type: entity },
                    { name: "db", type: "ContextDb" },
                ];

                const doc = gerarComentarios
                    ? renderEndpointDoc(entity, "Post", params, entity) + "\n"
                    : "";

                mapGroups += `${doc}static async Task<IResult> ${method}(${entity} ${paramName}, ContextDb db) {
    db.${dbSet}.Add(${paramName});
    await db.SaveChangesAsync();
    return Results.Created($"/${paramName}/{${paramName}.Id}", ${paramName});
}\n\n`;
            }

            // HANDLER: PUT
            {
                const method = opName(entity, "Put");
                const params = [
                    { name: "id", type: "int" },
                    { name: `input${entity}`, type: entity },
                    { name: "db", type: "ContextDb" },
                ];

                const doc = gerarComentarios
                    ? renderEndpointDoc(entity, "Put", params, "IResult") + "\n"
                    : "";

                const updateCode =
                    typeof generateInputs === "function"
                        ? generateInputs(cls)
                        : "";

                mapGroups += `${doc}static async Task<IResult> ${method}(int id, ${entity} input${entity}, ContextDb db) {
    var item = await db.${dbSet}.FindAsync(id);
    if (item is null) return Results.NotFound();
${updateCode}
    await db.SaveChangesAsync();
    return Results.NoContent();
}\n\n`;
            }

            // HANDLER: DELETE
            {
                const method = opName(entity, "Delete");
                const params = [
                    { name: "id", type: "int" },
                    { name: "db", type: "ContextDb" },
                ];

                const doc = gerarComentarios
                    ? renderEndpointDoc(entity, "Delete", params, "IResult") + "\n"
                    : "";

                mapGroups += `${doc}static async Task<IResult> ${method}(int id, ContextDb db) {
    if (await db.${dbSet}.FindAsync(id) is ${entity} item) {
        db.${dbSet}.Remove(item);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
    return Results.NotFound();
}\n\n`;
            }

            // MAPEAMENTO DAS ROTAS
            mapGroups += `var ${groupVar} = ${modVar}.MapGroup("/${entity}");\n`;
            mapGroups += `${groupVar}.MapGet("/", ${opName(entity, "GetAll")});\n`;
            mapGroups += `${groupVar}.MapGet("/{id}", ${opName(entity, "GetById")});\n`;
            mapGroups += `${groupVar}.MapPost("/", ${opName(entity, "Post")});\n`;
            mapGroups += `${groupVar}.MapPut("/{id}", ${opName(entity, "Put")});\n`;
            mapGroups += `${groupVar}.MapDelete("/{id}", ${opName(entity, "Delete")});\n\n`;
        }
    }

    return mapGroups;
}

function generateInputs(classe : LocalEntity) : string {    

    let inputs = "";
    for (const att of classe.attributes) {
        inputs += `\n        ${classe.name.toLowerCase()}.${capitalizeString(att.name)} = input${classe.name}.${capitalizeString(att.name)};`
    }
    return inputs;
}

function generateFeatureBuilder(features: string | undefined) : string {
    if (features == 'authentication'){
        return expandToStringWithNL`
        // Authentication Builder
        builder.Services.AddIdentityApiEndpoints<IdentityUser>()
            .AddEntityFrameworkStores<ContextDb>();
        
        builder.Services.AddCors();
        builder.Services.AddAuthorization();`
    }
    return '';
}

function generateFeatureCors(features: string | undefined) : string {
    if (features == 'authentication'){
        return expandToStringWithNL`
        app.UseCors();`
    }
    return '';
}