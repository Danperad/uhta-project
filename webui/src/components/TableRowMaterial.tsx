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
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
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
import {EnhancedTableToolbar, Order} from './ConsumableInModal';
import {useDispatch} from "react-redux";
import {AppDispatch} from "../redux/store";
import {AddSnackbar} from "../redux/actions/snackbarAction";

export default function TableRowMaterial(props: { rowMaterial: Material }) {
    const dispatch = useDispatch<AppDispatch>();

    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Consumable>('nr3');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Consumable,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rowMaterial.materials.map((n) => n.name);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: readonly string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDense(event.target.checked);
    };

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    const [rows, setRows] = React.useState<Consumable | null>(null);
    // Avoid a layout jump when reaching the last page with empty rows.
    // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows!.length) : 0;
    //End modal const

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
                <TableCell align="right" contentEditable>{rowMaterial.inOperation}</TableCell>
                <TableCell align="right" contentEditable>{rowMaterial.inStock}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1}}>
                            <Typography variant="h6" gutterBottom component="div">
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
                                            <TableCell align="right" contentEditable
                                                       typeof='number'>{materialRow.inOperation}</TableCell>
                                            <TableCell align="right" contentEditable
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
                                <EnhancedTableToolbar numSelected={selected.length}/>
                                <TableContainer>
                                    <Table
                                        sx={{minWidth: 750}}
                                        aria-labelledby="tableTitle"
                                        size={dense ? 'small' : 'medium'}
                                    >
                                        {/*<EnhancedTableHead*/}
                                        {/*    numSelected={selected.length}*/}
                                        {/*    order={order}*/}
                                        {/*    orderBy={orderBy}*/}
                                        {/*    onSelectAllClick={handleSelectAllClick}*/}
                                        {/*    onRequestSort={handleRequestSort}*/}
                                        {/*    rowCount={rows.length} //{material!.materials.length}?ser*/}
                                        {/*/>*/}
                                        {/*<TableBody>*/}
                                        {/*    {stableSort(rows, getComparator(order, orderBy))*/}
                                        {/*        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)*/}
                                        {/*        .map((row, index) => {*/}
                                        {/*            const isItemSelected = isSelected(row.name);*/}
                                        {/*            const labelId = `enhanced-table-checkbox-${index}`;*/}

                                        {/*            return (*/}
                                        {/*                <TableRow*/}
                                        {/*                    hover*/}
                                        {/*                    onClick={(event) => handleClick(event, row.name)}*/}
                                        {/*                    role="checkbox"*/}
                                        {/*                    aria-checked={isItemSelected}*/}
                                        {/*                    tabIndex={-1}*/}
                                        {/*                    key={row.name}*/}
                                        {/*                    selected={isItemSelected}*/}
                                        {/*                    sx={{ cursor: 'pointer' }}*/}
                                        {/*                >*/}
                                        {/*                    <TableCell padding="checkbox">*/}
                                        {/*                        <Checkbox*/}
                                        {/*                            color="primary"*/}
                                        {/*                            checked={isItemSelected}*/}
                                        {/*                            inputProps={{*/}
                                        {/*                                'aria-labelledby': labelId,*/}
                                        {/*                            }}*/}
                                        {/*                        />*/}
                                        {/*                    </TableCell>*/}
                                        {/*                    <TableCell*/}
                                        {/*                        component="th"*/}
                                        {/*                        id={labelId}*/}
                                        {/*                        scope="row"*/}
                                        {/*                        padding="none"*/}
                                        {/*                    >*/}
                                        {/*                        {row.name}*/}
                                        {/*                    </TableCell>*/}
                                        {/*                    <TableCell align="right">{row.nr3}</TableCell>*/}
                                        {/*                    <TableCell align="right">{row.kccc}</TableCell>*/}
                                        {/*                    <TableCell align="right">{row.inOperation}</TableCell>*/}
                                        {/*                    <TableCell align="right">{row.inStock}</TableCell>*/}
                                        {/*                </TableRow>*/}
                                        {/*            );*/}
                                        {/*        })}*/}
                                        {/*    {emptyRows > 0 && (*/}
                                        {/*        <TableRow*/}
                                        {/*            style={{*/}
                                        {/*                height: (dense ? 33 : 53) * emptyRows,*/}
                                        {/*            }}*/}
                                        {/*        >*/}
                                        {/*            <TableCell colSpan={6} />*/}
                                        {/*        </TableRow>*/}
                                        {/*    )}*/}
                                        {/*</TableBody>*/}
                                    </Table>
                                </TableContainer>
                                {/*<TablePagination*/}
                                {/*    rowsPerPageOptions={[5, 10, 25]}*/}
                                {/*    component="div"*/}
                                {/*    count={rows.length}*/}
                                {/*    rowsPerPage={rowsPerPage}*/}
                                {/*    page={page}*/}
                                {/*    onPageChange={handleChangePage}*/}
                                {/*    onRowsPerPageChange={handleChangeRowsPerPage}*/}
                                {/*/>*/}
                            </Paper>
                            <FormControlLabel
                                control={<Switch checked={dense} onChange={handleChangeDense}/>}
                                label="Dense padding"
                            />
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