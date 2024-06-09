import {Box, Button, Paper, Stack, TextField, Typography} from "@mui/material";
import {ChangeEvent, useRef, useState} from "react";
import excelIcon from "../../public/image/excel.svg";
import {AddSnackbar} from "../redux/actions/snackbarAction";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../redux/store";
import {Logs} from "../models";
import LogsService from "../services/LogsService";

export default function ReportPage() {

  const [applicationNumber, setApplicationNumber] = useState<string | undefined>();
  const inputFile = useRef<HTMLInputElement | null>(null)
  const user = useSelector((state: RootState) => state.currentUser.user);
  const dispatch = useDispatch<AppDispatch>();

  const createReport = async () => {
    const link = document.createElement('a');
    link.href = 'https://download1523.mediafire.com/6lg104yr1togBAkA3065_YuiqBXBXRBXnCpxZLtLHB4mnUdku-fUv4v6azvv02106Lm3I64Bw2bwYlXgSepf53vcUcHGyOeKvEDogftDW6xFkaZM3x_JUHB2_tDSNi1HFX7_lPZRyNIL0KUTI0PuPGivkznwge1jhTnjfJSUwhjY4A/jsf3gpw0s0s83x3/Отчет.xlsx';
    link.setAttribute('download', 'report.xlsx'); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
  }

  const uploadXmlButtonClick = () => {
    inputFile.current?.click()
  };
  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files === null || !files || files!.length === 0)
      return

    const file = files!.item(0)
    if (file === null) return;

    const newLog: Logs = {
      id: undefined,
      user_login: user!.login,
      action: "Добавление поставки",
      status: "ОК",
      result: "Добавление прошло успешно",
      element_number: parseInt(applicationNumber!),
      date: new Date()
    }
    try {
      await LogsService.addLog(newLog);
    } catch (e) {
      console.log(e)
    }

    dispatch(AddSnackbar({
      messageText: "Поставка успешно добавлена!",
      messageType: "success",
      key: +new Date()
    }))
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
          gridTemplateColumns: 'repeat(1, 1fr)',
          gridTemplateRows: 'repeat(2, 170px)',
          gridTemplateAreas: `"header"
                        "main "`,
        }}
      >
        <Box sx={{gridArea: 'header'}}>
          <Paper style={{padding: "20px"}}>
            <Typography mb={1}>Отчеты</Typography>
            <Stack mb={1} direction="row" spacing={2} style={{width: "100%"}} height='100%'>
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
              <Button variant="contained" onClick={() => {
                createReport()
              }}>Скачать</Button>
            </Stack>
            <Typography>Перед формированием отчета убедитесь, что загружены все актуальные поставки</Typography>
          </Paper>
        </Box>
        <Box sx={{gridArea: 'main', height: "76vh"}}>
          <Paper style={{padding: "20px"}}>
            <Typography mb={1}>Поставки</Typography>
            <Stack direction="row" mb={1} spacing={2} style={{width: "100%"}} height='100%'>
              <TextField label="Номер заявки" variant="outlined" size='small'
                         type="number" required
                         value={applicationNumber} onChange={(newValue) => setApplicationNumber(newValue.target.value)}
                         InputProps={{
                           inputProps: {min: 1}
                         }}
              />
              <Button variant="contained"
                      endIcon={<img src={excelIcon} style={{width: "20px"}} alt="excel"></img>}
                      onClick={uploadXmlButtonClick}>
                Загрузить
                <input type='file' ref={inputFile}
                       accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                       hidden onChange={uploadFile}/>
              </Button>
            </Stack>
            <Typography>Дата загрузки последней поставки: 09.06.2024</Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}
