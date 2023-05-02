import {useState} from 'react';
import {Autocomplete, Box, Button, Paper, Stack, TextField, Typography,} from '@mui/material';

import "../assets/css/Scrollbar.css";
import excelIcon from '../../public/image/excel.svg';

import {useDispatch} from "react-redux";
import {AppDispatch} from "../redux/store";
import {AddSnackbar} from "../redux/actions/snackbarAction";
import MaterialTable from "./MaterialTable";
import DeviceService from "../services/DeviceService";
import ConsumableService from "../services/ConsumableService";
import {Consumable, Device} from "../models";
import MaterialService from "../services/ConsumableService";

//Dictionaries
const Type = ['Прибор', 'Расходник']
const Unit = ['ШТ', 'УМП', 'КМП', 'Л', 'КГ', 'Т', 'М', 'М2']
const Producers = ['Поставщик', 'Производитель', 'Поставка', 'Товарищ', 'Человек']

export default function DeviceAndConsumable() {
    const dispatch = useDispatch<AppDispatch>();

    const [materialName, setMaterialName] = useState<string | null>();
    const [nr3, setNr3] = useState<string | null>();
    const [kccc, setKccc] = useState<string | null>();
    const [parentKccc, setParentKccc] = useState<string | null>();
    const [producer, setProducer] = useState<string | null>();
    const [materialType, setMaterialType] = useState<string | null>();
    const [amount, setAmount] = useState<string | null>();
    const [materialUnit, setMaterialUnit] = useState<string | null>();

    const [showDeviceBinding, setShowDeviceBinding] = useState(false);

    const [parentDevices, setParentDevices] = useState<Device[]>([]);

    const [showMaterialTable, setShowMaterialTable] = useState(false);

    const [autocompleteTypeValue, setAutocompleteTypeValue] = useState<string>('');
    const [autocompleteUnitValue, setAutocompleteUnitValue] = useState<string>('');
    const [autocompleteProducerValue, setAutocompleteProducerValue] = useState<string>('');

    const [search, setSearch] = useState<string>('');

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
            setParentKccc(null)
        }
    }

    function CheckMaterialUnit(event: any, value: string) {
        if (!(value === "ШТ" || value === "УМП" || value === "КМП" || value === "Л"
            || value === "КГ" || value === "Т" || value === "М" || value === "М2")) {
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
        <TextField id="parent-kccc" label="КССС привязка" variant="outlined" size='small' type='number'
                   value={parentKccc} onChange={(newValue) => setParentKccc(newValue.target.value)}
                   InputProps={{
                       inputProps: {min: 1}
                   }}
        />
    )

    const addNewMaterial = () => {
        const check = CheckRequiredFields();

        if (check && materialType === "Прибор") {
            const newDevice: Device = {
                id: 0,
                title: materialName!,
                producer: producer!,
                csss: parseInt(kccc!),
                nr3: parseInt(nr3!),
                unitType: materialUnit!,
                inOperation: 0,
                inStock: parseInt(amount!),
                consumables: []
            }
            DeviceService.saveDevice(newDevice).then((res) => {
                if (res === null) return;
                dispatch(AddSnackbar({
                    messageText: "Прибор успешно добавлен!",
                    messageType: "success",
                    key: +new Date()
                }))
                DeviceService.getAllDevices().then((res) => {
                    dispatch(res);
                }).catch(err => console.log(err));
            }).catch(e => {
                dispatch(AddSnackbar({
                    messageText: "Неудалось добавить!",
                    messageType: "error",
                    key: +new Date()
                }))
                console.log(e)
            });
            ClearFields();
        } else if (check && materialType === "Расходник") {
            if (parentKccc !== '' || parentKccc !== undefined) {
                const tmp: Device[] = [];

                DeviceService.getDeviceByCsss(parseInt(parentKccc!)).then((res) => {
                    if (res === null) return;
                    tmp.push(res)
                });
                setParentDevices(tmp)
            }
            const newConsumable: Consumable = {
                id: 0,
                title: materialName!,
                producer: producer!,
                csss: parseInt(kccc!),
                nr3: parseInt(nr3!),
                unitType: materialUnit!,
                inOperation: 0,
                inStock: parseInt(amount!),
                devices: parentDevices!

            }
            ConsumableService.saveConsumable(newConsumable).then((res) => {
                if (res === null) return;
                dispatch(AddSnackbar({
                    messageText: "Материал успешно добавлен!",
                    messageType: "success",
                    key: +new Date()
                }))
                MaterialService.getAllConsumables().then((res) => {
                    dispatch(res);
                }).catch(err => console.log(err));
            }).catch(e => {
                dispatch(AddSnackbar({
                    messageText: "Неудалось добавить!",
                    messageType: "error",
                    key: +new Date()
                }))
                console.log(e)
            });

            ClearFields();
        } else {
            dispatch(AddSnackbar({
                messageText: "Не все поля заполнены!",
                messageType: "error",
                key: +new Date()
            }))
        }

    };

    const handleShowMaterialTable = () => {
        DeviceService.getAllDevices(search).then((res) => {
            dispatch(res);
        }).catch(err => console.log(err));
        MaterialService.getAllConsumables(search).then((res) => {
            dispatch(res);
        }).catch(err => console.log(err));
        setShowMaterialTable(true);
    }

    function CheckRequiredFields() {
        return !(materialName === undefined || nr3 === undefined || kccc === undefined ||
            materialType === undefined || amount === undefined || materialUnit === undefined ||
            materialName === "" || nr3 === "" || kccc === "" ||
            materialType === "" || amount === "" || materialUnit === "");
    }

    function ClearFields() {
        setMaterialName("");
        setNr3("");
        setKccc("");
        setMaterialType("");
        setParentKccc("");
        setProducer("");
        setAmount("");
        setMaterialUnit("");
        setAutocompleteTypeValue("");
        setAutocompleteUnitValue("");
        setAutocompleteProducerValue("");
        setParentDevices([]);
    }

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
                            <TextField sx={{width: '40%'}} id="search" label="Поиск" variant="outlined" size='small'
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
                                    <TextField id="add-material-name" label="Наименование" variant="outlined"
                                               size='small'
                                               required
                                               value={materialName}
                                               onChange={(newValue) => setMaterialName(newValue.target.value)}/>
                                    <TextField id="kccc" label="КССС" variant="outlined" size='small' type="number"
                                               required
                                               value={kccc} onChange={(newValue) => setKccc(newValue.target.value)}
                                               InputProps={{
                                                   inputProps: {min: 1}
                                               }}
                                    />
                                    <TextField id="nr3" label="№R-3" variant="outlined" size='small' type="number"
                                               required
                                               value={nr3} onChange={(newValue) => setNr3(newValue.target.value)}
                                               InputProps={{
                                                   inputProps: {min: 1}
                                               }}
                                    />

                                    <Autocomplete disablePortal id="combo-box-producer" size='small' options={Producers}
                                                  onInputChange={CheckMaterialProducer}
                                                  value={autocompleteProducerValue}

                                                  renderInput={(params) => <TextField {...params} label="Производитель"
                                                                                      value={materialType}
                                                                                      onChange={(newValue) => setProducer(newValue.target.value)}/>}
                                    />

                                    <Autocomplete disablePortal id="combo-box-type" size='small' options={Type}
                                                  onInputChange={CheckMaterialType} value={autocompleteTypeValue}

                                                  renderInput={(params) => <TextField {...params} label="Тип" required
                                                                                      value={materialType}
                                                                                      onChange={(newValue) => setMaterialType(newValue.target.value)}/>}
                                    />

                                    {showDeviceBinding ? <DeviceBinding/> : null}

                                    <TextField id="amount-material" label="Количество" variant="outlined" size='small'
                                               type="number" required
                                               value={amount} onChange={(newValue) => setAmount(newValue.target.value)}
                                               InputProps={{
                                                   inputProps: {min: 1}
                                               }}
                                    />
                                    <Autocomplete disablePortal id="combo-box-unit" size='small' options={Unit}
                                                  onInputChange={CheckMaterialUnit} value={autocompleteUnitValue}
                                                  renderInput={(params) => <TextField {...params} label="Ед. измерения"
                                                                                      value={materialUnit} required
                                                                                      onChange={(newValue) => setMaterialUnit(newValue.target.value)}/>}
                                    />
                                </Stack>
                                <Stack direction='row' spacing={1} justifyContent='center'>
                                    <Button variant="contained"
                                            endIcon={<img src={excelIcon} style={{width: "20px"}} alt="excel"></img>}>
                                        Загрузить
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