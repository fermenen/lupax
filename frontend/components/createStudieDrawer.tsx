import React from 'react';
import splitbee from '@splitbee/web';
import FailedToLoad from './failedToLoad';
import DrawerApp from './drawer';
import Loading from './loading';
import * as Yup from 'yup';
import { ReactNode } from 'react';
import { errorAlert, successAlert } from "../services/alert.service";
import { useSWRConfig } from 'swr';
import { useTeams } from '../services/teams.service';
import { TeamsType } from '../interfaces';
import { Formik, Field, Form } from 'formik';

import {
    Button,
    Select,
    DrawerFooter,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    NumberInput,
    NumberInputField,
    Box,
    Divider,
    Stack,
    Textarea,
    useDisclosure,
    Tooltip
} from '@chakra-ui/react';



export default function CreateStudie({ children }: { children: ReactNode }) {

    const { teams, isLoading: isLoadingTeams, isError: isErrorTeams } = useTeams();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { mutate } = useSWRConfig();
    const firstField = React.useRef();

    const url_api_studie = `${process.env.NEXT_PUBLIC_URL_BASE_API}/studies/`;

    const min_number_participants = 5;
    const default_number_participants = 20;
    const max_number_participants = 100;

    const handleCreateStudie = (values: any, actions: any) => {
        const data = {
            private_studie_title: values.private_studie_title,
            public_studie_title: values.public_studie_title,
            studie_description: values.studie_description,
            audience_max: (Number(values.number_participants)) ? values.number_participants : default_number_participants,
            team_id: values.team_id
        }
        fetch(url_api_studie, {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body: JSON.stringify(data)
        }).then(function (res) {
            if (!res.ok) throw Error(res.statusText);
            return res;
        }).then(function (data) {
            onClose()
            mutate(url_api_studie)
            successAlert("", "Study created successfully")
            splitbee.track("Create study");
        }).catch(error => {
            errorAlert("Create study error", error.toString());
        }).finally(() => {
            actions.setSubmitting(false)
        })
    };

    const StudieFormSchema = Yup.object().shape({
        private_studie_title: Yup.string()
            .min(15, 'Too Short! (min 15 characters)')
            .max(50, 'Too Long! (max 50 characters)')
            .required('Please enter a name for the study!'),
        public_studie_title: Yup.string()
            .min(10, 'Too Short! (min 10 characters)')
            .max(50, 'Too Long! (max 50 characters)')
            .required('Please enter a public name for the study!'),
        studie_description: Yup.string()
            .min(20, 'Too Short! (min 20 characters)')
            .max(400, 'Too Long! (max 400 characters)')
            .required('Required'),
        number_participants: Yup.number()
            .positive()
            .integer()
            .min(min_number_participants, `${min_number_participants} minimum!`)
            .max(max_number_participants, `${max_number_participants} maximum!`),
    });

    if (isErrorTeams) return FailedToLoad("failed to load")
    if (isLoadingTeams) return <Loading />


    return (
        <>
            <Box onClick={onOpen} height={'100%'}>{children}</Box>
            <DrawerApp title={'Create new study'} initialFocusRef={firstField} isOpen={isOpen} onClose={onClose}>
                <Formik
                    initialValues={{
                        private_studie_title: "",
                        public_studie_title: "",
                        studie_description: "",
                        number_participants: default_number_participants,
                        team_id: ""
                    }}
                    validationSchema={StudieFormSchema}
                    onSubmit={(values, actions) => {
                        handleCreateStudie(values, actions)
                    }}>
                    {(props) => (
                        <Form>
                            <Stack spacing={6}>
                                <Field name='private_studie_title' >
                                    {({ field, form }: any) => (
                                        <FormControl isInvalid={form.errors.private_studie_title && form.touched.private_studie_title}>

                                            <FormLabel htmlFor='private_studie_title'>
                                                <Tooltip label="Help your team recognize projects." aria-label='A tooltip' placement='right'>
                                                    Internal study title
                                                </Tooltip>
                                            </FormLabel>
                                            <Input {...field} ref={firstField} id='private_studie_title' variant='filled' placeholder='Beta Feedback - International Travelers - Q3 2021' />
                                            <FormErrorMessage>{form.errors.private_studie_title}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='public_studie_title' >
                                    {({ field, form }: any) => (
                                        <FormControl isInvalid={form.errors.public_studie_title && form.touched.public_studie_title}>
                                            <FormLabel htmlFor='public_studie_title'>
                                                <Tooltip label="Unique titles attract more participants. Be descriptive, and make sure to differentiate titles from past studies." aria-label='A tooltip' placement='right'>
                                                    Public study title
                                                </Tooltip>
                                            </FormLabel>
                                            <Input {...field} id='public_studie_title' variant='filled' placeholder='Love to travel? Test a new travel app!' />
                                            <FormErrorMessage>{form.errors.public_studie_title}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name='studie_description' >
                                    {({ field, form }: any) => (
                                        <FormControl isInvalid={form.errors.studie_description && form.touched.studie_description}>
                                            <FormLabel htmlFor='studie_description'>
                                                <Tooltip label="Give an overview of your study and how it’ll be conducted." aria-label='A tooltip' placement='right'>
                                                    Study description
                                                </Tooltip>
                                            </FormLabel>
                                            <Textarea {...field} id='studie_description' variant='filled' placeholder="We're looking for feedback on a product we are building." />
                                            <FormErrorMessage>{form.errors.studie_description}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Divider />
                                <Field name='number_participants' >
                                    {({ field, form }: any) => (
                                        <FormControl isInvalid={form.errors.number_participants && form.touched.number_participants}>
                                            <FormLabel htmlFor='number_participants'>Number of participants (máx. {max_number_participants})</FormLabel>
                                            <NumberInput width={'max-content'}>
                                                <NumberInputField {...field} id='number_participants' placeholder={default_number_participants} />
                                            </NumberInput>
                                            <FormHelperText hidden={form.errors.number_participants && form.touched.number_participants}>On average, 10% of participants do not complete their study.</FormHelperText>
                                            <FormErrorMessage>{form.errors.number_participants}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Divider />
                                {teams.length != 0 &&
                                    <Field name='team_id' >
                                        {({ field, form }: any) => (
                                            <FormControl isInvalid={form.errors.name && form.touched.name}>
                                                <FormLabel htmlFor='team_id'>Team</FormLabel>
                                                <Select {...field} id='team_id' placeholder='Do not share with any team'>
                                                    {teams.map((team: TeamsType) =>
                                                        <option key={team.id} value={team.id}>{team.name.toUpperCase()}</option>
                                                    )}
                                                </Select>
                                                <FormHelperText>Research is better together. Add the study to a team to be able to view and edit together.</FormHelperText>
                                            </FormControl>
                                        )}
                                    </Field>
                                }
                            </Stack>
                            <DrawerFooter mt={5}>
                                <Button variant='outline' mr={3} onClick={onClose}>Cancel</Button>
                                <Button type="submit" isLoading={props.isSubmitting} colorScheme='green'>Create</Button>
                            </DrawerFooter>
                        </Form>
                    )}
                </Formik>
            </DrawerApp>
        </>
    )

}
