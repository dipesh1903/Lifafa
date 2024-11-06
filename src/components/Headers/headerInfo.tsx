import { Flex, Heading } from "@radix-ui/themes"

type props = {
    title: string
}

export default function HeaderInfo({title}: props) {
    return (
        <Flex direction="column">
            <Heading size="3">
            {title}
            </Heading>
            <p className="p-0 pt-1">{new Date().toLocaleDateString()}</p>
        </Flex>
    )
}