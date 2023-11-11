import { useQuery } from "react-query"
import { getChats } from "../backend/getChats"
import { getUserSession } from "../backend/handleUser"
import { Database } from "../lib/database.types";

type User = Database["public"]["Tables"]["users"]["Row"]["id"];

type Props = {
    otherUser: User;
}

export const Chats = (props: Props) => {

    const { data: CurrUser } = useQuery({
        queryFn: getUserSession,
        queryKey: "user",
    })

    const chats = useQuery({
        queryFn: async () => getChats(props.otherUser),
        queryKey: ["chats", props],
    })

    return (
        <>
            {chats.data?.map((chat) => (
                <div key={chat.msgid}>
                    <div className={`chat ${chat.id === CurrUser?.user.id ? "chat-end" : "chat-start"} mt-2`} key={chat.id}>
                        <div className={`chat-bubble ${chat.id === CurrUser?.user.id ? "chat-bubble-info" : "chat-bubble-success"}`}>{chat.message}</div>
                    </div>
                </div>
            ))}
        </>

    )
}
