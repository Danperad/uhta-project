import React, {useEffect, useState} from 'react';
import {
  Avatar,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  Modal,
  OutlinedInput,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import {useNavigate} from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {State} from '../models';
import style from '../assets/css/SignInModal.module.css';

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DescriptionIcon from '@mui/icons-material/Description';
import ArchiveIcon from '@mui/icons-material/Archive';
import BuildIcon from '@mui/icons-material/Build';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../redux/store";
import {AddSnackbar} from "../redux/actions/snackbarAction";
import UserService from "../services/UserService";
import digestMessage from "../hashGenerator";
import {CurrentUserNotLoaded} from "../redux/actions/currentUserAction";
import SettingsIcon from '@mui/icons-material/Settings';

export default function SideBar() {
  const user = useSelector((state: RootState) => state.currentUser.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [openEnterModal, setEnterModalOpen] = React.useState(false);
  const handleOpenEnterModal = () => setEnterModalOpen(true);
  const handleCloseEnterModal = () => setEnterModalOpen(false);

  const [values, setValues] = React.useState<State>({
    login: '',
    password: '',
    showPassword: false
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [avatarName, setAvatarName] = useState<string | undefined>();

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({...values, [prop]: event.target.value});
    };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const autorization = async () => {
    const hashPassword = await digestMessage(values.password);
    const res = await UserService.getUserByLoginAndPassword(values.login, hashPassword)
    if (res) {
      dispatch(res)
      dispatch(AddSnackbar({
        messageText: "Авторизация прошла успешна",
        messageType: "success",
        key: +new Date()
      }))
      setEnterModalOpen(false)
    } else {
      dispatch(AddSnackbar({
        messageText: "Неверный логин или пароль!",
        messageType: "error",
        key: +new Date()
      }))
    }
    return;
  };

  useEffect(() => {
    if (user) {
      setAvatarName(user.firstName.substring(0, 1) + user.lastName.substring(0, 1))
    }
  }, [user])

  return (
    <div style={{
      backgroundColor: '#727272',
      padding: '10px',
      borderRadius: '0 8px 8px 0',
    }}>
      <Stack justifyContent='space-between' height='100%'>
        <Stack spacing={2} marginTop={8}>
          {user ? (
            <Avatar sx={{width: 80, height: 80, cursor: "pointer"}}
                    style={{marginLeft: "auto", marginRight: "auto"}} onClick={() => {
              navigate("/account")
            }}>{avatarName}</Avatar>
          ) : (
            <Avatar sx={{width: 80, height: 80, cursor: "pointer"}}
                    style={{marginLeft: "auto", marginRight: "auto"}}>{avatarName}</Avatar>
          )}
          <Button variant="contained" color="secondary" disableElevation sx={{borderRadius: '5px'}}
                  startIcon={<FormatListBulletedIcon/>} onClick={() => {
            navigate("/order")
          }}>
            Заявки
          </Button>
          <Button variant="contained" color="secondary" disableElevation sx={{borderRadius: '5px'}}
                  startIcon={<BuildIcon/>} onClick={() => {
            navigate("/device")
          }}>
            Приборы
          </Button>
          <Button variant="contained" color="secondary" disableElevation sx={{borderRadius: '5px'}}
                  startIcon={<PeopleAltIcon/>} onClick={() => {
            navigate("/employee")
          }}>
            Сотрудники
          </Button>
          {user && user.role === "ADMIN" ? (
            <Button variant="contained" color="secondary" disableElevation sx={{borderRadius: '5px'}}
                    startIcon={<SettingsIcon/>} onClick={() => {
              navigate("/logs")
            }}>
              Логирование
            </Button>
          ) : (
            <></>
          )}
          <Button variant="contained" color="secondary" disableElevation sx={{borderRadius: '5px'}}
                  startIcon={<ArchiveIcon/>} onClick={() => {
            navigate("/archive")
          }}>
            Архив
          </Button>
          <Button variant="contained" color="secondary" disableElevation sx={{borderRadius: '5px'}}
                  startIcon={<DescriptionIcon/>} onClick={() => {
            navigate("/report")
          }}>
            Отчеты
          </Button>
        </Stack>
        {user ? (
          <Button variant="contained" color="secondary" disableElevation sx={{borderRadius: '5px'}}
                  startIcon={<LoginRoundedIcon/>} onClick={() => {
            dispatch(CurrentUserNotLoaded())
          }}>
            Выйти
          </Button>
        ) : (
          <Button variant="contained" color="secondary" disableElevation sx={{borderRadius: '5px'}}
                  startIcon={<LoginRoundedIcon/>} onClick={handleOpenEnterModal}>
            Авторизация
          </Button>

        )}
      </Stack>

      <Modal
        open={openEnterModal}
        onClose={handleCloseEnterModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={style.signInModalStyle}>
          <Typography variant="h5" color="primary" align='center'>Авторизация</Typography>
          <Stack
            component="form"
            sx={{
              width: '100%',
              mt: '30px',
            }}
            spacing={3}
            noValidate
            autoComplete="off"
            alignItems="center"
          >
            <TextField sx={{width: '40ch'}} label="Логин" size='small' value={values.login}
                       onChange={handleChange('login')}/>

            <FormControl sx={{width: '40ch'}} variant="outlined" size='small'>
              <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>

            <Button variant="contained" size="large" color="primary" sx={{borderRadius: '10px'}}
                    onClick={() => {
                      autorization()
                    }} disableElevation>Войти</Button>
            <Link component="button" variant="body2" onClick={handleCloseEnterModal}>Продолжить как
              гость</Link>
          </Stack>
        </Box>
      </Modal>
    </div>
  )
}
