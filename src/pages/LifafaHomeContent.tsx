import { Box } from "@radix-ui/themes"
import { useEffect } from "react";
import { useAuth } from "../store/auth/context";
import { LifafaActionFactory } from "../store/lifafas/actionCreator";
import { useLifafa, useLifafaDispatch } from "../store/lifafas/context";
import { Outlet, useNavigate } from "react-router-dom";
import LifafaCard from "../components/LifafaCard";

export default function LifafaHomeContent() {
    const user = useAuth();
    const navigate = useNavigate();
    const lifafas = useLifafa();
    const dispatch = useLifafaDispatch();

    console.log('all lifafas fetched', lifafas);
    const result = Object.values(lifafas.data || {});

    useEffect(() => {
        dispatch(LifafaActionFactory.fetchAllLifafa(user.user.uid));
    },[user.user.uid])
    return (
        <>
            <Box className="border-y-[0.5px] mt-2 bg-light-surface border-light-outlineVariant">
                {
                    result.map(item => {
                        return (
                            <Box className="px-10 py-4 border-b-[0.5px] border-light-outlineVariant hover:bg-light-surfaceDim hover:cursor-pointer"
                            key={item.lifafa.id}
                            onClick={() => navigate(`/lifafa/${item.lifafa.id}`)}>
                                <LifafaCard 
                                lifafa={item.lifafa}/>
                            </Box>
                        )
                    })
                }
            </Box>
            <Outlet/>
        </>
    )
}