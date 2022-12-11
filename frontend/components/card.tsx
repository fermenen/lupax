import { ReactNode, ReactText } from "react";
import { IconType } from "react-icons";
import { DragHandleIcon, AddIcon } from '@chakra-ui/icons'
import { SortableHandle } from 'react-sortable-hoc';
import { capitalizeFirstLetter } from "../services/util.service";

import {
    Box,
    BoxProps,
    useColorModeValue,
    Flex,
    Heading,
    Text,
    Icon,
    Divider,
    Stack,
    Spacer,
    CloseButton,
    Container,
    Tooltip,
} from "@chakra-ui/react";



type cardType = {
    children: ReactNode,
    props?: BoxProps
}

type cardTypeSimple = {
    title?: string,
    caption?: string,
    divider?: boolean,
    children: ReactNode,
    props?: BoxProps
}

type cardTypeIcon = {
    title?: string,
    caption?: string,
    icon: IconType,
    children: ReactNode,
    props?: BoxProps
}

type cardTypeDrag = {
    title?: string,
    children: ReactNode,
    actions?: ReactNode,
    props?: BoxProps
}


export function Card({ children, props }: cardType) {

    const bg = useColorModeValue('white', 'gray.900');

    return (
        <Box
            p={6}
            bg={bg}
            rounded={'md'}
            boxShadow={'1xl'}
            {...props}>
            {children}
        </Box>
    )
}


export function CardSimple({ title, caption, divider, children, props }: cardTypeSimple) {

    return (
        <Card {...props}>
            <Flex align={"baseline"} direction={'column'} mb={4}>
                <Heading as='h3' size='lg'>{title}</Heading>
                {caption && <Text fontSize='sm' color='gray.500' mt={2}>{caption}</Text>}
                {divider && <Divider mt={3} />}
            </Flex>
            <Box>
                {children}
            </Box>
        </Card>
    )

}



const DragHandle = SortableHandle(() => <Box alignSelf={'center'} cursor={'n-resize'} mr="4"><DragHandleIcon/></Box>);

export function CardDrag({ title, children, actions, props }: cardTypeDrag) {

    return (
        <Card {...props}>
            <Flex align={'stretch'}>
                <DragHandle />
                <Box >
                    <Heading as='h3' size='lg' mb={3}>{title}</Heading>
                    {children}
                </Box>
                <Spacer></Spacer>
                <Stack direction='column' spacing={2}>
                    {actions}
                </Stack>
            </Flex>
        </Card>
    )
}

export function CardIcon({ title, caption, children, icon, props }: cardTypeIcon) {

    return (
        <Card {...props}>
            <Flex align={"baseline"} direction={'column'} mb={4}>
                <Flex alignItems={'inherit'}>
                    <Icon mr="4" fontSize="18" as={icon} />
                    <Flex direction={'column'}>
                        <Heading as='h3' size='lg'>{title}</Heading>
                        {caption && <Text fontSize='sm' color='gray.500' mt={2}>{caption}</Text>}
                    </Flex>
                </Flex>
            </Flex>
            <Box ml={9}>
                {children}
            </Box>
        </Card>
    )

}

export function CardCreate({ text, props }: { text: ReactText, props?: BoxProps }) {

    const bg = useColorModeValue('brand.100', 'gray.900');

    return (
        <Box
            cursor="pointer"
            height={'100%'}
            width={'100%'}
            _hover={{
                bg: 'green.600',
                color: 'white',
            }}
            p={6}
            bg={bg}
            borderWidth='2px'
            borderColor={'green.600'}
            rounded={'md'}
            boxShadow={'1xl'}
            color={'green.600'}
            {...props}>
            <Flex
                height={'100%'}
                justifyContent={'center'}
                alignItems={'center'}>
                <Text fontSize='lg'><AddIcon boxSize={4} mr={2} />{text}</Text>
            </Flex>
        </Box>
    )
}

export function CardNotification({ text, date, fun, props }: { text: string, date: string, fun: Function, props?: BoxProps }) {

    return (
        <Container maxW='950px'>
            <Card {...props}>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <Stack direction={['column', 'row']} alignItems={'baseline'}>
                        <Text fontSize='md' minW={'fit-content'} color='gray.500' mr={4}>{capitalizeFirstLetter(date)}</Text>
                        <Text fontSize='lg'>{capitalizeFirstLetter(text)}</Text>
                    </Stack>
                    <Box ml={3}>
                        <Tooltip hasArrow label='Mark notification as seen' bg='gray.300' color='black'>
                            <CloseButton onClick={() => { fun() }} size='md' />
                        </Tooltip>
                    </Box>
                </Flex>
            </Card>
        </Container>
    )
}
