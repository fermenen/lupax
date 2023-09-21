import { useDisclosure, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, LinkBox, LinkOverlay, Button, Icon, Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { FaXTwitter } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";


export function ModalHelp({ children }: { children: ReactNode }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Box onClick={onOpen}>
                {children}
            </Box>
            <Modal
                isCentered
                isOpen={isOpen}
                onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Get support
                        <Text fontSize='sm' color='gray.500'>We’re here to help you get the most out of lupax.</Text>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex p={1} mb={1}>
                            <LinkBox>
                                <LinkOverlay href='mailto:support@lupax.app' isExternal>
                                    <Button leftIcon={<Icon as={FiMail} />} colorScheme='teal' variant='ghost'>
                                        support@lupax.app
                                    </Button>
                                </LinkOverlay>
                            </LinkBox>
                            <LinkBox>
                                <LinkOverlay href='https://x.com/lupax_app/' isExternal>
                                    <Button leftIcon={<Icon as={FaXTwitter} />} colorScheme='teal' variant='ghost'>
                                        @lupax_app
                                    </Button>
                                </LinkOverlay>
                            </LinkBox>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}