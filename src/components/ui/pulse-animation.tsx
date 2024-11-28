export default function PulseAnimation() {
    return(
        <>
            <div className="absolute top-[15%] left-[15%] w-[30px] h-[30px]  rounded-full bg-blue-400 opacity-0 animate-[pulseAnimation_4s_ease-in-out_infinite]"></div>
            <div className="absolute top-[15%] left-[15%] w-[30px] h-[30px]  rounded-full bg-blue-400 opacity-0  animate-[pulseAnimation_4s_ease-in-out_1s_infinite]"></div>
            <div className="absolute top-[15%] left-[15%] w-[30px] h-[30px]  rounded-full bg-blue-400 opacity-0  animate-[pulseAnimation_4s_ease-in-out_2s_infinite]"></div>
            <div className="absolute top-[15%] left-[15%] w-[30px] h-[30px]  rounded-full bg-blue-400 opacity-0  animate-[pulseAnimation_4s_ease-in-out_3s_infinite]"></div>
        </>
    )
}