import { expandToStringWithNL } from "langium/generate";
import fs from "fs";
import path from "path";
export function generate(model, target_folder) {
    fs.writeFileSync(path.join(target_folder, `StringExtension.cs`), generateExtension(model));
}
function generateExtension(model) {
    return expandToStringWithNL `
using System.Text;

namespace ${model.configuration?.name}.Domain.Security.Shared.Extensions
{
    public static class StringExtension
    {
        public static string ToBase64(this string text) => Convert.ToBase64String(Encoding.ASCII.GetBytes(text));
    }
}`;
}
