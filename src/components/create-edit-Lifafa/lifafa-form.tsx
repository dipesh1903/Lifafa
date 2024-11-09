import { Box, Flex } from "@radix-ui/themes";
import { Timestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getLifafaPassword, createLifafa, updateLifafa } from "../../api/api";
import { LifafaAccessType } from "../../constant";
import { useAuth } from "../../store/auth/context";
import AccessRadioGroup from "../RadioGroup/AccessRadioBtn";
import { PrimaryButton } from "../ui/Button";
import { Input } from "../ui/input";
import Label from "../ui/Label";
import Error from "../ui/text-error";


type formValues = {
    lifafaName: string
    protectedPassword: string
  }

export default function Form({onClose}: {onClose: (navigateBack: boolean) => void}) {
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
        } finally {
            onClose(false);
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
        } finally {
            onClose(true)
        }
    }

    return (
        <Box>
            <form className="group" onSubmit={handleSubmit(onSubmit)}>
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
                        
                        <Error>
                            {errors?.lifafaName?.message}
                        </Error>
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
                        <Error>
                            {errors?.protectedPassword?.message}
                        </Error>
                    </div> : null
                    }
                    <Flex justify="end">
                        <PrimaryButton type="submit">Create</PrimaryButton>
                    </Flex>
                </Box>
            </form>
        </Box>
    )
}