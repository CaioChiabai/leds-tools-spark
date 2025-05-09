import { expandToStringWithNL } from "langium/generate";
import fs from "fs";
import path from "path";
export function generate(model, target_folder) {
    fs.writeFileSync(path.join(target_folder, "TestHelper.cs"), generateProjectsln(model));
}
function generateProjectsln(model) {
    return expandToStringWithNL `
using AutoFixture;
using AutoFixture.Kernel;
using ${model?.configuration?.name}.Domain.Entities;

namespace ${model?.configuration?.name}.Domain.Test.Helpers
{
    internal static class TestHelper
    {

        public static Fixture GetFixture()
        {

            Fixture entityfixture = new Fixture();

            // Remove the ThrowingRecursionBehavior
            entityfixture.Behaviors.OfType<ThrowingRecursionBehavior>().ToList()
                .ForEach(b => entityfixture.Behaviors.Remove(b));

            // Add the OmitOnRecursionBehavior
            entityfixture.Behaviors.Add(new OmitOnRecursionBehavior());

            return entityfixture;

        }

    }
}
`;
}
