import * as React from 'react';
import {
    Box,
    Button,
    Checkbox,
    Collapse,
    FormControlLabel,
    Modal,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';

import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import {Consumable, Material} from '../models';
import {style} from "../assets/css/CreateOrderModal";
import DeviceService from "../services/DeviceService";
import material from "../models/Material";
import {EnhancedTableHead, EnhancedTableToolbar, getComparator, Order, stableSort} from './ConsumableInModal';
import {useDispatch} from "react-redux";
import {AppDispatch} from "../redux/store";
import {AddSnackbar} from "../redux/actions/snackbarAction";

export default function TableRowMaterial(props: { rowMaterial: Material }) {
    const dispatch = useDispatch<AppDispatch>();

    const [material, setMaterial] = React.useState<Material | null>(null);

    const {rowMaterial} = props;
    const [open, setOpen] = React.useState(false);
    const [openCreateOrderModal, setCreateOrderModalOpen] = React.useState(false);
    const handleOpenEditMaterialModal = (nr3: number) => {
        DeviceService.getDeviceByNr3(nr3).then((res) => {
            if (res === null) return;
            setMaterial(res);
        });
        setCreateOrderModalOpen(true);
    }
    const handleCloseEditMaterialModal = () => {
        setCreateOrderModalOpen(false);
        if (checked) {
            setChecked(prev => !prev);
        }
    }

    const {useState} = React;
    const [checked, setChecked] = useState(false);
    const handleChangeChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    function changeMaterialInOperation(newValue: number, material: material) {
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

    function changeMaterialInStock(newValue: number, material: material) {
        if (newValue >= 0) {
            if (newValue > material.inStock) {
                setMaterial({...material, inStock: material.inStock + 1})
            }
            if (newValue < material.inStock) {
                setMaterial({...material, inStock: material.inStock - 1})
            }
        }
    }


    return (
        <React.Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" onClick={(e) => {
                    handleOpenEditMaterialModal(rowMaterial.nr3)
                }}>
                    {rowMaterial.name}
                </TableCell>
                <TableCell align="right">{rowMaterial.nr3}</TableCell>
                <TableCell align="right">{rowMaterial.kccc}</TableCell>
                <TableCell align="right" >{rowMaterial.inOperation}</TableCell>
                <TableCell align="right" >{rowMaterial.inStock}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1}}>
                            <Typography variant="h6" gutterBottom component="div" color='primary'>
                                Расходные материалы
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Наименование</TableCell>
                                        <TableCell align="right">№R-3</TableCell>
                                        <TableCell>№КССС</TableCell>
                                        <TableCell align="right">Количество в эксплуатации</TableCell>
                                        <TableCell align="right">Количество на складе</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rowMaterial.materials.map((materialRow) => (
                                        <TableRow>
                                            <TableCell component="th" scope="row">{materialRow.name}</TableCell>
                                            <TableCell>{materialRow.nr3}</TableCell>
                                            <TableCell>{materialRow.kccc}</TableCell>
                                            <TableCell align="right"
                                                       typeof='number'>{materialRow.inOperation}</TableCell>
                                            <TableCell align="right"
                                                       typeof='number'>{materialRow.inStock}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <Modal
                open={openCreateOrderModal}
                onClose={handleCloseEditMaterialModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Stack direction="column"
                           justifyContent="space-between"
                           alignItems="stretch"
                           spacing={2}
                           sx={{width: '97%', height: '100%'}} style={{margin: '0px'}}>
                        <Paper sx={{width: '100%'}} style={{marginLeft: "0px", padding: "20px", marginBottom: "8px"}}>
                            <Stack direction="row" spacing={2}>
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
                        <Box sx={{width: '103%'}}>
                            <Paper sx={{width: '100%', mb: 2}}>

                            </Paper>

                        </Box>
                        <Paper sx={{width: '100%'}} style={{margin: "0px", padding: "20px"}}>
                            <Stack direction='row' justifyContent='space-between' sx={{width: '100%'}}>
                                <Button variant="contained">Отвязать от прибора</Button>
                                <Button variant="contained">Сохранить изменения</Button>
                            </Stack>
                        </Paper>
                    </Stack>
                </Box>
            </Modal>
        </React.Fragment>
    );
}