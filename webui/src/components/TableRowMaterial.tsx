import * as React from 'react';
import {Box, Collapse, Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@mui/material';

import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import {Material} from '../models';


export default function TableRowMaterial(props: { rowMaterial: Material }) {
    const {rowMaterial} = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
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
        </React.Fragment>
    );
}