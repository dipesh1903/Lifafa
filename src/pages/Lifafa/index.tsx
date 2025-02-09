import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../store/auth/context";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Box, Flex } from "@radix-ui/themes";
import { LifafaFE, SharedUserFE } from "../../types/documentFETypes";
import LifafaListDrawer from "../../components/Drawers/Lifafa";
import CreateRatnaInput from "../../components/CreateRatna";
import { useLifafa, useLifafaDispatch } from "../../store/lifafas/context";
import { LifafaActionFactory } from "../../store/lifafas/actionCreator";
import { LifafaAccessScreen, LifafaAccessType, pageStatus } from "../../constant";
import { fetchLifafa } from "../../api/api";
import { isLifafaOwner, isPasswordMatching, isUserHasLifafaAccess, isUserHasProtectedAccess, isUserHasPublicAccess } from "../../utils";
import LifafaLocked from "../../components/lifafa-lock";
import LifafaJoin from "../../components/lifafa-join";
import RatnaList from "../../components/Ratna/ratna-list";
import Loader from "../../components/Loaders/loader";
import HeaderHome from "../../components/Headers/headerHome";
import RatnaFilters from "../../components/ratna-filters";

export default function LifafaPage() {
    const navigate = useNavigate();
    const user = useAuth();
    const ref = useRef(null);
    const location = useLocation();
    const { lifafaId }= useParams();
    const [openLifafaListDrawer , setOpenLifafaListDrawer] = useState(false);
    const dispatch = useLifafaDispatch();
    const [isLoading, setIsLoading] = useState<pageStatus>();
    const [screenType, setScreenType] = useState<LifafaAccessScreen>();
    const currPageLifafa = useRef<LifafaFE>();
    const [lifafa, setLifafa] = useState<LifafaFE>({} as LifafaFE);
    const lifafaContext = useLifafa();


    const {
        uid
    } = user.user;

    if (lifafaId && (!lifafaContext.data[lifafaId] || !Object.keys(lifafaContext.data[lifafaId]).length)) {
        navigate('..')
    }

    function handleLifafaScreen(lifafa: LifafaFE, access: SharedUserFE, uid: string) {
        if (isLifafaOwner(lifafa, uid)) {
            setScreenType(LifafaAccessScreen.SHOW_RATNAS)
        } else if (lifafa?.accessType === LifafaAccessType.PUBLIC && !isUserHasPublicAccess(lifafa, uid)) {
            setScreenType(LifafaAccessScreen.SHOW_ADD_JOIN)
        } else if (lifafa.accessType === LifafaAccessType.PROTECTED && (!isUserHasProtectedAccess(lifafa, uid) ||
            !isPasswordMatching(access) || !access.accessType)) {
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
        
        if (lifafaId && (!lifafaData || !lifafaData[lifafaId]?.lifafa?.id || !lifafaData[lifafaId]?.userAccess?.[uid]?.id)) {
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
        } else if (lifafaId && lifafaData[lifafaId]) {
            currPageLifafa.current = lifafaData[lifafaId].lifafa;
            handleLifafaScreen(lifafaData[lifafaId].lifafa, lifafaData[lifafaId]?.userAccess?.[uid], uid);
            setIsLoading(pageStatus.COMPLETED);
        }
    }, [location])

    return (
            <Box ref={ref} className="flex flex-1 w-full min-h-[100vh] max-sm:mb-[60px] max-sm:ml-0 ml-[60px]">
                { !isLoading || isLoading === pageStatus.LOADING ?
                <Box className="w-full">
                    <Loader />
                </Box> :
                screenType === LifafaAccessScreen.SHOW_PASSWORD ? 
                    <LifafaLocked 
                    onSuccess={() => setScreenType(LifafaAccessScreen.SHOW_RATNAS)}
                    lifafa={lifafa}/> :
                        screenType === LifafaAccessScreen.SHOW_ADD_JOIN ?
                            <LifafaJoin 
                            onSuccess={() => setScreenType(LifafaAccessScreen.SHOW_RATNAS)} 
                            lifafa={lifafa}/> :
                <>
                    <Flex direction="column" justify="between" align="center" className="w-full  border-light-outlineVariant border-2 ">
                        <HeaderHome lifafa={lifafaId && lifafaContext?.data[lifafaId]?.lifafa || {} as LifafaFE}/>
                        <Flex className="max-w-2xl min-h-dvh flex-1 w-full ">
                            <Box className="w-full min-h-[100vh]">
                                <Box className="py-4  bg-light-primaryFixedDim bg-opacity-10  px-4 border-light-outline border-b-2">
                                    {lifafaId && lifafaContext?.data[lifafaId]?.lifafa &&
                                    (!!isLifafaOwner(lifafaContext?.data[lifafaId]?.lifafa, uid) ||
                                    !!isUserHasProtectedAccess(lifafaContext?.data[lifafaId]?.lifafa, uid))  &&
                                        <CreateRatnaInput lifafaId={lifafaId || ''} /> }
                                </Box>
                                <RatnaFilters />
                                <Box className="bg-light-surface ">
                                    <RatnaList lifafaId={lifafaId || ''}/>
                                </Box>
                            </Box>
                        </Flex>
                        {
                            openLifafaListDrawer ? 
                            <LifafaListDrawer open={openLifafaListDrawer} setOpen={setOpenLifafaListDrawer}/> : null
                        }
                    <Outlet/>
                    </Flex>
                </>
                }
            </Box>
    )
}