import { useQuery } from "react-query"
import { getRecentChats } from "../backend/recentChats"
import { getUserSession } from "../backend/handleUser";
import { IconMessage } from "@tabler/icons-react";
import { useState } from "react";
import { Database } from "../lib/database.types";
import { ChatBox } from "../components/ChatBox";
import { UnauthorizaError } from "./UnauthorizaError";

type User = Database["public"]["Tables"]["users"]["Row"] | null;

export const MyChats = () => {
    const [otherUser, setOtherUser] = useState<User>();
    const { data: userSession } = useQuery({
        queryFn: getUserSession,
        queryKey: ["userSession"],
    });
    const { data: users, isSuccess, isLoading } = useQuery({
        queryKey: 'my-chats',
        queryFn: () => getRecentChats(),
    })
    if (isLoading) {
        return <div className="h-screen bg-gradient-to-t from-[#202C32] to-[#101619] flex mx-auto justify-center"><span className="loading loading-dots loading-lg"></span></div>
    }
    if (!userSession) {
        return <UnauthorizaError />
    }
    return (
        <>
            <div className="bg-gradient-to-t from-[#202C32] to-[#101619] min-h-screen flex items-center justify-center px-16">
                <div className="relative w-full max-w-lg border border-gray-50/10 rounded">
                    <div className="m-8 relative space-y-4">
                        {isSuccess && users && (
                            <div>
                                {users.map((user) => (
                                    <div key={user.users?.id} className="p-5 bg-transparent rounded-lg flex items-center justify-between space-x-8">
                                        <div className="flex-1 flex justify-between items-center">
                                            <div className="h-4 w-48 text-lg capitalize rounded">{user.users?.name}</div>
                                            <label htmlFor="my_modal_6" className="btn btn-circle btn-outline" onClick={async () => setOtherUser(user.users)}><IconMessage /></label>
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

