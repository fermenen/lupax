import { Heading, Spacer, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";


interface BarPageProps {
    title: string;
    children?: ReactNode;
}

export default function BarPage(props: BarPageProps) {


    return (
        <>
            <Flex mb={{ base: 5, md: 9 }}>
                <Heading>{props.title}</Heading>
                <Spacer></Spacer>
                {props.children &&
                    props.children}
            </Flex>
        </>
    )

}