import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../store/auth/context";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Flex } from "@radix-ui/themes";
import useMobileLayout from "../../utils/hooks/useWindowDimension";
import "./style.scss"
import { LifafaFE, SharedUserFE } from "../../types/documentFETypes";
import LifafaListDrawer from "../../components/Drawers/Lifafa";
import CreateRatnaInput from "../../components/CreateRatna";
import { LifafaContextDataType, MemoComp, useLifafaDispatch } from "../../store/lifafas/context";
import { LifafaActionFactory } from "../../store/lifafas/actionCreator";
import { LifafaAccessScreen, LifafaAccessType, pageStatus } from "../../constant";
import { fetchLifafa } from "../../api/api";
import { isLifafaOwner, isPasswordMatching, isUserHasLifafaAccess, isUserHasProtectedAccess, isUserHasPublicAccess } from "../../utils";
import LifafaLocked from "../../components/lifafa-lock";
import LifafaJoin from "../../components/lifafa-join";
import RatnaList from "../../components/Ratna/ratna-list";
import Loader from "../../components/ui/loader";

export default function LifafaPage({lifafaContext}: {lifafaContext?: LifafaContextDataType}) {
    const navigate = useNavigate();
    const user = useAuth();
    const dimension = useMobileLayout();
    const ref = useRef(null);
    const location = useLocation();
    const { lifafaId }= useParams();
    const [openLifafaListDrawer , setOpenLifafaListDrawer] = useState(false);
    const [drawerPos , setDrawerPos] = useState({left: 0 , width: 600});
    const dispatch = useLifafaDispatch();
    const [isLoading, setIsLoading] = useState<pageStatus>();
    const [screenType, setScreenType] = useState<LifafaAccessScreen>();
    const currPageLifafa = useRef<LifafaFE>();
    const [lifafa, setLifafa] = useState<LifafaFE>({} as LifafaFE);

    const {
        uid
    } = user.user;

    useEffect(() => {
        console.log('lifafa context is', lifafaContext);
        if (lifafaId && lifafaContext?.data[lifafaId] && lifafaContext?.data[lifafaId]?.lifafa) {
            handleLifafaScreen(lifafaContext?.data[lifafaId]?.lifafa, lifafaContext?.data[lifafaId].userAccess?.[uid], uid);
        }
    }, [lifafaContext]);


    function handleLifafaScreen(lifafa: LifafaFE, access: SharedUserFE, uid: string) {
        if (isLifafaOwner(lifafa, uid)) {
            setScreenType(LifafaAccessScreen.SHOW_RATNAS)
        } else if (lifafa?.accessType === LifafaAccessType.PUBLIC && !isUserHasPublicAccess(lifafa, uid)) {
            setScreenType(LifafaAccessScreen.SHOW_ADD_JOIN)
        } else if (lifafa.accessType === LifafaAccessType.PROTECTED && (!isUserHasProtectedAccess(lifafa, uid) ||
            !isPasswordMatching(lifafa, access) || !access.accessType)) {
            setScreenType(LifafaAccessScreen.SHOW_PASSWORD)
        } else if (lifafa.accessType === LifafaAccessType.PRIVATE && !isLifafaOwner(lifafa, uid)) {
            navigate('/lifafa', {
                replace: true
            })
        } else {
            setScreenType(LifafaAccessScreen.SHOW_RATNAS)
        }
    }

    useEffect(() => {
        if (!lifafaId || !uid || !lifafaContext) return;
        const {
            data: lifafaData
        } = lifafaContext;
        if (!isLoading && lifafaId && (!lifafaData || !lifafaData[lifafaId]?.lifafa?.id || !lifafaData[lifafaId]?.userAccess?.[uid]?.id)) {
            fetchLifafa(lifafaId, uid).then(response => {
                if (response) {
                    const {
                        lifafa,
                        access
                    } = response ;
                    setLifafa(lifafa);
                    currPageLifafa.current = lifafa;
                    if (!!isUserHasLifafaAccess(lifafa, uid) && !!access.accessType) {
                        setScreenType(LifafaAccessScreen.SHOW_RATNAS)
                        dispatch(LifafaActionFactory.fetchSingleLifafaCompleted(lifafa, access));
                    } else {
                        handleLifafaScreen(lifafa, access, uid);
                    }
                    setIsLoading(pageStatus.COMPLETED)
                }
            }).catch(_ => {
                setIsLoading(pageStatus.COMPLETED);
                navigate('/lifafa', {
                replace: true
            })})
            setIsLoading(pageStatus.LOADING);
        } else if (!isLoading && lifafaId && lifafaData[lifafaId]) {
            currPageLifafa.current = lifafaData[lifafaId].lifafa;
            handleLifafaScreen(lifafaData[lifafaId].lifafa, lifafaData[lifafaId]?.userAccess?.[uid], uid);
            setIsLoading(pageStatus.COMPLETED);
        }
    }, [location])

    return (
        <Box ref={ref} className=" border-light-outlineVariant border-x-[0.5px] flex flex-1">
            { !isLoading || isLoading === pageStatus.LOADING ? <Flex align="center" justify="center" flexGrow="1"><Loader /></Flex> : screenType === LifafaAccessScreen.SHOW_PASSWORD ? 
            <LifafaLocked onSuccess={() => setScreenType(LifafaAccessScreen.SHOW_RATNAS)} lifafa={lifafa}/> : screenType === LifafaAccessScreen.SHOW_ADD_JOIN ? <LifafaJoin onSuccess={() => setScreenType(LifafaAccessScreen.SHOW_RATNAS)} lifafa={lifafa}/> : <>
            <Flex className="max-w-2xl min-h-dvh flex-1">
                <Box className="w-full min-h-[100vh]">
                    <Box className="py-4 border-y-[1px] border-light-outlineVariant  px-4">
                        {lifafaId && lifafaContext?.data[lifafaId]?.lifafa &&
                        (!!isLifafaOwner(lifafaContext?.data[lifafaId]?.lifafa, uid) ||
                        !!isUserHasProtectedAccess(lifafaContext?.data[lifafaId]?.lifafa, uid))  &&
                            <CreateRatnaInput lifafaId={lifafaId || ''} /> }
                    </Box>
                    <Box className="bg-light-surface ">
                        <MemoComp>
                            <RatnaList lifafaId={lifafaId || ''}/>
                        </MemoComp>
                    </Box>
                </Box>
            </Flex>
            {
                openLifafaListDrawer ? 
                <LifafaListDrawer open={openLifafaListDrawer} setOpen={setOpenLifafaListDrawer}/> : null
            }
            <Outlet/>
            </>
            }
        </Box>
    )
}