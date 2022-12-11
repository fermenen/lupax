import React from "react";
import GetLayoutWeb from "../../layouts/layoutWeb";
import * as Yup from 'yup';
import splitbee from '@splitbee/web';
import { errorAlert, successAlert } from '../../services/alert.service';
import { Field, Form, Formik } from "formik";

import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  FormErrorMessage
} from '@chakra-ui/react';


ForgotPassword.getLayout = GetLayoutWeb

export default function ForgotPassword(): JSX.Element {

  const url_api_forgot = `${process.env.NEXT_PUBLIC_URL_BASE_API}/api/auth/user/password/reset/token`;

  const handleForgotUser = (values: any, actions: any) => {
    const dataInput = {
      "formFields": [
        {
          "id": "email",
          "value": values.email
        }
      ]
    }
    fetch(url_api_forgot, {
      method: 'POST',
      headers: { "content-type": "application/json" },
      body: JSON.stringify(dataInput)
    }).then(function (res) {
      if (!res.ok) throw Error(res.statusText);
      return res;
    }).then(reponse => reponse.json()).then(data => {
      if (data.status === "OK") {
        successAlert('Recovery link sent', 'Please check your email for the password recovery link.');
        splitbee.track("Forgot password");
        actions.resetForm({
          values: {
            email: ''
          },
        });
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



  const UserForgotFormSchema = Yup.object().shape({
    email: Yup.string()
      .email()
      .required('Required'),
  });


  return (
    <Flex
      align={'center'}
      justify={'center'}>
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Forgot your password?
        </Heading>
        <Text
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.400')}>
          You&apos;ll get an email with a reset link
        </Text>
        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={UserForgotFormSchema}
          onSubmit={(values, actions) => {
            handleForgotUser(values, actions)
          }}>
          {(props) => (
            <Form>
              <Field name='email' >
                {({ field, form }: any) => (
                  <FormControl isInvalid={form.errors.email && form.touched.email}>
                    <Input {...field} id='email' placeholder="your-email@example.com" _placeholder={{ color: 'gray.500' }} />
                    <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Stack spacing={6} mt={6}>
                <Button
                  type="submit"
                  isLoading={props.isSubmitting}
                  bg={'green.700'}
                  color={'white'}
                  _hover={{
                    bg: 'green.800',
                  }}>
                  Request reset
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Stack>
    </Flex>
  );
}