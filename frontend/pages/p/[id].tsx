import { StepsProvider } from "react-step-builder";
import MySteps from "../../components/public/stepsTask"

function StudiePreview() {
    return (
        <>
            <StepsProvider>
                <MySteps preview_mode={false} />
            </StepsProvider>
        </>
    )
}


export default StudiePreview;