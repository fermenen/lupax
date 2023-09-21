import * as Yup from 'yup';
import FailedToLoad from '../../components/failedToLoad';
import Main from '../../components/main';
import CenterInfo from '../../components/centerInfo';
import BarPage from '../../components/barPage';
import CreateTeam from '../../components/createTeamDrawer';
import { capitalizeFirstLetter } from '../../services/util.service';
import { CardCreate, CardSimple } from '../../components/card';
import { getLayoutDashboard } from '../../layouts/layoutDashboard';
import { useTeams } from '../../services/teams.service';
import { errorAlert, successAlert, infoAlert } from "../../services/alert.service";
import { Formik, Field, Form } from 'formik';
import { useUser } from '../../services/users.service';
import { TeamsType, User } from '../../interfaces';
import { TeamSvg } from '../../components/svg/team';
import { FiUserMinus, FiUserPlus, FiUserX } from 'react-icons/fi';

import {
    Button,
    VStack,
    Text,
    Flex,
    Avatar,
    Badge,
    Box,
    Input,
    HStack,
    Divider,
    FormControl,
    FormErrorMessage,
    Skeleton,
    Icon,
    Tooltip,
    IconButton
} from '@chakra-ui/react';



Team.getLayout = getLayoutDashboard


export function orderUserAdmin(admin: string) {
    return function (user_a: { id: string; }, user_b: { id: string; }) {
        if (user_a.id == admin) { return -1 }
        return 0
    }
}

