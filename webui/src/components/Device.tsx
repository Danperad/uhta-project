import React from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Grid,
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
    Typography,
} from '@mui/material';
import TableRowMaterial from './TableRowMaterial';
import "../assets/css/Scrollbar.css";
import {Material} from '../models';
import DeviceService from '../services/DeviceService';
import excelIcon from '../../public/image/excel.svg';
import {useDispatch} from "react-redux";
import {AppDispatch} from "../redux/store";
import {AddSnackbar} from "../redux/actions/snackbarAction";

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

export default function Device() {
    const dispatch = useDispatch<AppDispatch>();

    const [materials, setMaterials] = React.useState<Material[]>([]);
    const [key, setKey] = React.useState<boolean>(false);

    const [materialName, setMaterialName] = React.useState<string | null>();
    const [nr3, setNr3] = React.useState<string | null>();
    const [kccc, setKccc] = React.useState<string | null>();
    const [parentKccc, setParentKccc] = React.useState<string | null>();
    const [producer, setProducer] = React.useState<string | null>();
    const [materialType, setMaterialType] = React.useState<string | null>();
    const [amount, setAmount] = React.useState<string | null>();
    const [materialUnit, setMaterialUnit] = React.useState<string | null>();

    const [showDeviceBinding, setShowDeviceBinding] = React.useState(false);

    React.useEffect(() => {
        if (key) return;
        setKey(true);
        DeviceService.getDevices().then((res: Material[]) => {
            setMaterials(res);
        }).catch(err => console.log(err));
    }, [materials, key])

    function CheckMaterialType(event: any, value: string) {
        setMaterialType(value);

        if (value === "Расходник") {
            setShowDeviceBinding(true)
        } else {

            setShowDeviceBinding(false)
            setParentKccc(null)
        }
    }

    function CheckMaterialUnit(event: any, value: string) {
        setMaterialUnit(value);
    }

    const DeviceBinding = () => (
        <TextField id="parent-kccc" label="КССС привязка *" variant="outlined" size='small' type='number'
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
    const MaterialTable = () => (
        <div className='section'>
            {materials.length !== 0 ? (
                <TableContainer component={Paper}>
                    <Table aria-label="material table" sx={{width: '100%'}}>
                        <TableHead>
                            <TableRow>
                                <TableCell/>
                                <TableCell>Наименование</TableCell>
                                <TableCell align="right">№R-3</TableCell>
                                <TableCell align="right">№КССС</TableCell>
                                <TableCell align="right">Количество в эксплуатации</TableCell>
                                <TableCell align="right">Количество на складе</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>

                            {materials.map((row) => (
                                <TableRowMaterial key={row.nr3} rowMaterial={row}/>
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
        </div>
    )
    const handleShowMaterialTable = () => setShowMaterialTable(true);

    function CheckRequiredFields() {
        return !(materialName === undefined || nr3 === undefined || kccc === undefined ||
            materialType === undefined || amount === undefined || materialUnit === undefined);
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
    }

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            padding: "8px",
            marginLeft: "0px",
            marginTop: "-8px",
            height: "100%"
        }}>
            <Grid container spacing={2} alignItems="stretch" direction="row">
                <Grid item xs={12}>
                    <Paper style={{padding: "20px"}}>
                        <Typography mb={1}>Приборы и расходники</Typography>
                        <Stack direction="row" spacing={1}>
                            <TextField sx={{width: '40%'}} id="search" label="Поиск" variant="outlined" size='small'
                                       type="search"/>
                            <Button variant="contained" onClick={handleShowMaterialTable}>Показать</Button>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={9}>
                    {showMaterialTable ? <MaterialTable/> : null}
                </Grid>
                <Grid item xs={3}>
                    <Paper style={{
                        padding: "20px",
                        textAlign: "center",
                        height: '100%'
                    }} >
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
                                <TextField id="producer" label="Производитель" variant="outlined" size='small'
                                           value={producer}
                                           onChange={(newValue) => setProducer(newValue.target.value)}/>
                                <Autocomplete disablePortal id="combo-box-type" size='small' options={Type}
                                              onInputChange={CheckMaterialType}

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
                                              onInputChange={CheckMaterialUnit}
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
                </Grid>
            </Grid>
        </Box>
    )
}