import {useState} from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    Modal,
    Paper, Skeleton,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {style} from '../../assets/css/CreateOrderModal';
import DeviceService from "../../services/DeviceService";
import ApplicationTable from "./ApplicationTable";
import {AddSnackbar} from "../../redux/actions/snackbarAction";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../redux/store";
import {Application, ApplicationConsumable, ApplicationDevice} from "../../models";
import ConsumableService from "../../services/ConsumableService";
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import ApplicationService from "../../services/ApplicationService";

export default function ApplicationPage() {
    const dispatch = useDispatch<AppDispatch>();
    const [checked, setChecked] = useState(false);

    const [openCreateOrderModal, setCreateApplicationModalOpen] = useState(false);

    const [materialAmount, setMaterialAmount] = useState<string | undefined>();

    const [showOrderTable, setShowApplicationTable] = useState(false);
    const [csss, setCsss] = useState<string | undefined>();

    const [devices, setDevices] = useState<ApplicationDevice[]>([]);
    const [consumables, setConsumables] = useState<ApplicationConsumable[]>([]);

    const [date, setDate] = useState('')
    const [purchase, setPurchase] = useState<string>()
    const [interval, setInterval] = useState<number>()
    const [unit, setUnit] = useState<string>()

    const handleOpenCreateApplicationModal = () => {
        setCreateApplicationModalOpen(true)
        DeviceService.getAllDevices().then((res) => {
            if (res) dispatch(res);
        });
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
    //Dictionaries
    const Unit = ['Дни', 'Месяцы',]
    const Purchase = ['Внутренний', 'Внешний',]
    const Statuses = ['Новая', 'На согласование', 'Согласована']

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
        const application = await ApplicationService.getAllApplications(search, false,  status, dateStart, dateEnd);
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

    const addApplication = ()=> {

        console.log(unit);
        console.log(purchase);


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
            return
        }
        dispatch(AddSnackbar({
            messageText: "Заявка успешно добавлена!",
            messageType: "success",
            key: +new Date()
        }))
        setCreateApplicationModalOpen(false);
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
                                <TextField sx={{width: '30%'}} label="Поиск" variant="outlined" size='small'
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
                            </Stack>
                            <Button variant="contained" onClick={handleOpenCreateApplicationModal}>Создать</Button>
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
                           sx={{width: '97%', height: '100%'}} style={{margin: '0px'}}>
                        <div>
                            <Paper sx={{width: '100%'}}
                                   style={{marginLeft: "0px", padding: "20px", marginBottom: "8px"}}>
                                <Typography mb={2}>Создание заявки</Typography>
                                <Stack direction="column" spacing={2}>
                                    <Stack direction="row" spacing={2}>
                                        <TextField label="Дата" type="date" size='small' sx={{width: '16%'}}
                                                   defaultValue={+Date()} value={date}
                                                   onChange={e=>{
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
                                                          onChange={(newValue) => setPurchase(newValue.target.value)} {...params}
                                                          label="Закуп"/>}

                                        />

                                        <FormControlLabel control={<Checkbox onChange={handleChangeChecked}/>}
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
                        <Paper sx={{width: '100%'}} style={{padding: "20px"}}>
                            <Stack direction='row' justifyContent='space-between' sx={{width: '100%'}}>
                                <Button variant="contained" onClick={handleCloseCreateOrderModal}>Отмена</Button>
                                <Button variant="contained" onClick={addApplication}>Создать</Button>
                            </Stack>
                        </Paper>
                    </Stack>
                </Box>
            </Modal>
        </Box>

    )
}