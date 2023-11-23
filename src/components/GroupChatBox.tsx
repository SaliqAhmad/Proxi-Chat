import { IconPhoto, IconSend, IconX } from "@tabler/icons-react"
import { Database } from "../lib/database.types"
import { GroupChats } from "./GroupChats";
import { useMutation, useQueryClient } from "react-query";
import { sendGroupChat, sendGroupMedia } from "../backend/handleGroupChats";
import { useEffect, useState } from "react";

type Groupdet = Database["public"]["Tables"]["groups"]["Row"];
type Group = {
    group: Groupdet | undefined
}


export const GroupChatBox = (props: Group) => {
    const [msg, setMsg] = useState<string>("");

    const queryClient = useQueryClient();

    const { mutate, isSuccess } = useMutation({
        mutationFn: (msg: string) => sendGroupChat(props.group?.id, msg),
        mutationKey: ["sendGrouupMsgs"],
        onSuccess: () => setMsg("")
    })

    const { mutate: sendPhoto, isSuccess: sendMedia } = useMutation({
        mutationFn: (img: FileList | null) => sendGroupMedia(props.group?.id, img)
    })
    useEffect(() => {
        if (isSuccess) {
            queryClient.invalidateQueries(["groupChats", props.group?.id])
        }
        if (sendMedia) {
            queryClient.invalidateQueries(["groupChats", props.group?.id])
        }
    }, [isSuccess, queryClient, props.group?.id, sendMedia])
    return (
        <>
            <input type="checkbox" id="my_modal_7" className="modal-toggle" />
            <div className="modal">
                <div className="card w-screen lg:w-1/2 h-screen bg-base-100 shadow-xl">
                    <div className="modal-action">
                        <label htmlFor="my_modal_7" className="btn btn-outline btn-circle"><IconX /></label>
                    </div>
                    <div className="card-body items-center text-center overflow-y-auto">
                        <h2 className="card-title">{props.group?.groupname}</h2>
                        <div className="w-full overflow-y-auto">
                            <GroupChats group={props.group} />
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
                                        <input type="file" accept="images/*" className="opacity-0 absolute btn-square" onChange={(e) => sendPhoto(e.target.files)} />
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