import { useSteps } from "react-step-builder";
import { ReactNode, ReactText, useEffect, useState } from 'react';
import { useReactMediaRecorder } from "react-media-recorder";
import { WarningTwoIcon } from '@chakra-ui/icons'
import { Task } from "../../interfaces";
import { Widget } from '@typeform/embed-react';
import { FiPlayCircle } from "react-icons/fi";
import { errorAlert } from "../../services/alert.service";

import {
    Button,
    Center,
    TagLabel,
    VStack,
    TagLeftIcon,
    Text,
    Tag,
    Badge,
    Divider,
    ButtonGroup,
} from '@chakra-ui/react'



type stepTask = {
    task: Task
    preview_mode: boolean
}

function StepScreenTask(props: stepTask) {

    const task_id = props.task.id;
    const { next, jump, total, current } = useSteps();
    const extensionIdChrome = `${process.env.NEXT_PUBLIC_ID_EXTENSION_CHROME}`;


    if (props.task.type === 'welcome_message')
        return (
            <WelcomePage />
        )
    else if (props.task.type === 'farewell_message')
        return (
            <FarewellPage />
        )
    else if (props.task.type === 'notice_extension')
        return (
            <ExtensionPage />
        )
    else if (props.task.type === 'typeform')
        return (
            <TypeFormPage />
        )
    else if (props.task.type === 'studie')
        return (
            <StudiePage />
        )
    return <>Error. hello@lupax.app</>



    function TextPageView({ text, children }: { text: ReactText, children?: ReactNode }) {
        return (
            <Center mt={10}>
                <VStack spacing={4}>
                    <Badge>{current}/{total}</Badge>
                    <Divider orientation='horizontal' />
                    <Text
                        fontSize={{ base: 'xl', md: '2xl' }}
                        textAlign={'center'}
                        maxW={'3xl'}>
                        {text}
                    </Text>
                    <Divider orientation='horizontal' />
                    {children}
                </VStack>
            </Center>
        )
    }


    function FarewellPage() {
        return (
            <TextPageView text={props.task.farewell_message}></TextPageView>
        )
    }

    function WelcomePage() {
        return (
            <TextPageView text={props.task.welcome_message}>
                <Button colorScheme='green' size='md' onClick={next}>Start study</Button>
            </TextPageView>
        )
    }

    function TypeFormPage() {

        function postData() {

            const url_participation = `${process.env.NEXT_PUBLIC_URL_BASE_API}/participation/`;
            const data_results = {
                task_id: task_id
            }

            fetch(url_participation, {
                method: 'POST',
                headers: { "content-type": "application/json" },
                body: JSON.stringify(data_results)
            }).then(function (res) {
                if (!res.ok) throw Error(res.statusText);
                return res;
            }).then(reponse => reponse.json()).then(data => {
                next();
            }).catch(error => {
                throw new Error(error.toString())
            }
            );
        }

        return (
            <Widget
                id={props.task.typeform_id}
                style={{ width: '100%', height: "90vh" }}
                className="my-form"
                onSubmit={postData} />
        )
    }


    function StudiePage() {

        const [loadingTask, setLoading] = useState(false);
        const [finish, setFinish] = useState(false);
        const [participation, setParticipation] = useState('');

        const {
            status,
            startRecording,
            stopRecording,
            mediaBlobUrl,
        } = useReactMediaRecorder(
            {
                video: false,
                screen: true,
                blobPropertyBag: {
                    type: "video/mp4"
                }
            }
        );

        let intervalId = 0;

        function startTaskStudie() {
            if (props.task.record_screen) {
                startRecording()
            } else {
                launchWebStudy()
            }
        }

        useEffect(() => {
            if (!finish && props.task.record_screen && status === 'recording') {
                launchWebStudy()
            }
            else if (finish && !props.task.record_screen) {
                next()
            }
            else if (finish && props.task.record_screen && status === 'stopped' && mediaBlobUrl) {
                if (!props.preview_mode) {
                    uploadVideo(mediaBlobUrl, participation)
                }
                next()
            }

        }, [status, finish, mediaBlobUrl])

        function finishTask(participation_id: string) {
            setParticipation(participation_id)
            setFinish(true)
            clearInterval(intervalId);
            if (props.task.record_screen) { stopRecording() }
        }

        function askExtensionIfFinishStudie() {
            const data = { type: "FROM_LUPAX_STATUS", id_task: props.task.id };
            chrome.runtime.sendMessage(extensionIdChrome, data, function (response: any) {
                if (response.finish && response.task === task_id && response.participation_id) {
                    finishTask(response.participation_id);
                }
            });
        }

        function launchWebStudy() {
            setLoading(true);
            var data = {
                type: "FROM_LUPAX_START",
                id_task: task_id,
                preview_mode: props.preview_mode,
                url_api: `${process.env.NEXT_PUBLIC_URL_BASE_API}`,
                extension_id: `${process.env.NEXT_PUBLIC_ID_EXTENSION_CHROME}`
            };
            chrome.runtime.sendMessage(extensionIdChrome, data, function (response: any) {
                // console.log(response)
            });

            intervalId = window.setInterval(function () {
                askExtensionIfFinishStudie();
            }, 5000);

        }

        function uploadVideo(blobUrl: string, participation_id: string) {
            const url_api_storage = `${process.env.NEXT_PUBLIC_URL_BASE_API}/storage/video/task/`;

            var xhr = new XMLHttpRequest;
            xhr.responseType = 'blob';
            xhr.open('GET', blobUrl);

            xhr.addEventListener("load", function () {

                var reader = new FileReader();
                reader.readAsDataURL(xhr.response);

                reader.onloadend = function () {
                    var base64data = reader.result;

                    const data = {
                        file: base64data,
                        participation_id: participation_id
                    }

                    fetch(url_api_storage, {
                        method: 'POST',
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify(data)
                    }).then(function (res) {
                        if (!res.ok) throw Error(res.statusText);
                        return res;
                    }).then(function (data) {
                    }).catch(error => {
                        errorAlert("Upload video error", error.toString());
                        throw new Error(error.toString())
                    })
                }

            }, false);
            xhr.send();
        }


        return (
            <Center mt={10}>
                <VStack spacing={4}>
                    <Badge>{current}/{total}</Badge>
                    <Divider orientation='horizontal' />
                    {status === 'recording' &&
                        <Tag colorScheme='red'>
                            <TagLeftIcon boxSize='12px' as={FiPlayCircle} />
                            <TagLabel>Your screen is being recorded</TagLabel>
                        </Tag>
                    }
                    <Text
                        fontSize={{ base: 'xl', md: '2xl' }}
                        textAlign={'center'}
                        maxW={'3xl'}>
                        {props.task.instructions}
                    </Text>
                    {props.task.target_url === "" &&
                        <Tag>
                            <TagLeftIcon boxSize='12px' as={WarningTwoIcon} />
                            <TagLabel>When the task is finished, press the finish button</TagLabel>
                        </Tag>
                    }
                    <Divider orientation='horizontal' />
                    <Button colorScheme='green' size='md' onClick={startTaskStudie}
                        isLoading={loadingTask} loadingText='Study in process'>Start task</Button>
                </VStack>
            </Center>
        )

    }


    function ExtensionPage() {

        const [hasExtension, setHasExtension] = useState(false);

        function callExtensionToCheckInstall() {
            try {
                chrome.runtime.sendMessage(extensionIdChrome, { type: "FROM_LUPAX_INSTALL" }, function (response: any) {
                    if (response && response['version']) {
                        setHasExtension(true)
                    }
                });
            } catch {
                setHasExtension(false)
            }
        }

        useEffect(() => {
            callExtensionToCheckInstall();
            const intervalId = setInterval(() => {
                callExtensionToCheckInstall();
            }, 2000)
            return () => clearInterval(intervalId); //This is important
        }, [hasExtension])

        return (
            <TextPageView text={"In order to carry out the study you need to install an extension in your browser (It's super easy and free)."}>
                <ButtonGroup size='md' colorScheme='green'>
                    <Button isDisabled={hasExtension} onClick={() => {
                        window.open(
                            'https://chrome.google.com/webstore/detail/' + extensionIdChrome,
                            '_blank' // <- This is what makes it open in a new window.
                        )
                    }}>Install extension</Button>
                    <Button isDisabled={!hasExtension} onClick={next}>Next</Button>
                </ButtonGroup>
            </TextPageView>
        )
    }


}

export default StepScreenTask;
