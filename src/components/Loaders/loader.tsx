import CardLoader from "./card";
import HeaderLoader from "./header";

export default function Loader() {
    return (
        <div>
            <HeaderLoader />
            {
                Array(6).fill(1).map((_, index) => (<CardLoader key={index}/>))
            }
        </div>
    )
}