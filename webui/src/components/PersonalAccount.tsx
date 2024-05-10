import {Avatar, Box, Button, Paper, Stack, TextField, Typography} from '@mui/material';
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../redux/store";
import {useNavigate} from "react-router-dom";
import {AddSnackbar} from "../redux/actions/snackbarAction";
import digestMessage from "../hashGenerator";

export default function PersonalAccount() {
  const user = useSelector((state: RootState) => state.currentUser.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [surname, setSurname] = useState<string | undefined>();
  const [name, setName] = useState<string | undefined>();
  const [middleName, setMiddleName] = useState<string | undefined>();
  const [login, setLogin] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [oldPassword, setOldPassword] = useState<string | undefined>();
  const [newPassword, setNewPassword] = useState<string | undefined>();
  const [newPasswordRepeat, setNewPasswordRepeat] = useState<string | undefined>();
  const [role, setRole] = useState<string | undefined>();
  const [avatarName, setAvatarName] = useState<string | undefined>();
  const [disabled, setDisabled] = useState<boolean>(true);
  const [disabledPassword, setDisabledPassword] = useState<boolean>(true);

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
    setAvatarName(name!.substring(0, 1) + surname!.substring(0, 1))
    setDisabled(true)
    dispatch(AddSnackbar({
      messageText: "Изменение прошло успешно",
      messageType: "success",
      key: +new Date()
    }))
  }
  const cancelChange = async () => {
    setDisabled(true)
    setSurname(user!.lastName)
    setName(user!.firstName)
    setMiddleName(user!.middleName)
  }

  const changePassword = async () => {
    setDisabledPassword(false)
  }
  const saveChangePassword = async () => {
    if(oldPassword){
      const hashPassword = await digestMessage(oldPassword);
      if (hashPassword === password!) {
        if(newPassword && newPasswordRepeat){
          if(newPassword === newPasswordRepeat){

            if(user){
              user.password = hashPassword
              setDisabledPassword(true)
              setPassword(hashPassword)
              setOldPassword("")
              setNewPassword("")
              setNewPasswordRepeat("")
              dispatch(AddSnackbar({
                messageText: "Изменение прошло успешно",
                messageType: "success",
                key: +new Date()
              }))
            }

          }
          else{
            dispatch(AddSnackbar({
              messageText: "Пароли не совпадают",
              messageType: "error",
              key: +new Date()
            }))
          }
        }
        else{
          dispatch(AddSnackbar({
            messageText: "Не все поля заполнены",
            messageType: "error",
            key: +new Date()
          }))
        }
      }
      else{
        dispatch(AddSnackbar({
          messageText: "Неверный старый пароль",
          messageType: "error",
          key: +new Date()
        }))
      }
    }
    else{
      dispatch(AddSnackbar({
        messageText: "Введите старый пароль",
        messageType: "error",
        key: +new Date()
      }))
    }
  }
  const cancelChangePassword = async () => {
    setDisabledPassword(true)
    setOldPassword("")
    setNewPassword("")
    setNewPasswordRepeat("")
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
                    <Button variant="outlined" sx={{width: "25%"}} onClick={() => {
                      changeInfo()
                    }}>Изменить</Button>
                  ) : (
                    <Stack direction="row" spacing={2}>
                      <Button variant="outlined" sx={{width: "25%"}} onClick={() => {
                        cancelChange()
                      }}>Отмена</Button>
                      <Button variant="contained" sx={{width: "25%"}} onClick={() => {
                        saveChange()
                      }}>Сохранить</Button>
                    </Stack>
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
                  {disabledPassword ? (
                    <Button variant="outlined" sx={{width: "45%"}} onClick={() => {
                      changePassword()
                    }}>Изменить пароль</Button>
                  ) : (
                    <>
                      <TextField label="Старый пароль" variant="outlined"
                                 size='small'
                                 required
                                 type="password"
                                 value={oldPassword}
                                 disabled={disabledPassword}
                                 onChange={(newValue) => setOldPassword(newValue.target.value)}
                      />
                      <TextField label="Новый пароль" variant="outlined"
                                 size='small'
                                 required
                                 type="password"
                                 value={newPassword}
                                 disabled={disabledPassword}
                                 onChange={(newValue) => setNewPassword(newValue.target.value)}
                      />
                      <TextField label="Повторите пароль" variant="outlined"
                                 size='small'
                                 required
                                 type="password"
                                 value={newPasswordRepeat}
                                 disabled={disabledPassword}
                                 onChange={(newValue) => setNewPasswordRepeat(newValue.target.value)}
                      />
                      <Stack direction="row" spacing={2}>
                        <Button variant="outlined" sx={{width: "25%"}} onClick={() => {
                          cancelChangePassword()
                        }}>Отмена</Button>
                        <Button variant="contained" sx={{width: "47%"}} onClick={() => {
                          saveChangePassword()
                        }}>Сохранить пароль</Button>
                      </Stack></>
                  )}
                </Stack>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}
