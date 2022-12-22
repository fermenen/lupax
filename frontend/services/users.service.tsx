import Session from 'supertokens-auth-react/recipe/session';
import useSWRImmutable from 'swr/immutable';
import splitbee from '@splitbee/web';
import { useState, useEffect } from "react";

const fetcher = async (
    input: RequestInfo,
    init: RequestInit,
    ...args: any[]
) => {
    const res = await fetch(input, init);
    return res.json();
};

const key_url_api_me = `${process.env.NEXT_PUBLIC_URL_BASE_API}/me/`;

export function useUser() {
    const { data, error, mutate } = useSWRImmutable(key_url_api_me, fetcher)

    return {
        user: data,
        isLoading: !error && !data,
        isError: error,
        mutate: mutate
    }

}


export function useUserLogin() {
    const siteRedirect = '/my/dashboard';
    const [isLogin, setIsLogin] = useState(false);
    const [isCodeExecuted, setIsCodeExecuted] = useState(false);

    async function getUserLogin() {
        return await Session.doesSessionExist()
    }

    useEffect(() => {
        getUserLogin().then(response => {
            setIsLogin(response)
            setIsCodeExecuted(true)

        })
    }, []);
    return { isLogin, isCodeExecuted, siteRedirect };
}

export async function LogoutUser(): Promise<boolean> {

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_BASE_API}/api/auth/signout`, { method: 'POST' });
    const data = await response.json();
    if (data.status === "OK") {
        splitbee.reset()
        return true;
    } else {
        return false;
    }

}