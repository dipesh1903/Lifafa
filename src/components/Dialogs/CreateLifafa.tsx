import { Dialog, DialogContent } from "../ui/Dialog";
import { Box, Button, Flex, Heading } from "@radix-ui/themes";
import AccessRadioGroup from "../RadioGroup/AccessRadioBtn";
import { LifafaAccessType } from "../../constant";
import { useEffect, useRef, useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { Controller, FieldValues, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createLifafa, getLifafaPassword, updateLifafa } from "../../api/api";
import { useAuth } from "../../store/auth/context";
import { Timestamp } from "firebase/firestore";

type props = {
    open: boolean,
    setOpen: (val: boolean) => void,
    onCreates: (name: string, access: LifafaAccessType, password?: string) => void
}

type formValues = {
    lifafaName: string
    protectedPassword: string
  }

export default function CreateLifafaDialog() {
    const navigate = useNavigate();
    const location = useLocation();
    const { lifafaId }= useParams();
    console.log('location state is', location.state);
    const radioItems = Object.keys(LifafaAccessType).map(value => ({label: value, value}));
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<formValues>({
        defaultValues: {
            lifafaName: location.state?.lifafaName || '',
            protectedPassword: location.state?.protectedPassword || ''
        }
    });
    const user = useAuth();
    const [access , setAccess] = useState(LifafaAccessType.PRIVATE)

    const onSubmit: SubmitHandler<formValues> = (data: FieldValues) => {
        if (lifafaId) {
            onUpdate(data.lifafaName, data.protectedPassword || '')
        } else {
            onCreate(data.lifafaName, data.protectedPassword || '')
        }
    }

    const onSubmitErr: SubmitErrorHandler<formValues> = (data: FieldValues) => {
        console.log(data);
    }

    useEffect(() => {
        setAccess(location.state?.accessType)
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
            console.log('the lifafa is', lifafa);
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
            console.log('error is', err);
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
                            <label htmlFor="lifafaName" className={`block mb-2 text-sm font-medium text-gray-900 dark:text-white`}>Name</label>
                            <input type="text"
                                {...register('lifafaName', {
                                    required: 'Lifafa name is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Atleast 6 character'
                                    }
                                })}
                                id="lifafaName"
                                className={`peer  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors?.lifafaName ? '[&:not(:placeholder-shown):not(:focus)]:border-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'}`} placeholder="John" />
                            
                            <span className="mt-2 text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                                {errors?.lifafaName?.message}
                            </span>
                        </div>
                        <AccessRadioGroup radioItems={radioItems} defaultValue={location.state?.accessType || LifafaAccessType.PRIVATE} onValueChange={(val) => {setAccess(val as LifafaAccessType)}} className="py-4"/>
                        {
                        access === LifafaAccessType.PROTECTED ?
                        <div>
                            <label htmlFor="protectedPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input
                            type="text"
                            {...register('protectedPassword', {
                                required: 'password is required',
                                minLength: {
                                    value: 4,
                                    message: 'Atleast 4 character'
                                }
                            })}
                            id="protectedPassword" className="peer bg-gray-50 border invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="****" />
                            <span className="required:border-red-500 mt-2 text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                                {errors?.protectedPassword?.message}
                            </span>
                        </div> : null
                        }
                        <Flex justify="end">
                            <button type="submit"
                                className="group-invalid:pointer-events-none group-invalid:opacity-30 group-invalid:cursor-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 my-4 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create</button>
                        </Flex>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
    )
}