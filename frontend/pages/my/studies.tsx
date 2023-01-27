import React from "react";
import Main from "../../components/main";
import FailedToLoad from '../../components/failedToLoad';
import CreateStudie from "../../components/createStudieDrawer";
import BarPage from "../../components/barPage";
import NextLink from "next/link";
import CenterInfo from "../../components/centerInfo";
import Loading from "../../components/loading";
import { AvatarGroupTeam } from "../../components/mini/avatarGroupTeam";
import { CardCreate } from "../../components/card";
import { capitalizeFirstLetter } from '../../services/util.service';
import { getLayoutDashboard } from '../../layouts/layoutDashboard';
import { useStudies } from "../../services/studies.service";
import { StudieBasic, User } from "../../interfaces";
import { StudieSvg } from "../../components/svg/studie";

import {
    Divider,
    Flex,
    Heading,
    HStack,
    Tag,
    VStack,
    Button,
    LinkBox,
    LinkOverlay,
    Text,
    Box,
    Wrap,
    WrapItem,
} from '@chakra-ui/react'


Studies.getLayout = getLayoutDashboard


export default function Studies() {

    const { studies, isLoading, isError } = useStudies();

    if (isError) return FailedToLoad("Error loading content, refresh page.")
    if (isLoading) return (<Loading />)

    if (studies.length == 0) {
        return (
            <Main>
                <BarPage title="Studies" />
                <CenterInfo svg={<StudieSvg />}>
                    <HStack spacing="1" justify="center" alignItems={'baseline'} >
                        <CreateStudie>
                            <Button size='lg' variant="link" colorScheme="green">
                                Create a study
                            </Button>
                        </CreateStudie>
                        <Text fontSize='xl' color="muted">and start measuring the usability of your sites easily.</Text>
                    </HStack>
                </CenterInfo>
            </Main>
        )
    }


    return (
        <Main>
            <BarPage title="All studies" />
            <Wrap spacing='40px'>
                <WrapItem key={'create'}>
                    <CreateStudie>
                        <CardCreate text={'Create study'} props={{ width: "400px" }} />
                    </CreateStudie>
                </WrapItem>
                {studies.map((studie: StudieBasic) =>
                    <WrapItem key={studie.id}>
                        <LinkBox as='article' minWidth={'400px'} maxWidth={'400px'}>
                            <NextLink href={`/my/studies/${studie.id}/overview`} passHref>
                                <LinkOverlay>
                                    <Box
                                        bg={'white'}
                                        boxShadow={'2xl'}
                                        rounded={'md'}
                                        p={6}
                                        height='230px'
                                        overflow={'hidden'}>
                                        <Flex
                                            direction={'column'}
                                            justifyContent={'space-between'}
                                            height={'100%'}>
                                            <VStack
                                                align='stretch'
                                                spacing={3}>
                                                <Heading
                                                    color={'gray.700'}
                                                    fontSize={'2xl'}
                                                    fontFamily={'body'}
                                                    noOfLines={1}>
                                                    {capitalizeFirstLetter(studie.private_studie_title)}
                                                </Heading>
                                                <Divider />
                                                <HStack spacing={2}>
                                                    {studie.is_published &&
                                                        <Tag colorScheme='green' width={'max-content'}>Published</Tag>
                                                    }
                                                    {studie.participants == studie.audience_max &&
                                                        <Tag colorScheme='orange' width={'max-content'}>{studie.participants}/{studie.audience_max} participants</Tag>
                                                    }
                                                    {studie.participants != studie.audience_max &&
                                                        <Tag width={'max-content'}>{studie.participants}/{studie.audience_max} participants</Tag>
                                                    }
                                                </HStack>
                                                {!studie.team_id &&
                                                    <Text color={'gray.500'} noOfLines={4}>
                                                        {capitalizeFirstLetter(studie.studie_description)}
                                                    </Text>
                                                }
                                                {studie.team_id &&
                                                    <Flex direction={'column'} justifyContent={'space-between'}>
                                                        <Text color={'gray.500'} noOfLines={2} mb={2}>
                                                            {capitalizeFirstLetter(studie.studie_description)}
                                                        </Text>
                                                        <AvatarGroupTeam team_id={studie.team_id} max_items={2} name_team={true} />
                                                    </Flex>
                                                }
                                            </VStack>
                                        </Flex>
                                    </Box>
                                </LinkOverlay>
                            </NextLink>
                        </LinkBox>
                    </WrapItem>
                )}
            </Wrap>
        </Main>
    );
}
