import React from 'react';
import {Typography, Avatar, Stack, Button} from "@mui/material";
import {useNavigate} from 'react-router-dom';

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DescriptionIcon from '@mui/icons-material/Description';
import ArchiveIcon from '@mui/icons-material/Archive';
import BuildIcon from '@mui/icons-material/Build';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export default function SideBar() {
    const navigate = useNavigate();

    return(
        <div style={{backgroundColor: '#727272', marginTop: '-7px', marginLeft: '-7px', height: '58%', padding: '10px', width: '13%', minWidth: '220px', paddingBottom: '100%'}}>
        <Stack spacing={2} marginTop={8}>
            <Button variant="contained" color="secondary" disableElevation sx={{ borderRadius: '10px'}} startIcon={<PeopleAltIcon />}  onClick={() => {navigate("/")}}>
                Персонал
            </Button>
            <Button variant="contained" color="secondary" disableElevation sx={{ borderRadius: '10px'}} startIcon={<FormatListBulletedIcon />} onClick={() => {navigate("/")}}>
                Заявки
            </Button>
            <Button variant="contained" color="secondary" disableElevation sx={{ borderRadius: '10px'}} startIcon={<DescriptionIcon />} onClick={() => {navigate("/")}}>
                Отчеты
            </Button>
            <Button variant="contained" color="secondary" disableElevation sx={{ borderRadius: '10px'}} startIcon={<ArchiveIcon />} onClick={() => {navigate("/")}}>
                Архив
            </Button>
            <Button variant="contained" color="secondary" disableElevation sx={{ borderRadius: '10px'}} startIcon={<BuildIcon />} onClick={() => {navigate("/")}}>
                Приборы
            </Button>
            <Button variant="contained" color="secondary" disableElevation sx={{ width: '100%', borderRadius: '10px', mt: '40%'}} startIcon={<ExitToAppIcon />}>
                Выйти
            </Button>
        </Stack>
        </div>
    )
}
