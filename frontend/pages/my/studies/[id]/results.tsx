import React from 'react';
import BarStudie from '../../../../components/barStudie';
import Main from '../../../../components/main';
import TableReact from '../../../../components/table';
import FailedToLoad from '../../../../components/failedToLoad';
import ReactPlayer from 'react-player';
import ms from 'ms';
import { CardSimple } from '../../../../components/card';
import { useRouter } from 'next/router';
import { useStudie } from '../../../../services/studies.service';
import { getLayoutDashboard } from '../../../../layouts/layoutDashboard';
import { capitalizeFirstLetter } from '../../../../services/util.service';
import { Participation, Task } from '../../../../interfaces';
import { VictoryAxis, VictoryBoxPlot, VictoryChart, VictoryContainer } from "victory";
import { format, millisecondsToSeconds } from 'date-fns';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
    Alert,
    AlertIcon,
    Flex,
    HStack,
    Tag,
    VStack,
    Tooltip,
    Skeleton,
    Text,
    Box,
    Center,
    AlertTitle,
    AlertDescription,
    Stack,
    Show
} from '@chakra-ui/react';


Results.getLayout = getLayoutDashboard


export default function Results() {

    const router = useRouter();
    const { id } = router.query;
    const { studie, isLoading, isError } = useStudie(id)

    function orderTasks(taska: { index: number; }, taskb: { index: number; }) {
        return taska.index - taskb.index;
    };

    function filterTasks(task: { type: string; }) {
        return ["studie", "typeform"].includes(task.type);
    };

    if (isError) return FailedToLoad("Error loading content, refresh page.")

    if (!isLoading && studie.number_tasks == 3) return (
        <>
            <BarStudie />
            <Main>
                <Alert status='info' mb={4}>
                    <AlertIcon />
                    You need to create tasks to be able to be evaluated.
                </Alert>
            </Main>
        </>
    )

    return (
        <>
            <BarStudie />
            <Main>
                {!isLoading &&
                    <>
                        <Alert status='warning' mb={4} hidden={studie.is_published}>
                            <AlertIcon />
                            You need to publish your lupax study before you can see results.
                        </Alert>
                        <VStack
                            spacing={6}
                            align='stretch'
                            hidden={!studie.is_published}>
                            {studie.tasks.sort(orderTasks).filter(filterTasks).map((task: Task, index: number) => (
                                <DataCard key={task.id} task={task} />
                            ))}
                        </VStack>
                    </>
                }
                {isLoading &&
                    <VStack
                        spacing={6}
                        align='stretch'>
                        <Skeleton height='100px' />
                        <Skeleton height='100px' />
                        <Skeleton height='100px' />
                        <Skeleton height='100px' />
                        <Skeleton height='100px' />
                    </VStack>
                }
            </Main>
        </>
    )


    function DataCard({ task }: { task: Task }) {

        if (task.type == 'typeform') return (
            <CardSimple title={`Typeform task`} divider={true}>
               <Stack spacing={3} cursor={'default'} direction={['column', 'row']}>
                    <Tooltip hasArrow label='Id typeform' bg='gray.300' color='black'>
                        <Tag width={'max-content'}>{task.typeform_id}</Tag>
                    </Tooltip>
                    <Tooltip hasArrow label='Have completed the survey' bg='gray.300' color='black'>
                        <Tag width={'max-content'} colorScheme='yellow'>{task.participants} participants</Tag>
                    </Tooltip>
                    <Tooltip hasArrow label='Go to Typeform!' bg='gray.300' color='black'>
                        <Box cursor={'pointer'} onClick={() => { window.open('https://www.typeform.com/', '_blank') }}>
                            <Tag width={'max-content'}>{"www.typeform.com"}</Tag>
                        </Box>
                    </Tooltip>
                </Stack>
            </CardSimple>
        )
        else if (task.type == 'studie') return (
            <CardSimple title={`Web study task`} caption={capitalizeFirstLetter(task.instructions)} divider={true}>
                <Stack spacing={3} cursor={'default'} direction={['column', 'row']}>
                    {task.url &&
                        <Tooltip hasArrow label='Url' bg='gray.300' color='black'>
                            <Tag width={'max-content'}>{task.url.replace('https://', '')}</Tag>
                        </Tooltip>
                    }
                    {task.target_url &&
                        <Tooltip hasArrow label='Url target' bg='gray.300' color='black'>
                            <Tag width={'max-content'}>{task.target_url.replace('https://', '')}</Tag>
                        </Tooltip>
                    }
                    <Tooltip hasArrow label='Have completed the study' bg='gray.300' color='black'>
                        <Tag width={'max-content'} colorScheme='yellow'>{task.participants} participants</Tag>
                    </Tooltip>
                </Stack>
                {task.participants != 0 &&
                    <VStack align='stretch'>
                        {task.participants >= 4 &&
                            <Stack direction={['column', 'row']}>
                                {task.target_url &&
                                    <PlotSucces />
                                }
                                {task.clicks_array &&
                                    <PlotClicks />
                                }
                                {task.time_total_array &&
                                    <PlotTime />
                                }
                            </Stack>
                        }
                        {task.participants < 4 &&
                            <Alert status='warning' mt={5} mb={5}>
                                <AlertIcon />
                                We need more data to make the graphs.
                            </Alert>
                        }
                        <Show above='sm'>
                            <TableAllData />
                        </Show>

                    </VStack>
                }
            </CardSimple>
        )
        else
            return (
                FailedToLoad("type not correct")
            )


        function PlotSucces() {
            return (
                <VictoryChart height={200} width={600} domainPadding={10}
                    containerComponent={<VictoryContainer responsive={true} />}>
                    <VictoryBoxPlot horizontal
                        boxWidth={25}
                        medianLabels={({ datum }) => (String(datum._median.toFixed(2) + '%'))}
                        data={[
                            { x: 'Sucess', min: 0, median: task.success_rate, max: 100, q1: 0, q3: 0 },
                        ]}
                        style={{
                            min: { stroke: "#1cae72" },
                            q1: { fill: "#1cae72" },
                            q3: { fill: "#1cae72" },
                            median: { stroke: "black", strokeWidth: 3 },
                        }}
                    />
                    <VictoryAxis dependentAxis
                        tickValues={[0, 25, 50, 75, 100]}
                        tickFormat={(t) => String(t) + '%'}
                    />
                    <VictoryAxis
                        tickFormat={(t) => String(t)}
                        orientation={'top'}
                    />
                </VictoryChart>
            )
        }

        function PlotClicks() {
            return (<PlotVictoryBox title='Clicks' data={task.clicks_array} units={''} />)
        }

        function PlotTime() {
            let n = task.time_total_array.length
            const times = Array(n);
            while (n--) times[n] = millisecondsToSeconds(task.time_total_array[n]);
            return (<PlotVictoryBox title='Time' data={times} units={'s'} />)
        }

        function PlotVictoryBox({ title, data, units }: { title: string, data: any[], units: string }) {
            return (
                <VictoryChart height={200} width={600} domainPadding={10}
                    containerComponent={<VictoryContainer responsive={true} />}>
                    <VictoryBoxPlot horizontal
                        boxWidth={25}
                        labelOrientation={{ median: 'bottom', max: 'left', min: 'right', q1: 'top', q3: 'top' }}
                        minLabels={({ datum }) => datum._min.toFixed(2)}
                        q1Labels={({ datum }) => (datum._q1.toFixed(1))}
                        medianLabels={({ datum }) => (String(datum._median.toFixed(2)) + " " + units)}
                        q3Labels={({ datum }) => datum._q3.toFixed(1)}
                        maxLabels={({ datum }) => datum._max.toFixed(2)}
                        data={[
                            { x: title, y: data },
                        ]}
                        style={{
                            median: { stroke: "#1cae72", strokeWidth: 3 },
                        }}
                    />
                    <VictoryAxis dependentAxis
                        tickFormat={(t) => String(t) + units}
                    />
                    <VictoryAxis
                        tickFormat={(t) => String(t)}
                        orientation={'top'}
                    />
                </VictoryChart>
            )
        }

        function TableAllData() {

            function dataf() {
                return task.participations.map((p: Participation) => {
                    return {
                        parcitipant: p.participant_user,
                        created: <Tag cursor={'default'}>{format(new Date(p.time_created), "dd/MM/yy HH:mm")}</Tag>,
                        target: (p.target_success) ? <Tag colorScheme='green' cursor={'default'}>Success</Tag> : <Tooltip hasArrow label='The tester has not reached the target' bg='gray.300' color='black'><Tag colorScheme='red' cursor={'default'}>Failure</Tag></Tooltip>,
                        clicks: p.clicks,
                        time: ms(p.time_total, { long: true }),
                        video: p.video_url
                    }
                })
            }
            const renderRowSubComponent = React.useCallback(
                ({ row }) => (
                    <>
                        {!row.original.video &&
                            <Alert status='error'>
                                <AlertIcon />
                                <AlertTitle>Video not available!</AlertTitle>
                                <AlertDescription>The user has cancelled the recording or there is a bug in the code.</AlertDescription>
                            </Alert>
                        }
                        {row.original.video &&
                            <Center>
                                <ReactPlayer url={row.original.video} controls={true} />
                            </Center>
                        }
                    </>
                ),
                []
            )

            const data = React.useMemo(() => dataf(), [])

            const expander = {
                Header: () => null, // No header
                id: 'expander', // It needs an ID
                Cell: ({ row }: { row: any }) => (
                    // Use Cell to render an expander for each row.
                    // We can use the getToggleRowExpandedProps prop-getter
                    // to build the expander.
                    <span {...row.getToggleRowExpandedProps()}>
                        {row.isExpanded ? <ViewOffIcon /> : <ViewIcon />}
                    </span>
                ),
            }
            const parcitipant = {
                Header: 'Parcitipant',
                accessor: 'parcitipant',
            }
            const created = {
                Header: 'Date',
                accessor: 'created',
            }
            const target = {
                Header: 'Target',
                accessor: 'target',
            }
            const clicks = {
                Header: 'Clicks',
                accessor: 'clicks',
            }
            const time = {
                Header: 'Time',
                accessor: 'time',
            }

            const columns = React.useMemo(

                () => [
                    (task.record_screen) ? expander : null,
                    (true) ? parcitipant : null,
                    (true) ? created : null,
                    (task.target_url) ? target : null,
                    (task.clicks_array) ? clicks : null,
                    (task.time_total_array) ? time : null,
                ].filter(Boolean),
                []
            )

            return (
                <TableReact data={data} columns={columns} renderRowSubComponent={renderRowSubComponent} />
            )

        }

    }

}

