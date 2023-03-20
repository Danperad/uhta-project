import React from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import Snackbar, {SnackbarOrigin} from '@mui/material/Snackbar';
import MuiAlert, {AlertColor, AlertProps} from '@mui/material/Alert';
import TableRowMaterial from './TableRowMaterial';
import "../assets/css/Scrollbar.css";
import {Material} from '../models';
import DeviceService from '../services/DeviceService';

export interface State extends SnackbarOrigin {
    openSnackbar: boolean;
}

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

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref,) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Device() {

    const [materials, setMaterials] = React.useState<Material[]>([]);
    const [key, setKey] = React.useState<boolean>(false);

    const [materialName, setMaterialName] = React.useState<string>();
    const [nr3, setNr3] = React.useState<number>();
    const [kccc, setKccc] = React.useState<number>();
    const [parentKccc, setParentKccc] = React.useState<number>();
    const [producer, setProducer] = React.useState<string>();
    const [materialType, setMaterialType] = React.useState<string>();
    const [amount, setAmount] = React.useState<number>();
    const [materialUnit, setMaterialUnit] = React.useState<string>();

    const [showDeviceBinding, setShowDeviceBinding] = React.useState(false);

    const [stateSnack, setStateSnack] = React.useState<State>({
        openSnackbar: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const {vertical, horizontal, openSnackbar} = stateSnack;

    const [messageType, setMessageType] = React.useState<string>();
    const [messageText, setMessageText] = React.useState<string>();

    React.useEffect(() => {
        if (key) return;
        setKey(true);
        DeviceService.getDevices().then((res: Material[]) => {
            setMaterials(res);
            console.log(res);
        }).catch(err => console.log(err));
    }, [materials, key])

    function CheckMaterialType(event: any, value: string) {
        setMaterialType(value);

        if (value === "Расходник") {
            setShowDeviceBinding(true)
        } else {
            setShowDeviceBinding(false)
        }
    }

    function CheckMaterialUnit(event: any, value: string) {
        setMaterialUnit(value);
    }

    const DeviceBinding = () => (
        <TextField id="parent-kccc" label="КССС привязка *" variant="outlined" size='small' type='number'
                   value={parentKccc} onChange={(newValue) => setParentKccc(parseInt(newValue.target.value))}
                   InputProps={{
                       inputProps: {min: 1}
                   }}
        />
    )

    const addNewMaterial = (newState: SnackbarOrigin) => () => {
        const check = CheckRequiredFields();

        if (check && materialType === "Прибор") {
            setMessageType("success");
            setMessageText("Прибор успешно добавлен!");
            setStateSnack({openSnackbar: true, ...newState});
        } else if (check && materialType === "Расходник" && parentKccc === undefined) {
            setMessageType("error");
            setMessageText("Материал не добавлен. Укажите КССС привязку!");
            setStateSnack({openSnackbar: true, ...newState});
        } else if (check && materialType === "Расходник" && parentKccc !== undefined) {
            setMessageType("success");
            setMessageText("Материал успешно добавлен!");
            setStateSnack({openSnackbar: true, ...newState});
        } else {
            setMessageType("error");
            setMessageText("Не все поля заполнены!");
            setStateSnack({openSnackbar: true, ...newState});
        }

    };

    function CheckRequiredFields() {
        return !(materialName === undefined || nr3 === undefined || kccc === undefined ||
            materialType === undefined || amount === undefined || materialUnit === undefined);
    }

    const handleCloseSnackbar = () => {
        setStateSnack({...stateSnack, openSnackbar: false});
    };

    return (
        <Box style={{marginLeft: '16px'}} sx={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            '& > :not(style)': {m: 1, idth: 128, height: '100%'},
        }}>
            <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1}
                   sx={{width: '71%'}} style={{margin: '0px', marginTop: '8px'}}>
                <Paper sx={{width: '100%'}} style={{marginLeft: "0px", padding: "20px", marginBottom: "8px"}}>
                    <Typography mb={1}>Приборы и расходники</Typography>
                    <TextField sx={{width: '40%'}} id="search" label="Поиск" variant="outlined" size='small'
                               type="search"/>
                </Paper>
                <div className='section' style={{width: '104.5%', height: '30.9%'}}>
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
                                    <TableRowMaterial key={row.name} rowMaterial={row}/>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Stack>

            <Paper sx={{width: '21%'}} style={{
                marginRight: "0px",
                marginLeft: "54px",
                padding: "20px",
                textAlign: "center",
                height: '36%'
            }}>
                <Stack
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                    style={{height: '100%'}}
                >
                    <Stack spacing={2}>
                        <Typography>Добавление</Typography>
                        <TextField id="add-material-name" label="Наименование" variant="outlined" size='small' required
                                   value={materialName}
                                   onChange={(newValue) => setMaterialName(newValue.target.value)}/>
                        <TextField id="kccc" label="КССС" variant="outlined" size='small' type="number" required
                                   value={kccc} onChange={(newValue) => setKccc(parseInt(newValue.target.value))}
                                   InputProps={{
                                       inputProps: {min: 1}
                                   }}
                        />
                        <TextField id="nr3" label="№R-3" variant="outlined" size='small' type="number" required
                                   value={nr3} onChange={(newValue) => setNr3(parseInt(newValue.target.value))}
                                   InputProps={{
                                       inputProps: {min: 1}
                                   }}
                        />
                        <TextField id="producer" label="Производитель" variant="outlined" size='small'
                                   value={producer} onChange={(newValue) => setProducer(newValue.target.value)}/>
                        <Autocomplete disablePortal id="combo-box-type" size='small' options={Type}
                                      onInputChange={CheckMaterialType}
                                      renderInput={(params) => <TextField {...params} label="Тип *" value={materialType}
                                                                          onChange={(newValue) => setMaterialType(newValue.target.value)}/>}
                        />

                        {showDeviceBinding ? <DeviceBinding/> : null}

                        <TextField id="amount-material" label="Количество" type="number" size='small' required
                                   value={amount} onChange={(newValue) => setAmount(parseInt(newValue.target.value))}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   InputProps={{
                                       inputProps: {min: 1}
                                   }}
                        />
                        <Autocomplete disablePortal id="combo-box-unit" size='small' options={Unit}
                                      onInputChange={CheckMaterialUnit}
                                      renderInput={(params) => <TextField {...params} label="Ед. измерения *"
                                                                          value={materialUnit}
                                                                          onChange={(newValue) => setMaterialUnit(newValue.target.value)}/>}
                        />
                    </Stack>
                    <Button variant="contained"
                            onClick={addNewMaterial({vertical: 'top', horizontal: 'right',})}>Добавить</Button>

                    <Snackbar anchorOrigin={{vertical, horizontal}} open={openSnackbar} onClose={handleCloseSnackbar}
                              autoHideDuration={3000} key={vertical + horizontal}
                    >
                        <Alert onClose={handleCloseSnackbar} severity={messageType as AlertColor} sx={{width: '100%'}}>
                            {messageText}
                        </Alert>
                    </Snackbar>
                </Stack>
            </Paper>
        </Box>
    )
}