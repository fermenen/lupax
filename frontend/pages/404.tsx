import { HStack, Text } from "@chakra-ui/react";
import Head from "next/head";
import CenterInfo from "../components/centerInfo";
import { Error404dSvg } from "../components/svg/404";
import GetLayoutWeb from "../layouts/layoutWeb";


Custom404.getLayout = GetLayoutWeb


export default function Custom404() {

    const text404 = "404. We can't find this page"

    return (
        <>
            <Head>
                <title>404 lupax.</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <CenterInfo svg={<Error404dSvg />}>
                <HStack spacing="1" justify="center">
                    <Text fontSize='2xl' color="muted" mt={10}>{text404}</Text>
                </HStack>
            </CenterInfo>
        </>

    )


}