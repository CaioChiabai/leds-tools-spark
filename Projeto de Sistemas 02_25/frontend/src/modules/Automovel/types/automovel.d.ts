export type Automovel = {
  placa : string
Id : string

}

export type AutomovelCreateReq = Pick<Automovel, "placa">


export type AutomovelListRes = {
  "@odata.context": string
  value: Automovel[]
}

export type AutomovelCreateRes = {
  statusCode: number
  uri: string
  message: string
}

export type AutomovelGetRes = AutomovelListRes


export type AutomovelUpdateRes = {
  statusCode: number
  message: string
}

export type AutomovelDeleteRes = AutomovelUpdateRes