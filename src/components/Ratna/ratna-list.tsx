import { useEffect } from "react";
import { useAuth } from "../../store/auth/context";
import { LifafaContextDataType } from "../../store/lifafas/context";
import { useGetRatnaFromPath, useRatnaDispatch } from "../../store/ratnas/context";
import { RatnaFE, SharedUserFE } from "../../types/documentFETypes";
import RatnaCard from "./Card";
import { getRatnas } from "../../api/ratna";
import { RatnaActionFactory } from "../../store/ratnas/actionCreator";
import { useSearchParams } from "react-router-dom";

export default function RatnaList({lifafaId, lifafaContext}: {lifafaId: string, lifafaContext?: LifafaContextDataType}) {
    const ratnaContext = useGetRatnaFromPath(lifafaId);
    const user = useAuth();
    const dispatch = useRatnaDispatch();
    const access = lifafaContext?.data[lifafaId].userAccess[user.user.uid] || {} as SharedUserFE;
    let ratnas: RatnaFE[] = [];
    const [searchParams] = useSearchParams();

    if (ratnaContext.data && lifafaId) {
        ratnas = Object.values(ratnaContext.data[lifafaId]).map(item => item);
        const query = searchParams.get('tags')
        if (query?.length) {
            let queryTags = [...query.split(',')];
            ratnas = ratnas.filter(item => !!queryTags.some(i => (item.tags || []).includes(i)));
        }
    }

    useEffect(() => {
        if (!ratnas || !ratnas.length) {
            getRatnas(lifafaId).then(
                result => {
                    dispatch(RatnaActionFactory.fetchAllRatnasCompleted(lifafaId, result))
                }
            ).catch()
        }
    }, [])

    return (
            ratnas && ratnas.map(item => {
                return (
                        <RatnaCard key={item.id} lifafaId={lifafaId} ratna={item} access={access}/>
                )
            })
    )
}