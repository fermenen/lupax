import FailedToLoad from '../../../../components/failedToLoad';
import BarStudie from '../../../../components/barStudie';
import Main from '../../../../components/main';
import { CardSimple } from '../../../../components/card';
import { useTeam } from '../../../../services/teams.service';
import { AvatarGroupTeam } from '../../../../components/mini/avatarGroupTeam';
import { capitalizeFirstLetter } from '../../../../services/util.service';
import { useRouter } from 'next/router';
import { getLayoutDashboard } from '../../../../layouts/layoutDashboard';
import { useStudie } from '../../../../services/studies.service';
import { format } from 'date-fns';

import {
    VStack,
    Text,
    Tag,
    HStack,
    List,
    ListItem,
    Skeleton,
} from '@chakra-ui/react';


Overview.getLayout = getLayoutDashboard

export default function Overview() {

    const router = useRouter();
    const { id } = router.query;
    const { studie, isLoading, isError } = useStudie(id)

    if (isError) return FailedToLoad("Error loading content, refresh page.")

    return (
        <>
            <BarStudie />
            <Main>
                {isLoading &&
                    <Skeleton height='120px' />
                }
                {!isLoading &&
                    <VStack spacing={6} align={'stretch'}>
                        <CardSimple title={capitalizeFirstLetter(studie.private_studie_title)} caption={capitalizeFirstLetter(studie.studie_description)} divider={true}>
                            <VStack align='stretch' spacing={5}>
                                <HStack spacing={3} cursor={'default'}>
                                    <Tag>{format(new Date(studie.time_created), "dd/MM/yy")}</Tag>
                                    {studie.is_published &&
                                        <Tag colorScheme='green' width={'max-content'}>Published</Tag>
                                    }
                                </HStack>
                                <List spacing={2}>
                                    <ListItem>
                                        {studie.participants} of {studie.audience_max} participants completed your study.
                                    </ListItem>
                                    <ListItem>
                                        <Text as={'span'} fontWeight={'bold'}>
                                            Public name:
                                        </Text>{' '}
                                        {capitalizeFirstLetter(studie.public_studie_title)}
                                    </ListItem>
                                </List>
                            </VStack>
                        </CardSimple>
                        {studie.team_id &&
                            <TeamInfo></TeamInfo>
                        }
                    </VStack>
                }
            </Main>
        </>
    )


    function TeamInfo() {

        const { team, isLoading: isLoadingTeams, isError: isErrorTeams } = useTeam(studie.team_id);

        return (
            <>
                {!isLoadingTeams && !isErrorTeams &&
                    <CardSimple caption={`The study is added to the team '${team.name.toUpperCase()}'`} >
                        <AvatarGroupTeam team_id={team.id} max_items={10}/>
                    </CardSimple>
                }
            </>
        )
    }

}
