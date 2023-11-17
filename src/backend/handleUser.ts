import { FormEvent } from "react";
import { supabase } from "../supabaseClient";
import toast from "react-hot-toast";

export const getUserSession = async () => {
    // Get the user session data.
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        throw error;
    }
    return data.session;
};

export const handleUserSignIn = async (email: string, password: string, latitude: number | undefined, longitude: number | undefined, userSessionId: string | undefined, e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
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
    // Sign in the user.
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
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
    return updateUserLocation(latitude, longitude);
};

const updateUserLocation = async (latitude: number | undefined, longitude: number | undefined) => {
    const userSessionId = (await supabase.auth.getUser()).data.user?.id;
    if (!latitude || !longitude || !userSessionId) return;
    const { error: locationError } = await supabase.from("users")
        .update({ latitude: latitude, longitude: longitude })
        .match({ id: userSessionId });
    if (locationError) {
        toast.error(locationError.message, {
            style: {
                background: "#DCDCDC",
                opacity: "10",
                padding: "16px",
                borderRadius: "3rem",
            },
        });
        throw locationError;
    }
    return true;
}

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
    const { error: dbSave } = await supabase.from("users")
        .insert({
            id: data.user.id,
            name: fullName,
            email: email,
            password: password,
            latitude: latitude,
            longitude: longitude,
        })

    if (dbSave) {
        toast.error(dbSave.message, {
            style: {
                background: "#DCDCDC",
                opacity: "10",
                padding: "16px",
                borderRadius: "3rem",
            },
        });
        throw dbSave;
    }

    if (data.session?.access_token) return true;
};

export const handleUserSignOut = async () => {
    // Sign out the user.
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw error;
    }
    return true;
};

