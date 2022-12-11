import { chakra } from '@chakra-ui/react';
import type { ReactNode } from 'react'


function Main({ children }: { children: ReactNode }) {


    return (
        <>
            <chakra.main
                p={6}>
                {children}
            </chakra.main>
        </>
    )

}

export default Main;