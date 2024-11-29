import { LockOpen1Icon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";
import { useAuth } from "../store/auth/context";
import { joinPublicLifafa } from "../api/api";
import { LifafaAccessType } from "../constant";
import { Timestamp } from "firebase/firestore";
import { LifafaFE } from "../types/documentFETypes";
import { useLifafaDispatch } from "../store/lifafas/context";
import { LifafaActionFactory } from "../store/lifafas/actionCreator";

type props = {
    lifafa: LifafaFE;
    onSuccess: () => void
}

export default function LifafaJoin({lifafa, onSuccess}: props) {
    const user = useAuth();
    const dispatch = useLifafaDispatch();
    function joinLifafa() {
        joinPublicLifafa(lifafa.id, user.user.uid, {
            name: user.user.displayName,
            accessType: LifafaAccessType.PUBLIC,
            joinedAt: Timestamp.fromDate(new Date())
        }).then(val => {
            dispatch(LifafaActionFactory.fetchSingleLifafaCompleted(lifafa, val))
            onSuccess();
        })
        .catch()
    }
    return (
        <Flex flexGrow="1" justify="center">
        <Flex direction="column" align="center" justify="center">
            <LockOpen1Icon height="100" width="100"/>
            <button 
                onClick={joinLifafa}
                className="group-invalid:pointer-events-none group-invalid:opacity-30 group-invalid:cursor-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 my-4 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Join</button>
        </Flex>
    </Flex>
    )
}