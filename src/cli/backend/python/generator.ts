
import fs from "fs";

import { backend } from "leds-spark-lib"

export import LibModel = backend.Model;
export const generators = backend.csharp.generators;

export function generate(model: LibModel.Model, target_folder: string): void {
    
    fs.mkdirSync(target_folder, { recursive: true });

    generators.django.generate(model, target_folder);
}