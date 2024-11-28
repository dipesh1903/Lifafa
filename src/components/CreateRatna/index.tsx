import { Flex } from "@radix-ui/themes";
import { useAuth } from "../../store/auth/context";
import { RatnaFE } from "../../types/documentFETypes";
import { CreateRatna } from "../../api/ratna";
import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { useRatnaDispatch } from "../../store/ratnas/context";
import { RatnaActionFactory } from "../../store/ratnas/actionCreator";
import { PrimaryButton } from "../ui/Button";
import { Textarea } from "../ui/textarea";
import { cn, isValidUrl } from "../../utils";
import { getFunctions, httpsCallable } from "firebase/functions";
import { OgObject } from "../../types/ogGraphTypes";

type props = {
    lifafaId: string,
    setRatna?: (ratna: RatnaFE) => void
}

export default function CreateRatnaInput({lifafaId}: props) {

    const [value, setValue] = useState('');
    const user = useAuth();
    const dispatch = useRatnaDispatch();

    const functions = getFunctions();
    const openGraph = httpsCallable<{url: string}, {error: boolean,result: OgObject}
    >(functions, "openGraph")

    async function createRatna() {
        try {
            let openGraphDetails = null;
            if(isValidUrl(value)) {
                openGraphDetails = await openGraph({url: value})
            }
            const ratna = {
                content: value,
                name: openGraphDetails?.data.result.ogTitle || '',
                createdAt: Timestamp.fromDate(new Date()),
                createdBy: user.user.uid,
                creatorName: user.user.displayName || '',
                openGraphInfo: openGraphDetails?.data.result,
                description: openGraphDetails?.data.result.ogDescription || ''
            }
            const result = await CreateRatna(ratna, lifafaId)
            dispatch(RatnaActionFactory.createActionCompleted(result, lifafaId));
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
                <PrimaryButton className={cn("px-2 pt-2 w-[20%] mt-2", `${!value.length ? 'pointer-events-none bg-opacity-60' : ''}`)}
                onClick={createRatna}>
                    Add
                </PrimaryButton>
            </Flex>
        </Flex>
    )
}