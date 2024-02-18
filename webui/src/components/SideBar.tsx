import React from 'react';
import {
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
import {LoginModel} from '../models/RequestModels';
import sha256 from "sha256";
import {State} from '../models';
import style from '../assets/css/SignInModal.module.css';

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DescriptionIcon from '@mui/icons-material/Description';
import ArchiveIcon from '@mui/icons-material/Archive';
import BuildIcon from '@mui/icons-material/Build';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import {useDispatch} from "react-redux";
import {AppDispatch} from "../redux/store";
import {AddSnackbar} from "../redux/actions/snackbarAction";

export default function SideBar() {
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

    const handleChange =
        (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setValues({...values, [prop]: event.target.value});
        };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const autorization = () => {
        const data: LoginModel = {
            login: values.login,
            password: sha256(values.password)
        };
        dispatch(AddSnackbar({
            messageText: "Неверный логин или пароль!",
            messageType: "error",
            key: +new Date()
        }))
        return;
    };

    return (
        <div style={{
            backgroundColor: '#727272',
            padding: '10px',
            borderRadius: '0 8px 8px 0',
        }}>
            <Stack justifyContent='space-between' height='100%'>
                <Stack spacing={2} marginTop={8}>
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
                <Button variant="contained" color="secondary" disableElevation sx={{borderRadius: '5px'}}
                        startIcon={<LoginRoundedIcon/>} onClick={handleOpenEnterModal}>
                    Авторизация
                </Button>
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
