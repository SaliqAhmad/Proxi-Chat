import { useMutation, useQuery, useQueryClient } from "react-query";
import { getUserSession } from "../backend/handleUser"
import { IconTrash } from "@tabler/icons-react";
import { Database } from "../lib/database.types";
import { getChats } from "../backend/getChats";
import { delMsgs } from "../backend/sendMsgs";
import { useEffect } from "react";

type User = Database["public"]["Tables"]["users"]["Row"];

type Props = {
    user: User;
}

export const Chats = (user: Props) => {
    const queryClient = useQueryClient();

    const { data: CurrUser } = useQuery({
        queryFn: getUserSession,
        queryKey: "user",
    })

    const { data: chats } = useQuery({
        queryFn: async () => getChats(user.user.id),
        queryKey: ["chats", user.user.id],
    })

    const { mutate, isSuccess } = useMutation({
        mutationFn: (msgid: string) => delMsgs(CurrUser?.user.id, msgid),
        mutationKey: ["delMsgs"],
    });

    useEffect(() => {
        if (isSuccess) {
            queryClient.invalidateQueries(["chats", user.user.id]);
        }
    }
        , [isSuccess, queryClient, user.user.id]);

    return (
        <div className="w-full">
            {chats?.map((chat) => (
                <div key={chat.msgid}>
                    <div className={`chat ${chat.id === CurrUser?.user.id ? "chat-end" : "chat-start"} mt-2`} key={chat.id}>
                        <div className={`chat-bubble ${chat.id === CurrUser?.user.id ? "chat-bubble-info" : "chat-bubble-success"}`}>{chat.message}</div>
                        <div className="avatar">
                            {chat.id === CurrUser?.user.id && (<div className="w-10">
                                <button className="btn btn-sm btn-circle bg-transparent hover:bg-transparent hover:scale-95 border-0" onClick={async () => mutate(chat.msgid)}>
                                    <IconTrash />
                                </button>
                            </div>)}
                        </div>
                    </div>
                </div>
            ))}
        </div>

    )
}
