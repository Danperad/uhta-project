import {ChangeEvent, useRef, useState} from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Modal,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {style} from '../../assets/css/CreateOrderModal';
import {styleReportModel} from '../../assets/css/CreateReportModal';
import DeviceService from "../../services/DeviceService";
import ApplicationTable from "./ApplicationTable";
import {AddSnackbar} from "../../redux/actions/snackbarAction";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import {Application, ApplicationConsumable, ApplicationDevice, Logs} from "../../models";
import ConsumableService from "../../services/ConsumableService";
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import ApplicationService from "../../services/ApplicationService";
import LogsService from "../../services/LogsService";

export default function ApplicationPage() {
  const user = useSelector((state: RootState) => state.currentUser.user);
  const dispatch = useDispatch<AppDispatch>();
  const [checked, setChecked] = useState(false);

  const [openCreateOrderModal, setCreateApplicationModalOpen] = useState(false);
  const [openCreateReportModal, setCreateReportModalOpen] = useState(false);

  const [materialAmount, setMaterialAmount] = useState<string | undefined>();

  const [showOrderTable, setShowApplicationTable] = useState(false);
  const [csss, setCsss] = useState<string | undefined>();

  const [devices, setDevices] = useState<ApplicationDevice[]>([]);
  const [consumables, setConsumables] = useState<ApplicationConsumable[]>([]);

  const [date, setDate] = useState('')
  const [purchase, setPurchase] = useState<string>()
  const [interval, setInterval] = useState<number>()
  const [unit, setUnit] = useState<string>()

  const [applicationNumber, setApplicationNumber] = useState<string | undefined>();
  const inputFile = useRef<HTMLInputElement | null>(null)
  const uploadXmlButtonClick = () => {
    inputFile.current?.click()
  };
  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files === null || !files || files!.length === 0)
      return

    const file = files!.item(0)
    if (file === null) return;

    const newLog: Logs = {
      id: undefined,
      user_login: user!.login,
      action: "Добавление поставки",
      status: "ОК",
      result: "Добавление прошло успешно",
      element_number: parseInt(applicationNumber!),
      date: new Date()
    }
    try {
      await LogsService.addLog(newLog);
    } catch (e) {
      console.log(e)
    }
    dispatch(AddSnackbar({
      messageText: "Поставка успешно добавлена!",
      messageType: "success",
      key: +new Date()
    }))
  }

  const handleOpenCreateApplicationModal = () => {
    setCreateApplicationModalOpen(true)
    DeviceService.getAllDevices().then((res) => {
      if (res) dispatch(res);
    });
  }
  const handleOpenCreateReportModal = () => {
    setCreateReportModalOpen(true)
  }
  const handleCloseCreateOrderModal = () => {
    setCreateApplicationModalOpen(false);
    if (checked) {
      setChecked(prev => !prev);
    }
  }
  const handleChangeChecked = () => {
    setChecked(prev => !prev)
  }
  const handleCloseCreateReportModal = () => {
    setCreateReportModalOpen(false);
  }
  //Dictionaries
  const Unit = ['Дни', 'Месяцы',]
  const Purchase = ['Внутренний', 'Внешний',]
  const Statuses = ['Новая', 'Согласована', 'Завершена']

  const [search, setSearch] = useState<string>('');
  const [dateStart, setDateStart] = useState<string | undefined>();
  const [dateEnd, setDateEnd] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [autocompleteStatusValue, setAutocompleteStatusValue] = useState<string>('');

  function CheckStatus(event: any, value: string) {
    setStatus(value);
    setAutocompleteStatusValue(value);
  }

  const [searchApplications, setSearchApplications] = useState<Application[]>();
  const handleShowApplicationTable = async () => {
    const application = await ApplicationService.getAllApplications(search, false, status, dateStart, dateEnd);
    setSearchApplications(application);
    setShowApplicationTable(true);
  }

  const addMaterial = async () => {
    if (!csss) return
    if (!materialAmount || materialAmount === '') {
      dispatch(AddSnackbar({
        messageText: "Количество должно быть больше 0",
        messageType: "error",
        key: +new Date()
      }))
      return;
    }

    if (devices.find(d => d.device.csss === +csss)) {
      dispatch(AddSnackbar({
        messageText: "Прибор с таким КССС уже добавлен",
        messageType: "error",
        key: +new Date()
      }))
      return
    }
    if (consumables.find(d => d.consumable.csss === +csss)) {
      dispatch(AddSnackbar({
        messageText: "Расходник с таким КССС уже добавлен",
        messageType: "error",
        key: +new Date()
      }))
      return
    }

    const resDevice = await DeviceService.getDeviceByCsss(+csss!)
    const resConsumable = await ConsumableService.getConsumableByCsss(+csss!)
    if (!resDevice && !resConsumable) {
      dispatch(AddSnackbar({
        messageText: "Прибор или расходник с КССС: " + csss + " не найден!",
        messageType: "error",
        key: +new Date()
      }))
      return;
    }
    if (resDevice) {
      const tmp: ApplicationDevice[] = []
      devices.forEach((d) => {
        tmp.push(d)
      })
      tmp.push({device: resDevice, count: +materialAmount})
      setDevices(tmp)
    } else {
      const tmp: ApplicationConsumable[] = []
      consumables?.forEach((c) => {
        tmp.push(c)
      })

      tmp.push({consumable: resConsumable!, count: +materialAmount})
      setConsumables(tmp)
    }
    setMaterialAmount("")
    setCsss("")
  }

  const delDevice = (csss: number) => {
    setDevices(devices.filter((d) => d.device.csss !== csss))
  }
  const delConsumable = (csss: number) => {
    setConsumables(consumables.filter((c) => c.consumable.csss !== csss))
  }

  function changeConsumableAmountInApplication(newValue: number, csss: number) {
    if (newValue < 1) {
      dispatch(AddSnackbar({
        messageText: "Недопустимое количество",
        messageType: "error",
        key: +new Date()
      }))
      return
    }
    const selectConumsble = consumables.find(c => c.consumable.csss === csss)
    if (!selectConumsble)
      return;
    selectConumsble.count = newValue
    const tmp = consumables.filter(c => c.consumable.csss !== csss)
    tmp.push(selectConumsble)
    setConsumables(tmp)
  }

  const createReport = async () => {
    const link = document.createElement('a');
    link.href = 'https://download1523.mediafire.com/6lg104yr1togBAkA3065_YuiqBXBXRBXnCpxZLtLHB4mnUdku-fUv4v6azvv02106Lm3I64Bw2bwYlXgSepf53vcUcHGyOeKvEDogftDW6xFkaZM3x_JUHB2_tDSNi1HFX7_lPZRyNIL0KUTI0PuPGivkznwge1jhTnjfJSUwhjY4A/jsf3gpw0s0s83x3/Отчет.xlsx';
    link.setAttribute('download', 'report.xlsx'); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);

    setCreateReportModalOpen(false);
  }

  function changeDeviceAmountInApplication(newValue: number, csss: number) {
    if (newValue < 1) {
      dispatch(AddSnackbar({
        messageText: "Недопустимое количество",
        messageType: "error",
        key: +new Date()
      }))
      return
    }
    const selectDevice = devices.find(c => c.device.csss === csss)
    if (!selectDevice)
      return;
    selectDevice.count = newValue
    const tmp = devices.filter(c => c.device.csss !== csss)
    tmp.push(selectDevice)
    setDevices(tmp)
  }

  const calculatePeriod = () => {
    let period = 86400 * interval!
    console.log(unit);
    if (unit === Unit[1])
      period = period * 30
    return period
  }

  const addApplication = async () => {
    if (!date || !purchase || consumables.length === undefined || devices.length === undefined)
      return;

    const milleseconds = new Date(date!).getTime()

    const period = checked ? calculatePeriod() : undefined

    const newApplication: Application = {
      number: undefined,
      date: milleseconds,
      title: purchase!,
      period: period,
      status: "Новая",
      consumables: consumables,
      devices: devices,
      inArchive: false
    }
    const res = ApplicationService.addApplication(newApplication)
    if (!res) {
      dispatch(AddSnackbar({
        messageText: "Что-то пошло не так",
        messageType: "error",
        key: +new Date()
      }))

      const newLog: Logs = {
        id: undefined,
        user_login: user!.login,
        action: "Добавление заявки",
        status: "ОШИБКА",
        result: "Неудалось добавить заявку",
        element_number: undefined,
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
      messageText: "Заявка успешно добавлена!",
      messageType: "success",
      key: +new Date()
    }))

    const allApplication = await ApplicationService.getAllApplications(null, false,)
    if (allApplication) {
      const element: Application = allApplication[0]

      const newLog: Logs = {
        id: undefined,
        user_login: user!.login,
        action: "Добавление заявки",
        status: "ОК",
        result: "Добавление прошло успешно",
        element_number: element!.number!,
        date: new Date()
      }
      try {
        await LogsService.addLog(newLog);
      } catch (e) {
        console.log(e)
      }
    }

    setCreateApplicationModalOpen(false);
    setDate("");
    setPurchase("");
    setInterval(undefined);
    setDevices([]);
    setConsumables([]);
    setUnit("");
    setChecked(false);
  }

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
          <Paper style={{marginLeft: "0px", padding: "20px", marginBottom: "8px"}}>
            <Typography mb={1}>Заявки</Typography>
            <Stack direction="row" justifyContent="space-between" width='100%' height='100%'>
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
                <Button variant="contained" onClick={handleShowApplicationTable}>Показать</Button>
                <Button variant="outlined" onClick={handleOpenCreateReportModal}>Отчет</Button>
                {user ? (
                  <Button variant="outlined" onClick={uploadXmlButtonClick}>Поставка
                    <input type='file' ref={inputFile}
                           accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                           hidden
                           onChange={uploadFile}/></Button>
                ) : (
                  <></>
                )}
              </Stack>
              {user ? (
                <Button variant="contained" onClick={handleOpenCreateApplicationModal}>Создать</Button>
              ) : (
                <></>
              )}
            </Stack>
          </Paper>
        </Box>
        <Box sx={{height: "84vh", gridArea: 'main'}}>
          {searchApplications !== null /*&& searchApplications!.length !== 0*/ ?
            (showOrderTable && <ApplicationTable applications={searchApplications!}/>
            ) : (
              <Stack spacing={2}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Skeleton variant="rounded" height={100} sx={{width: '100%'}} key={i}/>
                ))}
              </Stack>
            )}
        </Box>
      </Box>
      <Modal
        open={openCreateOrderModal}
        onClose={handleCloseCreateOrderModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack direction="column" justifyContent="space-between" spacing={1}
                 sx={{width: '100%', height: '100%'}} style={{margin: '0px'}}>
            <div>
              <Paper style={{marginLeft: "0px", padding: "20px", marginBottom: "8px"}}>
                <Typography mb={2}>Создание заявки</Typography>
                <Stack direction="column" spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <TextField label="Дата" type="date" size='small' sx={{width: '16%'}}
                               defaultValue={+Date()} value={date} required
                               onChange={e => {
                                 setDate((e.target.value))
                               }}
                               InputLabelProps={{
                                 shrink: true,
                               }}
                    />
                    <Autocomplete disablePortal size='small' options={Purchase}
                                  sx={{width: '16%'}}
                                  onInputChange={(e, value) => {
                                    setPurchase(value)
                                  }}
                                  value={purchase}
                                  renderInput={(params) => <TextField
                                    value={purchase}
                                    required
                                    onChange={(newValue) => setPurchase(newValue.target.value)} {...params}
                                    label="Закуп"/>}

                    />

                    <FormControlLabel control={<Checkbox onChange={handleChangeChecked}/>}
                                      label="Период"/>
                    {checked &&
                      <Stack direction="row" spacing={2} sx={{width: '40%'}}>
                        <TextField label="Интервал" variant="outlined" size='small'
                                   type="number" value={interval} required
                                   onChange={(newValue) => setInterval(+newValue.target.value)}
                                   InputProps={{
                                     inputProps: {min: 1}
                                   }}
                        />
                        <Autocomplete disablePortal size='small' options={Unit}
                                      sx={{width: '40%'}}
                                      onInputChange={(e, value) => {
                                        setUnit(value)
                                      }}
                                      value={unit}
                                      renderInput={(params) => <TextField
                                        value={unit}
                                        required
                                        onChange={(newValue) => setUnit(newValue.target.value)} {...params}
                                        label="Ед. измерения"/>}

                        />
                      </Stack>
                    }
                  </Stack>
                  <Typography mb={2}>Добавление материалов в заявку</Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField label="КССС" variant="outlined" size='small' type="number"
                               required
                               value={csss} onChange={(newValue) => setCsss(newValue.target.value)}
                               InputProps={{
                                 inputProps: {min: 1}
                               }}
                    />
                    <TextField label="Количество" variant="outlined" size='small'
                               type="number"
                               required
                               InputProps={{
                                 inputProps: {min: 1}
                               }}
                               value={materialAmount}
                               onChange={(newValue) => setMaterialAmount(newValue.target.value)}
                    />
                    <Button variant="contained" onClick={addMaterial}>Добавить материал</Button>
                  </Stack>
                </Stack>
              </Paper>
              <Paper style={{marginLeft: "0px", padding: "20px"}}>
                {consumables && consumables!.length !== 0 && consumables!.map(
                  (row: ApplicationConsumable) => (
                    <Stack direction="row" width='100%' spacing={1} mb={1}>
                      <TextField label="Наименование" variant="outlined"
                                 size='small'
                                 type="string"
                                 value={row.consumable.title}
                                 style={{width: '30%'}}
                      />
                      <TextField label="КССС" variant="outlined" size='small'
                                 type="number"
                                 value={row.consumable.csss}
                                 InputProps={{
                                   inputProps: {min: 1}
                                 }}
                      />
                      <TextField label="Количество"
                                 variant="outlined"
                                 size='small'
                                 type="number"
                                 value={row.count}
                                 onChange={(newValue) => changeConsumableAmountInApplication(parseInt(newValue.target.value), row.consumable.csss)}
                      />
                      <IconButton aria-label="delete" size="large" style={{marginTop: "-8px"}}
                                  onClick={() => {
                                    delConsumable(row.consumable.csss)
                                  }}>
                        <IndeterminateCheckBoxOutlinedIcon fontSize="inherit"/>
                      </IconButton>
                    </Stack>
                  )
                )}

                {devices && devices!.length !== 0 && (
                  devices!.map((row: ApplicationDevice) => (
                    <Stack direction="row" width='100%' spacing={1} mb={1}>
                      <TextField label="Наименование" variant="outlined"
                                 size='small'
                                 type="string"
                                 value={row.device.title}
                                 style={{width: '30%'}}
                      />
                      <TextField label="КССС" variant="outlined" size='small'
                                 type="number"
                                 value={row.device.csss}
                                 InputProps={{
                                   inputProps: {min: 1}
                                 }}
                      />
                      <TextField label="Количество"
                                 variant="outlined"
                                 size='small'
                                 type="number"
                                 value={row.count}
                                 onChange={(newValue) => changeDeviceAmountInApplication(parseInt(newValue.target.value), row.device.csss)}
                      />
                      <IconButton aria-label="delete" size="large" style={{marginTop: "-8px"}}
                                  onClick={() => {
                                    delDevice(row.device.csss)
                                  }}>
                        <IndeterminateCheckBoxOutlinedIcon fontSize="inherit"/>
                      </IconButton>
                    </Stack>
                  ))
                )}
              </Paper>
            </div>
            <Paper style={{padding: "20px"}}>
              <Stack direction='row' justifyContent='space-between' sx={{width: '100%'}}>
                <Button variant="outlined" onClick={handleCloseCreateOrderModal}>Отмена</Button>
                <Button variant="contained" onClick={addApplication}>Создать</Button>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Modal>
      <Modal
        open={openCreateReportModal}
        onClose={handleCloseCreateReportModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleReportModel}>
          <Stack direction="column" spacing={1}
                 sx={{width: '100%', height: '100%'}} style={{margin: '0px'}}>
            <div>
              <Paper style={{marginLeft: "0px", padding: "20px", marginBottom: "8px"}}>
                <Typography mb={2}>Создание отчета</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField label="От" type="date" size='small' sx={{width: '30%'}} required
                             InputLabelProps={{
                               shrink: true,
                             }}
                  />
                  <TextField label="До" type="date" size='small' sx={{width: '30%'}} required
                             InputLabelProps={{
                               shrink: true,
                             }}
                  />
                </Stack>
                <Typography mt={2}>Перед формированием отчета убедитесь, что загружены все актуальные
                  поставки</Typography>
              </Paper>
            </div>
            <Paper style={{padding: "20px"}}>
              <Stack direction='row' justifyContent='space-between' sx={{width: '100%'}}>
                <Button variant="outlined" onClick={() => {
                  handleCloseCreateReportModal()
                }}>Отмена</Button>
                <Button variant="contained" onClick={() => {
                  createReport()
                }}>Скачать</Button>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Modal>
    </Box>
  )
}
