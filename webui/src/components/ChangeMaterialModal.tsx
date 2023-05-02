import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import style from "../assets/css/ChangeDeviceModal.module.css";
import {useState} from "react";
import {Consumable, Device} from '../models';
import {AddSnackbar} from "../redux/actions/snackbarAction";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../redux/store";

export default (props: { receivedMaterial: Consumable }) => {
    const state = useSelector((state: RootState) => state);
    const dispatch = useDispatch<AppDispatch>();
    const [consumable, setConsumable] = useState<Consumable>(props.receivedMaterial);
    const [checked, setChecked] = useState(true);
    const [materialTitle, setMaterialTitle] = useState<string | null>();
    const [kccc, setKccc] = useState<string | null>();
    const [amount, setAmount] = useState<string | null>();

    const [autocompleteTitleValue, setAutocompleteTitleValue] = useState<Device | null>(null);

    const handleChangeChecked = () => {
        setChecked(prev => !prev)
    }

    function changeMaterialInOperation(newValue: number) {
        if (newValue >= 0) {
            if (newValue < consumable.inOperation && consumable.inOperation - 1 >= 0) {
                setConsumable({...consumable, inOperation: consumable.inOperation - 1})
                return;
            }
            if (newValue > consumable.inOperation && consumable.inStock - 1 >= 0) {
                setConsumable({...consumable, inOperation: consumable.inOperation + 1, inStock: consumable.inStock - 1})
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
            if (newValue > consumable.inStock) {
                setConsumable({...consumable, inStock: consumable.inStock + 1})
            }
            if (newValue < consumable.inStock) {
                setConsumable({...consumable, inStock: consumable.inStock - 1})
            }
        }
    }

    function CheckMaterialTitle(event: any, value: string) {
        for(var i = 0; i < state.devices.length; i++)
        {
            if(value === state.devices[i].title)
            {
                setMaterialTitle(value);
                setAutocompleteTitleValue(state.devices[i]);
            }
        }
    }

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
                        <Stack direction="row" spacing={2}>
                            <FormControlLabel control={<Checkbox onChange={handleChangeChecked}/>}
                                              label="Прибор"/>
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
                                    <Autocomplete disablePortal id="combo-box-title" size='small' options={state.devices}
                                                  isOptionEqualToValue={(materials, value) => materials.id === value.id}
                                                  getOptionLabel={(option) => option.title}
                                                  onInputChange={CheckMaterialTitle} value={autocompleteTitleValue}

                                                  renderInput={(params) => <TextField {...params} label="Наименование"
                                                                                      required
                                                                                      value={materialTitle}
                                                                                      onChange={(newValue) => setMaterialTitle(newValue.target.value)}/>}
                                                  style={{width: '30%'}}
                                    />
                                    <TextField id="kccc" label="КССС" variant="outlined" size='small' type="number"
                                               required
                                               value={kccc} onChange={(newValue) => setKccc(newValue.target.value)}
                                               InputProps={{
                                                   inputProps: {min: 1}
                                               }}
                                    />
                                    <TextField id="amount-material" label="Количество" variant="outlined" size='small'
                                               type="number" required
                                               value={amount} onChange={(newValue) => setAmount(newValue.target.value)}
                                               InputProps={{
                                                   inputProps: {min: 1}
                                               }}
                                    />
                                    <Button variant="contained">добавить</Button>
                                </Stack>
                                <div>
                                    {consumable !== null && consumable!.devices !== undefined && consumable!.devices.length !== 0  && (
                                        consumable!.devices.map((row: Device) => (
                                            <Stack direction="row" width='100%' spacing={1}>
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
                                                <Button variant="outlined">отвязать</Button>

                                            </Stack>
                                        ))
                                    )}
                                </div>
                            </Stack>
                        </Paper>
                    </div>
                </div>
                <Paper sx={{width: '100%'}} style={{padding: "20px"}}>
                    <Stack direction='row' justifyContent='space-between' sx={{width: '100%'}}>
                        <Button variant="contained">Удалить материал</Button>
                        <Button variant="contained">Сохранить изменения</Button>
                    </Stack>
                </Paper>
            </Stack>
        </Box>
    )
}
