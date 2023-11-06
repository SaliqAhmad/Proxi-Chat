import { FormEvent } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";

export const getUserSession = async () => {
    // Get the user session data.
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        throw error;
    }
    return data;
};

export const handleUserSignIn = async (email: string, password: string) => {
    // Sign in the user.
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        throw error;
    }
};

export const handleUserSignUp = async (email: string, password: string, fullName: string, latitude: number, longitude: number, e: FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName || !latitude || !longitude) {
        toast.error("Please fill in all the fields", {
            style: {
                background: "#DCDCDC",
                opacity: "10",
                padding: "16px",
                borderRadius: "3rem",
            },
        });
        return;
    }
    // Sign up the user.
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                fullName,
                latitude,
                longitude,
            },
        },
    });
    if (error) {
        toast.error(error.message, {
            style: {
                background: "#DCDCDC",
                opacity: "10",
                padding: "16px",
                borderRadius: "3rem",
            },
        });
        throw error;
    }
    if (data.session?.access_token) return true;
};

export const handleUserSignOut = async () => {
    // Sign out the user.
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw error;
    }
};

