import * as Yup from 'yup';
import FailedToLoad from '../../components/failedToLoad';
import Main from '../../components/main';
import BarPage from '../../components/barPage';
import NextLink from "next/link";
import splitbee from '@splitbee/web';
import { CardIcon } from '../../components/card';
import { getLayoutDashboard } from '../../layouts/layoutDashboard';
import { LogoutUser, useUser } from '../../services/users.service';
import { ChangeEvent, useState } from 'react';
import { errorAlert, successAlert } from '../../services/alert.service';
import { DeleteIcon, UnlockIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import { User } from '../../interfaces';
import { Formik, Field, Form } from 'formik';

import {
    VStack,
    Text,
    Avatar,
    Flex,
    Box,
    FormControl,
    FormLabel,
    Switch,
    Skeleton,
    Select,
    Divider,
    Button,
    HStack,
    useDisclosure,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    FormErrorMessage,
    Input,
    FormHelperText,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';

import {
    FiUser,
    FiSettings,
    FiBell,
} from 'react-icons/fi';



Settings.getLayout = getLayoutDashboard

export default function Settings() {

    const { user, isLoading, isError, mutate } = useUser();

    if (isError) return FailedToLoad("failed to load")

    return (
        <Main>
            <BarPage title="Settings" />
            <VStack
                spacing={5}
                align='stretch'>
                {isLoading &&
                    <>
                        <Skeleton height='120px' />
                        <Skeleton height='120px' />
                        <Skeleton height='120px' />
                    </>
                }
                {!isLoading &&
                    <>
                        <CardAccount user={user} mutate={mutate} />
                        <Preferences />
                        <Notifications user={user} mutate={mutate} />
                        <LinksMore />
                    </>
                }
            </VStack>
        </Main>
    )

}


function CardAccount({ user, mutate }: { user: User, mutate: Function }) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenModalPassword, onOpen: onOpenModalPassword, onClose: onCloseModalPassword } = useDisclosure();
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();
    const key_url_api_me = `${process.env.NEXT_PUBLIC_URL_BASE_API}/me/`;

    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const deleteAccount = async () => {
        setDeleting(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_BASE_API}/delete_account/`, { method: 'DELETE' });
        if (response.status == 200) {
            if (await LogoutUser() == true) {
                mutate(key_url_api_me).then(() => {
                    router.push('/').then(() => {
                        splitbee.track("Delete account");
                        successAlert('', 'Account deleted successfully');
                    })
                })

            }
        } else {
            setDeleting(false);
            onClose();
            errorAlert('A problem occurred while deleting the account', 'Contact support if you need assistance');
        }
    };

    const handleChangePassword = (values: any, actions: any) => {
        const data = { old_password: values.old_password,  new_password: values.new_password}
        fetch(`${process.env.NEXT_PUBLIC_URL_BASE_API}/change_password/`, {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body: JSON.stringify(data)
        }).then(function (res) {
            if (!res.ok) throw Error(res.statusText);
            return res;
        }).then(function (data) {
            onCloseModalPassword()
            successAlert("", "Password changed successfully")
            splitbee.track("Password changed");
        }).catch(error => {
            errorAlert("Error changing password", error.toString());
        }).finally(() => {
            actions.setSubmitting(false)
        })
    };

    const ChangePasswordSchema = Yup.object().shape({
        old_password: Yup.string()
            .min(8, 'Too Short! (min 8 characters)')
            .required('Required'),
        new_password: Yup.string()
            .min(8, 'Too Short! (min 8 characters)')
            .required('Required'),
    });

    return (
        <>
            <CardIcon title={'Account'} icon={FiUser}>
                <>
                    <Flex>
                        <Avatar name={user.name} src={user.profile_picture} />
                        <Box ml='3'>
                            <Text fontWeight='bold'>
                                {user.name} {user.last_name}
                            </Text>
                            <Text fontSize='sm'>{user.email}</Text>
                        </Box>
                    </Flex>
                    <Divider mt={5} mb={5} />
                    <HStack>
                        <Button onClick={onOpenModalPassword} leftIcon={<UnlockIcon />} colorScheme='gray' variant='solid' size='sm'>
                            Change password
                        </Button>
                        <Button onClick={onOpen} leftIcon={<DeleteIcon />} colorScheme='red' variant='solid' size='sm'>
                            Delete account
                        </Button>
                    </HStack>
                </>
            </CardIcon>
            <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Are you sure?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Text fontSize='lg'>
                            This action is irreversible, all your studies, results, teams will be deleted imminently, with no possibility to recover them.
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={deleteAccount} isLoading={deleting} colorScheme='red' mr={3}>
                            Delete account
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenModalPassword} onClose={onCloseModalPassword}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Change password</ModalHeader>
                    <ModalCloseButton />
                    <Formik
                        initialValues={{
                            old_password: "",
                            new_password: ""
                        }}
                        validationSchema={ChangePasswordSchema}
                        onSubmit={(values, actions) => { handleChangePassword(values, actions) }}>
                        {(props) => (
                            <Form>
                                <ModalBody pb={6}>
                                    <Field name='old_password'>
                                        {({ field, form }: any) => (
                                            <FormControl isInvalid={form.errors.old_password && form.touched.old_password} mb={4}>
                                                <FormLabel htmlFor='old_password'>Old password</FormLabel>
                                                <InputGroup>
                                                    <Input {...field} id='old_password' type={showPassword1 ? 'text' : 'password'} />
                                                    <InputRightElement h={'full'}>
                                                        <Button
                                                            variant={'ghost'}
                                                            onClick={() =>
                                                                setShowPassword1((showPassword1) => !showPassword1)
                                                            }>
                                                            {showPassword1 ? <ViewIcon /> : <ViewOffIcon />}
                                                        </Button>
                                                    </InputRightElement>
                                                </InputGroup>
                                                <FormErrorMessage>{form.errors.old_password}</FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name='new_password' >
                                        {({ field, form }: any) => (
                                            <FormControl isInvalid={form.errors.new_password && form.touched.new_password}>
                                                <FormLabel htmlFor='new_password'>New password</FormLabel>
                                                <InputGroup>
                                                    <Input {...field} id='new_password' type={showPassword2 ? 'text' : 'password'} />
                                                    <InputRightElement h={'full'}>
                                                        <Button
                                                            variant={'ghost'}
                                                            onClick={() =>
                                                                setShowPassword2((showPassword2) => !showPassword2)
                                                            }>
                                                            {showPassword2 ? <ViewIcon /> : <ViewOffIcon />}
                                                        </Button>
                                                    </InputRightElement>
                                                </InputGroup>
                                                <FormHelperText hidden={form.errors.new_password && form.touched.new_password}>Must be 8 characters and including a number.</FormHelperText>
                                                <FormErrorMessage>{form.errors.new_password}</FormErrorMessage>
                                            </FormControl>
                                        )}
                                    </Field>
                                </ModalBody>
                                <ModalFooter>
                                    <Button type="submit" isLoading={props.isSubmitting} colorScheme='green' mr={3}>
                                        Change
                                    </Button>
                                    <Button onClick={onCloseModalPassword}>Cancel</Button>
                                </ModalFooter>
                            </Form>
                        )}
                    </Formik>
                </ModalContent>
            </Modal>
        </>

    )
}

function Preferences() {

    return (
        <CardIcon title={'Preferences'} icon={FiSettings}>
            <FormControl>
                <Box maxW='sm'>
                    <FormLabel htmlFor='language'>Language</FormLabel>
                    <Select>
                        <option value='english-int'>English (int)</option>
                    </Select>
                </Box>
            </FormControl>
        </CardIcon>
    )
}


function Notifications({ user, mutate }: { user: User, mutate: Function }) {

    const handleditPreferences = (preference: string, value: boolean) => {

        const url_api_me_preferences = `${process.env.NEXT_PUBLIC_URL_BASE_API}/me/preferences/`;
        const data = {
            [preference]: value
        }

        fetch(url_api_me_preferences, {
            method: 'PATCH',
            headers: { "content-type": "application/json" },
            body: JSON.stringify(data)
        }).then(function (res) {
            if (!res.ok) throw Error(res.statusText);
            return res;
        }).then(function (data) {
            mutate();
        }).catch(error => {
            errorAlert("Modify alerts error", error.toString());
        })
    };

    return (
        <CardIcon title={'Notifications'} icon={FiBell}>
            <VStack spacing={4} align={'stretch'}>
                <FormControl display='flex' alignItems='center'>
                    <FormLabel htmlFor='team_alerts' mb='0'>
                        Team alerts?
                    </FormLabel>
                    <Switch
                        id='team_alerts'
                        value={user.preferences.team_alerts.toString()}
                        isChecked={user.preferences.team_alerts}
                        colorScheme={'green'}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            var actual_selected = (event.currentTarget.value.toLowerCase() === 'true');
                            handleditPreferences('team_alerts', !actual_selected)
                        }}
                    />
                </FormControl>
                <FormControl display='flex' alignItems='center'>
                    <FormLabel htmlFor='tips_alerts' mb='0'>
                        Tips on the use of lupax?
                    </FormLabel>
                    <Switch
                        id='tips_alerts'
                        // value={user.preferences.tips_alerts.toString()}
                        // isChecked={user.preferences.tips_alerts}
                        colorScheme={'green'}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            var actual_selected = (event.currentTarget.value.toLowerCase() === 'true');
                            handleditPreferences('tips_alerts', !actual_selected)
                        }}
                    />
                </FormControl>
            </VStack>
        </CardIcon>
    )
}

function LinksMore() {

    return (
        <Box>
            <HStack spacing='2' ml={2} mt={2}>
                <NextLink href='/my/privacy' passHref>
                    <Button colorScheme='gray' variant='link'>
                        Privacy Policy
                    </Button>
                </NextLink>
                <NextLink href={`${process.env.NEXT_PUBLIC_URL_BASE_API}/documentation/`} passHref>
                    <Button colorScheme='gray' variant='link'>
                        API References
                    </Button>
                </NextLink>
            </HStack>
        </Box>
    )
}