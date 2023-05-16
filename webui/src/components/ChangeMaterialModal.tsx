import {Box, Button, Modal, Paper, Stack, TextField, Typography} from "@mui/material";
import style from "../assets/css/ChangeDeviceModal.module.css";
import {useEffect, useState} from "react";
import {Consumable, Device} from '../models';
import {AddSnackbar} from "../redux/actions/snackbarAction";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../redux/store";
import DeviceService from "../services/DeviceService";
import styl from "../assets/css/ChildModalDeleteMaterial.module.css";
import ConsumableService from "../services/ConsumableService";

function ChangeMaterialModal(props: { receivedMaterial: Consumable }) {
    const dispatch = useDispatch<AppDispatch>();
    const [consumable, setConsumable] = useState<Consumable | null>(props.receivedMaterial);
    const [csss, setCsss] = useState<string | null>();
    const [amount, setAmount] = useState<string | null>();
    const [device, setDevice] = useState<Device | null>();


    const [openChildModal, setOpenChildModal] = useState(false);
    const [openChildModalAddParent, setOpenChildModalAddParent] = useState(false);

    const handleClose = () => {
        setOpenChildModal(false);
        setConsumable(null);
    };
    const handleCloseAddParent = () => {
        setOpenChildModal(false);
        setConsumable(null);
        setDevice(null);
        setOpenChildModalAddParent(false);
    }

    const saveChange = () => {
        ConsumableService.saveConsumable(consumable!).then(res => {
            if (res) {
                setOpenChildModal(false);
                setConsumable(null);
                dispatch(AddSnackbar({
                    messageText: "Расходник успешно изменен!",
                    messageType: "success",
                    key: +new Date()
                }))
                ConsumableService.getAllConsumables().then((res) => {
                    dispatch(res);
                }).catch(err => console.log(err));
            } else {
                dispatch(AddSnackbar({
                    messageText: "Не удалось изменить расходник!",
                    messageType: "error",
                    key: +new Date()
                }))
            }
        })
    }
    const deleteConsumable = () => {
        ConsumableService.deleteConsumableByCsss(consumable!.csss).then(res => {
            if (res) {
                setOpenChildModal(false);
                setConsumable(null)
                dispatch(AddSnackbar({
                    messageText: "Расходник успешно удален!",
                    messageType: "success",
                    key: +new Date()
                }))
                ConsumableService.getAllConsumables().then((res) => {
                    dispatch(res);
                }).catch(err => console.log(err));

            } else {
                dispatch(AddSnackbar({
                    messageText: "Не удалось удалить расходник!",
                    messageType: "error",
                    key: +new Date()
                }))
            }
        })
    }

    function changeMaterialInOperation(newValue: number) {
        if (newValue >= 0) {
            if (newValue < consumable!.inOperation && consumable!.inOperation - 1 >= 0) {
                setConsumable({...consumable!, inOperation: consumable!.inOperation - 1})
                return;
            }
            if (newValue > consumable!.inOperation && consumable!.inStock - 1 >= 0) {
                setConsumable({
                    ...consumable!,
                    inOperation: consumable!.inOperation + 1,
                    inStock: consumable!.inStock - 1
                })
            } else {
                dispatch(AddSnackbar({
                    messageText: "Приборы на складе закончились!",
                    messageType: "error",
                    key: +new Date()
                }))
            }
        }
    }

    function changeMaterialInStock(newValue: number) {
        if (newValue >= 0) {
            if (newValue > consumable!.inStock) {
                setConsumable({...consumable!, inStock: consumable!.inStock + 1})
            }
            if (newValue < consumable!.inStock) {
                setConsumable({...consumable!, inStock: consumable!.inStock - 1})
            }
        }
    }

    const checkCorrectData = () => {
        let device: Device | null = null;
        if (csss !== null || csss !== '' || csss !== undefined) {
            DeviceService.getDeviceByCsss(parseInt(csss!)).then((res) => {
                if (res === null) {
                    dispatch(AddSnackbar({
                        messageText: "Прибор с КССС: " + csss + " не найден!",
                        messageType: "error",
                        key: +new Date()
                    }))
                    return;
                }
                device = res;
                if (amount === null || amount === '' || amount === undefined) {
                    dispatch(AddSnackbar({
                        messageText: "Количество должно быть больше 0",
                        messageType: "error",
                        key: +new Date()
                    }))
                    setDevice(null);
                    return;
                }
                if (parseInt(amount!) > consumable!.inStock) {
                    dispatch(AddSnackbar({
                        messageText: "Недостаточно на складе!",
                        messageType: "error",
                        key: +new Date()
                    }))
                    setDevice(null);
                    return;
                }
                setDevice(device);
                setOpenChildModalAddParent(true);
            });
        }
    }

    const bind = () => {
        if (consumable === undefined || consumable == null) return
        const devices = consumable!.devices === undefined ? [] as Device[] : consumable!.devices
        devices.push(device!)
        ConsumableService.saveConsumable({
            ...consumable!, inOperation: consumable!.inOperation + parseInt(amount!),
            inStock: consumable!.inOperation - parseInt(amount!), devices: devices
        }).then(res => {
            if (res) {
                setOpenChildModal(false);
                setDevice(null)
                dispatch(AddSnackbar({
                    messageText: "Привязка успешно добавлена!",
                    messageType: "success",
                    key: +new Date()
                }))
                DeviceService.getAllDevices().then((res) => {
                    dispatch(res);
                }).catch(err => console.log(err));
            } else {
                dispatch(AddSnackbar({
                    messageText: "Не удалось добавить привязку!",
                    messageType: "error",
                    key: +new Date()
                }))
            }
        })
    }

    const delBind = async (csss: number) => {
        if (consumable === null) return
        const newConsumable = consumable
        newConsumable.devices = newConsumable?.devices.filter((d) => d.csss !== csss)
        const res = await ConsumableService.saveConsumable(newConsumable!)
        dispatch(AddSnackbar({
            messageText: "Материал отвязан!",
            messageType: "success",
            key: +new Date()
        }))
    };

    useEffect(() => {
        if (device !== null) {
            setOpenChildModalAddParent(true);
        } else {
            setOpenChildModalAddParent(false);
        }
    })

    return (
        <Box className={style.modalStyle}>
            <Stack direction="column"
                   justifyContent="space-between"
                   spacing={2}
                   sx={{width: '97.6%', height: '100%'}} style={{margin: '0px'}}>
                <div style={{width: '100%', height: '80%'}}>
                    <Paper sx={{width: '100%'}} style={{marginLeft: "0px", padding: "20px", marginBottom: "8px"}}>
                        <Stack direction="row" spacing={2} sx={{width: '100%'}}>
                            <Typography mb={2}>Редактирование материала:</Typography>
                            <Typography color="primary">{consumable !== null ? consumable!.title : ""}</Typography>
                            <Typography mb={2}>№КССС:</Typography>
                            <Typography color="primary">{consumable !== null ? consumable!.csss : ""}</Typography>
                            <Typography mb={2}>№R-3:</Typography>
                            <Typography color="primary">{consumable !== null ? consumable!.nr3 : ""}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={2} mt={1}>
                            <Typography mb={2}>Количество на складе:</Typography>
                            <TextField id="inStockMaterial" variant="outlined" size='small' type="number"
                                       style={{marginLeft: "10px", width: "10%"}}
                                       value={consumable !== null ? consumable!.inStock : ""}
                                       onChange={(newValue) => changeMaterialInStock(parseInt(newValue.target.value))}
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       InputProps={{
                                           inputProps: {min: 0}
                                       }}
                            />
                        </Stack>
                    </Paper>
                    <div className='section' style={{height: '70%', width: '102.6%'}}>
                        <Paper style={{marginLeft: "0px", padding: "20px", marginBottom: "8px"}}>
                            <Typography mb={2}>КССС привязки материала к приборам:</Typography>
                            <Stack spacing={2}>
                                <Stack direction="row" width='100%' spacing={1}>
                                    <TextField id="kccc" label="КССС" variant="outlined" size='small' type="number"
                                               required
                                               value={csss} onChange={(newValue) => setCsss(newValue.target.value)}
                                               InputProps={{
                                                   inputProps: {min: 1}
                                               }}
                                    />
                                    <TextField id="amount-material" label="Количество" variant="outlined" size='small'
                                               type="number" required
                                               value={amount}
                                               onChange={(newValue) => setAmount(newValue.target.value)}
                                        //onChange={(newValue) => changeMaterialInOperation(parseInt(newValue.target.value))}
                                               InputLabelProps={{
                                                   shrink: true,
                                               }}
                                    />
                                    <Button variant="contained" onClick={checkCorrectData}>добавить</Button>
                                </Stack>
                                {consumable !== null && consumable!.devices !== undefined && consumable!.devices.length !== 0 && (
                                    consumable!.devices.map((row: Device) => (
                                        <Stack direction="row" width='100%' spacing={1} mb={1}>
                                            <TextField id="title" label="Наименование" variant="outlined"
                                                       size='small'
                                                       type="string"
                                                       value={row.title}
                                                       style={{width: '30%'}}
                                            />
                                            <TextField id="kccc" label="КССС" variant="outlined" size='small'
                                                       type="number"
                                                       value={row.csss}
                                                       InputProps={{
                                                           inputProps: {min: 1}
                                                       }}
                                            />
                                            <TextField id="amount-material" label="Количество"
                                                       variant="outlined"
                                                       size='small'
                                                       type="number"
                                                       value={row.inOperation}
                                                       onChange={(newValue) => changeMaterialInOperation(parseInt(newValue.target.value))}
                                            />
                                            <Button variant="outlined" onClick={() => {
                                                delBind(row.csss)
                                            }}>отвязать</Button>

                                        </Stack>
                                    ))
                                )}
                            </Stack>
                        </Paper>
                    </div>
                </div>
                <Paper sx={{width: '100%'}} style={{padding: "20px"}}>
                    <Stack direction='row' justifyContent='space-between' sx={{width: '100%'}}>
                        <Button variant="contained" onClick={() => setOpenChildModal(true)}>Удалить материал</Button>
                        <Button variant="contained" onClick={saveChange}>Сохранить изменения</Button>
                    </Stack>
                </Paper>
                <Modal
                    open={openChildModal}
                    onClose={handleClose}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box className={styl.childModalStyle}>
                        <Typography>Вы точно хотите удалить расходник? </Typography>
                        <Typography color="primary">{consumable !== null ? consumable!.title : ""}</Typography>
                        <Stack direction='row' spacing={1} alignItems="center" justifyContent="center">
                            <Typography>№КССС:</Typography>
                            <Typography color="primary">{consumable !== null ? consumable!.csss : ""}</Typography>
                            <Typography mb={2}>№R-3:</Typography>
                            <Typography color="primary">{consumable !== null ? consumable!.nr3 : ""}</Typography>
                        </Stack>
                        <Stack direction='row' justifyContent="space-between" m={8}>
                            <Button onClick={handleClose} variant="contained">Отмена</Button>
                            <Button onClick={deleteConsumable} variant="contained">Удалить</Button>
                        </Stack>
                    </Box>
                </Modal>
                {device !== undefined &&
                    <Modal
                        open={openChildModalAddParent}
                        onClose={handleCloseAddParent}
                        aria-labelledby="child-modal-add-parent-title"
                        aria-describedby="child-modal-add-parent-description"
                    >
                        <Box className={styl.childModalStyle}>
                            <Typography>Вы точно хотите привязать расходник </Typography>
                            <Typography color="primary">{consumable !== null ? consumable!.title : ""}</Typography>
                            <Typography> к прибору </Typography>
                            <Stack direction='row' spacing={1} alignItems="center" justifyContent="center">
                                <Typography color="primary">{device !== null ? device!.title : ""}</Typography>
                                <Typography>№КССС:</Typography>
                                <Typography color="primary">{device !== null ? device!.csss : ""}</Typography>
                            </Stack>
                            <Stack direction='row' justifyContent="space-between" m={8}>
                                <Button onClick={handleCloseAddParent} variant="contained">Отмена</Button>
                                <Button onClick={bind} variant="contained">Привязать</Button>
                            </Stack>
                        </Box>
                    </Modal>
                }
            </Stack>
        </Box>
    )
}

export default ChangeMaterialModal