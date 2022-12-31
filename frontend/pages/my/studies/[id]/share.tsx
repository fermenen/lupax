import BarStudie from '../../../../components/barStudie';
import Main from '../../../../components/main';
import FailedToLoad from '../../../../components/failedToLoad';
import { CardSimple } from '../../../../components/card';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useStudie } from '../../../../services/studies.service';
import { getLayoutDashboard } from '../../../../layouts/layoutDashboard';
import { successAlert } from '../../../../services/alert.service';
import { FaWhatsapp } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';

import {
    Button,
    ButtonGroup,
    Flex,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Tooltip,
    Code,
    Alert,
    AlertIcon,
    VStack,
    Stack,
    Skeleton
} from '@chakra-ui/react';


Share.getLayout = getLayoutDashboard

export default function Share() {

    const router = useRouter();
    const { id } = router.query;
    const { studie, isLoading, isError } = useStudie(id)

    const url_public = `${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}/p/${id}`;
    const message_share = `hi! Could you take a moment and do this study -> ${url_public}`
    const url_whatsapp = `https://wa.me/?text=${message_share}`
    const url_mail = `mailto:?subject=Study of lupax for you?&body=${message_share}`
    const url_documentation = `${process.env.NEXT_PUBLIC_URL_BASE_API}/documentation#/`;
    const url_api_embed = `${process.env.NEXT_PUBLIC_URL_BASE_API}/available/${id}`;
    const [copy, setCopy] = useState(false)
    const handleClick = () => {
        setCopy(!copy)
        if (!copy) {
            navigator.clipboard.writeText(url_public);
            successAlert('', 'Link copied');
        }
    }

    if (isError) return FailedToLoad("Error loading content, refresh page.")

    return (
        <>
            <BarStudie />
            <Main>
                {isLoading &&
                    <Stack spacing={6}>
                        <Skeleton height='150px' />
                        <Skeleton height='150px' />
                    </Stack>
                }
                {!isLoading &&
                    <>
                        <Alert status='warning' mb={4} hidden={studie.is_published}>
                            <AlertIcon />
                            You need to publish your lupax study before you can share it.
                        </Alert>
                        <VStack
                            spacing={5}
                            align='stretch'>
                            <CardSimple title="Share your lupax study" caption="Get the link or share on social.">
                                <InputGroup size='md' maxW={570}>
                                    <Input value={url_public} />
                                    <InputRightElement width='5rem' mr={2}>
                                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                                            {copy ? 'Copied!' : 'Copy link'}
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                <ButtonGroup mt={4} ml={2}>
                                    <Tooltip hasArrow label='Share on whatsapp' bg='gray.300' color='black' placement='bottom-start'>
                                        <Link href={url_whatsapp} isExternal>
                                            <IconButton aria-label='Share on whatsapp' icon={<Icon as={FaWhatsapp} />} />
                                        </Link>
                                    </Tooltip>
                                    <Tooltip hasArrow label='Mail' bg='gray.300' color='black' placement='bottom-start'>
                                        <Link href={url_mail} isExternal>
                                            <IconButton aria-label='Mail' icon={<Icon as={FiMail} />} />
                                        </Link>
                                    </Tooltip>
                                </ButtonGroup>
                            </CardSimple>
                            <CardSimple title="Embed in a web page" caption="For the devs out there. Embed your lupax study into your website or app using our API."
                                props={{ mt: '7' }}>
                                <Flex direction={'column'}>
                                    <Code maxW={'max-content'}>curl -L -X GET {url_api_embed}</Code>
                                    <Link href={url_documentation} isExternal mt={2} maxW={'max-content'}>Check all the documentation</Link>
                                    <Code mt={5} maxW={'max-content'}>&lt;a href={url_public}&gt;Take this study&lt;/a&gt;</Code>
                                </Flex>
                            </CardSimple>
                        </VStack>
                    </>
                }
            </Main>
        </>
    )

}
