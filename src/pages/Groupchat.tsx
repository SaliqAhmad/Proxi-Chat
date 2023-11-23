import { useMutation, useQuery, useQueryClient } from "react-query";
import { getUserSession } from "../backend/handleUser";
import { TopBar } from "../components/TopBar";
import { IconPlus, IconTrash, IconArrowsJoin2 } from "@tabler/icons-react";
import { createGroup, delGroup, getAllGroups, joinGroup } from "../backend/handlegroup";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { GroupChatBox } from "../components/GroupChatBox";
import { Database } from "../lib/database.types";

type Group = Database["public"]["Tables"]["groups"]["Row"];

export const Groupchat = () => {
    const [groupname, setGroupname] = useState<string>("");
    const [group, setGroup] = useState<Group>();

    const queryClient = useQueryClient();

    const { data: userSession } = useQuery({
        queryFn: getUserSession,
        queryKey: ["userSession"],
    });
    const { data: groups, isLoading } = useQuery({
        queryFn: getAllGroups,
        queryKey: ["getGroups"],
    })
    const { mutate: creategroup, isSuccess } = useMutation({
        mutationKey: "creategroup",
        mutationFn: () => createGroup(groupname),
    })
    const { mutate: delgroup, isSuccess: delgrp } = useMutation({
        mutationKey: "deletegroup",
        mutationFn: async (id: string) => delGroup(id),

    })
    const { mutate: joingroup } = useMutation({
        mutationKey: "joingroup",
        mutationFn: async (id: string) => joinGroup(id),
    })
    useEffect(() => {
        if (isSuccess) {
            queryClient.invalidateQueries("getGroups");
            setGroupname("");
        }
        if (delgrp) {
            queryClient.invalidateQueries("getGroups");
        }
    }, [isSuccess, queryClient, delgrp]);

    if (!userSession) {
        return null;
    }
    return (
        <>
            <TopBar userSession={userSession} />
            <Toaster />
            <div className="bg-gradient-to-t from-[#202C32] to-[#101619] min-h-screen flex items-center justify-center px-16">
                <div className="relative w-full max-w-lg border border-gray-50/10 rounded">
                    {isLoading && <span className="loading loading-dots loading-lg flex mx-auto"></span>}
                    {groups?.map((group) => (
                        <div key={group.id} className="p-5 bg-transparent rounded-lg flex items-center justify-between space-x-8">
                            <div className="flex-1 flex h-10 justify-between items-center">
                                <label htmlFor="my_modal_7" className="h-4 w-48 text-lg capitalize rounded" onClick={() => setGroup(group)}>{group.groupname}</label>
                                {userSession.user.id === group.groupadmin && <button className="btn btn-circle btn-outline" onClick={async () => delgroup(group.id)}><IconTrash /></button>}
                                {userSession.user.id !== group.groupadmin && <button className="btn btn-circle btn-outline" onClick={async () => joingroup(group.id)}><IconArrowsJoin2 /></button>}
                            </div>
                        </div>
                    ))}
                    {groups?.length === 0 && <div className="m-8 relative space-y-4">
                        <div className="join">
                            <input className="input bg-transparent input-bordered rounded-full file-input-lg join-item" value={groupname} onChange={(e) => setGroupname(e.currentTarget.value)} placeholder="Enter Group Name" />
                            <button className="btn btn-outline join-item rounded-r-full btn-lg" onClick={() => creategroup()}><IconPlus /></button>
                        </div>
                    </div>}
                    <GroupChatBox group={group} />
                </div>
            </div>
        </>
    )
}