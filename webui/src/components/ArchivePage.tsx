import {Box, Button, Paper, Stack, TextField, Typography} from "@mui/material";

export default function ReportPage(){
    return(
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
                gridTemplateRows: 'repeat(2, 138px)',
                gridTemplateAreas: `"header"
                        "main"`,
            }}>
                <Box sx={{gridArea: 'header'}}>
                    <Paper style={{marginLeft: "0px", padding: "20px", marginBottom: "8px"}}>
                        <Typography mb={1}>Архив</Typography>

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
                <Box sx={{height: "84vh", gridArea: 'main'}}>

                </Box>
            </Box>
        </Box>
    )
}