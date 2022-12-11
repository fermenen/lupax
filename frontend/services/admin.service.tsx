import useSWR from "swr";


const fetcherWithError = async (
    input: RequestInfo,
    init: RequestInit,
    ...args: any[]
) => {
    const res = await fetch(input, init);
    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.')
        throw error
      }
    return res.json();
};



export function useUsersAll() {

    const url_api_all_users = `${process.env.NEXT_PUBLIC_URL_BASE_API}/admin/users/`
    const { data, error } = useSWR(url_api_all_users, fetcherWithError)

    return {
        users: data,
        isLoading: !error && !data,
        isError: error
    }

}


export function useMetrics() {

    const url_api_all_metrics= `${process.env.NEXT_PUBLIC_URL_BASE_API}/admin/metrics/`
    const { data, error } = useSWR(url_api_all_metrics, fetcherWithError)

    return {
        metrics: data,
        isLoading: !error && !data,
        isError: error
    }

}