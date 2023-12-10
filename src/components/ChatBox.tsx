import { Database } from "../lib/database.types";
import { Chats } from "../components/Chats";
import { IconSend, IconX, IconPhoto } from "@tabler/icons-react";
import { sendMedia, sendMsgs } from "../backend/sendMsgs";
import { useEffect, useState } from "react";
import { useQueryClient, useMutation } from "react-query";

type User = Database["public"]["Tables"]["users"]["Row"];

type Props = {
    user: User;
}

export const ChatBox = (user: Props) => {
    const [msg, setMsg] = useState<string>("");

    const queryClient = useQueryClient();

    const { mutate, isSuccess } = useMutation({
        mutationFn: (msg: string) => sendMsgs(user.user.id, msg),
        mutationKey: ["sendMsgs"],
    });

    const { mutate: sendPhoto, isSuccess: photoSend } = useMutation({
        mutationFn: (msg: FileList | null) => sendMedia(user.user.id, msg),
        mutationKey: ["sendMedia"],
    });

    useEffect(() => {
        if (isSuccess) {
            queryClient.invalidateQueries(["chats", user.user.id]);
            setMsg("");
        }
        if (photoSend) {
            queryClient.invalidateQueries(["chats", user.user.id]);
        }
    }
        , [isSuccess, queryClient, user.user.id, photoSend]);

    return (
        <>
            <input type="checkbox" id="my_modal_6" className="modal-toggle" />
            <div className="modal">
                <div className="card w-screen lg:w-1/2 h-screen bg-info/10 backdrop-blur-xl shadow-2xl">
                    <div className="modal-action">
                        <label htmlFor="my_modal_6" className="btn btn-outline btn-circle"><IconX /></label>
                    </div>
                    <div className="w-full flex justify-center">
                        <h2 className="card-title">{user.user.name}</h2>
                    </div>
                    <div className="flex flex-col overflow-y-auto h-screen">
                        <div className="flex-grow overflow-y-auto px-4 py-2">
                            <Chats user={user.user} />
                        </div>
                        <div className="flex items-center justify-center border-t mb-2 border-gray-500/30 p-4">
                            <div className="join">
                                <input className="w-52 input input-md lg:input-lg rounded-full bg-gray-500/20 join-item" placeholder="message..." value={msg} onChange={(e) => setMsg(e.currentTarget.value)} />
                                <button className="btn join-item btn-md lg:btn-lg btn-outline rounded-r-full" onClick={() => mutate(msg)}><IconSend /></button>
                                <button className="btn btn-md lg:btn-lg join-item btn-outline rounded-r-full">
                                    <input type="file" accept="images/*" className="opacity-0 absolute btn-square" onChange={(e) => sendPhoto(e.target.files)} />
                                    <IconPhoto />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}