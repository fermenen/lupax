import { Button } from "@chakra-ui/react";
import { StepsProvider } from "react-step-builder";
import MySteps from "../../../components/public/stepsTask"

function StudiePreview() {
    return (
        <>
            <StepsProvider>
                <MySteps preview_mode={true} />
            </StepsProvider>
        </>
    )
}


export default StudiePreview;

