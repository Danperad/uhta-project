import {Box, Button, Paper, Stack, TextField, Typography} from "@mui/material";
import {useState} from "react";

export default function ReportPage() {

    const [reportName, setReportName] = useState<string | undefined>();

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
                        <Typography mb={1}>Отчеты</Typography>
                        <Stack direction="row" spacing={2} style={{width: "100%"}} height='100%'>
                            <TextField sx={{width: '30%'}} label="Поиск" variant="outlined"
                                       size='small' type="search"/>
                            <TextField label="От" type="date" size='small' sx={{width: '16%'}}
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                            />
                            <TextField label="До" type="date" size='small' sx={{width: '16%'}}
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                            />
                            <Button variant="contained" >Показать</Button>
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
                                <TextField label="Наименование" variant="outlined"
                                           size='small'
                                           required
                                           value={reportName}
                                           onChange={(newValue) => setReportName(newValue.target.value)}/>
                                <TextField label="От" type="date" size='small'
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                />
                                <TextField label="До" type="date" size='small'
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                />
                            </Stack>
                            <Stack direction='row' spacing={1} justifyContent='center'>
                                <Button variant="contained">Создать</Button>
                            </Stack>
                        </Stack>
                    </Paper>
                </Box>
            </Box>
        </Box>
    )
}