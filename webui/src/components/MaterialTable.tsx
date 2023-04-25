import {Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import TableRowMaterial from "./TableRowMaterial";
import React from "react";
import {Device} from "../models";
import DeviceService from "../services/DeviceService";

export default function MaterialTable()
{
    const [materials, setMaterials] = React.useState<Device[]>([]);
    const [key, setKey] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (key) return;
        setKey(true);
        DeviceService.getAllDevices().then((res: Device[]) => {
            setMaterials(res);
        }).catch(err => console.log(err));
    }, [materials, key])

    return(
        <div className='section' style={{height: '100%'}}>
            {materials.length !== 0 ? (
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

                            {materials.map((row) => (
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
        </div>
    )
}