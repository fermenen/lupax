import * as Yup from 'yup';
import splitbee from '@splitbee/web';
import GetLayoutWeb from "../../layouts/layoutWeb";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import { GoogleButtonLoginRegister } from "../../components/mini/buttonSocial";
import { Field, Form, Formik } from "formik";
import { useRouter } from 'next/router';
import { errorAlert, successAlert } from '../../services/alert.service';
import { useUser, useUserLogin } from "../../services/users.service";
import { useSWRConfig } from 'swr';
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
    FormErrorMessage,
    InputGroup,
    InputRightElement,
    FormHelperText,
} from '@chakra-ui/react';



Login.getLayout = GetLayoutWeb


export default function Login(): JSX.Element {

    const router = useRouter();
    const url_api_signin = `${process.env.NEXT_PUBLIC_URL_BASE_API}/api/auth/signin`;
    const key_url_api_me = `${process.env.NEXT_PUBLIC_URL_BASE_API}/me/`;
    const { user, isLoading, isError } = useUser(); //Dont remove this line
    const { mutate } = useSWRConfig()
    const bg_box = useColorModeValue('white', 'gray.700');
    const [showPassword, setShowPassword] = useState(false);
    const { isLogin, siteRedirect } = useUserLogin();


    useEffect(() => {
        if (isLogin) router.push(siteRedirect);
    }, [isLogin, router, siteRedirect]);


    const handleSignInUser = (values: any, actions: any) => {
        const dataInput = {
            "formFields": [
                {
                    "id": "email",
                    "value": values.email
                },
                {
                    "id": "password",
                    "value": values.password
                }
            ]
        }
        fetch(url_api_signin, {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body: JSON.stringify(dataInput)
        }).then(function (res) {
            if (!res.ok) throw Error(res.statusText);
            return res;
        }).then(reponse => reponse.json()).then(data => {
            if (data.status === "OK" && data.user) {
                mutate(key_url_api_me).then(() => {
                    router.push(siteRedirect);
                    successAlert('', `Welcome back!`);
                    splitbee.track("Sign In")
                    splitbee.user.set({
                        userId: data.user.id,
                        email: data.user.email
                    })
                })
            } else if (data.status === "WRONG_CREDENTIALS_ERROR") {
                errorAlert('', 'Access credentials error');
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


    const UserSignInFormSchema = Yup.object().shape({
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
                    <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>
                        to enjoy all of our cool features ✌️
                    </Text>
                </Stack>
                <Formik
                    initialValues={{
                        email: "",
                        password: ""
                    }}
                    validationSchema={UserSignInFormSchema}
                    onSubmit={(values, actions) => {
                        handleSignInUser(values, actions)
                    }}>
                    {(props) => (
                        <Form>
                            <Box
                                rounded={'lg'}
                                bg={bg_box}
                                boxShadow={'lg'}
                                p={8}>
                                <Stack spacing={4}>
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
                                    <Stack spacing={7}>
                                        <Stack
                                            direction={{ base: 'column', sm: 'row' }}
                                            align={'start'}
                                            justify={'space-between'}>
                                            <NextLink href='/auth/forgot' passHref>
                                                <Link color={'green.600'}>Forgot password?</Link>
                                            </NextLink>
                                        </Stack>
                                        <Button
                                            type="submit"
                                            isLoading={props.isSubmitting}
                                            bg={'green.700'}
                                            color={'white'}
                                            _hover={{
                                                bg: 'green.800',
                                            }}>
                                            Sign in
                                        </Button>
                                        <GoogleButtonLoginRegister textButton="Sign in with google" />
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