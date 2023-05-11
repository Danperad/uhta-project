import {
    Box,
    Modal,
    Paper,
    Skeleton,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs
} from "@mui/material";
import TableRowMaterial from "./TableRowMaterial";
import {ReactNode, SyntheticEvent, useEffect, useState} from "react";
import {Consumable} from "../models";
import MaterialService from "../services/ConsumableService";
import ChangeMaterialModal from "./ChangeMaterialModal";
import { RootState} from "../redux/store";
import { useSelector} from "react-redux";

export interface MaterialTableProps {
    search: string;
}

export default () => {
    const state = useSelector((state: RootState) => state);

    const [value, setValue] = useState(0);

    const [consumable, setConsumable] = useState<Consumable | null>(null);
    const [openChangeConsumableModal, setChangeConsumableModal] = useState(false);

    interface TabPanelProps {
        children?: ReactNode;
        index: number;
        value: number;
    }

    function TabPanel(props: TabPanelProps) {
        const {children, value, index, ...other} = props;
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
                className='section' style={{height: '94%'}}
            >
                {value === index && (
                    <div>
                        {children}
                    </div>
                )}
            </div>
        );
    }

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleOpenEditMaterialModal = (csss: number) => {
        MaterialService.getConsumableByCsss(csss).then((res) => {
            if (res === null) return;
            setConsumable(res);
        });
        setChangeMaterialModal(true);
    }
    const handleCloseEditConsumableModal = () => {
        setConsumable(null);
    }

    useEffect(() => {
        if(consumable !== null)
        {
            setChangeConsumableModal(true);
        }
        else{
            setChangeConsumableModal(false);
        }
    },[consumable])

    return (
        <Paper style={{height: '100%'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider', width: '100%'}}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Приборы" {...a11yProps(0)} />
                    <Tab label="Расходники" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>

                {state.devices.length !== 0 ? (
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

                                {state.devices.map((row) => (
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

            </TabPanel>
            <TabPanel value={value} index={1}>
                
                {state.consumables.length !== 0 ? (
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 650}} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Наименование</TableCell>
                                    <TableCell align="right">№R-3</TableCell>
                                    <TableCell align="right">№КССС</TableCell>
                                    <TableCell align="right">Количество в эксплуатации</TableCell>
                                    <TableCell align="right">Количество на складе</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state.consumables.map((materialRow) => (
                                    <TableRow
                                        key={materialRow.title}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        onClick={() => {
                                            handleOpenEditMaterialModal(materialRow.csss)
                                        }}
                                    >
                                        <TableCell component="th" scope="row">{materialRow.title}</TableCell>
                                        <TableCell align="right">{materialRow.nr3}</TableCell>
                                        <TableCell align="right">{materialRow.csss}</TableCell>
                                        <TableCell align="right"
                                                   typeof='number'>{materialRow.inOperation}</TableCell>
                                        <TableCell align="right" typeof='number'>{materialRow.inStock}</TableCell>
                                    </TableRow>
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

            </TabPanel>
            <Modal
                open={openChangeConsumableModal}
                onClose={handleCloseEditConsumableModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <ChangeMaterialModal receivedMaterial={consumable!}/>
            </Modal>
        </Paper>
    )
}