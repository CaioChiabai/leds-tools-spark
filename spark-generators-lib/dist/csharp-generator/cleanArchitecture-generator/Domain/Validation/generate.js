import { expandToStringWithNL } from "langium/generate";
import fs from "fs";
import path from "path";
export function generate(model, target_folder) {
    fs.writeFileSync(path.join(target_folder, `DomainExceptionValidation.cs`), generateDomainException(model));
}
function generateDomainException(model) {
    return expandToStringWithNL `
namespace ${model.configuration?.name}.Domain.Validation
{
    public class DomainValidationException : Exception
    {
        public List<string> Errors { get; }

        public DomainValidationException(List<string> validationsErrors)
        {
            Errors = validationsErrors;
        }

        public override string ToString()
        {
            return string.Join(Environment.NewLine, Errors);
        }
    }
}`;
}
