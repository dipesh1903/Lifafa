import { useNavigate } from "react-router-dom";
import { LifafaFE } from "../../types/documentFETypes";
import { isLifafaOwner } from "../../utils";
import { useAuth } from "../../store/auth/context";
import { PrimaryButton } from "../ui/Button";

type props = {
    lifafa: LifafaFE
}
export default function LifafaCardActions({lifafa}: props) {
    const navigate = useNavigate();
    const user = useAuth();
    function copyToClipboard() {
        navigator.clipboard.writeText(`${window.location.origin}/lifafa/${lifafa.id}`);
    }
    return (
        <div className="flex flex-nowrap overflow-auto overflow-y-scroll scrollbar-w py-4">
            <PrimaryButton 
            variant="outline"
            className="w-fit mr-2 bg-light-secondary text-light-onSecondary border-light-outline hover:bg-opacity-80"
            onClick={(e) => {e.stopPropagation(); copyToClipboard()}}>Copy Invite Link</PrimaryButton>
            {!!isLifafaOwner(lifafa, user.user.uid) &&
            <PrimaryButton variant="outline"
            className="w-fit bg-light-secondary  border-light-outline text-light-onSecondary hover:bg-opacity-80"
            onClick={(e) => {e.stopPropagation(); navigate(`/lifafa/${lifafa.id}/edit`, {state: {lifafaName: lifafa.name, accessType: lifafa.accessType}})}}>
                Edit</PrimaryButton>}
        </div>
    )
}