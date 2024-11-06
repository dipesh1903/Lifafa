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
        console.log('dispatcher' , typeof LifafaActionFactory.fetchAllLifafa(user.user.uid));
        dispatch(LifafaActionFactory.fetchAllLifafa(user.user.uid));
    },[user.user.uid])
    return (
        <>
            <Box className="py-4 border-y-[1px] border-slate-100 px-4">
                {
                    result.map(item => {
                        return (
                            <Box className="px-10 py-4 my-4" key={item.lifafa.id} onClick={() => navigate(`/lifafa/${item.lifafa.id}`)}>
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