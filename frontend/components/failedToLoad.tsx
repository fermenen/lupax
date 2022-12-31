
import { Error } from '../components/svg/error';

import {
    Container,
    VStack,
    Box,
    Text,
    Link
} from '@chakra-ui/react';

export default function errorToLoad(errorText?: string) {

    return (
        <Container maxW='container.sm'>
            <VStack>
                <Error />
                {errorText &&
                    <Box>
                        <Text fontSize='xl' mt={3}>{errorText}</Text>
                    </Box>
                }
                <Box>
                    <Link href='mailto:support@lupax.app' isExternal>
                        <Text fontSize='md' mt={1}>Contact support if the problem persists</Text>
                    </Link>
                </Box>
            </VStack>
        </Container>
    )
}
