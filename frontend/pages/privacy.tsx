/* eslint-disable react/no-unescaped-entities */
import GetLayoutWeb from "../layouts/layoutWeb"
import Link from 'next/link'

import {
    Container,
    Text,
    Divider,
    UnorderedList,
    ListItem,
    OrderedList
} from "@chakra-ui/react"


Privacy.getLayout = GetLayoutWeb


export default function Privacy() {


    return (
        <Container maxW='900px' mt={10} mb={10}>

            <Text fontSize='3xl' mb={4}>Privacy Policy of lupax.app</Text>

            <Text>Latest update: May 18, 2022</Text>
            <Text>This Application collects some Personal Data from its Users.</Text>
            <Text>This document can be printed for reference by using the print command in the settings of any browser.</Text>

            <Divider mt={4} />
            <Text fontSize='2xl'>Owner and Data Controller</Text>

            <Text>
                lupax.app - Fernando Menéndez
            </Text>
            <Text>Owner contact email: <Link href={'mailto:fernando@lupax.app'}>fernando@lupax.app</Link></Text>

            <Divider mt={4} />
            <Text fontSize='2xl'>Types of Data collected</Text>

            <Text>
                <Text>Among the types of Personal Data that this Application collects, by itself or through third parties, there are: Usage Data; email address.</Text>
                <Text>Complete details on each type of Personal Data collected are provided in the dedicated sections of this privacy policy or by specific explanation texts displayed prior to the Data collection.
                    Personal Data may be freely provided by the User, or, in case of Usage Data, collected automatically when using this Application.
                    Unless specified otherwise, all Data requested by this Application is mandatory and failure to provide this Data may make it impossible for this Application to provide its services. In cases where this Application specifically states that some Data is not mandatory, Users are free not to communicate this Data without consequences to the availability or the functioning of the Service.
                    Users who are uncertain about which Personal Data is mandatory are welcome to contact the Owner.
                    Any use of Cookies – or of other tracking tools – by this Application or by the owners of third-party services used by this Application serves the purpose of providing the Service required by the User, in addition to any other purposes described in the present document and in the Cookie Policy, if available.</Text>
                <Text>Users are responsible for any third-party Personal Data obtained, published or shared through this Application and confirm that they have the third party's consent to provide the Data to the Owner.</Text>
            </Text>


            <Divider mt={4} />
            <Text fontSize='2xl'>Mode and place of processing the Data</Text>

            <Text fontSize='xl' mt={2}>Methods of processing</Text>
            <Text>
                <Text>The Owner takes appropriate security measures to prevent unauthorized access, disclosure, modification, or unauthorized destruction of the Data.</Text>
                <Text>The Data processing is carried out using computers and/or IT enabled tools, following organizational procedures and modes strictly related to the purposes indicated. In addition to the Owner, in some cases, the Data may be accessible to certain types of persons in charge, involved with the operation of this Application (administration, sales, marketing, legal, system administration) or external parties (such as third-party technical service providers, mail carriers, hosting providers, IT companies, communications agencies) appointed, if necessary, as Data Processors by the Owner. The updated list of these parties may be requested from the Owner at any time.</Text>
            </Text>
            <Text fontSize='xl' mt={2}>Legal basis of processing</Text>
            <Text>
                The Owner may process Personal Data relating to Users if one of the following applies:
            </Text>
            <UnorderedList>
                <ListItem>Users have given their consent for one or more specific purposes. Note: Under some legislations the Owner may be allowed to process Personal Data until the User objects to such processing (“opt-out”), without having to rely on consent or any other of the following legal bases. This, however, does not apply, whenever the processing of Personal Data is subject to European data protection law;</ListItem>
                <ListItem>provision of Data is necessary for the performance of an agreement with the User and/or for any pre-contractual obligations thereof;</ListItem>
                <ListItem>processing is necessary for compliance with a legal obligation to which the Owner is subject;</ListItem>
                <ListItem>processing is related to a task that is carried out in the public interest or in the exercise of official authority vested in the Owner;</ListItem>
                <ListItem>processing is necessary for the purposes of the legitimate interests pursued by the Owner or by a third party.</ListItem>
            </UnorderedList>
            <Text>
                In any case, the Owner will gladly help to clarify the specific legal basis that applies to the processing, and in particular whether the provision of Personal Data is a statutory or contractual requirement, or a requirement necessary to enter into a contract.
            </Text>

            <Text fontSize='xl' mt={2}>Place</Text>
            <Text>
                <Text>The Data is processed at the Owner's operating offices and in any other places where the parties involved in the processing are located.</Text>
                <Text>Depending on the User's location, data transfers may involve transferring the User's Data to a country other than their own. To find out more about the place of processing of such transferred Data, Users can check the section containing details about the processing of Personal Data.</Text>
                <Text>Users are also entitled to learn about the legal basis of Data transfers to a country outside the European Union or to any international organization governed by public international law or set up by two or more countries, such as the UN, and about the security measures taken by the Owner to safeguard their Data.</Text>
                <Text>If any such transfer takes place, Users can find out more by checking the relevant sections of this document or inquire with the Owner using the information provided in the contact section.</Text>
            </Text>


            <Text fontSize='xl' mt={2}>Retention time</Text>

            <Text>
                Personal Data shall be processed and stored for as long as required by the purpose they have been collected for.
                Therefore:
            </Text>
            <UnorderedList>
                <ListItem>Personal Data collected for purposes related to the performance of a contract between the Owner and the User shall be retained until such contract has been fully performed.</ListItem>
                <ListItem>Personal Data collected for the purposes of the Owner’s legitimate interests shall be retained as long as needed to fulfill such purposes. Users may find specific information regarding the legitimate interests pursued by the Owner within the relevant sections of this document or by contacting the Owner.</ListItem>
            </UnorderedList>
            <Text>
                The Owner may be allowed to retain Personal Data for a longer period whenever the User has given consent to such processing, as long as such consent is not withdrawn. Furthermore, the Owner may be obliged to retain Personal Data for a longer period whenever required to do so for the performance of a legal obligation or upon order of an authority.

                Once the retention period expires, Personal Data shall be deleted. Therefore, the right of access, the right to erasure, the right to rectification and the right to data portability cannot be enforced after expiration of the retention period.
            </Text>

            <Divider mt={4} />
            <Text fontSize='2xl'>The purposes of processing</Text>
            <Text>
                <Text>The Data concerning the User is collected to allow the Owner to provide its Service, comply with its legal obligations, respond to enforcement requests, protect its rights and interests (or those of its Users or third parties), detect any malicious or fraudulent activity, as well as the following: Hosting and backend infrastructure, Registration and authentication, Infrastructure monitoring and Displaying content from external platforms.</Text>
                <Text>For specific information about the Personal Data used for each purpose, the User may refer to the section “Detailed information on the processing of Personal Data”.</Text>
            </Text>

            <Divider mt={4} />
            <Text fontSize='2xl'>Detailed information on the processing of Personal Data</Text>
            <Text>
                Personal Data is collected for the following purposes and using the following services:
            </Text>
            <OrderedList>
                <ListItem>Displaying content from external platforms</ListItem>
                <Text>
                    This type of service allows you to view content hosted on external platforms directly from the pages of this Application and interact with them.
                    This type of service might still collect web traffic data for the pages where the service is installed, even when Users do not use it.

                    Gravatar
                    Gravatar is an image visualization service provided by Automattic Inc. or by Aut O’Mattic A8C Ireland Ltd., depending on the location this Application is accessed from, that allows this Application to incorporate content of this kind on its pages.
                    Please note that if Gravatar images are used for comment forms, the commenter's email address or parts of it may be sent to Gravatar - even if the commenter has not signed up for that service.
                    Personal Data processed: email address; Usage Data.

                    Place of processing: United States –  <Link href={'https://automattic.com/privacy/'}>Privacy Policy</Link>; Ireland –  <Link href={'https://automattic.com/privacy/'}>Privacy Policy</Link>.
                </Text>
                <ListItem>Infrastructure monitoring</ListItem>
                <Text>
                    This type of service allows this Application to monitor the use and behavior of its components so its performance, operation, maintenance and troubleshooting can be improved.
                    Which Personal Data are processed depends on the characteristics and mode of implementation of these services, whose function is to filter the activities of this Application.

                    Sentry (Functional Software, Inc. )
                    Sentry is a monitoring service provided by Functional Software, Inc. .
                    Personal Data processed: various types of Data as specified in the privacy policy of the service.

                    Place of processing: United States – <Link href={'https://sentry.io/privacy/'}>Privacy Policy</Link>.
                </Text>

                <ListItem>Hosting and backend infrastructure</ListItem>
                <Text>
                    This type of service has the purpose of hosting Data and files that enable this Application to run and be distributed as well as to provide a ready-made infrastructure to run specific features or parts of this Application.

                    Some services among those listed below, if any, may work through geographically distributed servers, making it difficult to determine the actual location where the Personal Data are stored.

                    Google Cloud Storage (Google Ireland Limited)
                    Google Cloud Storage is a hosting service provided by Google Ireland Limited.
                    Personal Data processed: various types of Data as specified in the privacy policy of the service.

                    Place of processing: Belgium – <Link href={'https://cloud.google.com/terms/cloud-privacy-notice'}>Privacy Policy</Link>.
                </Text>

                <ListItem>Registration and authentication</ListItem>

                <Text>
                    By registering or authenticating, Users allow this Application to identify them and give them access to dedicated services.
                    Depending on what is described below, third parties may provide registration and authentication services. In this case, this Application will be able to access some Data, stored by these third-party services, for registration or identification purposes.
                    Some of the services listed below may also collect Personal Data for targeting and profiling purposes; to find out more, please refer to the description of each service.

                    Google OAuth (Google Ireland Limited)
                    Google OAuth is a registration and authentication service provided by Google Ireland Limited and is connected to the Google network.
                    Personal Data processed: various types of Data as specified in the privacy policy of the service.

                    Place of processing: Ireland – <Link href={'https://cloud.google.com/terms/cloud-privacy-notice'}>Privacy Policy</Link>.
                </Text>

            </OrderedList>

            <Divider mt={4} />
            <Text fontSize='2xl'>The rights of Users</Text>
            <Text>
                Users may exercise certain rights regarding their Data processed by the Owner.

                In particular, Users have the right to do the following:
            </Text>
            <UnorderedList>
                <ListItem>Withdraw their consent at any time. Users have the right to withdraw consent where they have previously given their consent to the processing of their Personal Data.</ListItem>
                <ListItem>Object to processing of their Data. Users have the right to object to the processing of their Data if the processing is carried out on a legal basis other than consent. Further details are provided in the dedicated section below.</ListItem>
                <ListItem>Access their Data. Users have the right to learn if Data is being processed by the Owner, obtain disclosure regarding certain aspects of the processing and obtain a copy of the Data undergoing processing.</ListItem>
                <ListItem>Verify and seek rectification. Users have the right to verify the accuracy of their Data and ask for it to be updated or corrected.</ListItem>
                <ListItem>Restrict the processing of their Data. Users have the right, under certain circumstances, to restrict the processing of their Data. In this case, the Owner will not process their Data for any purpose other than storing it.</ListItem>
                <ListItem>Have their Personal Data deleted or otherwise removed. Users have the right, under certain circumstances, to obtain the erasure of their Data from the Owner.</ListItem>
                <ListItem>Receive their Data and have it transferred to another controller. Users have the right to receive their Data in a structured, commonly used and machine readable format and, if technically feasible, to have it transmitted to another controller without any hindrance. This provision is applicable provided that the Data is processed by automated means and that the processing is based on the User's consent, on a contract which the User is part of or on pre-contractual obligations thereof.</ListItem>
                <ListItem>Lodge a complaint. Users have the right to bring a claim before their competent data protection authority.</ListItem>
            </UnorderedList>

            <Text fontSize='xl' mt={2}>Details about the right to object to processing</Text>
            <Text>
                Where Personal Data is processed for a public interest, in the exercise of an official authority vested in the Owner or for the purposes of the legitimate interests pursued by the Owner, Users may object to such processing by providing a ground related to their particular situation to justify the objection.

                Users must know that, however, should their Personal Data be processed for direct marketing purposes, they can object to that processing at any time without providing any justification. To learn, whether the Owner is processing Personal Data for direct marketing purposes, Users may refer to the relevant sections of this document.
            </Text>
            <Text fontSize='xl' mt={2}>How to exercise these rights</Text>
            <Text>
                Any requests to exercise User rights can be directed to the Owner through the contact details provided in this document. These requests can be exercised free of charge and will be addressed by the Owner as early as possible and always within one month.
            </Text>



            <Divider mt={4} />
            <Text fontSize='2xl'>Additional information about Data collection and processing</Text>

            <Text fontSize='xl' mt={2}>Legal action</Text>
            <Text>
                The User's Personal Data may be used for legal purposes by the Owner in Court or in the stages leading to possible legal action arising from improper use of this Application or the related Services.
                The User declares to be aware that the Owner may be required to reveal personal data upon request of public authorities.
            </Text>

            <Text fontSize='xl' mt={2}>Additional information about User's Personal Data</Text>
            <Text>
                In addition to the information contained in this privacy policy, this Application may provide the User with additional and contextual information concerning particular Services or the collection and processing of Personal Data upon request.
            </Text>

            <Text fontSize='xl' mt={2}>System logs and maintenance</Text>
            <Text>
                For operation and maintenance purposes, this Application and any third-party services may collect files that record interaction with this Application (System logs) use other Personal Data (such as the IP Address) for this purpose.
            </Text>

            <Text fontSize='xl' mt={2}>Information not contained in this policy</Text>
            <Text>
                More details concerning the collection or processing of Personal Data may be requested from the Owner at any time. Please see the contact information at the beginning of this document.
            </Text>

            <Text fontSize='xl' mt={2}>How “Do Not Track” requests are handled</Text>
            <Text>
                This Application does not support “Do Not Track” requests.
                To determine whether any of the third-party services it uses honor the “Do Not Track” requests, please read their privacy policies.
            </Text>

            <Text fontSize='xl' mt={2}>Changes to this privacy policy</Text>
            <Text>
                The Owner reserves the right to make changes to this privacy policy at any time by notifying its Users on this page and possibly within this Application and/or - as far as technically and legally feasible - sending a notice to Users via any contact information available to the Owner. It is strongly recommended to check this page often, referring to the date of the last modification listed at the bottom.

                Should the changes affect processing activities performed on the basis of the User’s consent, the Owner shall collect new consent from the User, where required.
            </Text>


        </Container>
    )

}