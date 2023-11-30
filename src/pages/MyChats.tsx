import { useQuery } from "react-query"
import { getRecentChats } from "../backend/recentChats"
import { getUserSession } from "../backend/handleUser";
import { IconMessage } from "@tabler/icons-react";
import { useState } from "react";
import { Database } from "../lib/database.types";
import { ChatBox } from "../components/ChatBox";
import { UnauthorizaError } from "./UnauthorizaError";
import { TopBar } from "../components/TopBar";
import { Loading } from "../components/Loading";

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
        return <Loading />
    }
    if (!userSession) {
        return <UnauthorizaError />
    }
    return (
        <>
            <TopBar />
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-full md:w-3/4 lg:w-1/2 xl:w-1/3 rounded-lg border border-gray-50/10  shadow-lg p-4">
                    <div className="overflow-y-auto max-h-60 md:max-h-80 lg:max-h-96 xl:max-h-80 w-full rounded-lg p-2">
                        {isSuccess && users && (
                            <div>
                                {users.map((user) => (
                                    <div key={user.id} className="p-5 bg-transparent rounded-lg flex items-center justify-between space-x-8">
                                        <div className="flex-1 flex justify-between items-center">
                                            <div className="h-4 w-48 text-lg capitalize rounded">{user.users?.name}</div>
                                            <label htmlFor="my_modal_6" className="btn btn-circle btn-outline hover:scale-110" onClick={async () => setOtherUser(user.users)}><IconMessage /></label>
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

