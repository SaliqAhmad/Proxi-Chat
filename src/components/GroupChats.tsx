import { IconTrash } from "@tabler/icons-react"
import { Database } from "../lib/database.types"
import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteGroupMsg, getGroupChats, getGroupMedia } from "../backend/handleGroupChats";
import { getUserSession } from "../backend/handleUser";
import { useEffect } from "react";

type Group = Database["public"]["Tables"]["groups"]["Row"];
type Props = {
    group: Group | undefined
}

export const GroupChats = (props: Props) => {

    const queryClient = useQueryClient();

    const { data: CurrUser } = useQuery({
        queryFn: getUserSession,
        queryKey: "user",
    })

    const { data: chats, isFetching: chatsLoading } = useQuery({
        queryFn: () => getGroupChats(props.group?.id),
        queryKey: ["groupChats", props.group?.id],
    })

    const { mutate, isSuccess } = useMutation({
        mutationFn: (chatId: string) => deleteGroupMsg(props.group?.id, chatId),
        mutationKey: ["deleteGroupChat"],
    })

    type MediaProps = {
        path: string;
    }

    const Media = (path: MediaProps) => {
        const { data: media } = useQuery({
            queryFn: async () => getGroupMedia(path.path),
            queryKey: ["groupimg", props.group?.id],
        })
        return <img src={media} className="w-[650px] rounded-xl" alt="..." />
    }

    useEffect(() => {
        if (isSuccess) {
            queryClient.invalidateQueries(["groupChats", props.group?.id]);
        }
    }, [isSuccess, queryClient, props.group?.id]);

    return (
        <div className="w-full">
            {chats?.map((chat) => (
                <div key={chat.id}>
                    <div className={`chat ${chat.sender === CurrUser?.user.id ? "chat-end" : "chat-start"} mt-2`} key={chat.id}>
                        {chatsLoading ? <span className="loading loading-dots loading-md"></span> : <>
                            {chat.isImg && <p><Media path={chat.message} /></p>}
                            {!chat.isImg && <div className={`chat-bubble ${chat.sender === CurrUser?.user.id ? "chat-bubble-info" : "chat-bubble-success"}`}>{chat.message}</div>}
                            {chat.sender !== CurrUser?.user.id && <div className="chat-footer mt-2 opacity-50">
                                {chat.sendername}
                            </div>}
                            <div className="avatar">
                                {chat.sender === CurrUser?.user.id && (<div className="w-10">
                                    <button className="btn btn-sm btn-circle bg-transparent hover:bg-transparent hover:scale-95 border-0" onClick={() => mutate(chat.id)}>
                                        <IconTrash />
                                    </button>
                                </div>)}
                            </div>
                        </>
                        }
                    </div>
                </div>
            ))}
        </div>
    )
}