export default function Team() {

    const { teams, isLoading: isLoadingTeams, isError: isErrorTeams, mutate } = useTeams();
    const { user, isLoading: isLoadingUser, isError: isErrorUser } = useUser();

    const isLoading = isLoadingTeams || isLoadingUser;

    const handleCreateAssociationTeam = (values: any, actions: any) => {
        const url_api_team_association = `${process.env.NEXT_PUBLIC_URL_BASE_API}/teams/association/`;
        const data = {
            user_email: values.user_email,
            team_id: values.team_id
        }
        fetch(url_api_team_association, {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body: JSON.stringify(data)
        }).then(function (res) {
            if (!res.ok) throw Error(res.statusText);
            return res;
        }).then(reponse => reponse.json()).then(data => {
            if (data && data.detail) {
                if (data.detail === 'User already in team') {
                    infoAlert("", "The user is already in the team")
                } else if (data.detail === 'User not found') {
                    infoAlert("", "This user is not registered in lupax")
                }
            } else {
                actions.resetForm({
                    values: {
                        user_email: '',
                        team_id: values.team_id
                    },
                });
                mutate()
                successAlert("", "Colleague added")
            }
        }).catch(error => {
            errorAlert("Error add colleague", error.toString());
            throw new Error(error.toString())
        }).finally(() => {
            actions.setSubmitting(false)
        })
    };

    const leaveTeam = (team_id: string) => {
        const url_api_team_leave = `${process.env.NEXT_PUBLIC_URL_BASE_API}/team/${team_id}/leave/`;

        fetch(url_api_team_leave, {
            method: 'POST',
            headers: { "content-type": "application/json" }
        }).then(function (res) {
            if (!res.ok) throw Error(res.statusText);
            return res;
        }).then(reponse => reponse.json()).then(data => {
            mutate()
            successAlert("", "You have left the team correctly")
        }).catch(error => {
            errorAlert("Error leave team", error.toString());
            throw new Error(error.toString())
        })
    };

    const deleteUserTeam = (team_id: string, user_id: string) => {
        const url_api_team_delete_user = `${process.env.NEXT_PUBLIC_URL_BASE_API}/team/${team_id}/delete/user/`;
        const data = {
            user_id: user_id,
        }
        fetch(url_api_team_delete_user, {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body: JSON.stringify(data)
        }).then(function (res) {
            if (!res.ok) throw Error(res.statusText);
            return res;
        }).then(reponse => reponse.json()).then(data => {
            mutate()
            successAlert("", "You have successfully removed the user from the team")
        }).catch(error => {
            errorAlert("Error delete user team", error.toString());
            throw new Error(error.toString())
        })
    };



    const AssociationTeamFormSchema = Yup.object().shape({
        user_email: Yup.string().email('Email must be a valid email').required('Required')
    });

    if (isErrorTeams || isErrorUser) return FailedToLoad("failed to load")

    if (!isLoading && teams.length == 0) {
        return (
            <Main>
                <BarPage title="Teams" />
                <CenterInfo svg={<TeamSvg />}>
                    <HStack spacing="1" justify="center" alignItems={'baseline'}>
                        <CreateTeam>
                            <Button size='lg' variant="link" colorScheme="green">
                                Create a team
                            </Button>
                        </CreateTeam>
                        <Text fontSize='xl' color="muted">to collaborate with others.</Text>
                    </HStack>
                </CenterInfo>
            </Main>
        )
    }


    return (
        <Main>
            <BarPage title="Teams" />
            <VStack
                spacing={6}
                align='stretch'>
                <CreateTeam>
                    <CardCreate text={'Create team'} />
                </CreateTeam>
                {isLoading &&
                    <VStack
                        spacing={6}
                        align='stretch'>
                        <Skeleton height='120px' />
                        <Skeleton height='120px' />
                        <Skeleton height='120px' />
                        <Skeleton height='120px' />
                    </VStack>
                }
                {!isLoading &&
                    teams.map((team: TeamsType) =>
                        <CardSimple key={team.id} title={team.name.toUpperCase()}>
                            <Flex mt={6} direction={'column'}>
                                {team.users.sort(orderUserAdmin(team.admin_user_id)).map((userTeam: User) =>
                                    <Flex key={userTeam.id} ml={2} mb={4}>
                                        <Flex>
                                            <Avatar name={userTeam.name} src={userTeam.profile_picture} />
                                            <Box ml='3'>
                                                <Text fontWeight='bold'>
                                                    {capitalizeFirstLetter(userTeam.name)} {capitalizeFirstLetter(userTeam.last_name)}
                                                    {userTeam.id == team.admin_user_id &&
                                                        <Badge ml='2' colorScheme='yellow'>
                                                            Admin
                                                        </Badge>
                                                    }
                                                </Text>
                                                <Text fontSize='sm'>{userTeam.email}</Text>
                                            </Box>
                                            {team.admin_user_id == user.id && userTeam.id != team.admin_user_id &&
                                                <Flex ml={5} alignItems={'center'}>
                                                    <Tooltip hasArrow label={'Remove user from the team'} bg='gray.300' color='black'>
                                                        <IconButton _hover={{
                                                            color: 'red.500'
                                                        }}
                                                            size='sm'
                                                            aria-label={'Remove user from the team'}
                                                            onClick={() => { deleteUserTeam(team.id, userTeam.id) }}
                                                            icon={<FiUserMinus />} />
                                                    </Tooltip>
                                                </Flex>
                                            }
                                        </Flex>
                                    </Flex>
                                )}
                            </Flex>
                            <Divider mb={4} />
                            {user.id == team.admin_user_id &&
                                <Flex direction={'column'} mt={2} ml={2}>
                                    <Formik
                                        initialValues={{
                                            user_email: '',
                                            team_id: team.id
                                        }}
                                        validationSchema={AssociationTeamFormSchema}
                                        onSubmit={(values, actions) => {
                                            handleCreateAssociationTeam(values, actions)
                                        }}>
                                        {(props) => (
                                            <Form>
                                                <Flex direction={{ base: "column", md: "row" }}>
                                                    <Field name='user_email' >
                                                        {({ field, form }: any) => (
                                                            <FormControl width={'auto'} isInvalid={form.errors.user_email && form.touched.user_email}>
                                                                <Input {...field} id='user_email' variant='filled' placeholder='colleague@company.com' />
                                                                <FormErrorMessage>{form.errors.user_email}</FormErrorMessage>
                                                            </FormControl>
                                                        )}
                                                    </Field>
                                                    <Button leftIcon={<Icon as={FiUserPlus} />} type="submit" isLoading={props.isSubmitting}
                                                        ml={{ md: 2 }} mt={{ base: 2, md: 0 }}>Invite member</Button>
                                                </Flex>
                                            </Form>
                                        )}
                                    </Formik>
                                </Flex>
                            }
                            {user.id != team.admin_user_id &&
                                <Box mt={2} ml={2}>
                                    <Button leftIcon={<Icon as={FiUserX} />} onClick={() => { leaveTeam(team.id) }}>Leave team</Button>
                                </Box>
                            }
                        </CardSimple>
                    )
                }
            </VStack>
        </Main>
    )
}
