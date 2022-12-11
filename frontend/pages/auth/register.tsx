import * as Yup from 'yup';
import NextLink from "next/link";
import splitbee from '@splitbee/web';
import GetLayoutWeb from "../../layouts/layoutWeb";
import React, { useEffect, useState } from "react";
import { GoogleButtonLoginRegister } from "../../components/mini/buttonSocial";
import { Field, Form, Formik } from "formik";
import { useSWRConfig } from 'swr';
import { errorAlert, successAlert } from '../../services/alert.service';
import { useUser, useUserLogin } from "../../services/users.service";
import { useRouter } from 'next/router';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';


import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    FormErrorMessage,
    InputRightElement,
    Stack,
    HStack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    FormHelperText,
} from '@chakra-ui/react';



Register.getLayout = GetLayoutWeb


export default function Register(): JSX.Element {

    const url_api_signup = `${process.env.NEXT_PUBLIC_URL_BASE_API}/api/auth/signup`;
    const key_url_api_me = `${process.env.NEXT_PUBLIC_URL_BASE_API}/me/`;
    const { user, isLoading, isError } = useUser(); //Dont remove this line
    const bgBox = useColorModeValue('white', 'gray.700');
    const router = useRouter();
    const { mutate } = useSWRConfig()
    const { isLogin, siteRedirect } = useUserLogin();
    const [showPassword, setShowPassword] = useState(false);


    useEffect(() => {
        if (isLogin) router.push(siteRedirect);
    }, [isLogin, router, siteRedirect]);


    const handleCreateUser = (values: any, actions: any) => {
        const dataInput = {
            "formFields": [
                {
                    "id": "email",
                    "value": values.email
                },
                {
                    "id": "password",
                    "value": values.password
                },
                {
                    "id": "name",
                    "value": values.name
                },
                {
                    "id": "last_name",
                    "value": values.last_name
                },
            ]
        }
        fetch(url_api_signup, {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body: JSON.stringify(dataInput)
        }).then(function (res) {
            if (!res.ok) throw Error(res.statusText);
            return res;
        }).then(reponse => reponse.json()).then(data => {
            if (data.status === "OK" && data.user) {
                mutate(key_url_api_me).then(() => {
                    successAlert('', `Successful register!`);
                    router.push(siteRedirect);
                    splitbee.track("Sign Up")
                    splitbee.user.set({
                        userId: data.user.id,
                        email: data.user.email
                    })
                })
            } else if (data.status === "EMAIL_ALREADY_EXISTS_ERROR") {
                actions.setFieldError('email', 'Email is already registered');
            } else if (data.status === "FIELD_ERROR") {
                for (let field of data.formFields) {
                    actions.setFieldError(field.id, field.error);
                }
            }
        }).catch(error => {
            errorAlert('', error.toString());
        }).finally(() => {
            actions.setSubmitting(false)
        })
    };

    const UserSignUpFormSchema = Yup.object().shape({
        name: Yup.string()
            .min(4, 'Too Short! (min 4 characters)')
            .max(20, 'Too Long! (max 20 characters)')
            .required('Required'),
        last_name: Yup.string()
            .min(4, 'Too Short! (min 4 characters)')
            .max(40, 'Too Long! (max 40 characters)'),
        email: Yup.string()
            .email()
            .required('Required'),
        password: Yup.string()
            .min(8, 'Too Short! (min 8 characters)')
            .required('Required'),
    });


    return (
        <Flex
            align={'center'}
            justify={'center'}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Sign up</Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        to enjoy all of our cool features ✌️
                    </Text>
                </Stack>
                <Formik
                    initialValues={{
                        name: "",
                        last_name: "",
                        email: "",
                        password: ""
                    }}
                    validationSchema={UserSignUpFormSchema}
                    onSubmit={(values, actions) => {
                        handleCreateUser(values, actions)
                    }}>
                    {(props) => (
                        <Form>
                            <Box
                                rounded={'lg'}
                                bg={bgBox}
                                boxShadow={'lg'}
                                p={8}>
                                <Stack spacing={4}>

                                    <HStack>
                                        <Box>
                                            <Field name='name' >
                                                {({ field, form }: any) => (
                                                    <FormControl isInvalid={form.errors.name && form.touched.name}>
                                                        <FormLabel htmlFor='name'>First Name</FormLabel>
                                                        <Input {...field} id='name' />
                                                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </Box>
                                        <Box>
                                            <Field name='last_name' >
                                                {({ field, form }: any) => (
                                                    <FormControl isInvalid={form.errors.last_name && form.touched.last_name}>
                                                        <Flex justifyContent={'space-between'}>
                                                            <FormLabel htmlFor='last_name'>Last name</FormLabel>
                                                            <Text color={'gray'}>Optional</Text>
                                                        </Flex>
                                                        <Input {...field} id='last_name' />
                                                        <FormErrorMessage>{form.errors.last_name}</FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                        </Box>
                                    </HStack>
                                    <Field name='email' >
                                        {({ field, form }: any) => (
                                            <FormControl isInvalid={form.errors.email && form.touched.email}>
                                                <FormLabel htmlFor='email'>Email address</FormLabel>
                                                <Input {...field} id='email' />
                                                <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name='password' >
                                        {({ field, form }: any) => (
                                            <FormControl isInvalid={form.errors.password && form.touched.password}>
                                                <FormLabel htmlFor='password'>Password</FormLabel>
                                                <InputGroup>
                                                    <Input {...field} id='password' type={showPassword ? 'text' : 'password'} />
                                                    <InputRightElement h={'full'}>
                                                        <Button
                                                            variant={'ghost'}
                                                            onClick={() =>
                                                                setShowPassword((showPassword) => !showPassword)
                                                            }>
                                                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                                        </Button>
                                                    </InputRightElement>
                                                </InputGroup>
                                                <FormHelperText hidden={form.errors.password && form.touched.password}>Must be 8 characters and including a number.</FormHelperText>
                                                <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Stack spacing={10} pt={2}>
                                        <Button
                                            type="submit"
                                            isLoading={props.isSubmitting}
                                            loadingText="Submitting"
                                            size="lg"
                                            bg={'green.700'}
                                            color={'white'}
                                            _hover={{
                                                bg: 'green.800',
                                            }}>
                                            Sign up
                                        </Button>
                                    </Stack>
                                    <GoogleButtonLoginRegister textButton="Continue with google" />
                                    <Stack pt={6}>
                                        <Text align={'center'}>
                                            Already a user? {" "}
                                            <NextLink href='/auth/login' passHref>
                                                <Link color={'green.600'}>Login</Link>
                                            </NextLink>
                                        </Text>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Stack>
        </Flex>
    );
}