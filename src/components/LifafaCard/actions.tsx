import { Button, Flex } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { LifafaFE } from "../../types/documentFETypes";
import { isLifafaOwner } from "../../utils";
import { useAuth } from "../../store/auth/context";

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
        <Flex gap="3" wrap="nowrap" className="overflow-auto overflow-y-scroll scrollbar-w py-4">
            <Button variant="outline" onClick={(e) => {e.stopPropagation(); copyToClipboard()}}>Copy Invite Link</Button>
            {!!isLifafaOwner(lifafa, user.user.uid) && <Button variant="outline" onClick={(e) => {e.stopPropagation(); navigate(`/lifafa/${lifafa.id}/edit`, {state: {lifafaName: lifafa.name, accessType: lifafa.accessType}})}}>Edit</Button>}
        </Flex>
    )
}