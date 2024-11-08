import { IdCardIcon } from "@radix-ui/react-icons";
import { Flex, IconButton, Button } from "@radix-ui/themes";
import { useAuth } from "../../store/auth/context";
import { RatnaFE } from "../../types/documentFETypes";
import { CreateRatna } from "../../api/ratna";
import { useRef, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { useRatnaDispatch } from "../../store/ratnas/context";
import { RatnaActionFactory } from "../../store/ratnas/actionCreator";
import { PrimaryButton } from "../ui/Button";
import { Textarea } from "../ui/textarea";
import { cn } from "../../utils";

type props = {
    lifafaId: string,
    setRatna?: (ratna: RatnaFE) => void
}

export default function CreateRatnaInput({lifafaId}: props) {

    const [value, setValue] = useState('');
    const user = useAuth();
    const dispatch = useRatnaDispatch();


    async function createRatna() {
        try {
            const ratna = {
                content: value,
                createdAt: Timestamp.fromDate(new Date()),
                createdBy: user.user.uid,
                creatorName: user.user.displayName || ''
            }
            const ratnaId = await CreateRatna(ratna, lifafaId)
            dispatch(RatnaActionFactory.createActionCompleted({...ratna, id: ratnaId}, lifafaId));
        } catch (_) {
        } finally {
            setValue('');
        }
    }

    return (
        <Flex direction="column" gap="2">
            <div className="ring-light-secondary ring-2 rounded-lg">
            <Textarea autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="m-0 focus:ring-0 rounded-lg focus:border-none outline-none focus:ring-inset light-secondaryappearance-none focus:outline-none w-full h-30 p-4 resize-none bg-white " placeholder="Add your ratna">
            </Textarea>
            </div>
            <Flex justify="end" align="center"> 
                {/* <IconButton variant="ghost">
                    <IdCardIcon width="22"/>
                </IconButton> */}
                <PrimaryButton className={cn("px-2 pt-2 w-[20%] mt-2", `${!value.length ? 'pointer-events-none bg-opacity-60' : ''}`)}
                onClick={createRatna}>
                    Add
                </PrimaryButton>
            </Flex>
        </Flex>
    )
}