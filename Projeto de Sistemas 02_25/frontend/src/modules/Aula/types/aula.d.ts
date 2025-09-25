export type Aula = {
  Id : string

}

export type AulaCreateReq = Pick<Aula, >


export type AulaListRes = {
  "@odata.context": string
  value: Aula[]
}

export type AulaCreateRes = {
  statusCode: number
  uri: string
  message: string
}

export type AulaGetRes = AulaListRes


export type AulaUpdateRes = {
  statusCode: number
  message: string
}

export type AulaDeleteRes = AulaUpdateRes