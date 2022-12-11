import useSWR from "swr"

const fetcher = async (
    input: RequestInfo,
    init: RequestInit,
    ...args: any[]
) => {
    const res = await fetch(input, init);
    return res.json();
};


export function useStudie(id: string | string[] | undefined) {

    const url_api_studie_detail = `${process.env.NEXT_PUBLIC_URL_BASE_API}/studies/${id}/`;
    const { data, error, mutate } = useSWR(id ? url_api_studie_detail : null, id ? fetcher : null);

    return {
        studie: data,
        isLoading: !error && !data,
        isError: error,
        mutate: mutate
    }

}

export function useStudiePublic(id: string | string[] | undefined) {

    const url_api_studie_public = `${process.env.NEXT_PUBLIC_URL_BASE_API}/studie/public/${id}/`
    const { data, error } = useSWR(id ? url_api_studie_public : null, id ? fetcher : null);

    return {
        studie: data,
        isLoading: !error && !data,
        isError: error
    }

}


export function useStudies() {

    const url_api_studie = `${process.env.NEXT_PUBLIC_URL_BASE_API}/studies/`
    const { data, error } = useSWR(url_api_studie, fetcher)

    return {
        studies: data,
        isLoading: !error && !data,
        isError: error
    }

}

export function orderTasks(taska: { index: number; }, taskb: { index: number; }) {
    return taska.index - taskb.index;
};