import {
    Box,
    Button,
    Paper,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TextField,
    Autocomplete
} from "@mui/material";
import {useState} from "react";
import User from "../models/UserModel";
import {AddSnackbar} from "../redux/actions/snackbarAction";
import UserService from "../services/UserService";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../redux/store";
import {NewUser} from "../models";

const Role = ['Администратор', 'Пользователь']

export default function EmployeePage() {
    const dispatch = useDispatch<AppDispatch>();
    const state = useSelector((state: RootState) => state);
    const [search, setSearch] = useState<string>('');

    const [surname, setSurname] = useState<string | undefined>();
    const [name, setName] = useState<string | undefined>();
    const [middleName, setMiddleName] = useState<string | undefined>();
    const [login, setLogin] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();
    const [employeeRole, setEmployeeRole] = useState<string | undefined>();
    const [autocompleteRoleValue, setAutocompleteRoleValue] = useState<string>('');

    const deleteUser = async (login: string) => {
        const res = await UserService.deleteUserByLogin(login)
        if (!res) return
        dispatch(AddSnackbar({
            messageText: "Пользователь успешно удален!",
            messageType: "success",
            key: +new Date()
        }))
        const allUsers = await UserService.getAllUsers()
        if (!allUsers) return
        dispatch(allUsers)
        ClearFields();
    }

    const addNewEmployee = async () => {
        const check = CheckRequiredFields();

        if (check) {
            const newEmployee: NewUser = {
                id: undefined,
                lastName: surname!,
                firstName: name!,
                middleName: middleName,
                login: login!,
                password: password!,
                role: RoleConverter(employeeRole!)!
            }
            const res = await UserService.saveUser(newEmployee)
            if (!res) return
            dispatch(AddSnackbar({
                messageText: "Пользователь успешно добавлен!",
                messageType: "success",
                key: +new Date()
            }))
            const allUsers = await UserService.getAllUsers()
            if (!allUsers) return
            dispatch(allUsers)
            ClearFields();
        } else {
            dispatch(AddSnackbar({
                messageText: "Не все поля заполнены!",
                messageType: "error",
                key: +new Date()
            }))
        }
    }

    const CheckRequiredFields = () => {
        return !(surname === undefined || name === undefined || login === undefined || password === undefined || employeeRole === undefined ||
            surname === "" || name === "" || login === "" || password === "" || employeeRole === "");
    }

    const handleShowUsersTable = async () => {
        const users = await UserService.getAllUsers(search)
        if (users)
            dispatch(users)
    }

    function RoleConverter(role: string) {
        switch (role) {
            case "Администратор":
                return "ADMIN"
            case "Пользователь":
                return "WORKER"
        }
    }

    function ClearFields() {
        setName("");
        setSurname("");
        setMiddleName("");
        setLogin("");
        setPassword("");
        setEmployeeRole("");
        setAutocompleteRoleValue("");
    }

    function CheckRole(event: any, value: string) {
        if (!Role.some((v, _, __) => v === value)) {
            setAutocompleteRoleValue('');
            return;
        }
        setEmployeeRole(value);
        setAutocompleteRoleValue(value);
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
                        <Typography mb={1}>Сотрудники</Typography>
                        <Stack direction="row" spacing={2} style={{width: "100%"}} height='100%'>
                            <TextField sx={{width: '30%'}} label="Поиск" variant="outlined"
                                       size='small' type="search" value={search}
                                       onChange={(newValue) => setSearch(newValue.target.value)}/>
                            <Button variant="contained" onClick={handleShowUsersTable}>Показать</Button>
                        </Stack>
                    </Paper>
                </Box>
                <Box sx={{gridArea: 'main', height: "80vh"}}>
                    <div className='section' style={{height: '100%', width: '100%'}}>
                        {state.users.length !== 0 ? (
                            <TableContainer component={Paper}>
                                <Table sx={{minWidth: 650}} aria-label="simple table">
                                    <TableHead>
                                        <TableRow sx={{cursor: "default"}}>
                                            <TableCell>Номер</TableCell>
                                            <TableCell align="left">Фамилия</TableCell>
                                            <TableCell align="left">Имя</TableCell>
                                            <TableCell align="left">Отчество</TableCell>
                                            <TableCell align="left">Логин</TableCell>
                                            <TableCell align="left">Роль</TableCell>
                                            <TableCell align="center">Удаление</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {state.users.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                sx={{
                                                    '&:last-child td, &:last-child th': {
                                                        border: 0,
                                                        cursor: "pointer"
                                                    }
                                                }}
                                            >
                                                <TableCell>{row.id}</TableCell>
                                                <TableCell>{row.lastName}</TableCell>
                                                <TableCell>{row.firstName}</TableCell>
                                                <TableCell>{row.middleName}</TableCell>
                                                <TableCell>{row.login}</TableCell>
                                                <TableCell>{row.role}</TableCell>

                                                <TableCell align="center">
                                                    <Button variant="outlined" onClick={() => {
                                                        deleteUser(row.login)
                                                    }}>Удалить</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        ) : (
                            <Stack spacing={2}>
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <Skeleton variant="rounded" height={100} sx={{width: '100%'}} key={i}/>
                                ))}
                            </Stack>
                        )}
                    </div>
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
                                <TextField label="Фамилия" variant="outlined"
                                           size='small'
                                           required
                                           value={surname}
                                           onChange={(newValue) => setSurname(newValue.target.value)}/>
                                <TextField label="Имя" variant="outlined"
                                           size='small'
                                           required
                                           value={name}
                                           onChange={(newValue) => setName(newValue.target.value)}/>
                                <TextField label="Отчество" variant="outlined"
                                           size='small'
                                           value={middleName}
                                           onChange={(newValue) => setMiddleName(newValue.target.value)}/>
                                <TextField label="Логин" variant="outlined"
                                           size='small'
                                           required
                                           value={login}
                                           onChange={(newValue) => setLogin(newValue.target.value)}/>
                                <TextField label="Пароль" variant="outlined"
                                           size='small'
                                           required
                                           value={password}
                                           onChange={(newValue) => setPassword(newValue.target.value)}/>
                                <Autocomplete disablePortal size='small' options={Role}
                                              onInputChange={CheckRole} value={autocompleteRoleValue}
                                              renderInput={(params) => <TextField {...params} label="Роль"
                                                                                  value={employeeRole} required
                                                                                  onChange={(newValue) => setEmployeeRole(newValue.target.value)}/>}
                                />
                            </Stack>
                            <Stack direction='row' spacing={1} justifyContent='center'>
                                <Button variant="contained" onClick={() => {
                                    addNewEmployee()
                                }}>Добавить</Button>
                            </Stack>
                        </Stack>
                    </Paper>
                </Box>
            </Box>
        </Box>
    )
}