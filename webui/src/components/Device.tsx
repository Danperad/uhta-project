import React from 'react';
import { useState } from 'react';
import {Autocomplete, Box, Button, Paper, Stack, TextField, Typography,} from '@mui/material';

import "../assets/css/Scrollbar.css";
import excelIcon from '../../public/image/excel.svg';
import {useDispatch} from "react-redux";
import {AppDispatch} from "../redux/store";
import {AddSnackbar} from "../redux/actions/snackbarAction";
import MaterialTable from "./MaterialTable";

//Dictionaries
const Type = [
    {label: 'Прибор'},
    {label: 'Расходник'},
]
const Unit = [
    {label: 'ШТ'},
    {label: 'УМП'},
    {label: 'КМП'},
    {label: 'Л'},
    {label: 'КГ'},
    {label: 'Т'},
    {label: 'М'},
    {label: 'М2'},
]
const Producers = [
    {label: 'Поставщик'},
    {label: 'Производитель'},
    {label: 'Поставка'},
    {label: 'Товарищ'},
    {label: 'Человек'},
]

export default function Device() {
    const dispatch = useDispatch<AppDispatch>();

    const [materialName, setMaterialName] = React.useState<string | null>();
    const [nr3, setNr3] = React.useState<string | null>();
    const [kccc, setKccc] = React.useState<string | null>();
    const [parentKccc, setParentKccc] = React.useState<string | null>();
    const [producer, setProducer] = React.useState<string | null>();
    const [materialType, setMaterialType] = React.useState<string | null>();
    const [amount, setAmount] = React.useState<string | null>();
    const [materialUnit, setMaterialUnit] = React.useState<string | null>();

    const [showDeviceBinding, setShowDeviceBinding] = React.useState(false);

    function CheckMaterialType(event: any, value: string) {
        if (!(value === "Расходник" || value === "Прибор"))
        {
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
            || value === "КГ" || value === "Т" || value === "М" || value === "М2"))
        {
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
        <TextField id="parent-kccc" label="КССС привязка" variant="outlined" size='small' type='number' required
                   value={parentKccc} onChange={(newValue) => setParentKccc(newValue.target.value)}
                   InputProps={{
                       inputProps: {min: 1}
                   }}
        />
    )

    const addNewMaterial = () => {
        const check = CheckRequiredFields();

        if (check && materialType === "Прибор") {
            dispatch(AddSnackbar({
                messageText: "Прибор успешно добавлен!",
                messageType: "success",
                key: +new Date()
            }))
            ClearFields();
        } else if (check && materialType === "Расходник" && (parentKccc === undefined || parentKccc === null)) {
            dispatch(AddSnackbar({
                messageText: "Материал не добавлен! Укажите КССС привязку.",
                messageType: "error",
                key: +new Date()
            }))
        } else if (check && materialType === "Расходник" && (parentKccc !== undefined || true)) {
            dispatch(AddSnackbar({
                messageText: "Материал успешно добавлен!",
                messageType: "success",
                key: +new Date()
            }))
            ClearFields();
        } else {
            dispatch(AddSnackbar({
                messageText: "Не все поля заполнены!",
                messageType: "error",
                key: +new Date()
            }))
        }

    };

    const [showMaterialTable, setShowMaterialTable] = React.useState(false);
    const handleShowMaterialTable = () => setShowMaterialTable(true);

    function CheckRequiredFields() {
        return !(materialName === undefined || nr3 === undefined || kccc === undefined ||
            materialType === undefined || amount === undefined || materialUnit === undefined ||
            materialType === "" || materialUnit === "");
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
    }

    const [autocompleteTypeValue, setAutocompleteTypeValue] = useState<label>('');
    const [autocompleteUnitValue, setAutocompleteUnitValue] = useState<label>('');
    const [autocompleteProducerValue, setAutocompleteProducerValue] = useState<label>('');

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
                                       type="search"/>
                            <Button variant="contained" onClick={handleShowMaterialTable}>Показать</Button>
                        </Stack>
                    </Paper>
                </Box>
                <Box sx={{gridArea: 'main', height: "80vh"}}>
                    {showMaterialTable ? <MaterialTable/> : null}
                </Box>
                <Box sx={{gridArea: 'sidebar', height: "76vh"}}>
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
                                <TextField id="add-material-name" label="Наименование" variant="outlined" size='small'
                                           required
                                           value={materialName}
                                           onChange={(newValue) => setMaterialName(newValue.target.value)}/>
                                <TextField id="kccc" label="КССС" variant="outlined" size='small' type="number" required
                                           value={kccc} onChange={(newValue) => setKccc(newValue.target.value)}
                                           InputProps={{
                                               inputProps: {min: 1}
                                           }}
                                />
                                <TextField id="nr3" label="№R-3" variant="outlined" size='small' type="number" required
                                           value={nr3} onChange={(newValue) => setNr3(newValue.target.value)}
                                           InputProps={{
                                               inputProps: {min: 1}
                                           }}
                                />

                                <Autocomplete disablePortal id="combo-box-producer" size='small' options={Producers}
                                              onInputChange={CheckMaterialProducer} value={autocompleteProducerValue}

                                              renderInput={(params) => <TextField {...params} label="Производитель" required
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
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
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