import {ChangeEvent, useEffect, useState} from "react";

import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
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
} from "@mui/material";

import style from "../assets/css/ChangeDeviceModal.module.css"
import {Material} from '../models';
import {AddSnackbar} from "../redux/actions/snackbarAction";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../redux/store";

export default (props: { receivedMaterial: Material }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [material, setMaterial] = useState<Material | null>(null);
    const [checked, setChecked] = useState(false);
    const handleChangeChecked = (event: ChangeEvent<HTMLInputElement>) => {
        setChecked(prev => !prev)
    }

    const ParentKcccField = () => (
        <TextField id="parent-kccc" label="КССС привязка" variant="outlined" size='small' type='number' required
                   style={{width: "14%", marginLeft: "28px"}}
                   InputProps={{
                       inputProps: {min: 1}
                   }}
        />
    )

    function changeMaterialInOperation(newValue: number, material: Material) {
        if (newValue >= 0) {
            if (newValue < material.inOperation && material.inOperation - 1 >= 0) {
                setMaterial({...material, inOperation: material.inOperation - 1})
                return;
            }
            if (newValue > material.inOperation && material.inStock - 1 >= 0) {
                setMaterial({...material, inOperation: material.inOperation + 1, inStock: material.inStock - 1})
            } else {
                dispatch(AddSnackbar({
                    messageText: "Приборы на складе закончились!",
                    messageType: "error",
                    key: +new Date()
                }))
            }

        }
    }

    function changeMaterialInStock(newValue: number, material: Material) {
        if (newValue >= 0) {
            if (newValue > material.inStock) {
                setMaterial({...material, inStock: material.inStock + 1})
            }
            if (newValue < material.inStock) {
                setMaterial({...material, inStock: material.inStock - 1})
            }
        }
    }

    useEffect(() => {
        setMaterial(props.receivedMaterial);
    },)

    return (
        <Box className={style.modalStyle}>
            <Stack direction="column"
                   justifyContent="space-between"
                   spacing={2}
                   sx={{width: '97.6%', height: '100%'}} style={{margin: '0px'}}>
                <div style={{width: '100%', height: '80%'}}>
                    <Paper sx={{width: '100%'}}
                           style={{marginLeft: "0px", padding: "20px", marginBottom: "8px"}}>
                        <Stack direction="row" spacing={2} sx={{width: '100%'}}>
                            <Typography mb={2}>Редактирование прибора:</Typography>
                            <Typography color="primary">{material !== null ? material!.name : ""}</Typography>
                            <Typography mb={2}>№КССС:</Typography>
                            <Typography color="primary">{material !== null ? material!.kccc : ""}</Typography>
                            <Typography mb={2}>№R-3:</Typography>
                            <Typography color="primary">{material !== null ? material!.nr3 : ""}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <FormControlLabel control={<Checkbox onChange={handleChangeChecked}/>}
                                              label="Расходный материал"/>
                            {checked ? <ParentKcccField/> : null}
                        </Stack>
                        <Stack direction="row" spacing={2} mt={1}>
                            <Typography mb={2}>Количество в эксплуатации:</Typography>

                            <TextField id="inOperationMaterial" variant="outlined" size='small' type="number"
                                       style={{width: "10%"}}
                                       value={material !== null ? material!.inOperation : ""}
                                       onChange={(newValue) => changeMaterialInOperation(parseInt(newValue.target.value), material!)}
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} mt={1}>
                            <Typography mb={2}>Количество на складе:</Typography>
                            <TextField id="inStockMaterial" variant="outlined" size='small' type="number"
                                       style={{marginLeft: "65px", width: "10%"}}
                                       value={material !== null ? material!.inStock : ""}
                                       onChange={(newValue) => changeMaterialInStock(parseInt(newValue.target.value), material!)}
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
                        <TableContainer component={Paper}>
                            <Typography sx={{padding: '10px'}}>Расходные материалы прибора:</Typography>
                            <Table sx={{width: "100%"}} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Наименование</TableCell>
                                        <TableCell align="right">№R-3</TableCell>
                                        <TableCell align="right">№КССС</TableCell>
                                        <TableCell align="right">Количество в эксплуатации</TableCell>
                                        <TableCell align="right">Количество на складе</TableCell>
                                    </TableRow>
                                </TableHead>
                                {material?.materials.length !== 0 ? (
                                    <TableBody>
                                        {material?.materials.map((row) => (
                                            <TableRow
                                                key={row.nr3}
                                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="right">{row.nr3}</TableCell>
                                                <TableCell align="right">{row.kccc}</TableCell>
                                                <TableCell align="right">{row.inOperation}</TableCell>
                                                <TableCell align="right">{row.inStock}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                ) : (
                                    <div></div>
                                )}
                            </Table>
                        </TableContainer>

                    </div>
                </div>
                <Paper sx={{width: '100%'}} style={{padding: "20px"}}>
                    <Stack direction='row' justifyContent='space-between' sx={{width: '100%'}}>
                        <Button variant="contained">Удалить прибор</Button>
                        <Button variant="contained">Сохранить изменения</Button>
                    </Stack>
                </Paper>
            </Stack>
        </Box>
    )
}
