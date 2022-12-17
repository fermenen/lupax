import GetLayoutWeb from "../layouts/layoutWeb";
import { ReactElement, useEffect } from 'react';
import { useUserLogin } from "../services/users.service";
import { useRouter } from "next/router";

import {
    Container,
    SimpleGrid,
    Image,
    Flex,
    Heading,
    Text,
    Stack,
    StackDivider,
    Icon,
    useColorModeValue,
} from '@chakra-ui/react';
import {
    IoAnalyticsSharp,
    IoPeopleSharp,
    IoRadioButtonOnSharp,
    IoRocketSharp
} from 'react-icons/io5';




Features.getLayout = GetLayoutWeb


interface FeatureProps {
    text: string;
    iconBg: string;
    icon?: ReactElement;
}

const Feature = ({ text, icon, iconBg }: FeatureProps) => {
    return (
        <Stack direction={'row'} align={'center'}>
            <Flex
                w={8}
                h={8}
                align={'center'}
                justify={'center'}
                rounded={'full'}
                bg={iconBg}
                mr={2}>
                {icon}
            </Flex>
            <Text fontWeight={600}>{text}</Text>
        </Stack>
    );
};


export default function Features() {

    const router = useRouter();
    const { isLogin, siteRedirect } = useUserLogin();

    useEffect(() => {
        if (isLogin) router.push(siteRedirect);
    }, [isLogin, router, siteRedirect]);


    return (

        <Container maxW={'5xl'} py={12}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <Stack spacing={5}>
                    <Heading>User experience research software</Heading>
                    <Text color={'gray.500'} fontSize={'lg'}>
                        Empower your team with a UX toolkit to create digital experiences that fall in love users and grow your business.
                    </Text>
                    <Stack
                        spacing={4}
                        divider={
                            <StackDivider
                                borderColor={useColorModeValue('gray.100', 'gray.700')}
                            />
                        }>
                        <Feature
                            icon={
                                <Icon as={IoAnalyticsSharp} color={'yellow.500'} w={5} h={5} />
                            }
                            iconBg={useColorModeValue('yellow.100', 'yellow.900')}
                            text={'Measure user experience'}
                        />
                        <Feature
                            icon={<Icon as={IoPeopleSharp} color={'green.500'} w={5} h={5} />}
                            iconBg={useColorModeValue('green.100', 'green.900')}
                            text={'Collaborate with your team'}
                        />
                        <Feature
                            icon={
                                <Icon as={IoRadioButtonOnSharp} color={'red.500'} w={5} h={5} />
                            }
                            iconBg={useColorModeValue('red.100', 'red.900')}
                            text={'Record user iteration'}
                        />
                        <Feature
                            icon={
                                <Icon as={IoRocketSharp} color={'purple.500'} w={5} h={5} />
                            }
                            iconBg={useColorModeValue('purple.100', 'purple.900')}
                            text={'User-based product decisions'}
                        />

                    </Stack>
                </Stack>
                <Flex>
                    <Image
                        w="full"
                        rounded={'md'}
                        alt={'user experience'}
                        src={
                            'https://images.unsplash.com/flagged/photo-1550946107-8842ae9426db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80'
                        }
                        objectFit={'cover'}
                    />
                </Flex>
            </SimpleGrid>
        </Container>


    )


}