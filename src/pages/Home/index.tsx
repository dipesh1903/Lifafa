import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { Flex } from "@radix-ui/themes";
import SideBar from "../../components/Sidebar/desktop-sidebar";
import useMobileLayout from "../../utils/hooks/useWindowDimension";
import { useConfigDispatch } from "../../store/config/context";


export default function HomePage() {
    const dimension = useMobileLayout();
    const ref = useRef(null);
    const dispatch = useConfigDispatch();

    useEffect(() => {
        if (ref && ref.current) {
            const pos = (ref.current as HTMLElement).getBoundingClientRect();
            dispatch(pos);
        }
    }, [dimension])

    return (
        <Flex className="max-w-2xl min-h-dvh flex-1" ref={ref}>
            <SideBar/>
            <Outlet/>
        </Flex>
    )
}
