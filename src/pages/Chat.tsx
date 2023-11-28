import { useQuery } from "react-query"
import { getUserSession } from "../backend/handleUser";
import { UnauthorizaError } from "./UnauthorizaError";
import { getUsersOnLocation } from "../backend/getUsersOnLocation";
import { IconMessage } from "@tabler/icons-react";
import { ChatBox } from "../components/ChatBox";
import { useState } from "react";
import { Database } from "../lib/database.types";

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
        return <div className="h-screen bg-gradient-to-t from-[#202C32] to-[#101619] flex mx-auto justify-center"><span className="loading loading-dots loading-lg"></span></div>
    }
    if (!userSession) {
        return <UnauthorizaError />;
    }
    if (isError && !usersOnLocation) {
        return <div className="h-screen bg-gradient-to-t from-[#202C32] to-[#101619] flex mx-auto justify-center"><span className="loading loading-dots loading-lg"></span></div>;
    }
    return (
        <>
            <div className="bg-gradient-to-t from-[#202C32] to-[#101619] min-h-screen flex items-center justify-center px-16">
                <div className="relative w-full max-w-lg border border-gray-50/10 rounded">
                    <div className="m-8 relative space-y-4">
                        <h1 className="text-2xl text-center">User on Location: {usersOnLocation?.length}</h1>
                        {isSuccess && usersOnLocation && (
                            <div>
                                {usersOnLocation.map((user) => (
                                    <div key={user.id} className="p-5 bg-transparent rounded-lg flex items-center justify-between space-x-8">
                                        <div className="flex-1 flex justify-between items-center">
                                            <div className="h-4 w-48 text-lg capitalize rounded">{user.name}</div>
                                            <label htmlFor="my_modal_6" className="btn btn-circle btn-outline" onClick={async () => setOtherUser(user)}><IconMessage /></label>
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