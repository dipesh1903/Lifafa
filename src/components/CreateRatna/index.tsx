import { IdCardIcon } from "@radix-ui/react-icons";
import { Flex, IconButton, Button } from "@radix-ui/themes";
import { useAuth } from "../../store/auth/context";
import { RatnaFE } from "../../types/documentFETypes";
import { CreateRatna } from "../../api/ratna";
import { useRef } from "react";
import { Timestamp } from "firebase/firestore";
import { useRatnaDispatch } from "../../store/ratnas/context";
import { RatnaActionFactory } from "../../store/ratnas/actionCreator";

type props = {
    lifafaId: string,
    setRatna?: (ratna: RatnaFE) => void
}

export default function CreateRatnaInput({lifafaId , setRatna}: props) {

    const inputRef = useRef(null);
    const user = useAuth();
    const dispatch = useRatnaDispatch();

    async function createRatna() {
        try {
            const ratna = {
                content: inputRef.current ? (inputRef?.current as HTMLInputElement).value : '',
                createdAt: Timestamp.fromDate(new Date()),
                createdBy: user.user.uid
            }
            const ratnaId = await CreateRatna(ratna, lifafaId)
            dispatch(RatnaActionFactory.createActionCompleted({...ratna, id: ratnaId}, lifafaId));
        } catch (_) {
        } finally {
            if (inputRef.current) {
                (inputRef?.current as HTMLInputElement).value = '';
            }
        }
    }

    return (
        <Flex direction="column" gap="2">
            <textarea ref={inputRef}  className="appearance-none focus:outline-none w-full h-30 p-4 resize-none" placeholder="Add your ratna">
            </textarea>
            <Flex justify="between" align="center">
                <IconButton variant="ghost">
                    <IdCardIcon width="22"/>
                </IconButton>
                <Button variant="outline" className="px-2" onClick={createRatna}>
                    Add
                </Button>
            </Flex>
        </Flex>
    )
}