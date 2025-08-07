import { isUseCasesModel, isUseCase, Model, UseCase, LocalEntity, isModule, isLocalEntity  } from '../language/generated/ast.js';
import { GenerateOptions } from './main.js';
import { generate as pythonGenerate } from './backend/python/generator.js';
import { generate as javaGenerate } from './backend/java/generator.js';
import { generate as docGenerate} from './documentation/generator.js';
import { generate as vueVitegenerate} from './frontend/vue-vite/generate.js';
import { generate as csharpGenerator} from './backend/csharp/generator.js';
import { generate as opaGenerate } from './opa/generator.js'
import { processRelations, RelationInfo } from './util/relations.js';
import { generateCleanArchCustom } from './backend/csharp/generator-clean-arch-custom.js';

import { backend } from 'leds-spark-lib';
export import LibModel = backend.Model;

import path from 'path';
import chalk from 'chalk';

export function generate(model: Model, usecase: UseCase, filePath: string, destination: string | undefined, opts: GenerateOptions): string {
    const final_destination = extractDestination(filePath, destination);

    const listUCM = model.abstractElements.filter(isUseCasesModel);
    const listClassCRUD: LocalEntity[] = [];
    const listRefCRUD: LocalEntity[] = [];
    const listUCsNotCRUD: UseCase[] = [];
    
    // Cria uma lista todas as classes que tem casos de uso do tipo CRUD
    for (const ucm of listUCM) {
        const listElem = ucm.elements.filter(isUseCase);
        for (const elem of listElem) {
            if (elem.uctype == 'crud') {
                if (elem.entity ?? "" != "") {
                    listClassCRUD.push(elem.entity?.ref as LocalEntity);
                } 
            }
            else {
                listUCsNotCRUD.push(elem as UseCase);
            }
        }
    } 

    const listModules = model.abstractElements.filter(isModule);
    const all_entities = []
    for (const module of listModules) {
        all_entities.push(module.elements.filter(isLocalEntity))
    }

    const map = processRelations(all_entities.flat())

    // Cria uma lista de todas as classes relacionadas com as classes de ListClassCRUD
    for (const cls of listClassCRUD) {

        for (const rel of map.get(cls) as RelationInfo[]) {

            if ((!listClassCRUD.includes(rel.tgt as LocalEntity)) && (!listRefCRUD.includes(rel.tgt as LocalEntity))) {
                const classeRel = rel.tgt as LocalEntity;
                listRefCRUD.push(classeRel);
            }
        }
    }

    if (opts.only_back) {
        // Backend generation
        if (model.configuration?.language === 'python') {
            pythonGenerate(model as unknown as LibModel.Model, final_destination);
        } else if (model.configuration?.language === "csharp-clean-architecture-custom") {
            generateCleanArchCustom(model, listClassCRUD, listRefCRUD, listUCsNotCRUD, final_destination);
        } else if (model.configuration?.language?.startsWith("csharp")) {
            csharpGenerator(model as unknown as LibModel.Model, final_destination);
        } else if (model.configuration?.language === "java") {
            javaGenerate(model as unknown as LibModel.Model, final_destination);
        }
    } else if (opts.only_front) {
        // Frontend generation
        vueVitegenerate(model as unknown as LibModel.Model, final_destination);
    } else if (opts.only_Documentation) {
        // Documentation generation
        docGenerate(model, final_destination);
    } else if (opts.only_Backlog) {
        // Backlog generation
        console.log(chalk.yellow(`Not implemented yet`));
    } else if (opts.only_opa) {
        // OPA generation
        opaGenerate(model, final_destination);
    } else {
        // Generate All
        if (model.configuration?.language === 'python') {
            pythonGenerate(model as unknown as LibModel.Model, final_destination);
        } else if (model.configuration?.language === "csharp-clean-architecture-custom") {
            generateCleanArchCustom(model, listClassCRUD, listRefCRUD, listUCsNotCRUD, final_destination);
        } else if (model.configuration?.language?.startsWith("csharp")) {
            csharpGenerator(model as unknown as LibModel.Model, final_destination);
        } else if (model.configuration?.language === 'java') {
            javaGenerate(model as unknown as LibModel.Model, final_destination);
        }

        docGenerate(model, final_destination);
        vueVitegenerate(model as unknown as LibModel.Model, final_destination);
        opaGenerate(model, final_destination);
    }

    return final_destination;
}

function extractDestination(filePath: string, destination?: string) : string {
    const path_ext = new RegExp(path.extname(filePath)+'$', 'g')
    filePath = filePath.replace(path_ext, '')

    return destination ?? path.join(path.dirname(filePath))
}


