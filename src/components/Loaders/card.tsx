export default function CardLoader() {
    return (
        <div className="px-4 p-4 animate-pulse flex-col h-32 bg-slate-100 border-opacity-40 border-b-[1px] border-light-outlineVariant">
            <div className="rounded-full bg-slate-200 h-4 w-60"></div>
            <div className="rounded-full bg-slate-200 h-4 w-48 mt-3"></div>
            <div className="flex mt-6">
                <div className="rounded-full bg-slate-200 h-5 w-20"></div>
                <div className="rounded-full bg-slate-200 h-5 w-20 ml-2"></div>
            </div>
      </div>
    )
}