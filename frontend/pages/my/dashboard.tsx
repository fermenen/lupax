import BarPage from '../../components/barPage';
import Main from '../../components/main';
import FailedToLoad from '../../components/failedToLoad';
import CenterInfo from '../../components/centerInfo';
import { getLayoutDashboard } from '../../layouts/layoutDashboard';
import { useUser } from '../../services/users.service';
import { HStack, Skeleton, Text, VStack } from '@chakra-ui/react';
import { DashboardSvg } from '../../components/svg/dashboard';
import { orderNotifications, useNotifications, filterNotifications } from '../../services/notifications.service';
import { Notification } from '../../interfaces';
import { CardNotification } from '../../components/card';
import { formatDistanceToNow } from 'date-fns';
import { errorAlert } from '../../services/alert.service';

Dashboard.getLayout = getLayoutDashboard

export default function Dashboard() {

    const { user, isLoading: isLoadingUser, isError: isErrorUser } = useUser();
    const { notifications, isLoading: isLoadingNotifications, isError: isErrorNotifications, mutate } = useNotifications();

    const isError = isErrorUser || isErrorNotifications
    const isLoading = isLoadingUser || isLoadingNotifications

    if (isError) return FailedToLoad("failed to load")

    function handleMarkSeenNotification(id_n: string) {

        const url_api_notification_seen = `${process.env.NEXT_PUBLIC_URL_BASE_API}/notifications/${id_n}/see/`
        fetch(url_api_notification_seen, {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body: JSON.stringify({})
        }).then(function (res) {
            if (!res.ok) throw Error(res.statusText);
            return res;
        }).then(function (data) {
            mutate()
        }).catch(error => {
            errorAlert("Notification error", error.toString());
        })
    }


    if (!isLoading && Number(notifications.filter(filterNotifications(user)).length) == 0) {
        return (
            <Main>
                {user.role == 'guest' &&
                    <BarPage title={`Goodbye!`} />
                }
                {user.role != 'guest' &&
                    <BarPage title={`Hi ${user.name}!`} />
                }
                <CenterInfo svg={<DashboardSvg />}>
                    <HStack spacing="1" justify="center">
                        <Text fontSize='xl' color="muted">You have no new notifications, enjoy the rest of the day!</Text>
                    </HStack>
                </CenterInfo>
            </Main>
        )
    }


    return (
        <>
            <Main>
                {!isLoading && user.role == 'guest' &&
                    <BarPage title={`Goodbye!`} />
                }
                {!isLoading && user.role != 'guest' &&
                    <BarPage title={`Hi ${user.name}!`} />
                }
                {!isLoading &&
                    <VStack spacing={6}>
                        {notifications.filter(filterNotifications(user)).sort(orderNotifications).map((notification: Notification) =>
                            <CardNotification key={notification.id} date={formatDistanceToNow(new Date(notification.time_created), { addSuffix: true })}
                                text={notification.text} fun={() => { handleMarkSeenNotification(notification.id) }} />
                        )}
                    </VStack>
                }
                {isLoading &&
                    <VStack
                        spacing={6}
                        align='stretch'>
                        <Skeleton height='80px' />
                        <Skeleton height='80px' />
                        <Skeleton height='80px' />
                        <Skeleton height='80px' />
                        <Skeleton height='80px' />
                    </VStack>
                }
            </Main>
        </>
    )
}

