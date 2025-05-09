import fs from "fs";
import { generate as generateValidationBehavior } from "./Behavior/generate.js";
import { generate as generateExceptionFilter } from "./Exceptions/Filters/generate.js";
export function generate(model, target_folder) {
    const Behavior_folder = target_folder + "/Behavior";
    const Exceptions_folder = target_folder + "/Exceptions/Filters";
    fs.mkdirSync(Behavior_folder, { recursive: true });
    fs.mkdirSync(Exceptions_folder, { recursive: true });
    generateValidationBehavior(model, Behavior_folder);
    generateExceptionFilter(model, Exceptions_folder);
}
