import { backend, generateFrontend } from "leds-spark-lib"

export import Model = backend.Model;
export const generators = backend.csharp.generators;

export function generate(model: Model.Model, target_folder: string) : void {
    generateFrontend(model, target_folder)
}  