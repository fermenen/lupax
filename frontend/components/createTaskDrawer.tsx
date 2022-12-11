/* eslint-disable react/no-children-prop */
import splitbee from '@splitbee/web';
import DrawerApp from './drawer';
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
    InputGroup,
    InputLeftAddon,
    Checkbox,
    Textarea,
    Box,
    Divider,
    FormErrorMessage,
    FormHelperText,
    Radio,
    RadioGroup,
    Stack,
    useDisclosure
} from '@chakra-ui/react';


type createTaskProps = {
    studie_id: string
    children: ReactNode
}

function validateUrl(value: string, required: boolean) {
    let error;
    if (!value && required) {
        error = 'Required!';
    } else if (value && !/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)) {
        error = 'Invalid url address!';
    }
    return error;
}

function validateRequired(value: any) {
    if (!value) {
        return 'Required!';
    }
}


function CreateTask(props: createTaskProps) {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { mutate } = useSWRConfig()

    const url_api_studie_detail = `${process.env.NEXT_PUBLIC_URL_BASE_API}/studies/${props.studie_id}/`;
    const url_api_task = `${process.env.NEXT_PUBLIC_URL_BASE_API}/tasks/`;

    function procesateUrl(url: string) {
        let new_url = url
        if (new_url) {
            new_url = new_url.replace('https://', '').replace('http://', '')
            new_url = 'https://' + new_url
        }
        return new_url
    }


    const handleCreateTask = (values: any, actions: any) => {
        const data = {
            studie_id: props.studie_id,
            type: values.type,
            typeform_id: values.typeform_id,
            url: procesateUrl(values.url_task),
            target_url: procesateUrl(values.target_url),
            delete_cookie: values.delete_cookie,
            instructions: values.instructions,
            record_screen: values.record_screen,
        }
        fetch(url_api_task, {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body: JSON.stringify(data)
        }).then(function (res) {
            if (!res.ok) throw Error(res.statusText);
            return res;
        }).then(function (data) {
            onClose()
            mutate(url_api_studie_detail)
            successAlert("", "Task created successfully")
            splitbee.track("Create task");
        }).catch(error => {
            errorAlert("Create task error", error.toString());
        }).finally(() => {
            actions.setSubmitting(false)
        })
    };

    const TaskFormSchema = Yup.object().shape({
        type: Yup.string().required('Select a task type to get started'),
    });


    return (
        <>
            <Box onClick={onOpen}>{props.children}</Box>
            <DrawerApp isOpen={isOpen} onClose={onClose} title={'Create new task'}>
                <Formik
                    initialValues={{
                        type: "",
                        typeform_id: "",
                        url_task: "",
                        instructions: "",
                        target_url: "",
                        delete_cookie: false,
                        record_screen: false
                    }}
                    validationSchema={TaskFormSchema}
                    onSubmit={(values, actions) => {
                        handleCreateTask(values, actions)
                    }}>
                    {(props) => (
                        <Form>
                            <Stack spacing={6}>
                                <Field name='type' >
                                    {({ field, form }: any) => (
                                        <FormControl isInvalid={form.errors.type && form.touched.type}>
                                            <FormLabel htmlFor='type'>Type task</FormLabel>
                                            <RadioGroup >
                                                <Stack direction='row' spacing={5}>
                                                    <Radio {...field} colorScheme='green' value='studie'>Web study</Radio>
                                                    <Radio {...field} colorScheme='green' value='typeform'>Form by Typeform</Radio>
                                                </Stack>
                                            </RadioGroup>
                                            <FormErrorMessage>{form.errors.type}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                {props.values.type === 'typeform' &&
                                    <>
                                        <Divider />
                                        <Field name='typeform_id' validate={validateRequired}>
                                            {({ field, form }: any) => (
                                                <FormControl isInvalid={form.errors.typeform_id && form.touched.typeform_id}>
                                                    <FormLabel htmlFor='typeform_id'>Typeform id</FormLabel>
                                                    <Input {...field} id='typeform_id' variant='filled' placeholder='form-id' />
                                                    <FormHelperText ml={1} hidden={form.errors.typeform_id && form.touched.typeform_id}>https://form.typeform.com/to/form-id</FormHelperText>
                                                    <FormErrorMessage ml={1}>{form.errors.typeform_id}</FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>
                                    </>
                                }
                                {props.values.type === 'studie' &&
                                    <>
                                        <Divider />
                                        <Box>
                                            <Field name='url_task' validate={(value: string) => validateUrl(value, true)}>
                                                {({ field, form }: any) => (
                                                    <FormControl isInvalid={form.errors.url_task && form.touched.url_task}>
                                                        <FormLabel htmlFor='url_task'>Url</FormLabel>
                                                        <InputGroup>
                                                            <InputLeftAddon children="https://" />
                                                            <Input {...field} id='url_task' variant='filled' placeholder="www.example.com" />
                                                        </InputGroup >
                                                        <FormHelperText ml={1} hidden={form.errors.url_task && form.touched.url_task}>This is where your study will begin.</FormHelperText>
                                                        <FormErrorMessage ml={1}>{form.errors.url_task}</FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <Field name='delete_cookie' >
                                                {({ field, form }: any) => (
                                                    <FormControl mt={3} ml={1} isInvalid={form.errors.delete_cookie && form.touched.delete_cookie}>
                                                        <Checkbox {...field} id='delete_cookie' colorScheme='red'>
                                                            Delete Cookies?
                                                        </Checkbox>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </Box>
                                        <Field name='instructions' validate={validateRequired}>
                                            {({ field, form }: any) => (
                                                <FormControl isInvalid={form.errors.instructions && form.touched.instructions}>
                                                    <FormLabel htmlFor='instructions'>User Instructions</FormLabel>
                                                    <Textarea {...field} id='instructions' resize="none" placeholder='Delete the last item added to the cart' />
                                                    <FormErrorMessage>{form.errors.instructions}</FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>
                                        <Field name='target_url' validate={(value: string) => validateUrl(value, false)}>
                                            {({ field, form }: any) => (
                                                <FormControl isInvalid={form.errors.target_url && form.touched.target_url}>
                                                    <FormLabel htmlFor='target_url'>Url target</FormLabel>
                                                    <InputGroup>
                                                        <InputLeftAddon children="https://" />
                                                        <Input {...field} id='target_url' placeholder="www.example.com/target" />
                                                    </InputGroup >
                                                    <FormHelperText hidden={form.errors.target_url && form.touched.target_url}>The task ends automatically when the user clicks on a link with this url.</FormHelperText>
                                                    <FormErrorMessage>{form.errors.target_url}</FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>
                                        <Divider />
                                        <Field name='record_screen' >
                                            {({ field, form }: any) => (
                                                <FormControl mt={3} ml={1} isInvalid={form.errors.record_screen && form.touched.record_screen}>
                                                    <Checkbox {...field} id='record_screen' colorScheme='red'>
                                                        Record screen?
                                                    </Checkbox>
                                                </FormControl>
                                            )}
                                        </Field>
                                    </>
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

export default CreateTask;