import {
  Autocomplete,
  Box,
  Button,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Logs} from "../models";
import LogsService from "../services/LogsService";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {useNavigate} from "react-router-dom";
import moment from "moment";
export default function ControlPage() {
  const user = useSelector((state: RootState) => state.currentUser.user);
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>('');
  const [dateStart, setDateStart] = useState<string | undefined>();
  const [dateEnd, setDateEnd] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [autocompleteStatusValue, setAutocompleteStatusValue] = useState<string>('');
  const Statuses = ['ОК', 'ОШИБКА']
  const [logs, setLogs] = useState<Logs[]>();

  function CheckStatus(event: any, value: string) {
    setStatus(value);
    setAutocompleteStatusValue(value);
  }

  const handleShowLogsTable = async () => {
    const logs = await LogsService.getAllLogs(search, status, dateStart, dateEnd);
    setLogs(logs)
  }

  useEffect(() => {
    if (!user) {
      navigate("/")
    }
  }, [user])

  return (
    <Box sx={{
      width: '100%',
      height: '100vh',
      '& > .MuiBox-root > .MuiBox-root': {
        p: 1,
      },
    }}>
      <Box sx={{
        display: 'grid',
        height: "98.5%",
        margin: "8px 8px 8px 0",
        gridTemplateColumns: 'repeat(1, 1fr)',
        gridTemplateRows: 'repeat(2, 138px)',
        gridTemplateAreas: `"header"
                        "main"`,
      }}>
        <Box sx={{gridArea: 'header'}}>
          <Paper style={{marginLeft: "0px", padding: "20px"}}>
            <Typography mb={1}>Логирование</Typography>
            <Stack direction="row" spacing={2} style={{width: "100%"}} height='100%'>
              <TextField sx={{width: '32%'}} label="Поиск" variant="outlined" size='small'
                         type="search" value={search}
                         onChange={(newValue) => setSearch(newValue.target.value)}/>
              <TextField label="От" type="date" size='small' sx={{width: '10%'}}
                         InputLabelProps={{
                           shrink: true,
                         }}
                         value={dateStart}
                         onChange={(newValue) => setDateStart(newValue.target.value)}
              />
              <TextField label="До" type="date" size='small' sx={{width: '10%'}}
                         InputLabelProps={{
                           shrink: true,
                         }}
                         value={dateEnd}
                         onChange={(newValue) => setDateEnd(newValue.target.value)}
              />
              <Autocomplete disablePortal size='small' sx={{width: '16%'}} options={Statuses}
                            onInputChange={CheckStatus}
                            value={autocompleteStatusValue}

                            renderInput={(params) => <TextField {...params} label="Статус"
                                                                value={status}
                                                                onChange={(newValue) => setStatus(newValue.target.value)}/>}
              />
              <Button variant="contained" onClick={handleShowLogsTable}>Показать</Button>
            </Stack>
          </Paper>
        </Box>

        <Box sx={{gridArea: 'main', height: "80vh"}}>
          <div className='section' style={{height: '100%', width: '100%'}}>
            {logs ? (
              <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                  <TableHead>
                    <TableRow sx={{cursor: "default"}}>
                      <TableCell align="left">Пользователь</TableCell>
                      <TableCell align="left">Действие</TableCell>
                      <TableCell align="left">Статус</TableCell>
                      <TableCell align="left">Результат</TableCell>
                      <TableCell align="left">Номер элемента</TableCell>
                      <TableCell align="left">Дата и время</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          '&:last-child td, &:last-child th': {
                            border: 0,
                            cursor: "pointer"
                          }
                        }}
                      >
                        <TableCell>{row.user_login}</TableCell>
                        <TableCell>{row.action}</TableCell>
                        <TableCell>{row.status}</TableCell>
                        <TableCell>{row.result}</TableCell>
                        <TableCell>{row.element_number}</TableCell>
                        <TableCell>{moment(row.date).format("DD.MM.YYYY HH:mm:ss")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

            ) : (
              <Stack spacing={2}>
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton variant="rounded" height={96} sx={{width: '100%'}} key={i}/>
                ))}
              </Stack>
            )}
          </div>
        </Box>
      </Box>
    </Box>
  )
}
