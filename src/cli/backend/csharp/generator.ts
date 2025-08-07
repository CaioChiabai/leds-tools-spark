import fs from "fs";
import path from "path";

import { backend } from "leds-spark-lib"

export import Model = backend.Model;
export const generators = backend.csharp.generators;

export function generate(model: Model.Model, target_folder: string): void {
  const target_folder_back = path.join(target_folder, "backend");
  const target_folder_projname = path.join(target_folder_back, model.configuration?.name || "Projeto");

  fs.mkdirSync(target_folder_back, { recursive: true });

  if (model.configuration?.language === "csharp-minimal-api") {
    generators.miniminal.generator(model, target_folder_projname);
    generators.miniminal.generateProject(model, target_folder_back);
    generators.miniminal.generateDocker(model, target_folder_back);

  }
  else if (model.configuration?.language === "csharp-clean-architecture") {
    generators.CleanArc.generator(model, target_folder_projname);
    generators.CleanArc.generateProject(model, target_folder_back);
    generators.CleanArc.generateDocker(model, target_folder_back);
    
  }

}

