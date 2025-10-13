import React from "react";
import { ReactText } from "react";
import {
    Button,
    Flex,
    Heading,
    SimpleGrid,
    Text,
    Show
} from "@chakra-ui/react";

interface ButtonAdminBarType {
    name: ReactText;
    isActive?: boolean;
    onClick?: () => void;
}

function BarAdmin() {

    function ButtonAdminBar({ name, isActive = false, onClick }: ButtonAdminBarType) {
        return (
            <Button
                isActive={isActive}
                variant='ghost'
                colorScheme='teal'
                color='green.700'
                onClick={onClick}
                _hover={{
                    bg: 'green.100'
                }}
                _active={{
                    bg: 'green.700',
                    color: 'white'
                }}>
                {name}
            </Button>
        )
    }

    return (
        <>
            <SimpleGrid
                columns={{ sm: 1, md: 3 }}
                p={3}
                alignItems={'center'}
                bg={'gray.200'}
                borderBottom={'1px'}
                borderColor={'gray.200'}>
                <Show above='md'>
                    <Heading as='h4' size='md' p={1} width={'75%'} isTruncated>
                        Admin Dashboard
                    </Heading>
                </Show>
                <SimpleGrid columns={{ sm: 1, md: 3 }} spacing='1' maxWidth={'450px'}>
                    <ButtonAdminBar name='Metrics' isActive={true} />
                    <ButtonAdminBar name='Users' />
                    <ButtonAdminBar name='Notifications' />
                </SimpleGrid>
                <Show above='md'>
                    <Flex justifyContent={'flex-end'}>
                        <Text fontSize='sm' color='gray.600'>
                            Admin Panel
                        </Text>
                    </Flex>
                </Show>
            </SimpleGrid>
        </>
    )
}

export default BarAdmin;