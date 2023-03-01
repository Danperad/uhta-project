import React, { useState } from 'react';
import { Typography, Stack, Button, IconButton, OutlinedInput, InputLabel, InputAdornment, FormControl, TextField, Snackbar} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import {LoginModel} from '../models/RequestModels';
import sha256 from "sha256";
import {useNavigate} from 'react-router-dom';

interface State {
    login: string;
    password: string;
    showPassword: boolean;
  }

export default function Test() {
  const [openSnack, setOpenSnack] = React.useState(false);

  const handleClickSnack = () => {
    setOpenSnack(true);
  };
    
  const handleCloseSnack = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnack}
      >
      <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const [values, setValues] = React.useState<State>({
    login: '',
    password: '',
    showPassword: false
  });

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
    
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onClick = () => {
    const data: LoginModel = {
      login: values.login,
      password: sha256(values.password)
    };
      handleClickSnack();
      return;
	};

  return (
    <div>
      <Typography variant="h4" color="primary" align='center' mt="100px">Авторизация</Typography>
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
        <TextField sx={{ width: '40ch' }} label="Логин" size='small'  value={values.login} onChange={handleChange('login')}/>

        <FormControl sx={{ width: '40ch' }} variant="outlined" size='small'>
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
                {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            </InputAdornment>
            }
            label="Password"
          />
          </FormControl>

        <Button variant="contained" size="large" color="primary" sx={{ borderRadius: '10px'}} onClick={onClick} disableElevation>Войти</Button>
        <Snackbar
          open={openSnack}
          autoHideDuration={6000}
          onClose={handleCloseSnack}
          message="Неверный логин или пароль"
          action={action}
          />
      </Stack>
    </div>
  );
}
