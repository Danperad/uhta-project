import {useEffect, useState} from "react";
import fileDownload from "js-file-download";
import {Application, ApplicationConsumable, ApplicationDevice} from "../../models";
import OrderService from "../../services/ApplicationService";
import ApplicationService from "../../services/ApplicationService";
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import moment from 'moment';
import {style} from "../../assets/css/CreateOrderModal";
import IndeterminateCheckBoxOutlinedIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";
import {AddSnackbar} from "../../redux/actions/snackbarAction";
import DeviceService from "../../services/DeviceService";
import ConsumableService from "../../services/ConsumableService";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../redux/store";

export default function ApplicationTable() {
    const [orders, setOrders] = useState<Application[]>([]);
    const [key, setKey] = useState<boolean>(false);

    const [date, setDate] = useState('')
    const [purchase, setPurchase] = useState<string>()
    const [interval, setInterval] = useState<number>()
    const [unit, setUnit] = useState<string>()

    const [checked, setChecked] = useState(false);
    const [csss, setCsss] = useState<string | undefined>();
    const [materialAmount, setMaterialAmount] = useState<string | undefined>();
    const dispatch = useDispatch<AppDispatch>();
    const [devices, setDevices] = useState<ApplicationDevice[]>([]);
    const [consumables, setConsumables] = useState<ApplicationConsumable[]>([]);


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

    const [application, setApplication] = useState<Application>()
    const [openChangeApplicationModal, setChangeApplicationModal] = useState(false);

    const handleOpenEditApplicationModal = async (application: Application) => {
        console.log(application)
        if (!application) return;
        setApplication(application);
    }
    const handleCloseEditApplicationModal = () => {
        setApplication(undefined);
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
    const delConsumable = (csss: number) => {
        setConsumables(consumables.filter((c) => c.consumable.csss !== csss))
    }
    const delDevice = (csss: number) => {
        setDevices(devices.filter((d) => d.device.csss !== csss))
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
            number: undefined,
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
        setChangeApplicationModal(false);
    }

    const downloadApplication = async (id: number) => {
        const res = await ApplicationService.downloadFile(id);
        if (!res)
            return
        fileDownload(res, `application-${id}.xlsx`)
    }

    const archiveApplication = async (id: number) => {
        const inArchive = await ApplicationService.archiveApplicationById(id)
        if (!inArchive) {
            dispatch(AddSnackbar({
                messageText: "Не удалось архивировать заявку!",
                messageType: "error",
                key: +new Date()
            }))
            return
        }
        dispatch(AddSnackbar({
            messageText: "Заявка успешно архивирована!",
            messageType: "success",
            key: +new Date()
        }))

        const allApplication = await ApplicationService.getAllApplications()
        if (!allApplication)
            return
        setOrders(allApplication)
        //dispatch(allApplication)
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

        const allApplication = await ApplicationService.getAllApplications()
        if (!allApplication)
            return
        setOrders(allApplication)
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
        OrderService.getAllApplications().then((res) => {
            if (!res) return
            setOrders(res);
        }).catch(err => console.log(err));
    }, [])

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

    return (
        <div className='section' style={{height: '100%', width: '100%'}}>
            {orders.length !== 0 ? (
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow sx={{cursor: "default"}}>
                                <TableCell>Номер</TableCell>
                                <TableCell align="left">Тип закупа</TableCell>
                                <TableCell align="center">Дата</TableCell>
                                <TableCell align="center">Статус</TableCell>
                                <TableCell align="center">Архивация</TableCell>
                                <TableCell align="center">Скачивание</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((row) => (
                                <TableRow
                                    key={row.number}
                                    sx={{'&:last-child td, &:last-child th': {border: 0, cursor: "pointer"}}}
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
                                        handleOpenEditApplicationModal(row)
                                    }}>{row.status}</TableCell>
                                    <TableCell align="center"><Button
                                        variant="outlined" onClick={() => {
                                            archiveApplication(row.number!)
                                        }}>Архивировать</Button>
                                    </TableCell>
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
                    {[0, 1, 2, 3, 4].map((i) => (
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
                                    <Typography mb={2}>Редактирование заявки</Typography>
                                    <Stack direction="column" spacing={2}>
                                        <Stack direction="row" spacing={2}>
                                            <TextField label="Дата" type="date" size='small' sx={{width: '16%'}}
                                                       defaultValue={application.date} value={date}
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
                                                                  renderInput={(params) => <TextField {...params}
                                                                                                      value={unit}
                                                                                                      onChange={(newValue) => setUnit(newValue.target.value)}
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
                                    <Button variant="contained" onClick={() => {
                                        deleteApplication(application.number!)
                                    }}>Удалить заявку</Button>
                                    <Button variant="contained" onClick={saveApplication}>Утвердить</Button>
                                </Stack>
                            </Paper>
                        </Stack>
                    </Box>
                </Modal>
            }
        </div>
    )
}