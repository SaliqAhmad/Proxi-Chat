import { Session } from "@supabase/supabase-js"
import { handleUserSignOut } from "../backend/handleUser"
import { useMutation } from "react-query"
import { Link, useNavigate } from "react-router-dom"

type Props = {
    userSession: Session
}

export const TopBar = (props: Props) => {
    const navigate = useNavigate();
    const { mutate } = useMutation({
        mutationFn: handleUserSignOut,
        mutationKey: ["handleUserSignOut"],
        onSuccess: () => {
            navigate("/signin");
        }
    });

    return (
        <>
            {props && (
                <div className="navbar fixed mt-10">
                    <div className="w-full justify-center">
                        <Link to="/chats" className="btn btn-ghost text-xl">CHAT</Link>
                        <Link to="/groupchats" className="btn btn-ghost text-xl">GROUP CHAT</Link>
                        <Link to="mychats" className="btn btn-ghost text-xl">MY CHATS</Link>
                    </div>
                    <button className="btn btn-ghost text-xl" onClick={() => mutate()}>LOG-OUT</button>
                </div>
            )}
        </>
    )
}