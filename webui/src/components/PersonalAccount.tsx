import {Avatar, Box, Button, Paper, Stack, TextField, Typography} from '@mui/material';
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {useNavigate} from "react-router-dom";

export default function PersonalAccount() {
  const user = useSelector((state: RootState) => state.currentUser.user);
  const navigate = useNavigate();

  const [surname, setSurname] = useState<string | undefined>();
  const [name, setName] = useState<string | undefined>();
  const [middleName, setMiddleName] = useState<string | undefined>();
  const [login, setLogin] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [role, setRole] = useState<string | undefined>();
  const [avatarName, setAvatarName] = useState<string | undefined>();
  const [disabled, setDisabled] = useState<boolean>(true);

  function ReRoleConverter(role: string) {
    switch (role) {
      case "ADMIN":
        return "Администратор"
      case "WORKER":
        return "Пользователь"
    }
  }

  const changeInfo = async () => {
    setDisabled(false)
  }
  const saveChange = async () => {
    setDisabled(true)
  }

  useEffect(() => {
    if (user) {
      setSurname(user.lastName)
      setName(user.firstName)
      setMiddleName(user.middleName)
      setLogin(user.login)
      setAvatarName(user.firstName.substring(0, 1) + user.lastName.substring(0, 1))
      setPassword(user.password)
      setRole(ReRoleConverter(user.role))
    } else {
      navigate("/")
    }
  }, [user])

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
                <Avatar sx={{width: 200, height: 200, ml: 15,}}>{avatarName}</Avatar>
              </Box>
              <Box sx={{gridArea: 'fio', width: "80%"}}>
                <Stack spacing={3}>
                  <TextField label="Фамилия" variant="outlined"
                             size='small'
                             required
                             disabled={disabled}
                             value={surname}
                             onChange={(newValue) => setSurname(newValue.target.value)}/>
                  <TextField label="Имя" variant="outlined"
                             size='small'
                             required
                             disabled={disabled}
                             value={name}
                             onChange={(newValue) => setName(newValue.target.value)}/>
                  <TextField label="Отчество" variant="outlined"
                             size='small'
                             disabled={disabled}
                             value={middleName}
                             onChange={(newValue) => setMiddleName(newValue.target.value)}/>
                  {disabled ? (
                    <Button variant="contained" sx={{width: "25%"}} onClick={() => {
                      changeInfo()
                    }}>Изменить</Button>
                  ) : (
                    <Button variant="contained" sx={{width: "25%"}} onClick={() => {
                      saveChange()
                    }}>Сохранить</Button>
                  )}

                </Stack>
              </Box>
              <Box sx={{gridArea: 'info', width: "80%"}}>
                <Stack spacing={3}>
                  <TextField label="Роль" variant="outlined"
                             size='small'
                             required
                             disabled={true}
                             value={role}/>
                  <TextField label="Логин" variant="outlined"
                             size='small'
                             required
                             value={login}
                             disabled={true}
                  />
                </Stack>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}
