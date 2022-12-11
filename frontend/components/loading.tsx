import { Button, Center, Flex } from "@chakra-ui/react";

export default function Loading() {

    return (
        <>
            <Center>
                <Flex position={'absolute'} top={'20%'}>
                    <Button isLoading size='lg' colorScheme='yellow' variant='link' loadingText='Loading' />
                </Flex>
            </Center>
        </>
    )

}