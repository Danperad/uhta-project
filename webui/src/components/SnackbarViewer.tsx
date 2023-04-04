import React from 'react';
import { useSnackbar } from 'notistack';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {AddSnackbar, RemoveSnackbar} from "../redux/actions/snackbarAction";
import "../assets/css/Snackbar.css";

function SnackbarViewer(){
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.snackBar);

    React.useEffect(() => {
        state.forEach((s) => {
            enqueueSnackbar(s.messageText, {
                key: s.key,
                variant: s.messageType,
                onExited: () => {dispatch(RemoveSnackbar(s))},
            })
        })
    },[state, enqueueSnackbar, dispatch])

    return <></>;
}
export default SnackbarViewer;