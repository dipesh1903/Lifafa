import * as Popover from "@radix-ui/react-popover";
import { Input } from "./ui/input";
import { useLifafa, useLifafaDispatch } from "../store/lifafas/context";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { updateLifafa } from "../api/api";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "../store/auth/context";
import { PrimaryButton } from "./ui/Button";
import { RatnaFE } from "../types/documentFETypes";
import { LifafaActionFactory } from "../store/lifafas/actionCreator";
import { updateRatna } from "../api/ratna";
import { useRatnaDispatch } from "../store/ratnas/context";
import { RatnaActionFactory } from "../store/ratnas/actionCreator";
import { IconButton } from "@radix-ui/themes";
import TagsIcon from '../assets/svg/tags.svg';

type fieldTypes = {
    checkbox: string[]
}

type props = {
    ratna: RatnaFE,
}

export default function TagsDropdown({ratna}: props) {

    const [popoverOpen , setPopoverOpen] = useState<boolean>(false);

    const lifafa = useLifafa();
    const user = useAuth();
    const { lifafaId } = useParams();
    const [search , setSearch] = useState<string>('');
    const tagRef = useRef<string[]>([]);
    const [tags , setTags] = useState<string[]>([]);
    const dispatch = useLifafaDispatch();
    const ratnaDispatch = useRatnaDispatch();
    const {register, watch, getValues, setValue} = useForm<fieldTypes>({
        defaultValues: {
            checkbox: ratna.tags || []
        }
    })

    useEffect(() => {
        if(lifafaId) {
            tagRef.current = lifafa.data[lifafaId]?.lifafa.tags;
            setTags(lifafa.data[lifafaId]?.lifafa.tags)
        }
    },[lifafa])

    const watchAllFields = watch()

    function addToList() {
        if (!lifafaId) return;
        updateLifafa({
            updatedAt: Timestamp.fromDate(new Date()),
            tags: [...lifafa.data[lifafaId]?.lifafa.tags, search.trim()]
        }, lifafaId, user.user.uid).then(res => {
            dispatch(LifafaActionFactory.updateLifafaCompleted(res.lifafa, res.lifafaId))
            setTags([...lifafa.data[lifafaId]?.lifafa.tags, search])
            setValue('checkbox', [...getValues().checkbox, search])
            setSearch('')
        }).catch()
    }


    function searchTag(tag: string) {
        const searchTag = tagRef.current.filter(item => !!tag ? item.includes(tag) : item);
        setTags(searchTag);
        setSearch(tag);
    }

    function saveTags() {
        if (lifafaId) {
            updateRatna({
                updatedAt: Timestamp.fromDate(new Date()),
                tags: [...getValues().checkbox]
            }, lifafaId, ratna.id).then(res => {
                ratnaDispatch(RatnaActionFactory.updateRatnaCompleted(res, lifafaId, ratna.id))
            }).catch()
            .finally(() => {
                setPopoverOpen(false)
            })
        }
    }

    return (
        <Popover.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
            <Popover.Trigger>
                <IconButton variant="ghost" className="w-fit" onClick={(e) => {e.stopPropagation(); setPopoverOpen(true)}}>
                    <img src={TagsIcon} className="size-5"/>
                </IconButton>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    onClick={(e) => e.stopPropagation()}
                    className="w-[260px] rounded bg-white p-5 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)] data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade"
                    sideOffset={5}
                >
                    <div className="flex flex-col gap-2.5">
                        <Input value={search} onChange={(e) => searchTag(e.target.value)} />
                    </div>
                    { ((tags && tags.length)) ?
                        <div className="h-32 overflow-scroll">
                            {(tags).map(tag => {
                                return (
                                    <div key={tag} className="flex items-center p-2 hover:cursor-pointer hover:bg-light-primaryContainer">
                                        <input value={tag} {...register("checkbox")} type="checkbox" className="w-4 hover:cursor-pointer h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        <label id="checkbox" className="ms-2 text-sm font-medium text-gray-900 hover:cursor-pointer dark:text-gray-300">{tag}</label>
                                    </div>
                                )
                            })}
                        </div> :
                        <div>
                            <PrimaryButton className="mt-2"
                                onClick={addToList}>+ create</PrimaryButton>
                        </div>
                    }
                    {(watchAllFields && tags && tags.length) ? <PrimaryButton className="mt-2" onClick={saveTags}>Save</PrimaryButton> : null }
                    <Popover.Arrow className="fill-white" />
                </Popover.Content>
            </Popover.Portal>
	    </Popover.Root>
    )
}
