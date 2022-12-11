import dynamic from 'next/dynamic'
import EmailPassword from 'supertokens-auth-react/recipe/emailpassword'

const EmailPasswordAuthNoSSR = dynamic(
  new Promise((res) =>
    res(EmailPassword.EmailPasswordAuth)
  ),
  { ssr: false }
)

export default EmailPasswordAuthNoSSR