export type Instrutor = {
  nome : string
cpfstring : string
numero : string
Id : string

}

export type InstrutorCreateReq = Pick<Instrutor, "nome" | "cpfstring" | "numero">


export type InstrutorListRes = {
  "@odata.context": string
  value: Instrutor[]
}

export type InstrutorCreateRes = {
  statusCode: number
  uri: string
  message: string
}

export type InstrutorGetRes = InstrutorListRes


export type InstrutorUpdateRes = {
  statusCode: number
  message: string
}

export type InstrutorDeleteRes = InstrutorUpdateRes