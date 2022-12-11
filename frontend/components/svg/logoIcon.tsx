import { chakra, HTMLChakraProps } from '@chakra-ui/react'

export const LogoIcon = (props: HTMLChakraProps<'svg'>) => (
    <chakra.svg
        height="9"
        width="auto"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 612 612"
        {...props}
    >
        <path
            style={{
                fill: "#f0ac00",
            }}
            d="M-6.59-14.6h634.17v641.21H-6.59z"
        />
        <path
            d="M278.24 76.6V529h-66.32V76.6Z"
            style={{
                fill: "#004d53",
            }}
        />
        <path
            d="M327 496.2a38.24 38.24 0 0 1 11.73-27.95q11.55-11.56 29.14-11.57c11.72 0 21.43 3.86 29.47 11.57a38.24 38.24 0 0 1 11.73 27.95 37 37 0 0 1-11.73 27.63c-8 7.71-17.75 11.57-29.47 11.57s-21.44-3.86-29.14-11.57A37 37 0 0 1 327 496.2Z"
            style={{
                fill: "#006971",
            }}
        />
    </chakra.svg>
);


