import { ReactNode, ReactText } from "react";
import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay } from "@chakra-ui/react";


interface UseDrawerAppProps {
    isOpen: boolean
    onClose: any
    title: ReactText
    children: ReactNode
    initialFocusRef?: any
}


export default function DrawerApp({ isOpen, onClose, title, initialFocusRef, children }: UseDrawerAppProps) {

    return (
        <>
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                initialFocusRef={initialFocusRef}
                size='xl'>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='1px'>{title}</DrawerHeader>
                    <DrawerBody p={8}>
                        {children}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )

}