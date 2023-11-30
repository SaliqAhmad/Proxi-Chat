import { useQuery } from "react-query"
import { getUserSession } from "../backend/handleUser";
import { UnauthorizaError } from "./UnauthorizaError";
import { getUsersOnLocation } from "../backend/getUsersOnLocation";
import { IconMessage } from "@tabler/icons-react";
import { ChatBox } from "../components/ChatBox";
import { useState } from "react";
import { Database } from "../lib/database.types";
import { TopBar } from "../components/TopBar";
import { Loading } from "../components/Loading";

type User = Database["public"]["Tables"]["users"]["Row"];

export const Chat = () => {
    const [otherUser, setOtherUser] = useState<User>();
    const { data: userSession } = useQuery({
        queryFn: getUserSession,
        queryKey: ["userSession"],
    });
    const { data: usersOnLocation, isLoading, isSuccess, isError } = useQuery({
        queryFn: () => getUsersOnLocation(),
        queryKey: ["usersOnLocation"],
    });
    if (isLoading) {
        return <Loading />;
    }
    if (!userSession) {
        return <UnauthorizaError />;
    }
    if (isError && !usersOnLocation) {
        return <div className="h-screen bg-gradient-to-t from-[#202C32] to-[#101619] flex mx-auto justify-center"><span className="loading loading-dots loading-lg"></span></div>;
    }
    return (
        <>
            <TopBar />
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-full md:w-3/4 lg:w-1/2 xl:w-1/3 rounded-lg border border-gray-50/10  shadow-lg p-4">
                    <h1 className="text-2xl font-bold mb-4 text-center">User on Location: {usersOnLocation?.length}</h1>
                    <div className="overflow-y-auto max-h-60 md:max-h-80 lg:max-h-96 xl:max-h-80 w-full rounded-lg p-2">
                        {isSuccess && usersOnLocation && (
                            <div>
                                {usersOnLocation.map((user) => (
                                    <div key={user.id} className="p-5 bg-transparent rounded-lg flex items-center justify-between space-x-8">
                                        <div className="flex-1 flex justify-between items-center">
                                            <div className="h-4 w-48 text-lg capitalize rounded">{user.name}</div>
                                            <label htmlFor="my_modal_6" className="btn btn-circle btn-outline hover:scale-110" onClick={async () => setOtherUser(user)}><IconMessage /></label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {otherUser && (<ChatBox user={otherUser} />)}
                    </div>
                </div>
            </div>
        </>
    )
}