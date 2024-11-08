import { Flex } from "@radix-ui/themes";
import HeaderInfo from "./headerInfo";
import SignOut from "../sign-out";

export default function HeaderLifafaHome() {
    return (
        <Flex justify="between" align="center" className="bg-light-primaryContainer w-full border-b-slate-100 p-4">
            <HeaderInfo title="Lifafa"/>
            <Flex gap="2" align="center" className="sm:max-2xl:hidden ">
                <SignOut />
            </Flex>
        </Flex>
    )
}