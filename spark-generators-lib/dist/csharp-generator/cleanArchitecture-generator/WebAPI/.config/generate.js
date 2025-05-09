import { expandToString } from "langium/generate";
import fs from "fs";
import path from "path";
export function generate(model, target_folder) {
    fs.writeFileSync(path.join(target_folder, "dotnet-tools.json"), generateDotNetTools(model));
}
function generateDotNetTools(model) {
    return expandToString `
{
  "version": 1,
  "isRoot": true,
  "tools": {
    "dotnet-ef": {
      "version": "8.0.4",
      "commands": [
        "dotnet-ef"
      ]
    }
  }
}`;
}
