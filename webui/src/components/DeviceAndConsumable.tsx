import {ChangeEvent, useRef, useState} from 'react';
import {Autocomplete, Box, Button, Paper, Stack, TextField, Typography,} from '@mui/material';

import "../assets/css/Scrollbar.css";
import excelIcon from '../../public/image/excel.svg';

import {useDispatch} from "react-redux";
import {AppDispatch} from "../redux/store";
import {AddSnackbar} from "../redux/actions/snackbarAction";
import MaterialTable from "./MaterialTable";
import DeviceService from "../services/DeviceService";
import ConsumableService from "../services/ConsumableService";
import {Binding, Consumable, Device} from "../models";
import FileUploadService from "../services/FileUploadService";

//Dictionaries
const Type = ['Прибор', 'Расходник']
const Unit = ['ШТ', 'УПК', 'КМП', 'РУЛ', 'КГ', 'Т', 'М', 'М2']
const Producers = ['Поставщик', 'Производитель', 'Поставка', 'Товарищ', 'Человек']

export default function DeviceAndConsumable() {
    const dispatch = useDispatch<AppDispatch>();

    const [materialName, setMaterialName] = useState<string | undefined>();
    const [nr3, setNr3] = useState<string | undefined>();
    const [csss, setCsss] = useState<string | undefined>();
    const [parentCsss, setParentCsss] = useState<string | undefined>();
    const [producer, setProducer] = useState<string | undefined>();
    const [materialType, setMaterialType] = useState<string | undefined>();
    const [amount, setAmount] = useState<string | undefined>();
    const [materialUnit, setMaterialUnit] = useState<string | undefined>();

    const [showDeviceBinding, setShowDeviceBinding] = useState(false);

    const [showMaterialTable, setShowMaterialTable] = useState(false);

    const [autocompleteTypeValue, setAutocompleteTypeValue] = useState<string>('');
    const [autocompleteUnitValue, setAutocompleteUnitValue] = useState<string>('');
    const [autocompleteProducerValue, setAutocompleteProducerValue] = useState<string>('');

    const [search, setSearch] = useState<string>('');

    const inputFile = useRef<HTMLInputElement | null>(null)

    function CheckMaterialType(event: any, value: string) {
        if (!(value === "Расходник" || value === "Прибор")) {
            setShowDeviceBinding(false)
            setAutocompleteTypeValue('');
            return;
        }

        setMaterialType(value);
        setAutocompleteTypeValue(value);

        if (value === "Расходник") {
            setShowDeviceBinding(true)
        } else {

            setShowDeviceBinding(false)
            setParentCsss(undefined)
        }
    }

    function CheckMaterialUnit(event: any, value: string) {
        if (!Unit.some((v, _, __) => v === value)) {
            setAutocompleteUnitValue('');
            return;
        }
        setMaterialUnit(value);
        setAutocompleteUnitValue(value);
    }

    function CheckMaterialProducer(event: any, value: string) {
        setProducer(value);
        setAutocompleteProducerValue(value);
    }

    const DeviceBinding = () => (
        <TextField label="КССС привязка" variant="outlined" size='small' type='number'
                   value={parentCsss} onChange={(newValue) => setParentCsss(newValue.target.value)}
                   InputProps={{
                       inputProps: {min: 1}
                   }}
        />
    )

    const addNewMaterial = async () => {
        const check = CheckRequiredFields();

        if (check && materialType === "Прибор") {
            const newDevice: Device = {
                id: undefined,
                title: materialName!,
                producer: producer,
                csss: parseInt(csss!),
                nr3: parseInt(nr3!),
                unitType: materialUnit!,
                inOperation: 0,
                inStock: parseInt(amount!),
                consumables: []
            }
            const res = await DeviceService.saveDevice(newDevice)
            if (!res) return
            dispatch(AddSnackbar({
                messageText: "Прибор успешно добавлен!",
                messageType: "success",
                key: +new Date()
            }))
            const allDevices = await DeviceService.getAllDevices()
            if (!allDevices) return
            dispatch(allDevices)
            ClearFields();
        } else if (check && materialType === "Расходник") {
            if (parentCsss !== '' || parentCsss !== undefined) {
                const res = await DeviceService.getDeviceByCsss(parseInt(parentCsss!))
                const newDevice = {
                    device: res,
                    count: +amount!
                } as Binding
                const newConsumable: Consumable = {
                    id: undefined,
                    title: materialName!,
                    producer: producer,
                    csss: parseInt(csss!),
                    nr3: parseInt(nr3!),
                    unitType: materialUnit!,
                    inOperation: 0,
                    inStock: parseInt(amount!),
                    devices: !res ? [] : [newDevice]
                }
                const saveRes = await ConsumableService.saveConsumable(newConsumable)
                if (!saveRes) return;
                dispatch(AddSnackbar({
                    messageText: "Материал успешно добавлен!",
                    messageType: "success",
                    key: +new Date()
                }))
                const allConsumables = await ConsumableService.getAllConsumables()
                if (allConsumables) dispatch(allConsumables)
            }
            ClearFields();
        } else {
            dispatch(AddSnackbar({
                messageText: "Не все поля заполнены!",
                messageType: "error",
                key: +new Date()
            }))
        }

    };

    const handleShowMaterialTable = async () => {
        const devices = await DeviceService.getAllDevices(search)
        if (devices)
            dispatch(devices)
        const consumables = await ConsumableService.getAllConsumables(search)
        if (consumables)
            dispatch(consumables)
        setShowMaterialTable(true);
    }

    const CheckRequiredFields = () => {
        return !(materialName === undefined || nr3 === undefined || csss === undefined ||
            materialType === undefined || amount === undefined || materialUnit === undefined ||
            materialName === "" || nr3 === "" || csss === "" ||
            materialType === "" || amount === "" || materialUnit === "");
    }

    function ClearFields() {
        setMaterialName("");
        setNr3("");
        setCsss("");
        setMaterialType("");
        setParentCsss("");
        setProducer("");
        setAmount("");
        setMaterialUnit("");
        setAutocompleteTypeValue("");
        setAutocompleteUnitValue("");
        setAutocompleteProducerValue("");
    }

    const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files
        if (files === null || !files || files!.length === 0)
            return

        const file = files!.item(0)
        if (file === null) return;
        const res = await FileUploadService.uploadMaterial(file!)
        e.target.value = ''
        if (!res) {
            dispatch(AddSnackbar({
                messageText: "Не удалось загрузить файл!",
                messageType: "error",
                key: +new Date()
            }))
            return
        }
        dispatch(AddSnackbar({
            messageText: "Материалы успешно добавлены!",
            messageType: "success",
            key: +new Date()
        }))
    }

    const uploadXmlButtonClick = () => {
        inputFile.current?.click()
    };
    return (
        <Box sx={{
            width: '100%',
            height: '100vh',
            '& > .MuiBox-root > .MuiBox-root': {
                p: 1,
            },
        }}>

            <Box
                sx={{
                    display: 'grid',
                    height: "98.5%",
                    margin: "8px 8px 8px 0",
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gridTemplateRows: 'repeat(2, 138px)',
                    gridTemplateAreas: `"header header header header"
                        "main main main sidebar"`,
                }}
            >

                <Box sx={{gridArea: 'header'}}>
                    <Paper style={{padding: "20px"}}>
                        <Typography mb={1}>Приборы и расходники</Typography>
                        <Stack direction="row" spacing={1}>
                            <TextField sx={{width: '40%'}} label="Поиск" variant="outlined" size='small'
                                       type="search" value={search}
                                       onChange={(newValue) => setSearch(newValue.target.value)}/>
                            <Button variant="contained" onClick={handleShowMaterialTable}>Показать</Button>

                        </Stack>
                    </Paper>
                </Box>
                <Box sx={{gridArea: 'main', height: "80vh"}}>
                    {showMaterialTable && <MaterialTable/>}
                </Box>
                <Box sx={{gridArea: 'sidebar', height: "76vh"}} component="form">
                    <Paper
                        style={{
                            padding: "20px",
                            textAlign: "center",
                            height: '100%'
                        }}>
                        <Stack
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={2}
                            style={{height: '100%'}}
                        >
                            <Stack spacing={2}>
                                <Typography>Добавление</Typography>
                                <TextField label="Наименование" variant="outlined"
                                           size='small'
                                           required
                                           value={materialName}
                                           onChange={(newValue) => setMaterialName(newValue.target.value)}/>
                                <TextField label="КССС" variant="outlined" size='small' type="number"
                                           required
                                           value={csss} onChange={(newValue) => setCsss(newValue.target.value)}
                                           InputProps={{
                                               inputProps: {min: 1}
                                           }}
                                />
                                <TextField label="№R-3" variant="outlined" size='small' type="number"
                                           required
                                           value={nr3} onChange={(newValue) => setNr3(newValue.target.value)}
                                           InputProps={{
                                               inputProps: {min: 1}
                                           }}
                                />

                                <Autocomplete disablePortal size='small' options={Producers}
                                              onInputChange={CheckMaterialProducer}
                                              value={autocompleteProducerValue}

                                              renderInput={(params) => <TextField {...params} label="Производитель"
                                                                                  value={producer}
                                                                                  onChange={(newValue) => setProducer(newValue.target.value)}/>}
                                />

                                <Autocomplete disablePortal size='small' options={Type}
                                              onInputChange={CheckMaterialType} value={autocompleteTypeValue}

                                              renderInput={(params) => <TextField {...params} label="Тип" required
                                                                                  value={materialType}
                                                                                  onChange={(newValue) => setMaterialType(newValue.target.value)}/>}
                                />

                                {showDeviceBinding && <DeviceBinding/>}

                                <TextField label="Количество" variant="outlined" size='small'
                                           type="number" required
                                           value={amount} onChange={(newValue) => setAmount(newValue.target.value)}
                                           InputProps={{
                                               inputProps: {min: 1}
                                           }}
                                />
                                <Autocomplete disablePortal size='small' options={Unit}
                                              onInputChange={CheckMaterialUnit} value={autocompleteUnitValue}
                                              renderInput={(params) => <TextField {...params} label="Ед. измерения"
                                                                                  value={materialUnit} required
                                                                                  onChange={(newValue) => setMaterialUnit(newValue.target.value)}/>}
                                />
                            </Stack>
                            <Stack direction='row' spacing={1} justifyContent='center'>
                                <Button variant="contained"
                                        endIcon={<img src={excelIcon} style={{width: "20px"}} alt="excel"></img>}
                                        onClick={uploadXmlButtonClick}>
                                    Загрузить
                                    <input type='file' ref={inputFile}
                                           accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                                           hidden onChange={uploadFile}/>
                                </Button>
                                <Button variant="contained" onClick={() => {
                                    addNewMaterial()
                                }}>Добавить</Button>
                            </Stack>
                        </Stack>
                    </Paper>
                </Box>
            </Box>
        </Box>
    )
}