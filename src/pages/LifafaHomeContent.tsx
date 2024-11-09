import { Box, Flex } from "@radix-ui/themes"
import { useEffect } from "react";
import { useAuth } from "../store/auth/context";
import { LifafaActionFactory } from "../store/lifafas/actionCreator";
import { useLifafa, useLifafaDispatch } from "../store/lifafas/context";
import { Outlet, useNavigate } from "react-router-dom";
import LifafaCard from "../components/LifafaCard";
import HeaderLifafaHome from "../components/Headers/headerLifafaHome";
import { PrimaryButton } from "../components/ui/Button";
import Loader from "../components/ui/loader";

export default function LifafaHomeContent() {
    const user = useAuth();
    const navigate = useNavigate();
    const lifafas = useLifafa();
    const dispatch = useLifafaDispatch();

    
    const result = Object.values(lifafas.data || {});

    useEffect(() => {
        dispatch(LifafaActionFactory.fetchAllLifafa(user.user.uid));
    },[user.user.uid])

    return (
        <>
            <Flex direction="column" className="w-full flex-1 min-h-[100vh] max-sm:mb-[60px] md:max-2xl:ml-[60px]">
                {lifafas.isFetching ? <Flex align="center" justify="center" flexGrow="1"><Loader /></Flex> : <>
                <Flex direction="column" align="center" className="w-full bg-light-surfaceContainer flex-1">
                    <HeaderLifafaHome/>
                    <Flex className={`flex flex-col flex-1 border-y-[0.5px] w-full bg-light-surface border-light-outlineVariant ${!result.length ? 'justify-center' : ''}`}>
                        {
                            result.length ? result.map(item => {
                                return (
                                    <Box className="px-10 py-4 border-b-[0.5px] border-light-outlineVariant hover:bg-light-primaryContainer hover:bg-opacity-50 hover:cursor-pointer"
                                    key={item.lifafa.id}
                                    onClick={() => navigate(`/lifafa/${item.lifafa.id}`)}>
                                        <LifafaCard 
                                        lifafa={item.lifafa}/>
                                    </Box>
                                )
                            }) : 
                            <Flex justify="center">
                                <Flex direction="column" align="center" justify="center" className="w-fit">
                                    <div className="text-[24px] pb-2">Create your first Lifafa</div>
                                    <PrimaryButton onClick={() => navigate('/lifafa/create')}>Create</PrimaryButton>
                                </Flex>
                            </Flex>
                        }
                    </Flex>
                </Flex>
                </>
            }   
            </Flex>
            <Outlet/>
        </>
    )
}