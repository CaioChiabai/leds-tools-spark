import { expandToString } from "langium/generate";
import { isEnumX, isModule } from "../../../../shared/ast.js";
import path from "path";
import fs from "fs";
import { capitalizeString } from "../../../../shared/generator-utils.js";
export function generate(model, target_folder) {
    const modules = model.abstractElements.filter(isModule);
    const package_name = model.configuration?.name || "default";
    fs.writeFileSync(path.join(target_folder, `baseEnum.cs`), createBaseEnum(package_name));
    for (const mod of modules) {
        for (const enumx of mod.elements.filter(isEnumX)) {
            fs.writeFileSync(path.join(target_folder, `${enumx.name}.cs`), createEnum(enumx, package_name));
        }
    }
}
function createEnum(enumx, package_name) {
    return expandToString `
namespace ${package_name}.Domain.Enums
{
    public enum ${enumx.name} {
        ${enumx.attributes.map(a => `${capitalizeString(a.name)}`).join(",\n")}
    }
}
`;
}
function createBaseEnum(package_name) {
    return expandToString `
namespace ${package_name}.Domain.Enums
{
    public enum Base {}
}`;
}
