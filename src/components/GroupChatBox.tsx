import { IconPhoto, IconSend, IconX, IconDotsCircleHorizontal, IconTrash, IconDoorExit } from "@tabler/icons-react"
import { Database } from "../lib/database.types"
import { GroupChats } from "./GroupChats";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { checkIfGroupMember, sendGroupChat, sendGroupMedia } from "../backend/handleGroupChats";
import { useEffect, useState } from "react";
import { getUserSession } from "../backend/handleUser";
import { delGroup, leaveGroup } from "../backend/handlegroup";

type Groupdet = Database["public"]["Tables"]["groups"]["Row"];
type Group = {
    group: Groupdet | undefined;
}


export const GroupChatBox = (props: Group) => {
    const [msg, setMsg] = useState<string>("");

    const queryClient = useQueryClient();

    const { data: userSession } = useQuery({
        queryFn: getUserSession,
        queryKey: ["userSession"],
    });
    const { mutate, isSuccess } = useMutation({
        mutationFn: (msg: string) => sendGroupChat(props.group?.id, msg),
        mutationKey: ["sendGrouupMsgs"],
        onSuccess: () => setMsg("")
    })

    const { mutate: sendPhoto, isSuccess: sendMedia } = useMutation({
        mutationKey: "sendGroupMedia",
        mutationFn: (img: FileList | null) => sendGroupMedia(props.group?.id, img)
    })
    const { mutate: delgroup, isSuccess: delgrp } = useMutation({
        mutationKey: "deletegroup",
        mutationFn: async () => delGroup(props.group?.id),

    })
    const { mutate: leavegroup, isSuccess: leaveSuccess } = useMutation({
        mutationKey: "leavegroup",
        mutationFn: async () => leaveGroup(props.group?.id),
    })
    const { data: isPresent, isLoading } = useQuery({
        queryKey: ["checkIfgroupMemeber", props.group?.id],
        queryFn: async () => checkIfGroupMember(props.group?.id)
    })
    useEffect(() => {
        if (isSuccess) {
            queryClient.invalidateQueries(["groupChats", props.group?.id])
        }
        if (sendMedia) {
            queryClient.invalidateQueries(["groupChats", props.group?.id])
        }
        if (delgrp) {
            queryClient.invalidateQueries(["groupChats", props.group?.id])
        }
        if (leaveSuccess) {
            queryClient.invalidateQueries(["groupChats", props.group?.id])
            queryClient.invalidateQueries(["checkIfgroupMemeber", props.group?.id])
            queryClient.invalidateQueries(["getGroups"])
        }
    }, [isSuccess, queryClient, props.group?.id, sendMedia, delgrp, leaveSuccess])
    return (
        <>
            <input type="checkbox" id="my_modal_7" className="modal-toggle" />
            <div className="modal">
                <div className="card w-screen lg:w-1/2 h-screen bg-info/10 backdrop-blur-xl shadow-2xl">
                    <div className="modal-action">
                        <label htmlFor="my_modal_7" className="btn btn-outline btn-circle"><IconX /></label>
                        <div className={`dropdown dropdown-left ${!isPresent && "hidden"}`}>
                            <div tabIndex={0} role="button" className="btn btn-outline btn-circle"><IconDotsCircleHorizontal /></div>
                            <ul className="dropdown-content z-[1] menu p-2 shadow bg-slate-800 rounded-box h-42">
                                {userSession?.user.id !== props.group?.groupadmin && isPresent && <li><button className="btn btn-outline btn-circle" onClick={async () => leavegroup()}><IconDoorExit /></button></li>}
                                <li>{userSession?.user.id === props.group?.groupadmin && isPresent && <button className="btn btn-outline btn-circle" onClick={async () => delgroup()}><IconTrash /></button>}</li>
                            </ul>
                        </div>
                    </div>
                    <div className="w-full flex justify-center">
                        <h2 className="card-title">{props.group?.groupname}</h2>
                    </div>
                    <div className="flex flex-col overflow-y-auto h-screen">
                        <div className="flex-grow overflow-y-auto px-4 py-2">
                            {isLoading ? <span className="loading loading-spinner loading-lg mt-96"></span> :
                                <>
                                    {isPresent ? <GroupChats group={props.group} /> :
                                        <div className="card w-96 bg-error text-error-content flex mx-auto mt-96">
                                            <div className="card-body">
                                                <h2 className="card-title">You are notmember of this group</h2>
                                            </div>
                                        </div>
                                    }
                                </>
                            }
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