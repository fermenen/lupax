import GetLayoutWeb from "../layouts/layoutWeb";
import Link from 'next/link';

import {
    LinkOverlay,
    LinkBox,
    useColorModeValue,
    Button,
    Stack,
    Image,
    Text,
    Icon,
    Container,
    SimpleGrid,
    Flex,
    Heading,
    StackDivider,
} from "@chakra-ui/react";


Consulting.getLayout = GetLayoutWeb


export default function Consulting() {

    const url_typeform = 'https://94i7huh2y98.typeform.com/to/XhVfjTHU';

    return (
        <Container maxW={'5xl'} py={12}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <Stack spacing={5}>
                    <Heading>Exploring beyond common sense</Heading>
                    <Text color={'gray.500'} fontSize={'lg'}>
                        We are committed to understanding the authentic needs of users at every stage of the process. We create experiences that exceed expectations, from initial research to implementation.
                    </Text>
                    <Text as='b' color={'gray.500'} fontSize={'lg'}>
                        Trust us to take your vision to the next level and delight your users with every interaction.
                    </Text>
                    <LinkBox>
                        <Link href={url_typeform} target="_blank" passHref>
                            <LinkOverlay>
                                <Button
                                    as="a"
                                    data-splitbee-event="Click get book(CTA)"
                                    variant="solid"
                                    colorScheme="orange"
                                    display="inline-flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    w={{ base: "full", sm: "auto" }}
                                    mb={{ base: 2, sm: 0 }}
                                    size="lg"
                                    cursor="pointer">
                                    Book free 30 min consultation
                                    <Icon boxSize={4} ml={1} viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </Icon>
                                </Button>
                            </LinkOverlay>
                        </Link>
                    </LinkBox>
                    <Stack
                        spacing={2}
                        divider={
                            <StackDivider
                                borderColor={useColorModeValue('gray.100', 'gray.700')}
                            />
                        }>
                        <Text fontWeight={600} ml={5}>- UX Research</Text>
                        <Text fontWeight={600} ml={5}>- User experience development</Text>
                        <Text fontWeight={600} ml={5}>- UX & UI Consulting</Text>
                        <Text fontWeight={600} ml={5}>- Testing and focus groups</Text>
                        <Text fontWeight={600} ml={5}>- A/B testing, video analysis</Text>
                        <Text fontWeight={600} ml={5}>- User journey</Text>
                    </Stack>
                </Stack>
                <Flex>
                    <Image
                        w="full"
                        rounded={'md'}
                        alt={'ux process'}
                        src={'/ux-procces.jpg'}
                        objectFit={'cover'}
                    />
                </Flex>
            </SimpleGrid>
        </Container>
    )
}
