
import splitbee from '@splitbee/web';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { successAlert } from '../../../services/alert.service';
import { useUser, useUserLogin } from '../../../services/users.service';

export default function CallbackGoogle() {

    const router = useRouter();
    const { code } = router.query;
    const { user, isLoading, isError, mutate } = useUser();
    const { isLogin, siteRedirect } = useUserLogin();


    useEffect(() => {
        if (code) {
            sign_in_google();
        }
    }, [code]);


    const sign_in_google = () => {

        const url_api_signinup_url = `${process.env.NEXT_PUBLIC_URL_BASE_API}/api/auth/signinup/`;
        const data = JSON.stringify({
            code,
            redirectURI: `${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/auth/callback/google`,
            thirdPartyId: "google"
        })

        fetch(url_api_signinup_url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "rid": "thirdpartyemailpassword"
            },
            body: data
        }).then(function (res) {
            if (!res.ok) throw Error(res.statusText);
            return res;
        }).then(reponse => reponse.json()).then(data => {
            if (data.status === "OK" && data.user) {
                if (data.createdNewUser) {
                    mutate().then(() => {
                        router.push(siteRedirect);
                        successAlert('', `Successful register!`);
                        splitbee.track("Sign Up google")
                    })
                } else {
                    mutate().then(() => {
                        router.push(siteRedirect);
                        successAlert('', `Welcome back!`);
                        splitbee.track("Sign In google")
                    })
                }
            }
        }).catch(error => {
            throw new Error(error.toString());
        })
    };

    return (
        <>
        </>
    )

}