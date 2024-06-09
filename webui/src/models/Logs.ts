declare type Logs = {
  id: number | undefined,
  user_login: string,
  action: string,
  status: string,
  result: string,
  element_number?: number,
  date: Date,
}

export default Logs
