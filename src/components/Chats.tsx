import { useMutation, useQuery, useQueryClient } from "react-query";
import { getUserSession } from "../backend/handleUser"
import { IconTrash } from "@tabler/icons-react";
import { Database } from "../lib/database.types";
import { getChats } from "../backend/getChats";
import { delMsgs, getMedia } from "../backend/sendMsgs";
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

    const { data: chats, isLoading: chatsLoading } = useQuery({
        queryFn: async () => getChats(user.user.id),
        queryKey: ["chats", user.user.id],
    })

    type DelMsgsProps = Database["public"]["Tables"]["chats"]["Row"];

    const { mutate, isSuccess } = useMutation({
        mutationFn: (props: DelMsgsProps) => delMsgs(props.msgid, props.message, props.isImg),
        mutationKey: ["delMsgs"],
    });

    type MediaProps = {
        path: string;
    }

    const Media = (path: MediaProps) => {
        const { data: media } = useQuery({
            queryFn: async () => getMedia(path.path),
            queryKey: ["img", user.user.id],
        })
        return <img src={media} alt="..." />
    }

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
                        {chatsLoading ? <span className="loading loading-dots loading-md"></span> : <>
                            {chat.isImg && <p><Media path={chat.message} /></p>}
                            {!chat.isImg && <div className={`chat-bubble ${chat.id === CurrUser?.user.id ? "chat-bubble-info" : "chat-bubble-success"}`}>{chat.message}</div>}
                            <div className="avatar">
                                {chat.id === CurrUser?.user.id && (<div className="w-10">
                                    <button className="btn btn-sm btn-circle bg-transparent hover:bg-transparent hover:scale-95 border-0" onClick={() => mutate(chat)}>
                                        <IconTrash />
                                    </button>
                                </div>)}
                            </div>
                        </>}
                    </div>
                </div>
            ))}
        </div>

    )
}
