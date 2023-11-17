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

    const { mutate: sendPhoto } = useMutation({
        mutationFn: (msg: File) => sendMedia(user.user.id, msg),
        mutationKey: ["sendMedia"],
    });

    useEffect(() => {
        if (isSuccess) {
            queryClient.invalidateQueries(["chats", user.user.id]);
            setMsg("");
        }
    }
        , [isSuccess, queryClient, user.user.id]);

    return (
        <>
            <input type="checkbox" id="my_modal_6" className="modal-toggle" />
            <div className="modal">
                <div className="card w-screen lg:w-1/2 h-screen bg-base-100 shadow-xl">
                    <div className="modal-action">
                        <label htmlFor="my_modal_6" className="btn btn-outline btn-circle"><IconX /></label>
                    </div>
                    <div className="card-body items-center text-center overflow-y-auto">
                        <h2 className="card-title">{user.user.name}</h2>
                        <div className="w-full overflow-y-auto">
                            <Chats user={user.user} />
                        </div>
                        <p></p>
                        <div className="card-actions">
                            <div className="form-control">
                                <div className="input-group">
                                    <input type="text" placeholder="text..." className="input input-lg input-bordered" value={msg} onChange={(e) => setMsg(e.currentTarget.value)} />
                                    <button className="btn btn-outline btn-square btn-lg" onClick={() => mutate(msg)}>
                                        <IconSend />
                                    </button>
                                    <button className="btn btn-outline btn-square btn-lg" >
                                        <input type="file" accept="images/*" className="opacity-0 absolute btn-square" onChange={async (e) => sendPhoto(e.target.files[0])} />
                                        <IconPhoto />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}