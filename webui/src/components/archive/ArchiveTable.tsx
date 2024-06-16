import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
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
import moment from "moment/moment";
import {useEffect, useState} from "react";
import {Application, ApplicationConsumable, ApplicationDevice, Logs} from "../../models";
import OrderService from "../../services/ApplicationService";
import ApplicationService from "../../services/ApplicationService";
import fileDownload from "js-file-download";
import {AddSnackbar} from "../../redux/actions/snackbarAction";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import {style} from "../../assets/css/CreateOrderModal";
import LogsService from "../../services/LogsService";

export default function ArchiveTable() {
  const user = useSelector((state: RootState) => state.currentUser.user);
  const [archiveApplications, setArchiveApplications] = useState<Application[]>([]);
  const [key, setKey] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const [date, setDate] = useState('')
  const [purchase, setPurchase] = useState<string>()
  const [interval, setInterval] = useState<number>()
  const [unit, setUnit] = useState<string>()
  const [checked, setChecked] = useState<boolean>();
  const [devices, setDevices] = useState<ApplicationDevice[]>([]);
  const [consumables, setConsumables] = useState<ApplicationConsumable[]>([]);

  //Dictionaries
  const Unit = [
    'Дни',
    'Месяцы',
  ]
  const Purchase = [
    'Внутренний',
    'Внешний',
  ]

  const [application, setApplication] = useState<Application>()
  const [openChangeApplicationModal, setChangeApplicationModal] = useState(false);

  const handleOpenEditApplicationModal = async (application: Application) => {
    console.log(application)
    if (!application) return;
    setApplication(application);
    setConsumables(application.consumables);
    setDevices(application.devices);
    setDate(new Date(application.date + (1000 * 60 * 60 * 24)).toISOString().substring(0, 10));

    if (application.period != null) {
      setChecked(true);

      let days = application.period / 86400;

      if (days % 30 == 0) {
        days = days / 30;
        setUnit(Unit[1]);
      } else {
        setUnit(Unit[0]);
      }

      setInterval(days);
    } else {
      setUnit(undefined);
      setInterval(undefined);
      setChecked(false);
    }
  }
  const handleCloseEditApplicationModal = () => {
    setApplication(undefined);
  }

  const downloadApplication = async (id: number) => {
    const res = await ApplicationService.downloadFile(id);
    if (!res)
      return
    fileDownload(res, `application-${id}.xlsx`)
  }
  const unarchivApplication = async (id: number) => {
    const unArchive = await ApplicationService.unarchiveApplicationById(id)
    if (unArchive) {
      dispatch(AddSnackbar({
        messageText: "Не удалось разархивировать заявку!",
        messageType: "error",
        key: +new Date()
      }))

      const newLog: Logs = {
        id: undefined,
        user_login: user!.login,
        action: "Разархивирование заявки",
        status: "ОШИБКА",
        result: "Не удалось разархивировать заявку",
        element_number: id,
        date: new Date()
      }
      try {
        await LogsService.addLog(newLog);
      } catch (e) {
        console.log(e)
      }

      return
    }
    dispatch(AddSnackbar({
      messageText: "Заявка успешно разархивирована!",
      messageType: "success",
      key: +new Date()
    }))

    const newLog: Logs = {
      id: undefined,
      user_login: user!.login,
      action: "Разархивирование заявки",
      status: "ОК",
      result: "Заявка успешно разархивирована",
      element_number: id,
      date: new Date()
    }
    try {
      await LogsService.addLog(newLog);
    } catch (e) {
      console.log(e)
    }

    const allArchiveApplication = await ApplicationService.getAllApplications(null, true)
    if (!allArchiveApplication)
      return
    setArchiveApplications(allArchiveApplication)
  }
  const deleteApplication = async (id: number) => {
    const isDelete = await ApplicationService.deleteApplicationById(id)
    if (!isDelete) {
      dispatch(AddSnackbar({
        messageText: "Не удалось удалить заявку!",
        messageType: "error",
        key: +new Date()
      }))

      const newLog: Logs = {
        id: undefined,
        user_login: user!.login,
        action: "Удаление заявки",
        status: "ОШИБКА",
        result: "Не удалось удалить заявку",
        element_number: id,
        date: new Date()
      }
      try {
        await LogsService.addLog(newLog);
      } catch (e) {
        console.log(e)
      }

      return
    }
    dispatch(AddSnackbar({
      messageText: "Заявка успешно удалена!",
      messageType: "success",
      key: +new Date()
    }))

    const newLog: Logs = {
      id: undefined,
      user_login: user!.login,
      action: "Удаление заявки",
      status: "ОК",
      result: "Удаление прошло успешно",
      element_number: id,
      date: new Date()
    }
    try {
      await LogsService.addLog(newLog);
    } catch (e) {
      console.log(e)
    }

    const allArchiveApplication = await ApplicationService.getAllApplications(null, true)
    if (!allArchiveApplication)
      return
    setArchiveApplications(allArchiveApplication)
  }
  useEffect(() => {
    if (application)
      setChangeApplicationModal(true)
    else
      setChangeApplicationModal(false)
  }, [application])
  useEffect(() => {
    if (key) return;
    setKey(true);
    OrderService.getAllApplications(null, true).then((res) => {
      if (!res) return
      setArchiveApplications(res);
    }).catch(err => console.log(err));
  }, [])
  return (
    <div className='section' style={{height: '100%', width: '100%'}}>
      {archiveApplications.length !== 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{minWidth: 650}} aria-label="simple table">
            <TableHead>
              <TableRow sx={{cursor: "default"}}>
                <TableCell>Номер</TableCell>
                <TableCell align="left">Тип закупа</TableCell>
                <TableCell align="center">Дата</TableCell>
                <TableCell align="center">Статус</TableCell>
                {user ? (
                  <TableCell align="center">Создание копии</TableCell>
                ) : (
                  <></>
                )}
                <TableCell align="center">Скачивание</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {archiveApplications.map((row) => (
                <TableRow
                  key={row.number}
                  sx={{'&:last-child td, &:last-child th': {border: 0, cursor: "default"}}}
                >
                  <TableCell onClick={() => {
                    handleOpenEditApplicationModal(row)
                  }}>{row.number}</TableCell>
                  <TableCell align="left" onClick={() => {
                    handleOpenEditApplicationModal(row)
                  }}>{row.title}</TableCell>
                  <TableCell align="center" onClick={() => {
                    handleOpenEditApplicationModal(row)
                  }}>{moment(row.date).format('DD.MM.YYYY')}</TableCell>
                  <TableCell align="center" onClick={() => {
                    // handleOpenEditApplicationModal(row)
                  }}>{row.status}</TableCell>
                  {user ? (
                    <TableCell align="center"><Button
                      variant="outlined" onClick={() => {
                      unarchivApplication(row.number!)
                    }}>В работу</Button>
                    </TableCell>
                  ) : (
                    <></>
                  )}
                  <TableCell align="center">
                    <Button variant="outlined" onClick={() => {
                      downloadApplication(row.number!)
                    }}>Скачать</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      ) : (
        <Stack spacing={2}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton variant="rounded" height={100} sx={{width: '100%'}} key={i}/>
          ))}
        </Stack>
      )}
      {
        application &&
        <Modal
          open={openChangeApplicationModal}
          onClose={handleCloseEditApplicationModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Stack direction="column" justifyContent="space-between" spacing={1}
                   sx={{width: '97%', height: '100%'}} style={{margin: '0px'}}>
              <div>
                <Paper sx={{width: '100%'}}
                       style={{marginLeft: "0px", padding: "20px", marginBottom: "8px"}}>
                  <Stack direction="row" spacing={1}>
                    <Typography mb={2}>Заявка №</Typography>
                    <Typography color="primary">{application ? application!.number : ""}</Typography>
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <TextField disabled label="Дата" type="date" size='small' sx={{width: '16%'}}
                               defaultValue={application.date} value={date}
                               onChange={e => {
                                 setDate((e.target.value))
                               }}
                               InputLabelProps={{
                                 shrink: true,
                               }}

                    />
                    <Autocomplete disabled disablePortal size='small' options={Purchase}
                                  sx={{width: '16%'}}
                                  onInputChange={(e, value) => {
                                    setPurchase(value)
                                  }}
                                  value={purchase}
                                  defaultValue={application.title}
                                  renderInput={(params) => <TextField
                                    value={purchase}
                                    defaultValue={application.title}
                                    onChange={(newValue) => setPurchase(newValue.target.value)} {...params}
                                    label="Закуп"/>}

                    />

                    <FormControlLabel disabled control={<Checkbox checked={checked}/>}
                                      label="Период"/>
                    {checked &&
                      <Stack direction="row" spacing={2} sx={{width: '40%'}}>
                        <TextField disabled label="Интервал" variant="outlined" size='small'
                                   type="number" value={interval}
                                   onChange={(newValue) => setInterval(+newValue.target.value)}
                                   InputProps={{
                                     inputProps: {min: 1}
                                   }}
                        />
                        <Autocomplete disabled disablePortal size='small' options={Unit}
                                      sx={{width: '40%'}}
                                      onInputChange={(e, value) => {
                                        setUnit(value)
                                      }}
                                      value={unit}
                                      renderInput={(params) => <TextField
                                        value={unit}
                                        onChange={(newValue) => setUnit(newValue.target.value)} {...params}
                                        label="Ед. измерения"/>}
                        />
                      </Stack>
                    }
                  </Stack>
                </Paper>
                <Paper sx={{width: '100%'}} style={{marginLeft: "0px", padding: "20px"}}>
                  {consumables && consumables!.length !== 0 && consumables!.map(
                    (row: ApplicationConsumable) => (
                      <Stack direction="row" width='100%' spacing={1} mb={1}>
                        <TextField disabled label="Наименование" variant="outlined"
                                   size='small'
                                   type="string"
                                   value={row.consumable.title}
                                   style={{width: '30%'}}
                        />
                        <TextField disabled label="КССС" variant="outlined" size='small'
                                   type="number"
                                   value={row.consumable.csss}
                                   InputProps={{
                                     inputProps: {min: 1}
                                   }}
                        />
                        <TextField disabled label="Количество"
                                   variant="outlined"
                                   size='small'
                                   type="number"
                                   value={row.count}
                                   aria-readonly={true}
                        />
                      </Stack>
                    )
                  )}

                  {devices && devices!.length !== 0 && (
                    devices!.map((row: ApplicationDevice) => (
                      <Stack direction="row" width='100%' spacing={1} mb={1}>
                        <TextField disabled label="Наименование" variant="outlined"
                                   size='small'
                                   type="string"
                                   value={row.device.title}
                                   style={{width: '30%'}}
                        />
                        <TextField disabled label="КССС" variant="outlined" size='small'
                                   type="number"
                                   value={row.device.csss}
                                   InputProps={{
                                     inputProps: {min: 1}
                                   }}
                        />
                        <TextField disabled label="Количество"
                                   variant="outlined"
                                   size='small'
                                   type="number"
                                   value={row.count}
                                   aria-readonly={true}
                        />
                      </Stack>
                    ))
                  )}
                </Paper>
              </div>
              <Paper sx={{width: '100%'}} style={{padding: "20px"}}>
                <Stack direction='row' justifyContent='space-between' sx={{width: '100%'}}>
                  <Button variant="outlined" onClick={() => {
                    deleteApplication(application.number!)
                  }}>Удалить заявку</Button>
                  <Button variant="contained" onClick={() => {
                    unarchivApplication(application.number!)
                  }}>В работу</Button>
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Modal>
      }
    </div>
  )
}
