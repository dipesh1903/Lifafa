import { Flex, Heading } from "@radix-ui/themes";
import { RatnaFE } from "../../../types/documentFETypes";
import { isValidUrl } from "../../../utils";
import PopoverDemo from "../../tag-popover";
import TagList from "../../tags-list";

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
            {ratna.description && <p className="max-h-60 pt-2">{ratna.description}</p> }
            <Flex align="center" className="flex mt-4">
                <div className="mt-2 mr-2">
                    <PopoverDemo ratna={ratna}/>
                </div>
                {
                    ratna.tags && ratna.tags.length && <TagList tags={ratna.tags}/>
                }
            </Flex>
        </Flex>
    )
}