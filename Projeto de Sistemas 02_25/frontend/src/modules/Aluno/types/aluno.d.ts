export type Aluno = {
  nome : string
cpfstring : string
numero : string
Id : string

}

export type AlunoCreateReq = Pick<Aluno, "nome" | "cpfstring" | "numero">


export type AlunoListRes = {
  "@odata.context": string
  value: Aluno[]
}

export type AlunoCreateRes = {
  statusCode: number
  uri: string
  message: string
}

export type AlunoGetRes = AlunoListRes


export type AlunoUpdateRes = {
  statusCode: number
  message: string
}

export type AlunoDeleteRes = AlunoUpdateRes