import { Avatar, AvatarGroup, Box, Flex, Skeleton, Text } from "@chakra-ui/react"
import { useTeam } from "../../services/teams.service"
import { User } from '../../interfaces';


export function AvatarGroupTeam({ team_id, max_items, name_team }: { team_id: string, max_items: number, name_team?: boolean }) {

    const { team, isLoading, isError } = useTeam(team_id)

    return (
        <>
            {isLoading &&
                <Skeleton height='100px' />
            }
            {!isLoading && !isError &&
                <Flex align={'center'}>
                    <AvatarGroup size='md' max={max_items}>
                        {team.users.map((user: User) => <Avatar key={user.id} name={user.name} src={user.profile_picture} />)}
                    </AvatarGroup>
                    {name_team &&
                        <Box ml='3'>
                            <Text fontWeight='bold'>{team.name.toUpperCase()}</Text>
                        </Box>
                    }
                </Flex>
            }
        </>
    )

}