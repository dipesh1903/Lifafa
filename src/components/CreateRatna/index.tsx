import { Flex } from "@radix-ui/themes";
import { useAuth } from "../../store/auth/context";
import { RatnaFE } from "../../types/documentFETypes";
import { CreateRatna } from "../../api/ratna";
import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { useRatna, useRatnaDispatch } from "../../store/ratnas/context";
import { RatnaActionFactory } from "../../store/ratnas/actionCreator";
import { PrimaryButton } from "../ui/Button";
import { Textarea } from "../ui/textarea";
import { cn , isValidUrl } from "../../utils";
import { getFunctions, httpsCallable } from "firebase/functions";
import { OgObject } from "../../types/ogGraphTypes";
import { RatnaDoc } from "../../types/firebaseDocument";
import Spinner from "../../assets/svg/spinner.svg"
import { User } from "firebase/auth";

type props = {
    lifafaId: string,
    isDisabled?: boolean,
    setRatna?: (ratna: RatnaFE) => void
}

export default function CreateRatnaInput({lifafaId, isDisabled}: props) {

    const [value, setValue] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const user = useAuth();
    const dispatch = useRatnaDispatch();
    const ratnas = useRatna();
    const animateInput = !ratnas || !ratnas.data || !ratnas.data[lifafaId] || !Object.keys(ratnas.data[lifafaId]).length;
    const functions = getFunctions();

    const openGraph = httpsCallable<{url: string}, {error: boolean,result: OgObject}
    >(functions, "openGraph")

    async function createRatna() {
        try {
            setLoading(true)
            let openGraphDetails = null;
            if(isValidUrl(value)) {
                openGraphDetails = await openGraph({url: value})
            }
            const ratna: RatnaDoc = {
                content: value,
                name: openGraphDetails?.data.result.ogTitle || '',
                createdAt: Timestamp.fromDate(new Date()),
                createdBy: user.user.uid,
                creatorName: user.user.displayName || '',
                description: openGraphDetails?.data.result.ogDescription || ''
            }
            if (openGraphDetails) {
                ratna.openGraphInfo = openGraphDetails?.data.result
            }
            const result = await CreateRatna(ratna, lifafaId, user.user as User)
            if (!result) return;
            dispatch(RatnaActionFactory.createActionCompleted(result, lifafaId));
        } catch {
        } finally {
            setLoading(false);
            setValue('');
        }
    }

    return (
        <Flex direction="column" gap="2">
            <div className={cn("ring-light-secondary ring-2 rounded-lg", {
                'animate-pulse': animateInput && !value,
                'ring-4': animateInput && !value,
            })}>
                <Textarea autoFocus
                    disabled={isDisabled}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className={cn(`m-0 focus:ring-0 rounded-lg focus:border-none outline-none focus:ringinset
                        light-secondaryappearance-none focus:outline-none w-full h-30 p-4 resize-none bg-white font-semibold text-[16px]`, 
                        {"pointer-events-none": isDisabled, "opacity-50": isDisabled})}
                    placeholder="Add your ratna">
                </Textarea>
            </div>
            <Flex justify="end" align="center"> 
                <PrimaryButton className={cn("px-2 pt-2 w-[20%] mt-2", `${!value.length || loading ? 'pointer-events-none bg-opacity-60' : ''}`)}
                onClick={createRatna}>
                    {loading && <img src={Spinner}/>}<span className="pl-1">Add</span>
                </PrimaryButton>
            </Flex>
        </Flex>
    )
}