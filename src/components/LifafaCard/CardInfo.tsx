import { Flex, Heading } from "@radix-ui/themes";
import { LifafaFE } from "../../types/documentFETypes"

type props = {
    lifafa: LifafaFE
}

export default function CardInfo({lifafa}: props) {

    const {
        name,
        userInfo,
        createdAt,
        description
    } = lifafa;

    return (
        <Flex direction="column" className="text-light-onSurfaceVariant" gap="1.5">
            <Heading size="4" >{name || 'A lifafa'}</Heading>
            <p>{userInfo?.name}</p>
            <p>{createdAt.toDate().toDateString()}</p>
            <p>{description}</p>
        </Flex>
    );
}