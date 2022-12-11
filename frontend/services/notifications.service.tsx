import useSWR from "swr"
import { User } from "../interfaces";

const fetcher = async (
    input: RequestInfo,
    init: RequestInit,
    ...args: any[]
) => {
    const res = await fetch(input, init);
    return res.json();
};



export function useNotifications() {

    const url_api_notifications = `${process.env.NEXT_PUBLIC_URL_BASE_API}/notifications/`
    const { data, error, mutate } = useSWR(url_api_notifications, fetcher)

    return {
        notifications: data,
        isLoading: !error && !data,
        isError: error,
        mutate: mutate
    }
}


export function filterNotifications(user: User) {
    if (user && user.preferences){
        return function filter(notification: { type: string; }) {
            const app = 'app'; // always app notifications
            const team = (user.preferences.team_alerts) ? 'team' : 'NO_TEAM';
            return [app, team].includes(notification.type);
        };
    }else{
        return () => {}
    }
}


export function orderNotifications(n: { time_created: Date; }, n2: { time_created: Date; }) {
    return new Date(n2.time_created).getTime() - new Date(n.time_created).getTime();
};


