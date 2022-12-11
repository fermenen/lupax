import { Center, Flex } from "@chakra-ui/react";
import { ReactElement } from "react";


export default function CenterInfo({ svg, children }: { svg: ReactElement, children: ReactElement }) {


    return (
        <>
            <Center mt={20}>
                <Flex direction={'column'} alignItems={'center'}>
                    <svg height={270}>{svg}</svg>
                    <Flex mt={5}>
                        {children}
                    </Flex>
                </Flex>
            </Center>
        </>
    )

}