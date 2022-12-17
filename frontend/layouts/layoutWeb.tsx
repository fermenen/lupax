import Head from 'next/head';
import NextLink from "next/link";
import React, { ReactNode } from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { ChevronDownIcon, CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { FiHome } from 'react-icons/fi';
import { Logo } from '../components/svg/logo';
import { useUserLogin } from '../services/users.service';
import type { ReactElement } from 'react';

import {
    ChakraProvider,
    Box,
    useColorModeValue,
    Text,
    VisuallyHidden,
    Container,
    SimpleGrid,
    Stack,
    chakra,
    Button,
    Collapse,
    Flex,
    Icon,
    IconButton,
    LinkBox,
    LinkOverlay,
    Show,
    useDisclosure,
    Link
} from '@chakra-ui/react';



export default function GetLayoutWeb(page: ReactElement) {

    const heightFooter = '15rem'

    return (
        <ChakraProvider>
            <Box
                pos="relative"
                minH="100vh"
                bg={useColorModeValue('gray.50', 'gray.800')}>
                <Head>
                    <title>lupax.</title>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <NavbarWeb/>
                <Box
                    as="main"
                    paddingBottom={heightFooter}>
                    {page}
                </Box>
                <FooterWeb />
            </Box>
        </ChakraProvider>
    )

    function NavbarWeb() {
        const { isOpen, onToggle } = useDisclosure();
        const { isLogin, siteRedirect } = useUserLogin();

        return (
            <Box as="header">
                <Flex
                    bg={useColorModeValue('white', 'gray.800')}
                    color={useColorModeValue('gray.600', 'white')}
                    minH={'60px'}
                    py={{ base: 2 }}
                    px={{ base: 4, md: 10 }}
                    borderBottom={1}
                    borderStyle={'solid'}
                    borderColor={useColorModeValue('gray.200', 'gray.900')}
                    align={'center'}>
                    <Flex
                        flex={{ base: 1, md: 'auto' }}
                        ml={{ base: -2 }}
                        display={{ base: 'flex', md: 'none' }}>
                        <IconButton
                            onClick={onToggle}
                            icon={
                                isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
                            }
                            variant={'ghost'}
                            aria-label={'Toggle Navigation'}
                        />
                    </Flex>
                    <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                        <NextLink href='/' passHref>
                            <Link><Logo /></Link>
                        </NextLink>
                        <Flex display={{ base: 'none', md: 'flex' }} ml={16}>
                            <DesktopNav />
                        </Flex>
                    </Flex>
                    {!isLogin &&
                        <Stack
                            flex={{ base: 1, md: 0 }}
                            justify={'flex-end'}
                            spacing={6}
                            direction={'row'}>
                            <Show above='sm'>
                                <NextLink href='/auth/login' passHref>
                                    <Button
                                        as={'a'}
                                        fontSize={'md'}
                                        fontWeight={400}
                                        variant={'link'}>
                                        Sign In
                                    </Button>
                                </NextLink>
                            </Show>
                            <LinkBox>
                                <NextLink href='/auth/register' passHref>
                                    <LinkOverlay>
                                        <Button colorScheme={'orange'}>Sign Up</Button>
                                    </LinkOverlay>
                                </NextLink>
                            </LinkBox>
                        </Stack>
                    }
                    {isLogin &&
                        <Stack
                            flex={{ base: 1, md: 0 }}
                            justify={'flex-end'}
                            direction={'row'}>
                            <LinkBox>
                                <NextLink href={siteRedirect} passHref>
                                    <LinkOverlay>
                                        <Button colorScheme={'orange'} leftIcon={<Icon as={FiHome} boxSize={4} />}>Dashboard</Button>
                                    </LinkOverlay>
                                </NextLink>
                            </LinkBox>
                        </Stack>
                    }
                </Flex>
                <Collapse in={isOpen} animateOpacity>
                    <MobileNav />
                </Collapse>
            </Box>
        )
    }

    function FooterWeb() {
        return (
            <Box
                bg={useColorModeValue('gray.50', 'gray.900')}
                color={useColorModeValue('gray.700', 'gray.200')}
                as="footer"
                pos="absolute"
                bottom="0"
                width="100%"
                height={heightFooter}>
                <Container as={Stack} maxW={'6xl'} py={10}>
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
                        <Stack align={'flex-start'}>
                            <ListHeader>Support</ListHeader>
                            <Link href={'https://status.lupax.app/'}>Status</Link>
                            <Link href={'mailto:hello@lupax.app'}>hello@lupax.app</Link>
                        </Stack>
                        <Stack align={'flex-start'}>
                            <ListHeader>Legal</ListHeader>
                            <Link href={'/privacy'}>Privacy Policy</Link>
                        </Stack>
                        <Stack align={'flex-start'}>
                            <ListHeader>Developers</ListHeader>
                            <Link href={`${process.env.NEXT_PUBLIC_URL_BASE_API}/documentation/`}>API References</Link>
                        </Stack>
                    </SimpleGrid>
                </Container>
                <Box
                    borderTopWidth={1}
                    borderStyle={'solid'}
                    bg={useColorModeValue('gray.100', 'gray.900')}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}>
                    <Container
                        as={Stack}
                        maxW={'6xl'}
                        py={4}
                        direction={{ base: 'column', md: 'row' }}
                        spacing={4}
                        justify={{ md: 'space-between' }}
                        align={{ md: 'center' }}>
                        <Text >
                            &copy; {new Date().getFullYear()} lupax. All rights reserved.
                        </Text>
                        <Stack direction={'row'} spacing={6}>
                            <SocialButton label={'GitHub'} href={'https://github.com/fermenen/lupax'}>
                                <FaGithub />
                            </SocialButton>
                            <SocialButton label={'Twitter'} href={'https://www.twitter.com/lupax_app/'}>
                                <FaTwitter />
                            </SocialButton>
                            <SocialButton label={'LinkedIn'} href={'https://www.linkedin.com/company/lupax-app/'}>
                                <FaLinkedin />
                            </SocialButton>
                        </Stack>
                    </Container>
                </Box>
            </Box>
        )
    }

}

