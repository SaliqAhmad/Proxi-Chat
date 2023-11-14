import toast from "react-hot-toast";
import { supabase } from "../supabaseClient";

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

export const delMsgs = async (currUser: string | undefined, msgId: string) => {
    if (!currUser) return;
    if (!msgId) return;
    const { error } = await supabase
        .from("chats")
        .delete()
        .match({ id: currUser, msgid: msgId });
    if (error) {
        return toast.error("Error deleting message");
    }
}