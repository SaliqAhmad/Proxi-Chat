import toast from "react-hot-toast";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";

export const sendMsgs = async (receiverId: string, msg: string, isImg = false) => {
    const senderId = (await supabase.auth.getUser()).data.user?.id;
    if (!senderId) return;
    const { error } = await supabase
        .from("chats")
        .insert({
            id: senderId,
            receiverid: receiverId,
            message: msg,
            isImg: isImg,
        });
    if (error) {
        console.log(error);
    }

    if (error) {
        toast.error("Error sending message");
    }
};

export const delMsgs = async (msgId: string, isImg: boolean, receiverId: string) => {
    const currUserId = (await supabase.auth.getUser()).data.user?.id;
    if (!currUserId) return;
    if (isImg) {
        const { error } = await supabase
            .storage
            .from("media")
            .remove([`/${currUserId}/${receiverId}/${msgId}`]);
        if (error) {
            return toast.error("Error deleting message");
        }
    }
    const { error } = await supabase
        .from("chats")
        .delete()
        .match({ id: currUserId, msgid: msgId });
    if (error) {
        return toast.error("Error deleting message");
    }
}

export const sendMedia = async (receiverId: string, file: File) => {
    const senderId = (await supabase.auth.getUser()).data.user?.id;
    if (!senderId) return;
    if (file === null) return;
    const { data, error } = await supabase
        .storage
        .from("media")
        .upload(`/${senderId}/${receiverId}/${uuidv4()}`, file);
    if (error) {
        toast.error("Error sending media");
        return null;
    }
    if (data.path === null) return null;
    sendMsgs(receiverId, data.path, true);
}

export const getMedia = (path: string) => {
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    return data.publicUrl;
}