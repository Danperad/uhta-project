import {
    Box, Button,
    Checkbox,
    FormControlLabel,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import style from "../assets/css/ChangeDeviceModal.module.css";
import * as React from "react";
import {Consumable} from '../models';
import {AddSnackbar} from "../redux/actions/snackbarAction";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../redux/store";

export default (props: {receivedMaterial: Consumable}) =>
{
    const dispatch = useDispatch<AppDispatch>();
    const [consumable, setConsumable] = React.useState<Consumable | null>(null);
    const {useState} = React;
    const [checked, setChecked] = useState(true);
    const handleChangeChecked = () => {
        setChecked(prev => !prev)
    }

    const ParentKcccField = () => (
        <TextField id="parent-kccc" label="КССС привязка" variant="outlined" size='small' type='number' required
                   style={{width: "14%", marginLeft: "28px"}} value={consumable !== null ? consumable!.parentCsss : ""}
                   InputProps={{
                       inputProps: {min: 1}
                   }}
        />
    )

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

    React.useEffect(() => {
        setConsumable(props.receivedMaterial);
    }, )

    return(
        <Box className={style.modalStyle}>
            <Stack direction="column"
                   justifyContent="space-between"
                   spacing={2}
                   sx={{width: '97.6%', height: '100%'}} style={{margin: '0px'}}>
                <div style={{width: '100%', height: '80%'}}>
                    <Paper sx={{width: '100%'}}
                           style={{marginLeft: "0px", padding: "20px", marginBottom: "8px"}}>
                        <Stack direction="row" spacing={2} sx={{width: '100%'}}>
                            <Typography mb={2}>Редактирование материала:</Typography>
                            <Typography color="primary">{consumable !== null ? consumable!.title : ""}</Typography>
                            <Typography mb={2}>№КССС:</Typography>
                            <Typography color="primary">{consumable !== null ? consumable!.csss : ""}</Typography>
                            <Typography mb={2}>№R-3:</Typography>
                            <Typography color="primary">{consumable !== null ? consumable!.nr3 : ""}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <FormControlLabel control={<Checkbox onChange={handleChangeChecked} checked/>}
                                              label="Расходный материал"/>
                            {checked ? <ParentKcccField/> : null}
                        </Stack>
                        <Stack direction="row" spacing={2} mt={1}>
                            <Typography mb={2}>Количество в эксплуатации:</Typography>

                            <TextField id="inOperationMaterial" variant="outlined" size='small' type="number"
                                       style={{width: "10%"}}
                                       value={consumable !== null ? consumable!.inOperation : ""}
                                       onChange={(newValue) => changeMaterialInOperation(parseInt(newValue.target.value), consumable!)}
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} mt={1}>
                            <Typography mb={2}>Количество на складе:</Typography>
                            <TextField id="inStockMaterial" variant="outlined" size='small' type="number"
                                       style={{marginLeft: "65px", width: "10%"}}
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
