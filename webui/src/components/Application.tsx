import {useEffect, useState} from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    Modal,
    Paper,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {style} from '../assets/css/CreateOrderModal';
import DeviceService from "../services/DeviceService";
import ApplicationTable from "./ApplicationTable";
import {AddSnackbar} from "../redux/actions/snackbarAction";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../redux/store";
import {Consumable, Device} from "../models";
import ConsumableService from "../services/ConsumableService";
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';

export default function Application() {
    const state = useSelector((state: RootState) => state);
    const dispatch = useDispatch<AppDispatch>();
    const [checked, setChecked] = useState(false);
    const [key, setKey] = useState(false);

    const [openCreateOrderModal, setCreateApplicationModalOpen] = useState(false);

    const [materialAmount, setMaterialAmount] = useState<string | undefined>();

    const [showOrderTable, setShowApplicationTable] = useState(false);
    const [csss, setCsss] = useState<string | undefined>();

    const [devices, setDevices] = useState<Device[]>([]);
    const [consumables, setConsumables] = useState<Consumable[]>([]);

    const handleOpenCreateApplicationModal = () => setCreateApplicationModalOpen(true);
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
    const Unit = [
        {label: 'Дни'},
        {label: 'Месяцы'},
    ]
    const Purchase = [
        {label: 'Внутренний'},
        {label: 'Внешний'},
    ]

    const handleShowApplicationTable = () => setShowApplicationTable(true);

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

        if(devices.find(d => d.csss === +csss))
        {
            dispatch(AddSnackbar({
                messageText: "Прибор с таким КССС уже добавлен",
                messageType: "error",
                key: +new Date()
            }))
            return
        }
        if(consumables.find(d => d.csss === +csss))
        {
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
            const tmp: Device[] = []
            devices.forEach((d) => {
                tmp.push(d)
            })

            tmp.push({...resDevice!, inStock: parseInt(materialAmount)})
            setDevices(tmp)
        } else {
            const tmp: Consumable[] = []
            consumables?.forEach((c) => {
                tmp.push(c)
            })

            tmp.push({...resConsumable!, inStock: parseInt(materialAmount)})
            setConsumables(tmp)
        }
        setMaterialAmount(undefined)
        setCsss(undefined)

    }

    const delDevice = async (csss: number) => {
        setDevices(devices.filter((d) => d.csss !== csss))
    }
    const delConsumable = async (csss: number) => {
        setConsumables(consumables.filter((c) => c.csss !== csss))
    }

    function changeConsumableAmountInApplication(newValue: number, csss: number)
    {
        if (newValue < 1)
        {
            dispatch(AddSnackbar({
                messageText: "Недопустимое количество",
                messageType: "error",
                key: +new Date()
            }))
            return
        }
        const selectConumsble = consumables.find(c => c.csss === csss)
        if(!selectConumsble)
            return;
        selectConumsble.inStock = newValue
        const tmp = consumables.filter(c => c.csss !== csss)
        tmp.push(selectConumsble)
        setConsumables(tmp)
    }
    function changeDeviceAmountInApplication(newValue: number, csss: number)
    {
        if (newValue < 1)
        {
            dispatch(AddSnackbar({
                messageText: "Недопустимое количество",
                messageType: "error",
                key: +new Date()
            }))
            return
        }
        const selectDevice = devices.find(c => c.csss === csss)
        if(!selectDevice)
            return;
        selectDevice.inStock = newValue
        const tmp = devices.filter(c => c.csss !== csss)
        tmp.push(selectDevice)
        setDevices(tmp)
    }

    useEffect(() => {
        if (key) return
        setKey(true)
        DeviceService.getAllDevices().then((res) => {
            if (res) dispatch(res);
        });
    }, [])

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
                                <TextField sx={{width: '30%'}} label="Поиск" variant="outlined"
                                           size='small' type="search"/>
                                <TextField label="От" type="date" size='small' sx={{width: '16%'}}
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                />
                                <TextField label="До" type="date" size='small' sx={{width: '16%'}}
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                />
                                <Button variant="contained" onClick={handleShowApplicationTable}>Показать</Button>
                            </Stack>
                            <Button variant="contained" onClick={handleOpenCreateApplicationModal}>Создать</Button>
                        </Stack>
                    </Paper>
                </Box>
                <Box sx={{height: "84vh", gridArea: 'main'}}>
                    {showOrderTable && <ApplicationTable/>}
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
                                                   InputLabelProps={{
                                                       shrink: true,
                                                   }}
                                        />
                                        <Autocomplete disablePortal size='small' options={Purchase}
                                                      sx={{width: '16%'}}
                                                      renderInput={(params) => <TextField {...params} label="Закуп"/>}
                                        />
                                        <FormControlLabel control={<Checkbox onChange={handleChangeChecked}/>}
                                                          label="Период"/>
                                        {checked && <Stack direction="row" spacing={2} sx={{width: '40%'}}>
                                            <TextField label="Интервал" variant="outlined" size='small'
                                                       type="number"
                                                       InputProps={{
                                                           inputProps: {min: 1}
                                                       }}
                                            />
                                            <Autocomplete disablePortal size='small' options={Unit}
                                                          sx={{width: '40%'}}
                                                          renderInput={(params) => <TextField {...params}
                                                                                              label="Ед. измерения"/>}
                                            />
                                        </Stack>}
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
                                {consumables && consumables!.length !== 0 && (
                                    consumables!.map((row: Consumable) => (
                                        <Stack direction="row" width='100%' spacing={1} mb={1}>
                                            <TextField label="Наименование" variant="outlined"
                                                       size='small'
                                                       type="string"
                                                       value={row.title}
                                                       style={{width: '30%'}}
                                            />
                                            <TextField label="КССС" variant="outlined" size='small'
                                                       type="number"
                                                       value={row.csss}
                                                       InputProps={{
                                                           inputProps: {min: 1}
                                                       }}
                                            />
                                            <TextField label="Количество"
                                                       variant="outlined"
                                                       size='small'
                                                       type="number"
                                                       value={row.inStock}
                                                       onChange={(newValue) => changeConsumableAmountInApplication(parseInt(newValue.target.value), row.csss)}
                                            />
                                            <IconButton aria-label="delete" size="large" style={{marginTop: "-8px"}}
                                                        onClick={() => {
                                                            delConsumable(row.csss)
                                                        }}>
                                                <IndeterminateCheckBoxOutlinedIcon fontSize="inherit"/>
                                            </IconButton>
                                        </Stack>
                                    ))
                                )}

                                {devices && devices!.length !== 0 && (
                                    devices!.map((row: Device) => (
                                        <Stack direction="row" width='100%' spacing={1} mb={1}>
                                            <TextField label="Наименование" variant="outlined"
                                                       size='small'
                                                       type="string"
                                                       value={row.title}
                                                       style={{width: '30%'}}
                                            />
                                            <TextField label="КССС" variant="outlined" size='small'
                                                       type="number"
                                                       value={row.csss}
                                                       InputProps={{
                                                           inputProps: {min: 1}
                                                       }}
                                            />
                                            <TextField label="Количество"
                                                       variant="outlined"
                                                       size='small'
                                                       type="number"
                                                       value={row.inStock}
                                                        onChange={(newValue) => changeDeviceAmountInApplication(parseInt(newValue.target.value), row.csss)}
                                            />
                                            <IconButton aria-label="delete" size="large" style={{marginTop: "-8px"}}
                                                        onClick={() => {
                                                            delDevice(row.csss)
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
                                <Button variant="contained">Удалить заявку</Button>
                                <Button variant="contained">Утвердить</Button>
                            </Stack>
                        </Paper>
                    </Stack>
                </Box>
            </Modal>
        </Box>

    )
}