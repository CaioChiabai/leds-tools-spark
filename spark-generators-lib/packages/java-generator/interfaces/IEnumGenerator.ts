import { EnumX } from "../../shared/ast.js";

export interface IEnumGenerator {
  generate(enumx: EnumX, packageName: string): string;
}