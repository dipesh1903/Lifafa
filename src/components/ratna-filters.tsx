import { useSearchParams } from "react-router-dom"
import { cn } from "../utils";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Box, Flex } from "@radix-ui/themes";
import { SyntheticEvent } from "react";

export default function RatnaFilters() {

    const [searchParams , setSearchparams] = useSearchParams();
    const searchKeys = [...searchParams.keys()]
    const filters: {[key: string]: string[]} = {}

    searchKeys.forEach(key => {
        const query = searchParams.get(key)
        if (query?.length) {
            const values = [...query.split(',')];
            filters[key] = values
        }
    })

    function onClick(e: SyntheticEvent, filterKey: string, filterValue: string) {
        e.stopPropagation();
        const index = filters[filterKey].indexOf(filterValue)
        if (index > -1) {
            filters[filterKey].splice(index, 1)
            setSearchparams((searchParam) => {
                if (filters[filterKey].length) {
                    searchParam.set(filterKey, filters[filterKey].join(','));
                } else {
                    searchParam.delete(filterKey)
                }
                return searchParam;
            })
        }
    }

    if (!Object.keys(filters).length) return null;

    return (
        <Flex wrap="wrap" className="p-6 w-full">
            {
                Object.keys(filters).map(item => (
                    filters[item].map(value => (
                        <button
                        className={cn("flex mt-2 items-center h-fit py-[2px] bg-light-primaryFixedDim px-2 whitespace-nowrap w-fit mx-1 break-keep rounded-full border-light-outline border-2")}
                        key={value}><span className="font-bold">{item}</span><span className="pl-[2px] pr-[6px]">:</span><span className="font-medium">{value}</span>
                        <Box onClick={(e) => onClick(e, item, value)} className="peer hover:bg-light-primaryContainer hover:text-light-primaryContainer p-[6px] rounded-full mt-[2px] ml-[6px]">
                        <Cross1Icon className="stroke-black" strokeWidth="2px" fontWeight="800" width="10" height="10"/></Box></button>
                    ))
                ))
            }
        </Flex>
    )
}