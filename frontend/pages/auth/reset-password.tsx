import React, { useEffect, useState } from "react";
import GetLayoutWeb from "../../layouts/layoutWeb";
import { useRouter } from 'next/router';
import { errorAlert, successAlert } from '../../services/alert.service';
import splitbee from '@splitbee/web';
import { useFormik } from "formik";

import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';



ResetPassword.getLayout = GetLayoutWeb

export default function ResetPassword(): JSX.Element {

    const router = useRouter();
    const { token } = router.query
    const [loading, setLoading] = useState(false);
    const [isInvalidPassword, setInValidPassword] = useState(false);

    function invalidToken() {
        errorAlert('', "Token is not valid");
        router.push('/auth/forgot');
    }

    const handleForgot = (password1: string, password2: string) => {

        if (password1.localeCompare(password2) != 0) {
            setLoading(false);
            setInValidPassword(true);
            errorAlert('', "Passwords do not match");
            return
        }
        if (!token) {
            invalidToken();
            return
        }
        const data = {
            "method": "token",
            "formFields": [
                {
                    "id": "password",
                    "value": password1
                }
            ],
            "token": token
        }


        fetch(`${process.env.NEXT_PUBLIC_URL_BASE_API}/api/auth/user/password/reset`, {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(function (res) {
            if (!res.ok) throw Error(res.statusText);
            return res;
        }).then(reponse => reponse.json()).then(data => {

            if (data.status === "FIELD_ERROR") {
                setLoading(false);
                for (let field of data.formFields) {
                    if (field.id === 'password') {
                        setInValidPassword(true);
                        errorAlert('', field.error);

                    }
                }
            } else if (data.status === "OK") {
                splitbee.track("Change password")
                router.push('/auth/login');
                successAlert('', 'Successful change');
            } else if (data.status === "RESET_PASSWORD_INVALID_TOKEN_ERROR") {
                invalidToken();
            }

        }).catch(error => {
            setLoading(false);
            errorAlert('', error.toString());
        }
        );

    };

    const formik = useFormik({
        initialValues: {
            password1: "",
            password2: "",
        },
        onSubmit: (values) => {
            setLoading(true);
            handleForgot(values.password1, values.password2);

        },
        // validationSchema: Yup.object({
        //   email: Yup.string().trim().required("Le nom d'utilisateur est requis"),
        //   password: Yup.string().trim().required("Le mot de passe est requis"),
        // }),
    });

    return (
        <Flex
            align={'center'}
            justify={'center'}>

            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Change your password</Heading>
                    <Text fontSize={'lg'} color={'gray.600'}>

                    </Text>
                </Stack>

                <form onSubmit={formik.handleSubmit}>
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow={'lg'}
                        p={8}>
                        <Stack spacing={4}>
                            <FormControl id="password1">
                                <FormLabel>New password</FormLabel>
                                <Input isRequired
                                    type="password"
                                    isInvalid={isInvalidPassword}
                                    value={formik.values.password1}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} />
                            </FormControl>
                            <FormControl id="password2">
                                <FormLabel>Confirm new password</FormLabel>
                                <Input isRequired
                                    type="password"
                                    isInvalid={isInvalidPassword}
                                    value={formik.values.password2}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} />
                            </FormControl>
                            <Stack spacing={10}>
                                <Button
                                    type="submit"
                                    isLoading={loading}
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    Change password
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </form>
            </Stack>
        </Flex>
    );

}