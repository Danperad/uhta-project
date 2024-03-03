import {Avatar, Box, Button, Paper, Stack, TextField, Typography} from '@mui/material';
import React, {useState} from "react";

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
        }}>
            <Box sx={{
                display: 'grid',
                height: "98.5%",
                margin: "8px 8px 8px 0",
                gridTemplateColumns: 'repeat(1, 1fr)',
                gridTemplateRows: 'repeat(2, 90px)',
                gridTemplateAreas: `"header"
                        "main"`,
            }}>
                <Box sx={{gridArea: 'header'}}>
                    <Paper style={{marginLeft: "0px", padding: "20px"}}>
                        <Typography mb={1}>Личный кабинет</Typography>
                    </Paper>
                </Box>
                <Box sx={{gridArea: 'main', height: "84vh",}}>
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
                            <Box sx={{gridArea: 'avatar'}}>
                                <Avatar sx={{width: 200, height: 200, ml: 15,}}>Г</Avatar>
                            </Box>
                            <Box sx={{gridArea: 'fio', width: "80%"}}>
                                <Stack spacing={3}>
                                    <TextField label="Фамилия" variant="outlined"
                                               size='small'
                                               required
                                               value={surname}
                                               onChange={(newValue) => setSurname(newValue.target.value)}/>
                                    <TextField label="Имя" variant="outlined"
                                               size='small'
                                               required
                                               value={name}
                                               onChange={(newValue) => setName(newValue.target.value)}/>
                                    <TextField label="Отчество" variant="outlined"
                                               size='small'
                                               value={middleName}
                                               onChange={(newValue) => setMiddleName(newValue.target.value)}/>
                                    <Button variant="contained" sx={{width: "25%"}}>Сохранить</Button>
                                </Stack>
                            </Box>
                            <Box sx={{gridArea: 'info', width: "80%"}}>
                                <Stack spacing={3}>
                                    <TextField label="Логин" variant="outlined"
                                               size='small'
                                               required
                                               value={login}
                                               onChange={(newValue) => setLogin(newValue.target.value)}/>
                                    <TextField label="Пароль" variant="outlined"
                                               size='small'
                                               required
                                               value={password}
                                               onChange={(newValue) => setPassword(newValue.target.value)}/>
                                    <TextField label="Роль" variant="outlined"
                                               size='small'
                                               required
                                               disabled={true}
                                               value={role}/>
                                </Stack>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Box>
    )
}