
type props = {
    tags: string[],
    onClick?: () => {}
}

export default function TagList({tags}: props) {
    if (!tags.length) return null;
    return (
        <div className="flex flex-nowrap max-w-[350px] max-sm:max-w-[200px] overflow-scroll break-keep">
            {
                tags.map((item,id) => (
                    <button className="h-fit py-[2px] text-[12px] hover:bg-light-primaryFixedDim px-2 whitespace-nowrap w-fit mx-1 break-keep rounded-full border-light-outline border-2" key={id}>{item}</button>
                ))
            }
        </div>
    )
}