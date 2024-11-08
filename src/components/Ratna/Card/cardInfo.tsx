import { Flex, Heading } from "@radix-ui/themes";
import { RatnaFE, SharedUserFE } from "../../../types/documentFETypes";
import { isValidUrl } from "../../../utils";

type props = {
    ratna: RatnaFE
}

export default function CardInfo({ratna}: props ) {

    function openContent() {
        if(isValidUrl(ratna.content)) {
            window.open(ratna.content, '_blank', 'noopener, noreferrer');
        }
    }

    return (
        <Flex direction="column" gap="1.5" onClick={openContent}>
            {
                ratna.name && <Heading size="5">{ratna.name}</Heading>
            }
            <p className="max-h-60 font-semibold text-lg">{ratna.content}</p>
        </Flex>
    )
}