import { Dialog, DialogContent } from "../ui/Dialog";
import { Box, Flex } from "@radix-ui/themes";
import AccessRadioGroup from "../RadioGroup/AccessRadioBtn";
import { LifafaAccessType } from "../../constant";
import { useEffect, useState } from "react";
import { FieldValues, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createLifafa, getLifafaPassword, updateLifafa } from "../../api/api";
import { useAuth } from "../../store/auth/context";
import { Timestamp } from "firebase/firestore";
import Label from "../ui/Label";
import { Input } from "../ui/input";
import { PrimaryButton } from "../ui/Button";

type formValues = {
    lifafaName: string
    protectedPassword: string
  }

export default function CreateLifafaDialog() {
    const navigate = useNavigate();
    const location = useLocation();
    const { lifafaId }= useParams();
    const [access , setAccess] = useState(LifafaAccessType.PRIVATE)
    const radioItems = Object.keys(LifafaAccessType).map(value => ({label: value, value}));
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<formValues>({
        defaultValues: {
            lifafaName: location.state?.lifafaName || '',
            protectedPassword: location.state?.protectedPassword || ''
        }
    });
    const user = useAuth();

    const onSubmit: SubmitHandler<formValues> = (data: FieldValues) => {
        if (lifafaId) {
            onUpdate(data.lifafaName, data.protectedPassword || '')
        } else {
            onCreate(data.lifafaName, data.protectedPassword || '')
        }
    }

    const onSubmitErr: SubmitErrorHandler<formValues> = (data: FieldValues) => {
        
    }

    useEffect(() => {
        if (location.state?.accessType) {
            setAccess(location.state?.accessType)
        }
        if (location.state?.accessType === LifafaAccessType.PROTECTED && lifafaId) {
            getLifafaPassword(lifafaId, user.user.uid).then(val => {
                setValue('protectedPassword', val);
            })
        }
    }, [location])

    async function onCreate(name: string, password?: string) {
        try {
            const lifafa = await createLifafa({
                name,
                sharedUserId: [],
                tags: [],
                accessType: access,
                description: "",
                createdBy: user.user.uid,
                createdAt: Timestamp.fromDate(new Date())
            }, user.user.uid, password)
            
            navigate(`/lifafa/${lifafa.id}`, {
                replace: true
            })
        } catch (err) {
            navigate('..');
        }
    }

    async function onUpdate(name: string, password?: string) {
        try {
            const lifafa = await updateLifafa({
                name,
                sharedUserId: [],
                tags: [],
                accessType: access,
                description: "",
                updatedAt: Timestamp.fromDate(new Date())
            }, lifafaId || '', user.user.uid, password)
            navigate(`/lifafa/${lifafa.lifafaId}`, {
                replace: true
            })
        } catch (err) {
            
            navigate('..');
        }
    }

    return (
        <Dialog open={true}>
            <DialogContent className="sm:max-w-md p-4 max-sm:w-[calc(100%-30px)] !top-[30%]">
                <Flex justify="between">
                    <h3>{location.state?.lifafaName ? 'Update Lifafa' : 'Create Lifafa'}</h3>
                    <Cross1Icon onClick={() => navigate('..')}/>
                </Flex>
                <form className="group" onSubmit={handleSubmit(onSubmit, onSubmitErr)}>
                    <Box>
                        <div>
                            <Label htmlFor="lifafaName">Name</Label>
                            <Input type="text"
                                {...register('lifafaName', {
                                    required: 'Lifafa name is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Atleast 6 character'
                                    }
                                })}
                                id="lifafaName"
                                 placeholder="John" />
                            
                            <span className="mt-2 text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                                {errors?.lifafaName?.message}
                            </span>
                        </div>
                        <AccessRadioGroup radioItems={radioItems} defaultValue={location.state?.accessType || LifafaAccessType.PRIVATE} onValueChange={(val) => {setAccess(val as LifafaAccessType)}} className="py-4"/>
                        {
                        access === LifafaAccessType.PROTECTED ?
                        <div>
                            <Label htmlFor="protectedPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</Label>
                            <Input
                            type="text"
                            {...register('protectedPassword', {
                                required: 'password is required',
                                minLength: {
                                    value: 4,
                                    message: 'Atleast 4 character'
                                }
                            })}
                            id="protectedPassword" placeholder="****" />
                            <span className="required:border-red-500 mt-2 text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                                {errors?.protectedPassword?.message}
                            </span>
                        </div> : null
                        }
                        <Flex justify="end">
                            <PrimaryButton type="submit">Create</PrimaryButton>
                        </Flex>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    )
}