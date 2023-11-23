import toast from "react-hot-toast";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";

export const getGroupChats = async (groupId: string | undefined) => {
    if (!groupId) return;
    const { data, error } = await supabase
        .from("groupmessages")
        .select("*")
        .eq("groupid", groupId);

    if (error) {
        throw error;
    }

    return data;
};

export const sendGroupChat = async (groupId: string | undefined, message: string, isImg = false) => {
    const currUser = (await supabase.auth.getUser()).data;
    if (!currUser.user) {
        throw new Error("currUser is undefined");
    }
    if (!groupId) {
        throw new Error("groupId is undefined");
    }
    const { data, error } = await supabase
        .from("groupmessages")
        .insert(
            {
                sender: currUser.user.id,
                groupid: groupId,
                sendername: currUser.user.user_metadata.name,
                message: message,
                isImg
            }
        );

    if (error) {
        throw error;
    }

    return data;
};

export const deleteGroupMsg = async (groupId: string | undefined, msgId: string) => {
    const { data, error } = await supabase
        .from("groupmessages")
        .delete()
        .match({ id: msgId, groupid: groupId });

    if (error) {
        throw error;
    }

    return data;
}

export const sendGroupMedia = async (groupId: string | undefined, fileList: FileList | null) => {
    const senderId = (await supabase.auth.getUser()).data.user?.id;
    const file = fileList?.item(0);
    if (!file) return;
    if (!senderId) return;
    if (!groupId) return;
    if (file === null) return;
    const { data, error } = await supabase
        .storage
        .from("groupmedia")
        .upload(`/${groupId}/${senderId}/${uuidv4()}`, file);
    if (error) {
        toast.error("Error sending media");
        return null;
    }
    if (data.path === null) return null;
    sendGroupChat(groupId, data.path, true);
}

export const getGroupMedia = (path: string) => {
    const { data } = supabase.storage.from("groupmedia").getPublicUrl(path);
    return data.publicUrl;
}