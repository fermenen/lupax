import React from 'react';
import DrawerApp from './drawer';
import splitbee from '@splitbee/web';
import * as Yup from 'yup';
import { ReactNode } from 'react';
import { errorAlert, successAlert } from "../services/alert.service";
import { useSWRConfig } from 'swr';
import { Formik, Field, Form } from 'formik';
import {
    Button,
    DrawerFooter,
    Input,
    FormControl,
    FormLabel,
    Box,
    FormErrorMessage,
    useDisclosure
} from '@chakra-ui/react'



export default function CreateTeam({ children }: { children: ReactNode }) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { mutate } = useSWRConfig();
    const firstField = React.useRef();

    const url_api_teams = `${process.env.NEXT_PUBLIC_URL_BASE_API}/teams/`;

    const handleCreateTeam = (values: any, actions: any) => {
        const data = { name: values.name }
        fetch(url_api_teams, {
            method: 'POST',
            headers: { "content-type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(data)
        }).then(function (res) {
            if (!res.ok) throw Error(res.statusText);
            return res;
        }).then(function (data) {
            mutate(url_api_teams)
            onClose()
            successAlert("", "Team created successfully")
            splitbee.track("Create team");
        }).catch(error => {
            errorAlert("Create team error", error.toString());
        }).finally(() => {
            actions.setSubmitting(false)
        })
    };

    const TeamFormSchema = Yup.object().shape({
        name: Yup.string()
            .min(10, 'Too Short! (min 10 characters)')
            .max(50, 'Too Long! (max 50 characters)')
            .required('Required'),
    });


    return (
        <>
            <Box onClick={onOpen}>{children}</Box>
            <DrawerApp title={'Create new team'} initialFocusRef={firstField} isOpen={isOpen} onClose={onClose}>
                <Formik
                    initialValues={{
                        name: "",
                    }}
                    validationSchema={TeamFormSchema}
                    onSubmit={(values, actions) => {
                        handleCreateTeam(values, actions)
                    }}>
                    {(props) => (
                        <Form>
                            <Field name='name' >
                                {({ field, form }: any) => (
                                    <FormControl isInvalid={form.errors.name && form.touched.name}>
                                        <FormLabel htmlFor='name'>Team name</FormLabel>
                                        <Input {...field} ref={firstField} id='name' variant='filled' placeholder='Squad UX desktop app' />
                                        <FormErrorMessage ml={1}>{form.errors.name}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
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
