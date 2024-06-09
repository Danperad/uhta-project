import {Box, Button, Paper, Stack, TextField, Typography} from "@mui/material";
import {useState} from "react";

export default function ReportPage() {

  const [reportName, setReportName] = useState<string | undefined>();

  const createReport = async () => {
    const link = document.createElement('a');
    link.href = 'https://download1523.mediafire.com/6lg104yr1togBAkA3065_YuiqBXBXRBXnCpxZLtLHB4mnUdku-fUv4v6azvv02106Lm3I64Bw2bwYlXgSepf53vcUcHGyOeKvEDogftDW6xFkaZM3x_JUHB2_tDSNi1HFX7_lPZRyNIL0KUTI0PuPGivkznwge1jhTnjfJSUwhjY4A/jsf3gpw0s0s83x3/Отчет.xlsx';
    link.setAttribute('download', 'report.xlsx'); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
  }

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
              <Button variant="contained" onClick={() => {createReport()}}>Скачать</Button>
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
