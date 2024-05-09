import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import {style} from "../../assets/css/CreateOrderModal";
import {Application, ApplicationConsumable, ApplicationDevice} from "../../models";
import IndeterminateCheckBoxOutlinedIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../redux/store";
import {useEffect, useState} from "react";
import {AddSnackbar} from "../../redux/actions/snackbarAction";
import DeviceService from "../../services/DeviceService";
import ConsumableService from "../../services/ConsumableService";
import ApplicationService from "../../services/ApplicationService";

function ChangeApplicationModal(props: { receivedApplication: Application, closeEvent: () => void }) {

  const dispatch = useDispatch<AppDispatch>();
  const [application, setApplication] = useState<Application>(props.receivedApplication);

  const [date, setDate] = useState('')
  const [purchase, setPurchase] = useState<string>()
  const [interval, setInterval] = useState<number>()
  const [unit, setUnit] = useState<string>()
  const [checked, setChecked] = useState(false);
  const [csss, setCsss] = useState<string | undefined>();
  const [devices, setDevices] = useState<ApplicationDevice[]>([]);
  const [consumables, setConsumables] = useState<ApplicationConsumable[]>([]);
  const [materialAmount, setMaterialAmount] = useState<string | undefined>();


  const handleChangeChecked = () => {
    setChecked(prev => !prev)
  }

  //Dictionaries
  const Unit = [
    'Дни',
    'Месяцы',
  ]
  const Purchase = [
    'Внутренний',
    'Внешний',
  ]

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
      tmp.push({applicationNumber: undefined, device: resDevice, count: +materialAmount})
      setDevices(tmp)
    } else {
      const tmp: ApplicationConsumable[] = []
      consumables?.forEach((c) => {
        tmp.push(c)
      })

      tmp.push({applicationNumber: undefined, consumable: resConsumable!, count: +materialAmount})
      setConsumables(tmp)
    }
    setMaterialAmount(undefined)
    setCsss(undefined)

  }
  const delConsumable = (csss: number) => {
    setConsumables(consumables.filter((c) => c.consumable.csss !== csss))
  }
  const delDevice = (csss: number) => {
    setDevices(devices.filter((d) => d.device.csss !== csss))
  }
  const deleteApplication = async (id: number) => {
    const isDelete = await ApplicationService.deleteApplicationById(id)
    if (!isDelete) {
      dispatch(AddSnackbar({
        messageText: "Не удалось удалить заявку!",
        messageType: "error",
        key: +new Date()
      }))
      return
    }
    dispatch(AddSnackbar({
      messageText: "Заявка успешно удалена!",
      messageType: "success",
      key: +new Date()
    }))

    const allApplication = await ApplicationService.getAllApplications(null, false)
    if (!allApplication)
      return
    //setOrders(allApplication)
  }
  const calculatePeriod = () => {
    let period = 86400 * interval!
    if (unit === Unit[1])
      period = period * 30
    return period
  }
  const saveApplication = () => {

    if (!date || !purchase || consumables.length === undefined || devices.length === undefined)
      return;

    const milleseconds = new Date(date!).getTime()

    const period = checked ? calculatePeriod() : undefined

    const newApplication: Application = {
      number: application.number,
      date: milleseconds,
      title: purchase!,
      period: period,
      status: "Согласована",
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
      return
    }
    dispatch(AddSnackbar({
      messageText: "Заявка утверждена",
      messageType: "success",
      key: +new Date()
    }))
    //setChangeApplicationModal(false);
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

  useEffect(() => {
    setDate(new Date(application.date + (1000 * 60 * 60 * 24)).toISOString().substring(0, 10))
    setConsumables(application.consumables);
    setDevices(application.devices);
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
  })

  return (
    <Box sx={style}>
      <Stack direction="column" justifyContent="space-between" spacing={1}
             sx={{width: '97%', height: '100%'}} style={{margin: '0px'}}>
        <div>
          <Paper sx={{width: '100%'}}
                 style={{marginLeft: "0px", padding: "20px", marginBottom: "8px"}}>
            <Typography mb={2}>Редактирование заявки</Typography>
            <Stack direction="column" spacing={2}>
              <Stack direction="row" spacing={2}>
                <TextField label="Дата" type="date" size='small' sx={{width: '16%'}}

                           defaultValue={new Date(application.date).toISOString().substring(0, 10)}
                           value={date}
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
                              defaultValue={application.title}
                              renderInput={(params) => <TextField
                                value={purchase}
                                defaultValue={application.title}
                                onChange={(newValue) => setPurchase(newValue.target.value)} {...params}
                                label="Закуп"/>}

                />

                <FormControlLabel control={<Checkbox onChange={handleChangeChecked} checked={checked}/>}
                                  label="Период"/>
                {checked &&
                  <Stack direction="row" spacing={2} sx={{width: '40%'}}>
                    <TextField label="Интервал" variant="outlined" size='small'
                               type="number" value={interval}
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
                                    onChange={(newValue) => setUnit(newValue.target.value)} {...params}
                                    label="Ед. измерения"/>}
                    />
                  </Stack>
                }
              </Stack>
              <Typography mb={2}>Материалы в заявке</Typography>
              <Stack direction="row" spacing={2}>
                <TextField label="КССС" variant="outlined" size='small' type="number"
                           required
                           value={csss}
                           onChange={(newValue) => setCsss(newValue.target.value)}
                           InputProps={{
                             inputProps: {min: 1}
                           }}
                />
                <TextField label="Количество" variant="outlined" size='small'
                           type="number"
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
          <Paper sx={{width: '100%'}} style={{marginLeft: "0px", padding: "20px"}}>
            {consumables && consumables!.length !== 0 && consumables!.map(
              (row: ApplicationConsumable) => (
                <Stack direction="row" width='100%' spacing={1} mb={1}>
                  <TextField label="Наименование" variant="outlined" disabled
                             size='small'
                             type="string"
                             value={row.consumable.title}
                             style={{width: '30%'}}
                  />
                  <TextField label="КССС" variant="outlined" size='small' disabled
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
                  <TextField label="Наименование" variant="outlined" disabled
                             size='small'
                             type="string"
                             value={row.device.title}
                             style={{width: '30%'}}
                  />
                  <TextField label="КССС" variant="outlined" size='small' disabled
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
        <Paper sx={{width: '100%'}} style={{padding: "20px"}}>
          <Stack direction='row' justifyContent='space-between' sx={{width: '100%'}}>
            <Button variant="contained" onClick={() => {
              deleteApplication(application.number!)
            }}>Удалить заявку</Button>
            <Button variant="contained" onClick={saveApplication}>Утвердить</Button>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  )
}

export default ChangeApplicationModal;
