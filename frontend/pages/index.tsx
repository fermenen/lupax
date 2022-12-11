import NextLink from "next/link";
import Head from 'next/head'
import GetLayoutWeb from "../layouts/layoutWeb";
import { useRouter } from 'next/router';
import { useUserLogin } from "../services/users.service";
import { useEffect } from "react";


import {
  chakra,
  Box,
  VStack,
  LinkOverlay,
  LinkBox,
  useColorModeValue,
  Button,
  Stack,
  Image,
  Text,
  Icon,
} from "@chakra-ui/react";


Web.getLayout = GetLayoutWeb


export default function Web() {

  const router = useRouter();
  const { isLogin, siteRedirect } = useUserLogin();

  useEffect(() => {
    if (isLogin) router.push(siteRedirect);
  }, [isLogin, router, siteRedirect]);

  return (

    <Box px={8} py={24} mx="auto">
      <Head>
        <title>The user experience (UX) research app | lupax.</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="lupax is a UX platform where brands can test and measure user experience on websites, apps and prototypes using a range of user research methods."></meta>
      </Head>

      <Box
        w={{ base: "full", md: 11 / 12, xl: 9 / 12 }}
        mx="auto"
        textAlign={{ base: "left", md: "center" }}
      >
        <chakra.h1
          mb={6}
          fontSize={{ base: "4xl", md: "6xl" }}
          fontWeight="bold"
          lineHeight="none"
          letterSpacing={{ base: "normal", md: "tight" }}
          color={useColorModeValue("gray.900", "gray.100")}
        >
          Your{" "}
          <Text
            display={{ base: "block", lg: "inline" }}
            w="full"
            bgClip="text"
            bgGradient="linear(to-r, green.700, purple.500)"
            fontWeight="extrabold"
          >
            usability studies
          </Text>{" "}
          made easy.
        </chakra.h1>
        <chakra.p
          px={{ base: 0, lg: 24 }}
          mb={6}
          fontSize={{ base: "lg", md: "xl" }}
          color={useColorModeValue("gray.600", "gray.300")}
        >
          lupax is a user experience research software that will allow you to really know your users.
        </chakra.p>

        <VStack>

          <Stack
            direction={{ base: "column", sm: "row" }}
            mb={{ base: 1, md: 3 }}
            spacing={2}
            justifyContent={{ sm: "left", md: "center" }}>

            <LinkBox>
              <NextLink href='/auth/register' passHref>
                <LinkOverlay>
                  <Button
                    as="a"
                    data-splitbee-event="Click get started(CTA)"
                    variant="solid"
                    colorScheme="orange"
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                    w={{ base: "full", sm: "auto" }}
                    mb={{ base: 2, sm: 0 }}
                    size="lg"
                    cursor="pointer">
                    Get started for free
                    <Icon boxSize={4} ml={1} viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </Icon>
                  </Button>
                </LinkOverlay>
              </NextLink>
            </LinkBox>

            {/* <Button
            as="a"
            colorScheme="gray"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            w={{ base: "full", sm: "auto" }}
            mb={{ base: 2, sm: 0 }}
            size="lg"
            cursor="pointer"
          >
            Book a Demo
            <Icon boxSize={4} ml={1} viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
                clipRule="evenodd"
              />
            </Icon>
          </Button> */}
          </Stack>
          <Text color={'gray.500'} maxW={'md'}>
            No credit card · No time limit
          </Text>
        </VStack>
      </Box>
      <Box
        w={{ base: "full", md: 10 / 12 }}
        mx="auto"
        mt={20}
        textAlign="center"
      >
        <Image
          w="full"
          rounded="lg"
          shadow="2xl"
          src="/hero.png"
          alt="lupax software screenshot"
        />
      </Box>

    </Box>

  );
}
