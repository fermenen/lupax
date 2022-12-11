import NextLink from "next/link";
import splitbee from '@splitbee/web';
import FailedToLoad from '../components/failedToLoad';
import Confetti from 'react-confetti';
import { ReactText, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { ViewIcon } from '@chakra-ui/icons';
import { capitalizeFirstLetter } from '../services/util.service';
import { useRouter } from 'next/router';
import { useSWRConfig } from 'swr';
import { errorAlert, successAlert } from "../services/alert.service";
import { useStudie } from "../services/studies.service";

import {
    Button,
    ButtonGroup,
    Flex,
    Heading,
    Icon,
    SimpleGrid,
    IconButton,
    Tooltip,
    Link,
    Text,
    Box,
    Show
} from "@chakra-ui/react";


interface ButtonStudieBarType {
    pathname: string;
    id_studie: string;
    name: ReactText;
    count?: number;
}


function BarStudie() {


    const router = useRouter();
    const { id } = router.query;
    const { studie, isLoading, isError } = useStudie(id);
    const { mutate } = useSWRConfig();
    const [isConfeti, setIsConfeti] = useState(false);

    function ButtonStudieBar({ pathname, id_studie, name, count }: ButtonStudieBarType) {
        const router = useRouter()
        const hrefIs = router.asPath
        const hrefDestination = `/my/studies/${encodeURIComponent(id_studie)}/${pathname}`
        let sameHref = false
        if (hrefIs.includes(hrefDestination)) sameHref = true
        return (
            <NextLink href={hrefDestination} replace>
                <Button
                    isActive={sameHref}
                    variant='ghost'
                    colorScheme='teal'
                    color='green.700'
                    _hover={{
                        bg: 'green.100'
                    }}
                    _active={{
                        bg: 'green.700',
                        color: 'white'
                    }}>
                    {name}
                    {Number(count) >= 0 &&
                        <Text ml={1}>({count})</Text>
                    }
                </Button>
            </NextLink>
        )
    }

    const handlePublishStudie = (id_studie: string) => {

        const url_api_studie_detail = `${process.env.NEXT_PUBLIC_URL_BASE_API}/studies/${id_studie}/`;
        const url_api_publish = `${process.env.NEXT_PUBLIC_URL_BASE_API}/publish/${id_studie}/`;

        fetch(url_api_publish, {
            method: 'PATCH',
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ is_published: true })
        }).then(function (res) {
            if (!res.ok) throw Error(res.statusText);
            return res;
        }).then(function (data) {
            mutate(url_api_studie_detail)
            successAlert("", "Studie published successfully")
            splitbee.track("Studie published");
            setIsConfeti(true)
        }).catch(error => {
            errorAlert("Studie published error", error.toString());
        }).finally(() => {

        })

    };

    if (isError) return FailedToLoad("failed to load")

    return (
        <>
            <SimpleGrid
                columns={{ sm: 1, md: 3 }}
                p={3}
                alignItems={'center'}
                bg={'gray.200'}
                borderBottom={'1px'}
                borderColor={'gray.200'}>
                {!isLoading &&
                    <>
                        <Show above='md'>
                            <Heading as='h4' size='md' p={1} width={'75%'} isTruncated>
                                {capitalizeFirstLetter(studie.private_studie_title)}
                            </Heading>
                        </Show>
                        <SimpleGrid columns={{ sm: 1, md: 4 }} spacing='1' maxWidth={'450px'}>
                            <ButtonStudieBar pathname='overview' id_studie={studie.id} name='Overview' />
                            <ButtonStudieBar pathname='create' id_studie={studie.id} name='Create' count={studie.number_tasks} />
                            <ButtonStudieBar pathname='share' id_studie={studie.id} name='Share' />
                            <ButtonStudieBar pathname='results' id_studie={studie.id} name='Results' count={studie.participants} />
                        </SimpleGrid>
                        <Show above='md'>
                            <Flex justifyContent={'flex-end'}>
                                <ButtonGroup colorScheme='teal' variant='outline' spacing='2'>
                                    <Tooltip hasArrow label='Preview mode' bg='gray.300' color='black'>
                                        <Link href={`/p/preview/${studie.id}`} isExternal>
                                            <IconButton aria-label='Preview mode' icon={<ViewIcon />} />
                                        </Link>
                                    </Tooltip>
                                    <Tooltip hasArrow label='Make your changes visible to the world!' bg='gray.300' color='black' placement='bottom-start'>
                                        <Button
                                            onClick={() => { handlePublishStudie(studie.id) }}
                                            isDisabled={studie.is_published}
                                            leftIcon={<Icon as={FiUploadCloud} />}>
                                            {studie.is_published
                                                && 'Published'}
                                            {!studie.is_published
                                                && 'Publish'}
                                        </Button>
                                    </Tooltip>
                                </ButtonGroup>
                            </Flex>
                        </Show>
                    </>
                }
                <Confetti run={isConfeti} recycle={false} />
            </SimpleGrid>
        </>
    )

}

export default BarStudie;

