import { Flex } from "@radix-ui/themes";
import Label from "./ui/Label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { RatnaFE } from "../types/documentFETypes";
import { cn, isValidUrl } from "../utils";
import { useMediaQuery } from "../utils/hooks/useMediaQuery";
import { Dialog, DialogContent } from "./ui/Dialog";
import { Drawer, DrawerContent, DrawerOverlay } from "./ui/Drawer";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { CreateRatna, updateRatna } from "../api/ratna";
import { Timestamp } from "firebase/firestore";
import { useRatnaDispatch } from "../store/ratnas/context";
import { RatnaActionFactory } from "../store/ratnas/actionCreator";
import { useConfig } from "../store/config/context";
import { PrimaryButton } from "./ui/Button";
import Error from "./ui/text-error";
import { useAuth } from "../store/auth/context";
import { User } from "firebase/auth";
import { useState } from "react";
import Spinner from "../assets/svg/spinner.svg"

type formValues = {
    ratnaName: string,
    ratnaContent: string,
    ratnaDescription: string
}

function RatnaForm({ratna, lifafaId, onClose}: {ratna: RatnaFE, lifafaId: string, onClose: () => void})  { 
        const dispatch = useRatnaDispatch();
        const [loading, setLoading] = useState<boolean>(false);
        const user = useAuth();
        const {
            register,
            handleSubmit,
            formState: { errors }
        } = useForm<formValues>({
            defaultValues: {
                ratnaName: ratna.name || '',
                ratnaContent: ratna.content || '',
                ratnaDescription: ratna.description || ''
            }
        });

        const onSubmit: SubmitHandler<formValues> = (data: FieldValues) => {
            const doc = {
                name: data.ratnaName,
                updatedAt: Timestamp.fromDate(new Date()),
                content: data.ratnaContent,
                description: data.ratnaDescription
            }
            setLoading(true);
            if (ratna.id) {
                updateRatna(doc, lifafaId, ratna.id).then(val => {
                    dispatch(RatnaActionFactory.updateRatnaCompleted(val, lifafaId, ratna.id))
                    
                }).catch()
                .finally(() => {
                    setLoading(false)
                    onClose()
                })
            } else {
                CreateRatna({
                    ...doc,
                    creatorName: user.user.displayName || '',
                    createdBy: user.user.uid,
                    createdAt: Timestamp.fromDate(new Date())
                }, lifafaId, user.user as User).then(val => {
                    if (!val) return;
                    dispatch(RatnaActionFactory.createActionCompleted(val, lifafaId))
                }).catch()
                .finally(() => {
                    setLoading(false)
                    onClose()
                })
            }
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
                        <Error>
                            {errors?.ratnaName?.message}
                        </Error>
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
                            <Error>
                                {errors?.ratnaContent?.message}
                            </Error>
                    </Flex>
                }
                <Flex direction="column">
                    <Label htmlFor="ratnaDescription">Description</Label>
                    <Textarea id="ratnaDescription" {
                        ...register("ratnaDescription")
                    }/>
                </Flex>
                <Flex justify="end" className="w-full mt-4">
                    <PrimaryButton type="submit"
                    className={cn(`justify-self-center group-invalid:pointer-events-none group-invalid:opacity-30 group-invalid:cursor-none focus:ring-4 focus:outline-none font-medium rounded-lg
                        text-sm w-full px-5 py-2.5 text-center`, {"pointer-events-none bg-opacity-60" : loading})}
                    variant="solid">{loading && <img src={Spinner}/>}<span className="pl-1">Save</span></PrimaryButton>
                </Flex>
                </form>
            </Flex>

)}

type props = {
    setOpen?: (val: boolean) => void,
    open?: boolean,
    ratna?: RatnaFE
}

export default function EditRatna({setOpen, open, ratna}: props) {
    const isDesktop = useMediaQuery('(min-width: 768px)')
    const navigate = useNavigate();
    const {lifafaId} = useParams();
    const {state} = useLocation();
    const drawerPos = useConfig();
    const ratnaValue = state ? state.ratna : ratna

    function onDialogClose() {
        if (typeof setOpen === 'function') {
            setOpen(false);
            setTimeout(() => {
                document.body.style.pointerEvents = "auto";
            })
        } else {
            setTimeout(() => {
                document.body.style.pointerEvents = "auto";
                navigate('..');
            }, 100)
        }
    }

    function onDrawerClose() {
        if (typeof setOpen === 'function') {
            setOpen(false);
        } else {
            navigate('..');
        }
        setTimeout(() => {
            document.body.style.pointerEvents = "auto";
        },1000)
    } 


    function isOpen() {
        return ((open !== undefined && open !== null) ?  open : true)
    }

    if (!ratnaValue || !lifafaId) return;
    if(isDesktop) {
        return (
            <Dialog open={isOpen()} onOpenChange={onDialogClose}
                >
                <DialogContent>
                    <RatnaForm ratna={ratnaValue} lifafaId={lifafaId}
                     onClose={onDialogClose}/>
                </DialogContent>
            </Dialog>
        )
    } else {
        return (
            <Drawer open={isOpen()} onOpenChange={onDrawerClose}
            onAnimationEnd={() => {
                setTimeout(() => {
                    document.body.style.pointerEvents = "auto";
                }, 1000)}}>
                <DrawerOverlay>
                    <DrawerContent style={{left: `${(drawerPos).left}px`, width: `${(drawerPos).width}px` , boxShadow: 'rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px'}} className={cn("flex flex-col p-4 fixed bottom-0 m-auto left-[20px] h-[80%")}>
                        <RatnaForm ratna={ratnaValue} lifafaId={lifafaId} onClose={onDrawerClose}/>
                    </DrawerContent>
                </DrawerOverlay>
            </Drawer>
        )
    }
}