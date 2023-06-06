import {Fragment, useEffect, useState} from 'react';
import {Box, Collapse, Modal, Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@mui/material';

import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import {Consumable, Device} from '../models';
import DeviceService from "../services/DeviceService";
import ConsumableService from "../services/ConsumableService";
import ChangeDeviceModal from "./ChangeDeviceModal";
import ChangeConsumableModal from "./ChangeConsumableModal"

export default function TableRowMaterial(props: { rowMaterial: Device }) {
    const [device, setDevice] = useState<Device>();
    const [consumable, setConsumable] = useState<Consumable>();

    const {rowMaterial} = props;
    const [open, setOpen] = useState(false);
    const [openChangeDeviceModal, setChangeDeviceModal] = useState(false);
    const [openChangeConsumableModal, setChangeConsumableModal] = useState(false);
    const handleOpenEditDeviceModal = async (csss: number) => {
        const device = await DeviceService.getDeviceByCsss(csss)
        if (!device) return;
        setDevice(device);
    }
    const handleCloseEditDeviceModal = () => {
        setDevice(undefined);
    }
    const handleOpenEditMaterialModal = async (csss: number) => {
        const consumablee = await ConsumableService.getConsumableByCsss(csss)
        if (!consumablee) return
        setConsumable(consumablee)
    }
    const handleCloseEditConsumableModal = () => {
        setConsumable(undefined);
    }

    useEffect(() => {
        if (device) {
            setChangeDeviceModal(true);
        } else {
            setChangeDeviceModal(false);
        }
    }, [device])
    useEffect(() => {
        if (consumable) {
            setChangeConsumableModal(true);
        } else {
            setChangeConsumableModal(false);
        }
    }, [consumable])

    return (
        <Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell>
                    {rowMaterial.consumables &&
                        <>
                            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                                {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                            </IconButton>
                        </>
                    }
                </TableCell>
                <TableCell component="th" scope="row" onClick={() => {
                    handleOpenEditDeviceModal(rowMaterial.csss)
                }}>
                    {rowMaterial.title}
                </TableCell>
                <TableCell align="right">{rowMaterial.nr3}</TableCell>
                <TableCell align="right">{rowMaterial.csss}</TableCell>
                <TableCell align="right" onClick={() => {
                    handleOpenEditDeviceModal(rowMaterial.csss)
                }}>{rowMaterial.inOperation}</TableCell>
                <TableCell align="right" onClick={() => {
                    handleOpenEditDeviceModal(rowMaterial.csss)
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
                                    {rowMaterial.consumables &&
                                        <>
                                            {rowMaterial.consumables.map((materialRow) => (
                                                <TableRow>
                                                    <TableCell component="th" scope="row" onClick={() => {
                                                        handleOpenEditMaterialModal(materialRow.csss)
                                                    }}>{materialRow.title}</TableCell>
                                                    <TableCell>{materialRow.nr3}</TableCell>
                                                    <TableCell>{materialRow.csss}</TableCell>
                                                    <TableCell align="right" onClick={() => {
                                                        handleOpenEditMaterialModal(materialRow.csss)
                                                    }}
                                                               typeof='number'>{materialRow.inOperation}</TableCell>
                                                    <TableCell align="right" onClick={() => {
                                                        handleOpenEditMaterialModal(materialRow.csss)
                                                    }}
                                                               typeof='number'>{materialRow.inStock}</TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                    }
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            {
                device &&
                <Modal
                    open={openChangeDeviceModal}
                    onClose={handleCloseEditDeviceModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <ChangeDeviceModal receivedMaterial={device} closeEvent={() => {
                        handleCloseEditDeviceModal()
                        setDevice(undefined)
                    }}/>
                </Modal>
            }
            {
                consumable &&
                <Modal
                    open={openChangeConsumableModal}
                    onClose={handleCloseEditConsumableModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <ChangeConsumableModal receivedMaterial={consumable} closeEvent={() => {
                        handleCloseEditConsumableModal()
                        setConsumable(undefined)
                    }}/>
                </Modal>
            }

        </Fragment>
    );
}