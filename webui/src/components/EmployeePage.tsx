import {Box, Button, Paper, Stack, TextField, Typography} from "@mui/material";
import {useState} from "react";

export default function EmployeePage() {

    const [surname, setSurname] = useState<string | undefined>();
    const [name, setName] = useState<string | undefined>();
    const [middleName, setMiddleName] = useState<string | undefined>();

    return (
        <Box sx={{
            width: '100%',
            height: '100vh',
            '& > .MuiBox-root > .MuiBox-root': {
                p: 1,
            },
        }}>

            <Box
                sx={{
                    display: 'grid',
                    height: "98.5%",
                    margin: "8px 8px 8px 0",
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gridTemplateRows: 'repeat(2, 138px)',
                    gridTemplateAreas: `"header header header header"
                        "main main main sidebar"`,
                }}
            >
                <Box sx={{gridArea: 'header'}}>
                    <Paper style={{padding: "20px"}}>
                        <Typography mb={1}>Сотрудники</Typography>
                        <Stack direction="row" spacing={2} style={{width: "100%"}} height='100%'>
                            <TextField sx={{width: '30%'}} label="Поиск" variant="outlined"
                                       size='small' type="search"/>
                            <Button variant="contained">Показать</Button>
                        </Stack>
                    </Paper>
                </Box>
                <Box sx={{gridArea: 'main', height: "80vh"}}>

                </Box>
                <Box sx={{gridArea: 'sidebar', height: "76vh"}} component="form">
                    <Paper
                        style={{
                            padding: "20px",
                            textAlign: "center",
                            height: '100%'
                        }}>
                        <Stack
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={2}
                            style={{height: '100%'}}
                        >
                            <Stack spacing={2}>
                                <Typography>Добавление</Typography>
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
                                           required
                                           value={middleName}
                                           onChange={(newValue) => setMiddleName(newValue.target.value)}/>
                            </Stack>
                            <Stack direction='row' spacing={1} justifyContent='center'>
                                <Button variant="contained">Добавить</Button>
                            </Stack>
                        </Stack>
                    </Paper>
                </Box>
            </Box>
        </Box>
    )
}