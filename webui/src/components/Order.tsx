import {useEffect, useState} from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Modal,
    Paper,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {style} from '../assets/css/CreateOrderModal';
import DeviceService from "../services/DeviceService";
import OrderTable from "./OrderTable";
import {AddSnackbar} from "../redux/actions/snackbarAction";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../redux/store";

export default function Order() {
    const state = useSelector((state: RootState) => state);
    const dispatch = useDispatch<AppDispatch>();
    const [checked, setChecked] = useState(false);
    const [key, setKey] = useState(false);
    const OrderPerriod = () => (
        <Stack direction="row" spacing={2} sx={{width: '40%'}}>
            <TextField id="interval" label="Интервал" variant="outlined" size='small' type="number"
                       InputProps={{
                           inputProps: {min: 1}
                       }}
            />
            <Autocomplete disablePortal id="combo-box-unit" size='small' options={Unit} sx={{width: '40%'}}
                          renderInput={(params) => <TextField {...params} label="Ед. измерения"/>}
            />
        </Stack>
    )

    const [dateTimeOt, setDateTimeOt] = useState<string>();
    const [dateTimeDo, setDateTimeDo] = useState<string>();

    const [openCreateOrderModal, setCreateOrderModalOpen] = useState(false);
    const handleOpenCreateOrderModal = () => setCreateOrderModalOpen(true);
    const handleCloseCreateOrderModal = () => {
        setCreateOrderModalOpen(false);
        if (checked) {
            setChecked(prev => !prev);
        }
    }
    const handleChangeChecked = () => {
        setChecked(prev => !prev)
    }
    //Dictionaries
    const Unit = [
        {label: 'Дней'},
        {label: 'Месяцев'},
    ]
    const Purchase = [
        {label: 'Внутренний'},
        {label: 'Внешний'},
    ]


    useEffect(() => {
        if(key) return
        setKey(true)
        DeviceService.getAllDevices().then((res) => {
            dispatch(res);
        }).catch(err => console.log(err));
    }, [])

    const [showOrderTable, setShowOrderTable] = useState(false);
    const handleShowOrderTable = () => setShowOrderTable(true);

    const [selectedMaterial, setSelectedMaterial] = useState<string | null>();
    const [materialAmount, setMaterialAmount] = useState<string | null>();
    const addMaterial = () => {
        console.log(selectedMaterial);
        console.log(materialAmount);
        if(selectedMaterial === null || selectedMaterial === undefined)
        {
            dispatch(AddSnackbar({
                messageText: "Материал не выбран!",
                messageType: "error",
                key: +new Date()
            }))
            return
        }
        if(materialAmount === null || materialAmount === undefined)
        {
            dispatch(AddSnackbar({
                messageText: "Не задано количество!",
                messageType: "error",
                key: +new Date()
            }))
            return
        }
        dispatch(AddSnackbar({
            messageText: "Прибор успешно добавлен!",
            messageType: "success",
            key: +new Date()
        }))
        setSelectedMaterial(null);
        setMaterialAmount(null);
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
                                <TextField sx={{width: '30%'}} id="outlined-search" label="Поиск" variant="outlined"
                                           size='small' type="search"/>
                                <TextField id="dateOt" label="От" type="date" size='small' sx={{width: '16%'}}
                                           onChange={e => {
                                               setDateTimeOt(e.target.value);
                                           }}
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                />
                                <TextField id="dateDo" label="До" type="date" size='small' sx={{width: '16%'}}
                                           onChange={e => {
                                               setDateTimeDo(e.target.value);
                                           }}
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                />
                                <Button variant="contained" onClick={handleShowOrderTable}>Показать</Button>
                            </Stack>
                            <Button variant="contained" onClick={handleOpenCreateOrderModal}>Создать</Button>
                        </Stack>
                    </Paper>
                </Box>
                <Box sx={{height: "84vh", gridArea: 'main'}}>
                    {showOrderTable ? <OrderTable/> : null}
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
                        <Paper sx={{width: '100%'}} style={{marginLeft: "0px", padding: "20px", marginBottom: "8px"}}>
                            <Typography mb={2}>Создание заявки</Typography>
                            <Stack direction="column" spacing={2}>
                                <Stack direction="row" spacing={2}>
                                    <TextField id="date" label="Дата" type="date" size='small' sx={{width: '16%'}}
                                               onChange={e => {
                                                   setDateTimeOt(e.target.value);
                                               }}
                                               InputLabelProps={{
                                                   shrink: true,
                                               }}
                                    />
                                    <Autocomplete disablePortal id="combo-box-unit" size='small' options={Purchase}
                                                  sx={{width: '16%'}}
                                                  renderInput={(params) => <TextField {...params} label="Закуп"/>}
                                    />
                                    <FormControlLabel control={<Checkbox onChange={handleChangeChecked}/>}
                                                      label="Период"/>
                                    {checked ? <OrderPerriod/> : null}
                                </Stack>
                                <Typography mb={2}>Добавление материалов в заявку</Typography>
                                <Stack direction="row" spacing={2}>
                                    <Autocomplete disablePortal id="combo-box-name-material" size='small'
                                                  options={state.devices.map((row) => (row.title))}
                                                  sx={{width: '26%'}}
                                                  renderInput={(params) => <TextField {...params}
                                                                                      label="Наименование" value={selectedMaterial}
                                                                                      onChange={(newValue) => setSelectedMaterial(newValue.target.value)}/>}
                                    />
                                    <TextField id="amount-material" label="Количество" variant="outlined" size='small'
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
                        <Paper sx={{width: '100%'}} style={{padding: "20px"}}>
                            <Stack direction='row' justifyContent='space-between' sx={{width: '100%'}}>
                                <div>
                                    <Button variant="contained">Удалить заявку</Button>
                                    <Button variant="outlined" style={{marginLeft: '8px'}}>Удалить выбранные</Button>
                                </div>
                                <Button variant="contained">Утвердить</Button>
                            </Stack>
                        </Paper>
                    </Stack>
                </Box>
            </Modal>
        </Box>

    )
}