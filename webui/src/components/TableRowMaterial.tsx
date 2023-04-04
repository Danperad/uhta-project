import React, {Fragment, useState} from 'react';
import {Box, Collapse, Modal, Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@mui/material';

import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import {Consumable, Material} from '../models';
import DeviceService from "../services/DeviceService";
import MaterialService from "../services/MaterialService";
import ChangeDeviceModal from "./ChangeDeviceModal";
import ChangeMaterialModal from "./ChangeMaterialModal"

export default function TableRowMaterial(props: { rowMaterial: Material }) {
    const [material, setMaterial] = useState<Material | null>(null);
    const [consumable, setConsumable] = useState<Consumable | null>(null);

    const {rowMaterial} = props;
    const [open, setOpen] = useState(false);
    const [openChangeDeviceModal, setChangeDeviceModal] = useState(false);
    const [openChangeMaterialModal, setChangeMaterialModal] = useState(false);
    const handleOpenEditDeviceModal = (nr3: number) => {
        DeviceService.getDeviceByNr3(nr3).then((res) => {
            if (res === null) return;
            setMaterial(res);
        });
        setChangeDeviceModal(true);
    }
    const handleCloseEditDeviceModal = () => {
        setChangeDeviceModal(false);
    }
    const handleOpenEditMaterialModal = (nr3: number) => {
        MaterialService.getMaterialByNr3(nr3).then((res) => {
            if (res === null) return;
            setConsumable(res);
        });
        setChangeMaterialModal(true);
    }
    const handleCloseEditMaterialModal = () => {
        setChangeMaterialModal(false);
    }


    return (
        <Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" onClick={(e) => {
                    handleOpenEditDeviceModal(rowMaterial.nr3)
                }}>
                    {rowMaterial.name}
                </TableCell>
                <TableCell align="right">{rowMaterial.nr3}</TableCell>
                <TableCell align="right">{rowMaterial.kccc}</TableCell>
                <TableCell align="right" onClick={(e) => {
                    handleOpenEditDeviceModal(rowMaterial.nr3)
                }}>{rowMaterial.inOperation}</TableCell>
                <TableCell align="right" onClick={(e) => {
                    handleOpenEditDeviceModal(rowMaterial.nr3)
                }}>{rowMaterial.inStock}</TableCell>
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
                                            <TableCell component="th" scope="row" onClick={(e) => {
                                                handleOpenEditMaterialModal(rowMaterial.nr3)
                                            }}>{materialRow.name}</TableCell>
                                            <TableCell>{materialRow.nr3}</TableCell>
                                            <TableCell>{materialRow.kccc}</TableCell>
                                            <TableCell align="right" onClick={(e) => {
                                                handleOpenEditMaterialModal(rowMaterial.nr3)
                                            }}
                                                       typeof='number'>{materialRow.inOperation}</TableCell>
                                            <TableCell align="right" onClick={(e) => {
                                                handleOpenEditMaterialModal(rowMaterial.nr3)
                                            }}
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
                open={openChangeDeviceModal}
                onClose={handleCloseEditDeviceModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <ChangeDeviceModal receivedMaterial={material!}/>
            </Modal>
            <Modal
                open={openChangeMaterialModal}
                onClose={handleCloseEditMaterialModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <ChangeMaterialModal receivedMaterial={consumable!}/>
            </Modal>
        </Fragment>
    );
}