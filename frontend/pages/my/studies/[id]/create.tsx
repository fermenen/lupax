import React from 'react';
import FailedToLoad from '../../../../components/failedToLoad';
import BarStudie from '../../../../components/barStudie';
import Main from '../../../../components/main';
import CreateTask from '../../../../components/createTaskDrawer';
import { CardCreate, CardDrag, CardIcon } from '../../../../components/card';
import { useRouter } from 'next/router';
import { Task } from '../../../../interfaces';
import { getLayoutDashboard } from '../../../../layouts/layoutDashboard';
import { orderTasks, useStudie } from '../../../../services/studies.service';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import { errorAlert, successAlert } from '../../../../services/alert.service';
import { DeleteIcon, EditIcon, SearchIcon } from '@chakra-ui/icons';
import { FiSmile, FiThumbsUp, FiAlertOctagon } from 'react-icons/fi';

import {
    Stack,
    VStack,
    Text,
    Badge,
    IconButton,
    Editable,
    EditableTextarea,
    EditablePreview,
    Skeleton,
    List,
    ListItem,
    Box,
    Tooltip,
    Button,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogCloseButton,
    useDisclosure,
} from '@chakra-ui/react';


Create.getLayout = getLayoutDashboard


export default function Create() {

    const router = useRouter();
    const { id } = router.query;
    const { studie, isLoading, isError, mutate } = useStudie(id);

    if (isError) return FailedToLoad("failed to load")


    const SortableItem = SortableElement(({ value }: { value: Task }) => (
        <CardTask task={value}></CardTask>
    ));

    const SortableList = SortableContainer(({ tasks }: { tasks: any }) => {
        return (
            <ul>
                <VStack
                    spacing={5}
                    align='stretch'>
                    {tasks.sort(orderTasks).map((task: Task, index: number) => (
                        <>
                            {index == (studie.number_tasks - 1) &&
                                <CreateTask studie_id={studie.id}>
                                    <CardCreate text={'Create task'} />
                                </CreateTask>
                            }
                            {!task.move &&
                                <CardTask task={task}></CardTask>
                            }
                            {task.move &&
                                <SortableItem key={task.id} value={task} index={task.index} />
                            }
                        </>
                    ))}
                </VStack>
            </ul>
        );
    });


    function orderArray({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) {
        if (oldIndex != newIndex) {
            const tasksNewOrder: any = arrayMoveImmutable(studie.tasks.sort(orderTasks), oldIndex, newIndex);
            for (const x of tasksNewOrder.keys()) tasksNewOrder[x]['index'] = x;

            const dataToBD = tasksNewOrder.map((item: { id: string; index: number; }, index: number) => (
                { 'id': item.id, 'index': index }
            ));

            const url_api_studie_detail = `${process.env.NEXT_PUBLIC_URL_BASE_API}/studie/${studie.id}/edit/tasks/`;
            fetch(url_api_studie_detail, {
                method: 'PATCH',
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ tasks: dataToBD })
            }).then(function (res) {
                if (!res.ok) throw Error(res.statusText);
                return res;
            }).then(function (data) {
            }).catch(error => {
                errorAlert("Studie tasks error", error.toString());
            }).finally(() => {
            })
            mutate({ ...studie, tasks: tasksNewOrder }, false)
        }
    }


    return (
        <>
            <BarStudie />
            <Main>
                {!isLoading &&
                    <SortableList tasks={studie.tasks} onSortEnd={orderArray} useDragHandle />
                }
                {isLoading &&
                    <Stack spacing={6}>
                        <Skeleton height='100px' />
                        <Skeleton height='100px' />
                        <Skeleton height='100px' />
                        <Skeleton height='100px' />
                        <Skeleton height='100px' />
                    </Stack>
                }
            </Main>
        </>
    )


    function CardTask({ task }: { task: Task }) {

        const deleteElement = () => {

            const url_api_studie_detail_delete = `${process.env.NEXT_PUBLIC_URL_BASE_API}/tasks/${task.id}/delete/`;
            fetch(url_api_studie_detail_delete, {
                method: 'POST',
                headers: { "content-type": "application/json" }
            }).then(function (res) {
                if (!res.ok) throw Error(res.statusText);
                return res;
            }).then(function (data) {
                mutate()
                successAlert("", "Task deleted successfully")
            }).catch(error => {
                errorAlert("Task error delete", error.toString());
            }).finally(() => {
            })

        };

        const changeDescription = (nextValue: string, previousValue: string) => {
            if (nextValue.localeCompare(previousValue) != 0) {
                const url_api_studie_detail_edit = `${process.env.NEXT_PUBLIC_URL_BASE_API}/tasks/${task.id}/edit/`;
                const data = {
                    [task.type]: nextValue
                }
                fetch(url_api_studie_detail_edit, {
                    method: 'POST',
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(data)
                }).then(function (res) {
                    if (!res.ok) throw Error(res.statusText);
                    return res;
                }).then(function (data) {
                    mutate()
                    successAlert("", "Task change successfully")
                }).catch(error => {
                    errorAlert("Task error change", error.toString());
                })
            }
        };

        return (
            <>
                {task.type === 'typeform' &&
                    <CardDrag title='Typeform' actions={
                        <Stack direction='column' spacing={2}>
                            <Box onClick={deleteElement}>
                                <ButtonDelete text='Delete Typeform' />
                            </Box>
                        </Stack>}>
                        <VStack align={'start'} spacing={5}>
                            <List spacing={2}>
                                <ListItem>
                                    <Text as={'span'} fontWeight={'bold'}>
                                        Id:
                                    </Text>{' '}
                                    {task.typeform_id}
                                </ListItem>
                            </List>
                        </VStack>
                    </CardDrag>
                }
                {task.type == 'studie' &&
                    <CardDrag title='Web study' actions={
                        <Stack direction='column' spacing={2}>
                            <DeleteStudieTask count_participants={task.participants} fun={deleteElement} />
                        </Stack>}>
                        <VStack align={'start'} spacing={5}>
                            <Stack direction='row' cursor={'default'}>
                                <Badge>{task.url.replace('https://', '')}</Badge>
                                {task.delete_cookie && <Badge colorScheme='red'>Removed cookies</Badge>}
                                {task.record_screen && <Badge colorScheme='red'>Record screen</Badge>}
                            </Stack>
                            <List spacing={2}>
                                <ListItem>
                                    <Text as={'span'} fontWeight={'bold'}>
                                        Instructions:
                                    </Text>{' '}
                                    {task.instructions}
                                </ListItem>
                                {task.target_url &&
                                    <ListItem>
                                        <Text as={'span'} fontWeight={'bold'}>
                                            Target url:
                                        </Text>{' '}
                                        {task.target_url.replace('https://', '')}
                                    </ListItem>
                                }
                            </List>
                        </VStack>
                    </CardDrag>
                }
                {task.type == 'welcome_message' &&
                    <CardIcon title='Greeting message for your testers' caption='They will see this upon navigating to the trigger page for the test.' icon={FiSmile}>
                        <Editable defaultValue={task.welcome_message} onSubmit={(nextValue: string) => changeDescription(nextValue, task.welcome_message)}>
                            <EditablePreview />
                            <EditableTextarea />
                        </Editable>
                    </CardIcon>
                }
                {task.type == 'notice_extension' &&
                    <CardIcon title='Extension notice' caption='We will display a notice for the user to install the lupax extension in their browser.' icon={FiAlertOctagon}>
                    </CardIcon>
                }
                {task.type == 'farewell_message' &&
                    <CardIcon title='Thank you message for your testers' caption='They will see this when done testing.' icon={FiThumbsUp}>
                        <Editable defaultValue={task.farewell_message} onSubmit={(nextValue: string) => changeDescription(nextValue, task.farewell_message)}>
                            <EditablePreview />
                            <EditableTextarea />
                        </Editable>
                    </CardIcon>
                }
            </>
        )
    }


}


function ButtonDelete({ text }: { text: string }) {

    return (
        <Tooltip hasArrow label={text} bg='gray.300' color='black'>
            <IconButton _hover={{
                color: 'red.500'
            }}
                size='sm'
                aria-label={text}
                icon={<DeleteIcon />} />
        </Tooltip>

    )
}


function DeleteStudieTask({ count_participants, fun }: { count_participants: number, fun: Function }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const ref = undefined // funciona en front pero da un error de clase, segurmanete version chakra, se deja inoperativo.

    function deleteAction() {
        count_participants == 0 ? fun() : onOpen();
    }

    return (
        <>
            <Box onClick={deleteAction}>
                <ButtonDelete text='Delete studie task' />
            </Box>
            <AlertDialog
                motionPreset='slideInBottom'
                leastDestructiveRef={ref}
                onClose={onClose}
                isOpen={isOpen}
                isCentered>
                <AlertDialogOverlay />
                <AlertDialogContent>
                    <AlertDialogHeader>Delete studie task?</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>
                        Are you sure you want to delete this studie task? {count_participants} results will be deleted.
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={ref} onClick={onClose}>
                            No
                        </Button>
                        <Button colorScheme='red' ml={3} onClick={() => { fun() }}>
                            Yes, delete anyway
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
