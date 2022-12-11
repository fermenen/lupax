import Head from 'next/head';
import { Box, Heading, Text } from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';


export default function InfoScreen() {

    return (
        <>
            <Head>
                <title>The study is closed</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <Box textAlign="center" py={40} px={6}>
                <WarningTwoIcon boxSize={'50px'} color={'orange.300'} />
                <Heading as="h2" size="xl" mt={6} mb={2}>
                    {"Ah-ha! You’ve unlocked their secret..."}
                </Heading>
                <Text color={'gray.500'}>
                    {"The lupax study you're trying to access is currently closed. Please tell the owner (or whoever gave you the link) so they can fix it. Or if you're the owner, you can log in."}
                </Text>
            </Box>
        </>
    )

}