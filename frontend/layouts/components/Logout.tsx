import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { useSWRConfig } from "swr";
import { LogoutUser } from "../../services/users.service";
import { successAlert } from "../../services/alert.service";

export function Logout({ children }: { children: ReactElement }) {

  const key_url_api_me = `${process.env.NEXT_PUBLIC_URL_BASE_API}/me/`;
  const router = useRouter();
  const { mutate } = useSWRConfig();

  async function handelLogout() {

    if (await LogoutUser() == true) {
      mutate(key_url_api_me)
      router.push('/').then(() => {
        successAlert('', 'Successful logout');
      })
    }
  }

  return (
    <Box onClick={handelLogout}>
      {children}
    </Box>
  )

}