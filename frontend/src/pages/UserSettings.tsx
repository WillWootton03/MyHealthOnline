import BodyDetails from "../components/BodyDetails";

export default function UserSettings() {
    return (
        <div className="flex justify-center items-center h-200 page-bg-light">
            <div className=" w-fit mx-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white/60 shadow[0_8px_40px_rgba(0,0,0,0.08)
                    px-8 py-10 drop-shadow-2xl">
                <BodyDetails />
            </div>
        </div>
    );
}