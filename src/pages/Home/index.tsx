import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { Flex } from "@radix-ui/themes";
import SideBar from "../../components/Sidebar/desktop-sidebar";
import HeaderHome from "../../components/Headers/headerHome";
import useMobileLayout from "../../utils/hooks/useWindowDimension";
import { useConfigDispatch } from "../../store/config/context";


export default function HomePage() {
    const dimension = useMobileLayout();
    const ref = useRef(null);
    const dispatch = useConfigDispatch();
    // const [drawerPos , setDrawerPos] = useState({left: 0 , width: 600});

    useEffect(() => {
        if (ref && ref.current) {
            const pos = (ref.current as HTMLElement).getBoundingClientRect();
            console.log('dispatch dimension', pos);
            dispatch(pos);
        }
    }, [dimension])

    return (
        <Flex className="max-w-2xl min-h-dvh m-auto">
            <SideBar/>
            <Flex direction="column" ref={ref} className="w-full min-h-[100vh] border-r-[2px] border-l-[2px] border-slate-100">
                <Flex justify="between" align="center" className="w-full border-b-slate-100">
                    <HeaderHome/>
                </Flex>
                {/* <Outlet context={{drawerPos}}/> */}
                <Outlet/>
            </Flex>
        </Flex>
    )
}
