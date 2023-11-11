import { Database } from "../lib/database.types";
import { Chats } from "../components/Chats";
import { IconX } from "@tabler/icons-react";

type User = Database["public"]["Tables"]["users"]["Row"];

type Props = {
    user: User;
}

export const ChatBox = (props: Props) => {

    if (!props) {
        return null;
    }
    return (
        <>
            <input type="checkbox" id="my_modal_6" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box w-11/4 max-w-5xl h-screen bg-gradient-to-t from-[#101619] to-[#202C32]">
                    <div className="modal-action">
                        <label htmlFor="my_modal_6" className="btn btn-outline btn-circle"><IconX /></label>
                    </div>
                    <h3 className="font-bold text-lg text-center">{props.user.name}</h3>
                    <Chats otherUser={props.user.id} />
                </div>
            </div>
        </>
    )
}