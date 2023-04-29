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
import {useEffect, useState} from "react";
import {Consumable, Device} from '../models';
import {AddSnackbar} from "../redux/actions/snackbarAction";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../redux/store";
import DeviceService from "../services/DeviceService";

export default (props: { receivedMaterial: Consumable }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [consumable, setConsumable] = useState<Consumable | null>(null);
    const [checked, setChecked] = useState(true);
    const [materialTitle, setMaterialTitle] = useState<string | null>();
    const [kccc, setKccc] = useState<string | null>();
    const [amount, setAmount] = useState<string | null>();
    const handleChangeChecked = () => {
        setChecked(prev => !prev)
    }

    function changeMaterialInOperation(newValue: number, material: Consumable) {
        if (newValue >= 0) {
            if (newValue < material.inOperation && material.inOperation - 1 >= 0) {
                setConsumable({...material, inOperation: material.inOperation - 1})
                return;
            }
            if (newValue > material.inOperation && material.inStock - 1 >= 0) {
                setConsumable({...material, inOperation: material.inOperation + 1, inStock: material.inStock - 1})
            } else {
                dispatch(AddSnackbar({
                    messageText: "Приборы на складе закончились!",
                    messageType: "error",
                    key: +new Date()
                }))
            }

        }
    }

    function changeMaterialInStock(newValue: number, material: Consumable) {
        if (newValue >= 0) {
            if (newValue > material.inStock) {
                setConsumable({...material, inStock: material.inStock + 1})
            }
            if (newValue < material.inStock) {
                setConsumable({...material, inStock: material.inStock - 1})
            }
        }
    }

    const [materials, setMaterials] = useState<Device[]>([]);
    const [key, setKey] = useState<boolean>(false);

    const [autocompleteTitleValue, setAutocompleteTitleValue] = useState<string>('');

    function CheckMaterialTitle(event: any, value: string) {
        // for(var i = 0; i < materials.length; i++)
        // {
        //     if(value === materials[i].title)
        //     {
        //         setMaterialTitle(value);
        //         setAutocompleteTitleValue(value);
        //     }
        //     else {
        //         setAutocompleteTitleValue('');
        //         return
        //     }
        // }
        if (value !== 'Шнур асбестовый ШАП-02 ГОСТ 1779-83')
            setAutocompleteTitleValue('');
    }

    const [autocompleteTypeValue, setAutocompleteTypeValue] = useState<string>('');
    const [materialType, setMaterialType] = useState<string | null>();
    const [title, setTitle] = useState<string[]>();

    useEffect(() => {
        //setChecked(prev => !prev);
        const tmp: string[] = [];

        setMaterialTitle('');
        setConsumable(props.receivedMaterial);
        if (key) return;
        setKey(true);
        DeviceService.getAllDevices().then((res: Device[]) => {
            setMaterials(res);
            res.forEach((d) => tmp.push(d.title))
            setTitle(tmp);
        }).catch(err => console.log(err));

    }, [materials, key])

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
                                       onChange={(newValue) => changeMaterialInStock(parseInt(newValue.target.value), consumable!)}
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
                            <Stack spacing={1}>
                                <Stack direction="row" width='100%' spacing={1}>
                                    {/*<Autocomplete disablePortal id="combo-box-type" size='small' options={title!}
                                                  onInputChange={CheckMaterialType} value={autocompleteTypeValue}

                                                  renderInput={(params) => <TextField {...params} label="Тип" required
                                                                                      value={materialType}
                                                                                      onChange={(newValue) => setMaterialType(newValue.target.value)}/>}
                                                  style={{width: '30%'}}
                                    />*/}
                                    <Autocomplete disablePortal id="combo-box-title" size='small' options={materials}
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
                                    {consumable?.devices.length !== 0 ? (

                                        consumable!.devices.map((row: Device) => (
                                            <Stack direction="row" width='100%' spacing={1}>
                                                <TextField id="title" label="Наименование" variant="outlined"
                                                           size='small'
                                                           type="number"
                                                           value={row.title}
                                                           InputProps={{
                                                               inputProps: {min: 1}
                                                           }}
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
                                                           InputProps={{
                                                               inputProps: {min: 1}
                                                           }}
                                                />
                                                <Button variant="outlined">отвязать</Button>

                                            </Stack>
                                        ))

                                    ) : (
                                        <div></div>
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
