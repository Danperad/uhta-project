import {useEffect} from 'react';
import { useSnackbar } from 'notistack';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import { RemoveSnackbar} from "../redux/actions/snackbarAction";
import "../assets/css/Snackbar.css";

function SnackbarViewer(){
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const state = useSelector((state: RootState) => state.snackBar);

    useEffect(() => {
        state.forEach((s) => {
            enqueueSnackbar(s.messageText, {
                key: s.key,
                variant: s.messageType,
                onExited: () => {dispatch(RemoveSnackbar(s))},
            })
        })
    },[state])

    return <></>;
}
export default SnackbarViewer;