import useSWR from "swr"

const fetcher = async (
    input: RequestInfo,
    init: RequestInit,
    ...args: any[]
) => {
    const res = await fetch(input, init);
    return res.json();
};


export function useTeams() {

    const url_api_teams = `${process.env.NEXT_PUBLIC_URL_BASE_API}/teams/`;
    const { data, error, mutate } = useSWR(url_api_teams, fetcher)

    return {
        teams: data,
        isLoading: !error && !data,
        isError: error,
        mutate: mutate
    }

}


export function useTeam(id: string | string[] | undefined) {

    const url_api_team = `${process.env.NEXT_PUBLIC_URL_BASE_API}/team/${id}/`;
    const { data, error } = useSWR(id ? url_api_team : null, id ? fetcher : null);

    return {
        team: data,
        isLoading: !error && !data,
        isError: error
    }

}
