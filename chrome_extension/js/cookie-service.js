
export default async function deleteAllDomainCookies(domain) {

    try {
        const lastCharacter = domain.charAt(domain.length - 1);
        if (lastCharacter === '/') { domain = domain.slice(0, -1) }
        const withAll = deleteDomainCookies(domain)
        const withoutHttps = deleteDomainCookies(domain.replace('https://', ''))
        const withoutWWW = deleteDomainCookies(domain.replace('https://', '').replace('www.', '.'))
    } catch (error) {
        console.error(`Unexpected error: ${error.message}`);
    }

}



async function deleteDomainCookies(domain) {
    let cookiesDeleted = 0;
    try {
        const cookies = await chrome.cookies.getAll({ domain });
        if (cookies.length === 0) {
            return cookiesDeleted;
        }
        let pending = cookies.map(deleteCookie);
        await Promise.all(pending);
        cookiesDeleted = pending.length;
    } catch (error) {
        console.error(`Unexpected error: ${error.message}`);
        return cookiesDeleted;
    }
    return cookiesDeleted;
}



function deleteCookie(cookie) {
    // Cookie deletion is largely modeled off of how deleting cookies works when using HTTP headers.
    // Specific flags on the cookie object like `secure` or `hostOnly` are not exposed for deletion
    // purposes. Instead, cookies are deleted by URL, name, and storeId. Unlike HTTP headers, though,
    // we don't have to delete cookies by setting Max-Age=0; we have a method for that ;)
    //
    // To remove cookies set with a Secure attribute, we must provide the correct protocol in the
    // details object's `url` property.
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Secure
    const protocol = cookie.secure ? "https:" : "http:";

    // Note that the final URL may not be valid. The domain value for a standard cookie is prefixed
    // with a period (invalid) while cookies that are set to `cookie.hostOnly == true` do not have
    // this prefix (valid).
    // https://developer.chrome.com/docs/extensions/reference/cookies/#type-Cookie
    const cookieUrl = `${protocol}//${cookie.domain}${cookie.path}`;

    return chrome.cookies.remove({
        url: cookieUrl,
        name: cookie.name,
        storeId: cookie.storeId,
    });
}