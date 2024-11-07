import { Flex } from "@radix-ui/themes";
import Label from "./ui/Label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { RatnaFE } from "../types/documentFETypes";
import { cn, isValidUrl } from "../utils";
import { useState } from "react";
import { useMediaQuery } from "../utils/hooks/useMediaQuery";
import { Dialog, DialogContent } from "./ui/Dialog";
import { Drawer, DrawerContent, DrawerOverlay } from "./ui/Drawer";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { updateRatna } from "../api/ratna";
import { Timestamp } from "firebase/firestore";
import { useRatnaDispatch } from "../store/ratnas/context";
import { RatnaActionFactory } from "../store/ratnas/actionCreator";
import { useConfig } from "../store/config/context";
import { PrimaryButton } from "./ui/Button";

type formValues = {
    ratnaName: string,
    ratnaContent: string,
    ratnaDescription: string
}

function RatnaForm({ratna, lifafaId, onClose}: {ratna: RatnaFE, lifafaId: string, onClose: () => void})  { 
        const dispatch = useRatnaDispatch();
        const {
            register,
            handleSubmit,
            formState: { errors }
        } = useForm<formValues>({
            defaultValues: {
                ratnaName: ratna.name || '',
                ratnaContent: ratna.content,
                ratnaDescription: ratna.description
            }
        });

        const onSubmit: SubmitHandler<formValues> = (data: FieldValues) => {
            updateRatna({
                name: data.ratnaName,
                updatedAt: Timestamp.fromDate(new Date()),
                content: data.ratnaContent,
                description: data.ratnaDescription
            }, lifafaId, ratna.id).then(val => {
                dispatch(RatnaActionFactory.updateRatnaCompleted(val, lifafaId, ratna.id))
                console.log('updated ratna value is ', val)
            }).catch(err => console.log('updated ratna error is ', err))
            .finally(() => onClose())
        }
    
        return(
            <Flex direction="column">
                <form onSubmit={handleSubmit(onSubmit)}>
                <Flex direction="column">
                    <Label htmlFor="ratnaName">Name</Label>
                    <Input type="text" id="ratnaName"
                        {
                            ...register("ratnaName", {
                                maxLength: {
                                    value: 40,
                                    message: 'Max 40 characters'
                                }
                            })
                        }></Input>
                        <span className="mt-2 text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                            {errors?.ratnaName?.message}
                        </span>
                </Flex>
                {
                    isValidUrl(ratna.content) ? 
                    <Flex direction="column">
                        <Label htmlFor="ratnaContent">Link</Label>
                        <Input type="url" id="ratnaContent" 
                            {
                                ...register("ratnaContent", {
                                    required: 'Cannot be empty'
                                })
                            }/>
                    </Flex> : 
                    <Flex direction="column">
                        <Label htmlFor="ratnaContent">Content</Label>
                        <Textarea id="ratnaContent"
                            {
                                ...register("ratnaContent", {
                                    required: 'Cannot be empty'
                                })
                            }/>
                            <span className="mt-2 text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                                {errors?.ratnaContent?.message}
                            </span>
                    </Flex>
                }
                <Flex direction="column">
                    <Label htmlFor="ratnaDescription">Description</Label>
                    <Textarea id="ratnaDescription" {
                        ...register("ratnaDescription")
                    }/>
                </Flex>
                <Flex justify="end" className="w-full mt-4">
                    <PrimaryButton type="submit" className="justify-self-center group-invalid:pointer-events-none group-invalid:opacity-30 group-invalid:cursor-none focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center" variant="solid">Save</PrimaryButton>
                </Flex>
                </form>
            </Flex>

)}

export default function EditRatna() {
    const isDesktop = useMediaQuery('(min-width: 768px)')
    const navigate = useNavigate();
    const {lifafaId} = useParams();
    const [open , setOpen] = useState<boolean>(true);
    const {state} = useLocation();
    const drawerPos = useConfig();

    function onDialogClose() {
        setOpen(false);
        setTimeout(() => {
            document.body.style.pointerEvents = "auto";
            navigate('..');
        })
    }

    function onDrawerClose() {
        setOpen(false);
        navigate('..');
        setTimeout(() => {
            document.body.style.pointerEvents = "auto";
        },1000)
    } 

    if (!state.ratna || !lifafaId) return;
    if(isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onDialogClose}>
                <DialogContent>
                    <RatnaForm ratna={state.ratna} lifafaId={lifafaId}
                     onClose={onDialogClose}/>
                </DialogContent>
            </Dialog>
        )
    } else {
        return (
            <Drawer open={open} onOpenChange={onDrawerClose}
            onAnimationEnd={() => {
                setTimeout(() => {
                    document.body.style.pointerEvents = "auto";
                }, 1000)}}>
                <DrawerOverlay>
                    <DrawerContent style={{left: `${(drawerPos).left}px`, width: `${(drawerPos).width}px` , boxShadow: 'rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px'}} className={cn("flex flex-col p-4 fixed bottom-0 m-auto left-[20px] h-[80%")}>
                        <RatnaForm ratna={state.ratna} lifafaId={lifafaId} onClose={onDrawerClose}/>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
        )
    }
}