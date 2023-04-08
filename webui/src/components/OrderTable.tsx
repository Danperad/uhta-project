import React from "react";
import {Order} from "../models";
import OrderService from "../services/OrderService";
import {
    Button,
    Paper,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";

export default function MaterialTable() {
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [key, setKey] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (key) return;
        setKey(true);
        OrderService.getOrder().then((res: Order[]) => {
            setOrders(res);
        }).catch(err => console.log(err));
    }, [orders, key])

    return (
        <div className='section' style={{height: '100%', width: '100%'}}>
            {orders.length !== 0 ? (
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Номер</TableCell>
                                <TableCell align="left">Наименование</TableCell>
                                <TableCell align="center">Дата</TableCell>
                                <TableCell align="center">Статус</TableCell>
                                <TableCell align="center">Архивация</TableCell>
                                <TableCell align="center">Скачивание</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((row) => (
                                <TableRow
                                    key={row.number}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell>{row.number}</TableCell>
                                    <TableCell align="left">{row.name}</TableCell>
                                    <TableCell align="center">{row.date.toString()}</TableCell>
                                    <TableCell align="center">{row.status}</TableCell>
                                    <TableCell align="center"><Button
                                        variant="contained">Архивировать</Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button variant="contained">Скачать</Button>
                                    </TableCell>
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
        </div>
    )
}