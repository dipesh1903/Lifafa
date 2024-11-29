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
import Spinner from "../../assets/svg/spinner.svg";
import { useLifafa } from "../../store/lifafas/context";
import { toast } from "react-toastify";


type formValues = {
    lifafaName: string
    protectedPassword: string
  }

export default function Form({onClose}: {onClose: (navigateBack: boolean) => void}) {

    const navigate = useNavigate();
    const location = useLocation();
    const { lifafaId }= useParams();
    const [loading, setLoading] = useState<boolean>(false)
    const user = useAuth();
    const [access , setAccess] = useState(LifafaAccessType.PRIVATE)
    const lifafas = useLifafa();
    const radioItems = Object.keys(LifafaAccessType).map(value => {
        if (user.isAnonymousUser) {
            return {label: value, value, isDisabled: value !== LifafaAccessType.PRIVATE}
        } else {
            return {label: value, value};
        } 
    })
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<formValues>({
        defaultValues: {
            lifafaName: location.state?.lifafaName || '',
            protectedPassword: location.state?.protectedPassword || ''
        }
    });

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
            if (user.isAnonymousUser && lifafas && lifafas.data && Object.keys(lifafas.data).length) {
                onClose(false);
                toast.info('Login to get complete access');
                return;
            }
            setLoading(true)
            const lifafa = await createLifafa({
                name,
                sharedUserId: [],
                tags: [],
                accessType: access,
                description: "",
                createdBy: user.user.uid,
                createdAt: Timestamp.fromDate(new Date())
            }, user.user.uid, user.isAnonymousUser, password)
            navigate(`/lifafa/${lifafa.id}`, {
                replace: true
            })
        } catch (err) {
            navigate('..');
        } finally {
            setLoading(false);
            onClose(false);
        }
    }

    async function onUpdate(name: string, password?: string) {
        try {
            setLoading(true)
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
            setLoading(false)
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
                    <AccessRadioGroup radioItems={radioItems}
                    defaultValue={location.state?.accessType || LifafaAccessType.PRIVATE} onValueChange={(val) => {setAccess(val as LifafaAccessType)}} className="py-4"/>
                    {user.isAnonymousUser && <div className="italics opacity-25  pb-4">** Login to enable all features **</div>}
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
                        <PrimaryButton type="submit"
                        className={loading ?  "pointer-events-none bg-opacity-60" : ""}
                        >{loading && <img src={Spinner} />}<span className="pl-1">Create</span></PrimaryButton>
                    </Flex>
                </Box>
            </form>
        </Box>
    )
}