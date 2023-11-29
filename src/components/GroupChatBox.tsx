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
    group: Groupdet | undefined
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
                <div className="card w-screen lg:w-1/2 h-screen bg-base-100/70 backdrop-blur-xl shadow-xl">
                    <div className="modal-action">
                        <label htmlFor="my_modal_7" className="btn btn-outline btn-circle"><IconX /></label>
                        <div className={`dropdown dropdown-left ${!isPresent && "hidden"}`}>
                            <div tabIndex={0} role="button" className="btn btn-outline btn-circle"><IconDotsCircleHorizontal /></div>
                            <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box h-42">
                                <li><a>{userSession?.user.id !== props.group?.groupadmin && isPresent && <button className="btn btn-circle bg-transparent" onClick={async () => leavegroup()}><IconDoorExit /></button>}</a></li>
                                <li><a>{userSession?.user.id === props.group?.groupadmin && isPresent && <button className="btn btn-circle bg-transparent" onClick={async () => delgroup()}><IconTrash /></button>}</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="card-body items-center text-center overflow-y-auto">
                        <h2 className="card-title">{props.group?.groupname}</h2>
                        <div className="w-full overflow-y-auto">
                            {isLoading ? <span className="loading loading-spinner loading-lg mt-96"></span> :
                                <>
                                    {isPresent ? <GroupChats group={props.group} /> :
                                        <div className="card w-96 bg-error text-error-content flex mx-auto mt-96">
                                            <div className="card-body">
                                                <h2 className="card-title">You are not a member of this group</h2>
                                            </div>
                                        </div>
                                    }
                                </>
                            }
                        </div>
                        <p></p>
                        <div className="card-actions">
                            <div className={`form-control ${!isPresent && "hidden"}`}>
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