import { Flex, Heading } from "@radix-ui/themes";
import { RatnaFE } from "../../../types/documentFETypes";
import { createYoutubeImgUrl, getYoutubeVideoId, isValidUrl } from "../../../utils";
import TagsDropdown from "../../tag-popover";
import TagList from "../../tags-list";
import { useSearchParams } from "react-router-dom";
import { OgObject } from "../../../types/ogGraphTypes";

type props = {
    ratna: RatnaFE
}

export default function CardInfo({ratna}: props ) {

    const [searchParam , setSearchParam] = useSearchParams();

    const {
        ogTitle = '',
        ogDescription = '',
        requestUrl,
    } = ratna.openGraphInfo || {} as OgObject

    let {
        ogImage
    } = ratna.openGraphInfo || {} as OgObject

    if ((!ogImage || !ogImage.length) && !!requestUrl) {
        const videoId = getYoutubeVideoId(requestUrl);
        if (videoId) {
            ogImage = [{url: createYoutubeImgUrl(videoId)}]
        }
    }

    function openContent() {
        if(isValidUrl(ratna.content)) {
            window.open(ratna.content, '_blank', 'noopener, noreferrer');
        }
    }

    function updateTag(tag: string) {
        const tags = searchParam.get('tags');
        if (!tags || !tags.length || (tags?.length && ![...tags.split(',')].includes(tag))) {
            setSearchParam((searchParam) => {
                searchParam.set('tags', `${tags ? `${tags},` : ''}${tag}`)
                return searchParam
            })   
        }
    }


    return (
        <Flex direction="column" gap="1.5" onClick={openContent}>
            {
                <Heading className="mb-2" size="5">{ogTitle || ratna.name}</Heading>
            }
            {
                ogImage?.length && requestUrl ? <img src={ogImage[0].url}></img> :
                <p className="max-h-60 font-semibold text-lg">{ratna.content}</p>
            }
            <p className="max-h-60 pt-2">{ogDescription || ratna.description}</p>
            <Flex align="center" className="flex mt-4">
                <div className="mt-2 mr-2">
                    <TagsDropdown ratna={ratna}/>
                </div>
                {
                    ratna.tags && ratna.tags.length ? <TagList tags={ratna.tags} onClick={updateTag}/> : null
                }
            </Flex>
        </Flex>
    )
}