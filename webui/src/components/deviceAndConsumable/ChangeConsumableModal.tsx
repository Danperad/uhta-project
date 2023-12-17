import {Box, Button, Modal, Paper, Stack, TextField, Typography} from "@mui/material";
import style from "../../assets/css/ChangeDeviceModal.module.css";
import {useEffect, useState} from "react";
import {Binding, Consumable, Device} from '../../models';
import {AddSnackbar} from "../../redux/actions/snackbarAction";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../redux/store";
import DeviceService from "../../services/DeviceService";
import styl from "../../assets/css/ChildModalDeleteMaterial.module.css";
import ConsumableService from "../../services/ConsumableService";

function ChangeConsumableModal(props: { receivedMaterial: Consumable, closeEvent: () => void }) {
    const dispatch = useDispatch<AppDispatch>();
    const [consumable, setConsumable] = useState<Consumable>(props.receivedMaterial);
    const [csss, setCsss] = useState<string | undefined>();
    const [amount, setAmount] = useState<string | undefined>();
    const [device, setDevice] = useState<Device | undefined>();


    const [openChildModal, setOpenChildModal] = useState(false);
    const [openChildModalAddParent, setOpenChildModalAddParent] = useState(false);

    const handleClose = () => {
        setOpenChildModal(false);
        props.closeEvent()
    };
    const handleCloseAddParent = () => {
        setOpenChildModal(false);
        setDevice(undefined);
        setOpenChildModalAddParent(false);
        props.closeEvent()
    }

    const saveChange = async () => {
        const savedConsumable = await ConsumableService.saveConsumable(consumable)
        if (!savedConsumable) {
            dispatch(AddSnackbar({
                messageText: "Не удалось изменить расходник!",
                messageType: "error",
                key: +new Date()
            }))
            return
        }
        dispatch(AddSnackbar({
            messageText: "Расходник успешно изменен!",
            messageType: "success",
            key: +new Date()
        }))
        setOpenChildModal(false)
        props.closeEvent()
        const consumables = await ConsumableService.getAllConsumables()
        if (!consumables) return
        dispatch(consumables)
    }
    const deleteConsumable = async () => {
        const isDeleted = await ConsumableService.deleteConsumableByCsss(consumable.csss)
        if (!isDeleted) {
            dispatch(AddSnackbar({
                messageText: "Не удалось удалить расходник!",
                messageType: "error",
                key: +new Date()
            }))
            return
        }
        dispatch(AddSnackbar({
            messageText: "Расходник успешно удален!",
            messageType: "success",
            key: +new Date()
        }))
        setOpenChildModal(false);
        props.closeEvent()
        const consumables = await ConsumableService.getAllConsumables()
        if (!consumables) return
        dispatch(consumables)
    }

    function changeMaterialInOperation(id : number, newValue: number) {
        if (newValue < 0) return
        let bind = consumable.devices.find(d => d.id === +id);
        if (newValue < bind!.count && consumable!.inOperation - 1 >= 0) {
            if(bind){
                bind!.count = newValue;
                setConsumable({...consumable!, inOperation: consumable!.inOperation - 1})
            }
            return;
        }
        else if (newValue > bind!.count && consumable!.inStock - 1 >= 0) {
            if(bind){
                bind!.count = newValue;
                setConsumable({
                    ...consumable!,
                    inOperation: consumable!.inOperation + 1,
                    inStock: consumable!.inStock - 1
                })
                }
        } else {
            dispatch(AddSnackbar({
                messageText: "Приборы на складе закончились!",
                messageType: "error",
                key: +new Date()
            }))
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

    const checkCorrectData = async () => {
        if (!csss) return

        if (consumable.devices && consumable.devices.find(d => d.device!.csss === +csss)) {
            dispatch(AddSnackbar({
                messageText: "Прибор уже привязан",
                messageType: "error",
                key: +new Date()
            }))
            return;
        }
        if (!amount || amount === '') {
            dispatch(AddSnackbar({
                messageText: "Количество должно быть больше 0",
                messageType: "error",
                key: +new Date()
            }))
            setDevice(undefined);
            return;
        }
        if (parseInt(amount!) > consumable!.inStock) {
            dispatch(AddSnackbar({
                messageText: "Недостаточно на складе!",
                messageType: "error",
                key: +new Date()
            }))
            setDevice(undefined);
            return;
        }

        const res = await DeviceService.getDeviceByCsss(+csss!)
        if (!res) {
            dispatch(AddSnackbar({
                messageText: "Прибор с КССС: " + csss + " не найден!",
                messageType: "error",
                key: +new Date()
            }))
            return;
        }
        setDevice(res);
        setOpenChildModalAddParent(true);
    }

    const bind = async () => {
        if (!consumable || !amount) return
        const devices = !consumable.devices ? [] as Binding[] : consumable.devices
        const newDevice = {
            id: 0,
            device: device,
            count: +amount
        } as Binding
        devices.push(newDevice)
        const addedConsumable = await ConsumableService.saveConsumable({
            ...consumable, inOperation: consumable.inOperation + parseInt(amount),
            inStock: consumable.inStock - parseInt(amount), devices: devices
        })
        if (!addedConsumable) {
            dispatch(AddSnackbar({
                messageText: "Не удалось добавить привязку!",
                messageType: "error",
                key: +new Date()
            }))
            return
        }
        setConsumable(addedConsumable)
        setOpenChildModal(false);
        setDevice(undefined)
        dispatch(AddSnackbar({
            messageText: "Привязка успешно добавлена!",
            messageType: "success",
            key: +new Date()
        }))
        const newDevices = await DeviceService.getAllDevices()
        if (newDevices)
            dispatch(newDevices)
        const newConsumables = await ConsumableService.getAllConsumables()
        if (newConsumables)
            dispatch(newConsumables)
    }

    const delBind = async (csss: number) => {
        if (!consumable) return
        const newConsumable = consumable
        newConsumable.devices = newConsumable.devices.filter((d) => d.device!.csss !== csss)
        try {
            await ConsumableService.saveConsumable(newConsumable)
            dispatch(AddSnackbar({
                messageText: "Материал отвязан!",
                messageType: "success",
                key: +new Date()
            }))
        } catch (e) {
            dispatch(AddSnackbar({
                messageText: "АЛЯРМА!",
                messageType: "error",
                key: +new Date()
            }))
        }
    };

    useEffect(() => {
        if (device) {
            setOpenChildModalAddParent(true);
        } else {
            setOpenChildModalAddParent(false);
        }
    }, [device])

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
                            <Typography color="primary">{consumable ? consumable.title : ""}</Typography>
                            <Typography mb={2}>№КССС:</Typography>
                            <Typography color="primary">{consumable ? consumable.csss : ""}</Typography>
                            <Typography mb={2}>№R-3:</Typography>
                            <Typography color="primary">{consumable ? consumable.nr3 : ""}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={2} mt={1}>
                            <Typography mb={2}>Количество на складе:</Typography>
                            <TextField variant="outlined" size='small' type="number"
                                       style={{marginLeft: "10px", width: "10%"}}
                                       value={consumable ? consumable.inStock : ""}
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
                                    <TextField label="КССС" variant="outlined" size='small' type="number"
                                               required
                                               value={csss} onChange={(newValue) => setCsss(newValue.target.value)}
                                               InputProps={{
                                                   inputProps: {min: 1}
                                               }}
                                    />
                                    <TextField label="Количество" variant="outlined" size='small'
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
                                {consumable && consumable!.devices && consumable!.devices.length !== 0 && (
                                    consumable!.devices.map((row) => (
                                        <Stack direction="row" width='100%' spacing={1} mb={1}>
                                            <TextField label="Наименование" variant="outlined" disabled
                                                       size='small'
                                                       type="string"
                                                       value={row.device!.title}
                                                       style={{width: '30%'}}
                                            />
                                            <TextField label="КССС" variant="outlined" size='small' disabled
                                                       type="number"
                                                       value={row.device!.csss}
                                                       InputProps={{
                                                           inputProps: {min: 1}
                                                       }}
                                            />
                                            <TextField label="Количество"
                                                       variant="outlined"
                                                       size='small'
                                                       type="number"
                                                       value={row.count}
                                                       onChange={(newValue) => changeMaterialInOperation(row.id!, parseInt(newValue.target.value))}
                                            />
                                            <Button variant="outlined" onClick={() => {
                                                delBind(row.device!.csss)
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
                        <Typography color="primary">{consumable ? consumable!.title : ""}</Typography>
                        <Stack direction='row' spacing={1} alignItems="center" justifyContent="center">
                            <Typography>№КССС:</Typography>
                            <Typography color="primary">{consumable ? consumable!.csss : ""}</Typography>
                            <Typography mb={2}>№R-3:</Typography>
                            <Typography color="primary">{consumable ? consumable!.nr3 : ""}</Typography>
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
                            <Typography color="primary">{consumable ? consumable!.title : ""}</Typography>
                            <Typography> к прибору </Typography>
                            <Stack direction='row' spacing={1} alignItems="center" justifyContent="center">
                                <Typography color="primary">{device ? device!.title : ""}</Typography>
                                <Typography>№КССС:</Typography>
                                <Typography color="primary">{device ? device!.csss : ""}</Typography>
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

export default ChangeConsumableModal