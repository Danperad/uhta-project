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
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {useNavigate} from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import {LoginModel} from '../models/RequestModels';
import sha256 from "sha256";
import {State} from '../models';
import {style} from '../assets/css/SignInModal';

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DescriptionIcon from '@mui/icons-material/Description';
import ArchiveIcon from '@mui/icons-material/Archive';
import BuildIcon from '@mui/icons-material/Build';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';

export default function SideBar() {
    const navigate = useNavigate();

    const [openEnterModal, setEnterModalOpen] = React.useState(false);
    const handleOpenEnterModal = () => setEnterModalOpen(true);
    const handleCloseEnterModal = () => setEnterModalOpen(false);

    const [openSnack, setOpenSnack] = React.useState(false);
    const [values, setValues] = React.useState<State>({
        login: '',
        password: '',
        showPassword: false
    });
    const [showPassword, setShowPassword] = React.useState(false);


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
                <CloseIcon fontSize="small"/>
            </IconButton>
        </React.Fragment>
    );

    const handleChange =
        (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setValues({...values, [prop]: event.target.value});
        };

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
        <div style={{
            backgroundColor: '#727272',
            marginTop: '-7px',
            marginLeft: '-7px',
            padding: '10px',
            width: '13%',
            minWidth: '200px',
            paddingBottom: '100%',
            borderRadius: '0 5px 5px 0'
        }}>
            <Stack spacing={2} marginTop={8}>
                <Button variant="contained" color="secondary" disableElevation sx={{borderRadius: '5px'}}
                        startIcon={<PeopleAltIcon/>} onClick={() => {
                    navigate("/")
                }}>
                    Персонал
                </Button>
                <Button variant="contained" color="secondary" disableElevation sx={{borderRadius: '5px'}}
                        startIcon={<FormatListBulletedIcon/>} onClick={() => {
                    navigate("/order")
                }}>
                    Заявки
                </Button>
                <Button variant="contained" color="secondary" disableElevation sx={{borderRadius: '5px'}}
                        startIcon={<DescriptionIcon/>} onClick={() => {
                    navigate("/")
                }}>
                    Отчеты
                </Button>
                <Button variant="contained" color="secondary" disableElevation sx={{borderRadius: '5px'}}
                        startIcon={<ArchiveIcon/>} onClick={() => {
                    navigate("/")
                }}>
                    Архив
                </Button>
                <Button variant="contained" color="secondary" disableElevation sx={{borderRadius: '5px'}}
                        startIcon={<BuildIcon/>} onClick={() => {
                    navigate("/device")
                }}>
                    Приборы
                </Button>
                <Button variant="contained" color="secondary" disableElevation sx={{borderRadius: '5px'}}
                        startIcon={<LoginRoundedIcon/>} onClick={handleOpenEnterModal}>
                    Авторизация
                </Button>

                <Modal
                    open={openEnterModal}
                    onClose={handleCloseEnterModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
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
                                    onClick={onClick} disableElevation>Войти</Button>
                            <Link component="button" variant="body2" onClick={handleCloseEnterModal}>Продолжить как
                                гость</Link>
                        </Stack>
                    </Box>
                </Modal>
                <Snackbar
                    open={openSnack}
                    autoHideDuration={6000}
                    onClose={handleCloseSnack}
                    message="Неверный логин или пароль"
                    action={action}
                />
            </Stack>
        </div>
    )
}