const ListHeader = ({ children }: { children: ReactNode }) => {
    return (
        <Text fontWeight={'bold'} fontSize={'lg'} mb={2}>
            {children}
        </Text>
    );
};

const SocialButton = ({
    children,
    label,
    href,
}: {
    children: ReactNode;
    label: string;
    href: string;
}) => {
    return (
        <chakra.button
            bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
            rounded={'full'}
            w={8}
            h={8}
            cursor={'pointer'}
            as={'a'}
            href={href}
            display={'inline-flex'}
            alignItems={'center'}
            justifyContent={'center'}
            transition={'background 0.3s ease'}
            _hover={{
                bg: useColorModeValue('blackAlpha.300', 'whiteAlpha.200'),
            }}>
            <VisuallyHidden>{label}</VisuallyHidden>
            {children}
        </chakra.button>
    );
};

const NAV_ITEMS: Array<NavItem> = [
    {
        label: 'Features',
        href: '/features',
    },
    {
        label: 'Pricing',
        href: '/pricing',
    },
];

const DesktopNav = () => {

    return (
        <Stack direction={'row'} spacing={5}>
            {NAV_ITEMS.map((navItem) => (
                <NextLink  key={navItem.label} href={navItem.href ?? '#'} passHref>
                    <Button
                        as={'a'}
                        fontSize={'lg'}
                        fontWeight={500}
                        variant={'link'}>
                        {navItem.label}
                    </Button>
                </NextLink>
            ))}
        </Stack>
    );
};


const MobileNav = () => {
    return (
        <Stack
            bg={useColorModeValue('white', 'gray.800')}
            p={4}
            display={{ md: 'none' }}>
            {NAV_ITEMS.map((navItem) => (
                <MobileNavItem key={navItem.label} {...navItem} />
            ))}
        </Stack>
    );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Stack spacing={4} onClick={children && onToggle}>
            <Flex
                py={2}
                as={Link}
                href={href ?? '#'}
                justify={'space-between'}
                align={'center'}
                _hover={{
                    textDecoration: 'none',
                }}>
                <Text
                    fontWeight={600}
                    color={useColorModeValue('gray.600', 'gray.200')}>
                    {label}
                </Text>
                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        transition={'all .25s ease-in-out'}
                        transform={isOpen ? 'rotate(180deg)' : ''}
                        w={6}
                        h={6}
                    />
                )}
            </Flex>

            <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
                <Stack
                    mt={2}
                    pl={4}
                    borderLeft={1}
                    borderStyle={'solid'}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    align={'start'}>
                    {children &&
                        children.map((child) => (
                            <Link key={child.label} py={2} href={child.href}>
                                {child.label}
                            </Link>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    );
};

interface NavItem {
    label: string;
    subLabel?: string;
    children?: Array<NavItem>;
    href?: string;
}

