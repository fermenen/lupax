import NextLink from "next/link";
import GetLayoutWeb from "../layouts/layoutWeb";
import { ReactNode, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useUserLogin } from "../services/users.service";
import { useRouter } from "next/router";

import {
    Box,
    Stack,
    Heading,
    Text,
    VStack,
    useColorModeValue,
    List,
    ListItem,
    ListIcon,
    Button,
    Flex,
    LinkBox,
    LinkOverlay
} from '@chakra-ui/react';



Pricing.getLayout = GetLayoutWeb


function PriceWrapper({ children }: { children: ReactNode }) {
    return (
        <Box
            mb={4}
            shadow="base"
            borderWidth="1px"
            alignSelf={{ base: 'center', lg: 'flex-start' }}
            borderColor={useColorModeValue('gray.200', 'gray.500')}
            borderRadius={'xl'}>
            {children}
        </Box>
    );
}


export default function Pricing() {

    const router = useRouter();
    const { isLogin, siteRedirect } = useUserLogin();

    useEffect(() => {
        if (isLogin) router.push(siteRedirect);
    }, [isLogin, router, siteRedirect]);


    return (

        <Box py={12}>
            <VStack spacing={2} textAlign="center">
                <Heading as="h1" fontSize="4xl">
                    Simple, right?
                </Heading>
                <Text fontSize="lg" color={'gray.500'}>
                    No credit card needed. No time limit.
                </Text>
            </VStack>
            <Stack
                direction={{ base: 'column', md: 'row' }}
                textAlign="center"
                justify="center"
                spacing={{ base: 4, lg: 10 }}
                py={10}>

                <PriceWrapper>
                    <Box py={4} px={12}>
                        <Flex direction={'column'} alignItems={'flex-start'}>
                            <Text fontSize="3xl" fontWeight="600">
                                Free,
                            </Text>
                            <Text fontSize="3xl" fontWeight="600">
                                unlimited studies
                            </Text>
                        </Flex>
                    </Box>

                    <VStack
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        py={4}
                        borderBottomRadius={'xl'}>
                        <List spacing={3} textAlign="start" px={12}>
                            <ListItem>
                                <ListIcon as={FaCheckCircle} color="green.500" />
                                Unlimited studies
                            </ListItem>
                            <ListItem>
                                <ListIcon as={FaCheckCircle} color="green.500" />
                                Unlimited teams
                            </ListItem>
                            <ListItem>
                                <ListIcon as={FaCheckCircle} color="green.500" />
                                Unlimited participants
                            </ListItem>
                            <ListItem>
                                <ListIcon as={FaCheckCircle} color="green.500" />
                                Screen recording
                            </ListItem>
                        </List>
                        <Box w="80%" pt={7}>
                            <LinkBox>
                                <NextLink href='/auth/register' passHref>
                                    <LinkOverlay>
                                        <Button w="full" colorScheme="orange" variant="outline" data-splitbee-event="Click get started (pricing)">
                                            Get started
                                        </Button>
                                    </LinkOverlay>
                                </NextLink>
                            </LinkBox>
                        </Box>

                    </VStack>
                </PriceWrapper>
            </Stack>
        </Box>

    )

}

