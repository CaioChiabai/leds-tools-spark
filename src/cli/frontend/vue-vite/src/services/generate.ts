import { LocalEntity, Model } from "../../../../../language/generated/ast.js"
import fs from "fs";
import { createPath } from "../../../../util/generator-utils.js";
import { expandToString } from "langium/generate";
import { generate as generateRequires } from "./requires/generate.js"
import path from "path";

export function generate(model: Model, listClassCRUD: LocalEntity[], target_folder: string) : void {

    const requires_folder = createPath(target_folder, "requires")

    fs.mkdirSync(requires_folder, {recursive:true})

    fs.writeFileSync(path.join(target_folder, "api.ts"), generateApi())
    fs.writeFileSync(path.join(requires_folder, "factory.ts"), generateFactory())

    generateRequires(model, listClassCRUD, requires_folder)

}  

function generateApi(): string {
    return expandToString`
import axios, { type AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080'
})

export default api;`
}

function generateFactory(): string {
    return expandToString`
import api from 'axios'
import useApi from '../../composition/UseApi'

export default function serviceFactory(apiUrl: string, listUrl?: string) {
  const { list, post, update, remove, getById } = useApi(apiUrl)

  let customList

  if (listUrl) {
    customList = async () => {
      const { data } = await api.get(listUrl)
      return data
    }
  }

  return {
    list: customList || list,
    post,
    update,
    remove,
    getById
  }
}`
}