import { useEffect, useState } from "react";
import useMobileLayout from "./useWindowDimension";

export function useMediaQuery(query: string) {

    const [match , setMatch] = useState(window.matchMedia(query).matches);
    const dimension = useMobileLayout();

    useEffect(() => {
        setMatch(window.matchMedia(query).matches);
    }, [dimension])

    return match;
}