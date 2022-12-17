import FailedToLoad from '../../components/failedToLoad';
import Main from '../../components/main';
import BarPage from '../../components/barPage';
import { CardIcon } from '../../components/card';
import { getLayoutDashboard } from '../../layouts/layoutDashboard';
import { useUser } from '../../services/users.service';
import { ChangeEvent } from 'react';
import { errorAlert } from '../../services/alert.service';
import { DeleteIcon } from '@chakra-ui/icons';
import { User } from '../../interfaces';

import {
    VStack,
    Text,
    Avatar,
    Flex,
    Box,
    FormControl,
    FormLabel,
    Switch,
    Skeleton,
    Select,
    Divider,
    Button
} from '@chakra-ui/react';

import {
    FiUser,
    FiSettings,
    FiBell,
} from 'react-icons/fi';



Settings.getLayout = getLayoutDashboard

export default function Settings() {

    const { user, isLoading, isError, mutate } = useUser();

    if (isError) return FailedToLoad("failed to load")

    return (
        <Main>
            <BarPage title="Settings" />
            <VStack
                spacing={5}
                align='stretch'>
                {isLoading &&
                    <>
                        <Skeleton height='120px' />
                        <Skeleton height='120px' />
                        <Skeleton height='120px' />
                    </>
                }
                {!isLoading &&
                    <>
                        <CardAccount user={user} />
                        <Preferences />
                        <Notifications user={user} mutate={mutate} />
                    </>
                }
            </VStack>
        </Main>
    )

}


function CardAccount({ user }: { user: User }) {

    return (
        <CardIcon title={'Account'} icon={FiUser}>
            <>
                <Flex>
                    <Avatar name={user.name} src={user.profile_picture} />
                    <Box ml='3'>
                        <Text fontWeight='bold'>
                            {user.name} {user.last_name}
                        </Text>
                        <Text fontSize='sm'>{user.email}</Text>
                    </Box>
                </Flex>
                <Divider mt={5} mb={5} />
                <Button leftIcon={<DeleteIcon />} colorScheme='red' variant='solid' size='sm'>
                    Delete account
                </Button>
            </>
        </CardIcon>
    )
}

function Preferences() {

    return (
        <CardIcon title={'Preferences'} icon={FiSettings}>
            <FormControl>
                <Box maxW='sm'>
                    <FormLabel htmlFor='language'>Language</FormLabel>
                    <Select>
                        <option value='english-int'>English (int)</option>
                    </Select>
                </Box>

            </FormControl>
        </CardIcon>
    )
}


function Notifications({ user, mutate }: { user: User, mutate: Function }) {

    const handleditPreferences = (preference: string, value: boolean) => {

        const url_api_me_preferences = `${process.env.NEXT_PUBLIC_URL_BASE_API}/me/preferences/`

        const data = {
            [preference]: value
        }

        fetch(url_api_me_preferences, {
            method: 'PATCH',
            headers: { "content-type": "application/json" },
            body: JSON.stringify(data)
        }).then(function (res) {
            if (!res.ok) throw Error(res.statusText);
            return res;
        }).then(function (data) {
            mutate();
        }).catch(error => {
            errorAlert("Modify alerts error", error.toString());
        })
    };

    return (
        <CardIcon title={'Notifications'} icon={FiBell}>
            <VStack spacing={4} align={'stretch'}>
                <FormControl display='flex' alignItems='center'>
                    <FormLabel htmlFor='team_alerts' mb='0'>
                        Team alerts?
                    </FormLabel>
                    <Switch
                        id='team_alerts'
                        isChecked={user.preferences.team_alerts}
                        colorScheme={'green'}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            var actual_selected = (event.currentTarget.value.toLowerCase() === 'true');
                            handleditPreferences('team_alerts', !actual_selected)
                        }}
                    />
                </FormControl>
            </VStack>
        </CardIcon>
    )
}