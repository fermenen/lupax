import Loading from "../../components/loading";
import Main from "../../components/main";
import TableReact from "../../components/table";
import React from "react";
import BarPage from "../../components/barPage";
import { CardIcon } from "../../components/card";
import { getLayoutDashboard } from "../../layouts/layoutDashboard"
import { errorAlert, successAlert } from "../../services/alert.service";
import { useMetrics, useUsersAll } from "../../services/admin.service";
import { FiUsers, FiTrendingUp, FiBell } from "react-icons/fi";
import { DeleteIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSWRConfig } from 'swr';
import { format } from 'date-fns';

import {
    Flex,
    Box,
    Text,
    Container,
    GridItem,
    Grid,
    IconButton,
    VStack,
    UnorderedList,
    ListItem
} from '@chakra-ui/react'


interface UserResponse {
    supertokens: any
    lupax: any
}

Admin.getLayout = getLayoutDashboard


export default function Admin() {

    const { mutate } = useSWRConfig()
    const { users, isLoading: isLoadingUser, isError: isErrorUsers } = useUsersAll();
    const { metrics, isLoading: isLoadingMetrics, isError: isErrorMetrics } = useMetrics();
    const url_api_delete_user = `${process.env.NEXT_PUBLIC_URL_BASE_API}/admin/delete/user/`;
    const url_api_all_users = `${process.env.NEXT_PUBLIC_URL_BASE_API}/admin/users/`;


    if (isErrorUsers || isErrorMetrics) return <>Error</>
    if (isLoadingUser || isLoadingMetrics) return <Loading />

    return (
        <>
            <Main>
                <BarPage title="Admin" />
                <VStack
                    spacing={6}
                    align='stretch'
                >
                    <Metrics />
                    <TableUsers />
                    <NotificationsAdmin />
                </VStack>
            </Main>
        </>
    )

    function Metrics() {
        return (
            <CardIcon title={'Metrics'} icon={FiTrendingUp}>
                <Container py={5} maxW={'container.lg'}>
                    <Grid
                        templateColumns={{
                            base: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                        }}
                        gap={6}>
                        <GridItem w="100%">
                            <Flex flexDirection={'column'}>
                                <Text fontSize={'4xl'} fontWeight={'bold'}>
                                    {metrics.count_users}
                                </Text>
                                <Box fontSize={'sm'}>
                                    Users lupax (only user role).
                                </Box>
                            </Flex>
                        </GridItem>
                        <GridItem w="100%">
                            <Flex flexDirection={'column'}>
                                <Text fontSize={'4xl'} fontWeight={'bold'}>
                                    {metrics.count_studies_teams}
                                </Text>
                                <Box fontSize={'sm'}>
                                    Studies of teams of user with user role.
                                </Box>
                            </Flex>
                        </GridItem>
                        <GridItem w="100%">
                            <Flex flexDirection={'column'}>
                                <Text fontSize={'4xl'} fontWeight={'bold'}>
                                    {metrics.count_studies_user}
                                </Text>
                                <Box fontSize={'sm'}>
                                    Studies only user with user role.
                                </Box>
                            </Flex>
                        </GridItem>
                    </Grid>
                </Container>
            </CardIcon>
        )
    }

    function TableUsers() {

        function dataf() {

            const handleDeleteUser = (user_id_supertokens: string) => {
                const data = {
                    user_id: user_id_supertokens
                }
                fetch(url_api_delete_user, {
                    method: 'POST',
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(data)
                }).then(function (res) {
                    if (!res.ok) throw Error(res.statusText);
                    return res;
                }).then(function (data) {
                    mutate(url_api_all_users)
                    successAlert("", "User deleted successfully")
                }).catch(error => {
                    errorAlert("User delete error", error.toString());
                }).finally(() => {

                })
            };


            return users.users.map((user: UserResponse) => {

                return {
                    id_s: user.supertokens.user_id,
                    email: user.supertokens.email,
                    id_l: (user.lupax) ? user.lupax.id : '',
                    phone: user.supertokens.phone_number,
                    recipe: user.supertokens.recipe_id,
                    time: (user.lupax) ? format(new Date(user.lupax.time_joined), "dd/MM/yy HH:mm") : '',
                    name: (user.lupax) ? user.lupax.name + " " + user.lupax.last_name : '',
                    role: (user.lupax) ? user.lupax.role : '',
                    actions: <IconButton onClick={() => { handleDeleteUser(user.supertokens.user_id) }} aria-label='Delete' icon={<DeleteIcon />} />
                }
            })
        }


        const renderRowSubComponent = React.useCallback(
            ({ row }) => (
                <>
                    <UnorderedList>
                        <ListItem>ID Supertokens: {row.original.id_s}</ListItem>
                        <ListItem>ID lupax: {row.original.id_l}</ListItem>
                        <ListItem>Phone: {row.original.phone}</ListItem>
                        <ListItem>Role: {row.original.role}</ListItem>
                    </UnorderedList>
                </>
            ),
            []
        )

        const data = React.useMemo(() => dataf(), [])

        const columns = React.useMemo(
            () => [
                {
                    Header: () => null, // No header
                    id: 'expander', // It needs an ID
                    Cell: ({ row }: { row: any }) => (
                        <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? <ViewOffIcon /> : <ViewIcon />}
                        </span>
                    ),
                },
                {
                    Header: 'Email',
                    accessor: 'email',
                },
                {
                    Header: 'Name',
                    accessor: 'name',
                },
                {
                    Header: 'Time Joined',
                    accessor: 'time',
                },
                {
                    Header: 'Recipe',
                    accessor: 'recipe',
                },
                {
                    Header: 'Actions',
                    accessor: 'actions',
                },
            ],
            []
        )

        return (
            <CardIcon title={'Users'} icon={FiUsers}>
                <TableReact data={data} columns={columns} renderRowSubComponent={renderRowSubComponent} />
            </CardIcon>
        )
    }



    function NotificationsAdmin() {

        return (
            <CardIcon title={'Notifications'} icon={FiBell}>

            </CardIcon>

        )
    }

}
