import Head from 'next/head';
import {
    Box,
    Flex,
    Button,
    Heading,
    useColorModeValue,
    Stack,
    useColorMode,
    Badge,
    Tooltip
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { capitalizeFirstLetter } from '../../services/util.service';


type studie = {
    name: string
    preview: boolean
    progress: number
}


function NavbarPublicTask(props: studie) {

    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <>
            <Head>
                <title>
                    {capitalizeFirstLetter(props.name)}
                </title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Box px={7} bg={useColorModeValue('gray.100', 'gray.900')}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'} cursor={'default'}>
                    <Heading as='h2' size='xl'>
                        {capitalizeFirstLetter(props.name)}
                        <Badge ml={4} colorScheme='green'>{props.progress * 100}% completed</Badge>
                        {props.preview &&
                            <Tooltip label="Results will not be saved" aria-label='Preview help'>
                                <Badge ml={4} colorScheme='yellow' cursor={'help'}>preview</Badge>
                            </Tooltip>
                        }
                    </Heading>
                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={7}>
                            <Button onClick={toggleColorMode}>
                                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            </Button>
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </>
    );
}


export default NavbarPublicTask;