import {Avatar, Box, Button, Paper, Stack, TextField, Typography, TableContainer, TableHead, TableRow, TableBody,  TableCell, Table} from '@mui/material';
import React, {useState} from "react";
import { BarChart } from '@mui/x-charts/BarChart';


function createData(
    name: string,
    count: number,
) {
    return { name, count};
}

const rows = [
    createData('Грозный Иван Андреевич', 15),
    createData('Быков Владимир Николаевич', 11),
    createData('Смирнов Андрей Генадьевич', 9),
    createData('Глушков Валерий Юрьевич', 5),
    createData('Зубарев Анатолий Павлович', 1),
];

export default function PersonalAccount() {
    const [surname, setSurname] = useState<string | undefined>();
    const [name, setName] = useState<string | undefined>();
    const [middleName, setMiddleName] = useState<string | undefined>();
    const [login, setLogin] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();
    const [role, setRole] = useState<string | undefined>();

    return (
        <Box sx={{
            width: '100%',
            height: '100vh',
            '& > .MuiBox-root > .MuiBox-root': {
                p: 1,
            },
        }}
        >
            <Box sx={{
                display: 'grid',
                height: "98.5%",
                margin: "8px 8px 8px 0",
                gridTemplateColumns: 'repeat(5, 1fr)',
                gridTemplateRows: 'repeat(1, 90px)',
                gridTemplateAreas: `"header header header header header"
                        "main main main main main"
                        "chart chart chart statistics statistics"`,
            }}>
                <Box sx={{gridArea: 'header'}}>
                    <Paper style={{marginLeft: "0px", padding: "20px"}}>
                        <Typography mb={1}>Личный кабинет</Typography>
                    </Paper>
                </Box>
                <Box sx={{gridArea: 'main', height: "28vh"}}>
                    <Paper
                        style={{
                            padding: "20px",
                            textAlign: "center",
                            height: '100%'
                        }}>
                        <Box sx={{
                            display: 'grid',
                            height: "98.5%",
                            margin: "8px 8px 8px 0",
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gridTemplateAreas: `"avatar fio info"`,
                            gap: 2
                        }}>
                            <Box sx={{gridArea: 'avatar', height: "40vh"}}>
                                <Avatar sx={{width: 200, height: 200, ml: 15,}}>Г</Avatar>
                            </Box>
                            <Box sx={{gridArea: 'fio', width: "80%" }}>
                                <Stack spacing={3}>
                                    <TextField label="Фамилия" variant="outlined"
                                               size='small'
                                               required
                                               value={"Грозный"}
                                               onChange={(newValue) => setSurname(newValue.target.value)}/>
                                    <TextField label="Имя" variant="outlined"
                                               size='small'
                                               required
                                               value={"Иван"}
                                               onChange={(newValue) => setName(newValue.target.value)}/>
                                    <TextField label="Отчество" variant="outlined"
                                               size='small'
                                               value={"Андреевич"}
                                               onChange={(newValue) => setMiddleName(newValue.target.value)}/>
                                    <Button variant="contained" sx={{width: "25%"}}>Сохранить</Button>
                                </Stack>
                            </Box>
                            <Box sx={{gridArea: 'info', width: "80%"}}>
                                <Stack spacing={3}>
                                    <TextField label="Роль" variant="outlined"
                                               size='small'
                                               required
                                               disabled={true}
                                               value={"Администратор"}/>
                                    <TextField label="Логин" variant="outlined"
                                               size='small'
                                               required
                                               value={"Grozny"}
                                               disabled={true}
                                    />
                                    <TextField label="Пароль" variant="outlined"
                                               size='small'
                                               required
                                               value={"groza123"}
                                               type="password"
                                               onChange={(newValue) => setPassword(newValue.target.value)}/>
                                </Stack>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
                <Box sx={{gridArea: 'chart', height: "49.5vh"}}>
                    <Paper style={{marginLeft: "0px", padding: "20px", height: "100%"}}>
                        <Typography mb={1}>Рейтинговая таблица</Typography>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Сотрудник</TableCell>
                                        <TableCell align="right">Количество заявок за месяц</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.name}
                                            </TableCell>
                                            <TableCell align="right">{row.count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
                <Box sx={{gridArea: 'statistics', height: "49.5vh"}}>
                    <Paper style={{marginLeft: "0px", padding: "20px", height: "100%"}}>
                        <Typography mb={1}>Личная статистика</Typography>
                        <BarChart
                            colors={["#1066ee"]}
                            xAxis={[{ scaleType: 'band', data: ['Январь', 'Февраль', 'Март'] }]}
                            series={[{ data: [4, 9, 15] }]}
                            sx={{width: "100%"}}
                        />
                    </Paper>
                </Box>
            </Box>
        </Box>
    )
}