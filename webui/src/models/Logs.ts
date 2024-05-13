declare type Logs = {
  id: number | undefined,
  user: string,
  action: string,
  status: "ОК | ОШИБКА",
  result: string,
  element_number: number,
  date: number,
}

export default Logs
