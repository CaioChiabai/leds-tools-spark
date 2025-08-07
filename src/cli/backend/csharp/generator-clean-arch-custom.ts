import fs from "fs";
import path from "path";
import { generate as archGenerate } from "./clean-architecture-custom/generator.js";
import { generate as projGenerate } from "./clean-architecture-custom/project-generator.js";
import { generate as dockGenerate } from "./clean-architecture-custom/docker-generator.js";
import { LocalEntity, Model, UseCase } from "../../../language/generated/ast.js";

export function generateCleanArchCustom(model: Model, listClassCRUD: LocalEntity[], listRefCRUD: LocalEntity[], listUCsnotCRUD: UseCase[], target_folder: string): void {

  const target_folder_back = path.join(target_folder, "backend");
  const target_folder_projname = path.join(target_folder_back, model.configuration?.name || "Projeto");

  fs.mkdirSync(target_folder_back, { recursive: true });

  archGenerate(model, listClassCRUD, listRefCRUD, listUCsnotCRUD, target_folder_projname);
  projGenerate(model, target_folder_back);
  dockGenerate(model, target_folder_back);
}