import { LockClosedIcon } from "@radix-ui/react-icons";
import { Box, Flex } from "@radix-ui/themes";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { addUser } from "../api/api";
import { useAuth } from "../store/auth/context";
import { Timestamp } from "firebase/firestore";
import { LifafaAccessType } from "../constant";
import { useLifafaDispatch } from "../store/lifafas/context";
import { LifafaActionFactory } from "../store/lifafas/actionCreator";
import { LifafaFE } from "../types/documentFETypes";
import { Input } from "./ui/input";
import Label from "./ui/Label";
import { PrimaryButton } from "./ui/Button";

type formValues = {
    lifafaPassword: string
}

type props = {
    lifafa: LifafaFE;
    onSuccess: () => void
}

export default function LifafaLocked({lifafa, onSuccess}: props) {
    const user = useAuth();
    const dispatch = useLifafaDispatch();
    const {register, handleSubmit, formState: { errors }} = useForm<formValues>();

    const onSubmit: SubmitHandler<formValues> = (data: FieldValues) => { 
        console.log('password is ', data);
        addUser(user.user.uid, lifafa.id, {
            accessType: LifafaAccessType.PROTECTED,
            name: user.user.displayName,
            joinedAt: Timestamp.fromDate(new Date()),
            password: data.lifafaPassword
        }).then(val => 
            dispatch(LifafaActionFactory.fetchSingleLifafaCompleted(lifafa, val))
        )
        .catch(err => console.log('error after adding user', err))
    }
    return (
        <Flex flexGrow="1" justify="center">
            <Flex direction="column" align="center" justify="center">
                <LockClosedIcon height="100" width="100"/>
                <form className="group" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Label htmlFor="lifafaPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</Label>
                                <Input
                                type="text"
                                {...register('lifafaPassword', {
                                    required: 'password is required',
                                })}
                                id="lifafaPassword" placeholder="****" />
                        <span className="mt-2 text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                            {errors?.lifafaPassword?.message}
                        </span>
                    </div>
                    <PrimaryButton type="submit"
                            className="group-invalid:pointer-events-none group-invalid:opacity-30 group-invalid:cursor-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 my-4 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Join</PrimaryButton>
                </form>
            </Flex>
        </Flex>
    )
}