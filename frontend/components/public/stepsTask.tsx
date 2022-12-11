import FailedToLoad from '../failedToLoad';
import StepScreenTask from "./stepTask";
import NavbarPublicTask from "./navbarPublicTask";
import Loading from '../loading';
import InfoScreen from './infoScreen';
import { Steps, useSteps } from "react-step-builder";
import { useStudiePublic } from '../../services/studies.service';
import { useRouter } from 'next/router';
import { Task } from '../../interfaces';


type steps = {
    preview_mode: boolean
}


function MySteps(props: steps) {

    const { progress } = useSteps();
    const router = useRouter()
    const { id } = router.query
    const { studie, isLoading, isError } = useStudiePublic(id)

    if (isError) return FailedToLoad("failed to load")
    if (isLoading) return <Loading />
    if (!studie.available && !props.preview_mode) return <InfoScreen />

    function orderTasks(taska: { index: number; }, taskb: { index: number; }) {
        return taska.index - taskb.index;
    };

    return (
        <>
            <NavbarPublicTask name={studie.public_studie_title} preview={props.preview_mode} progress={progress}></NavbarPublicTask>
            <Steps>
                {studie.tasks.sort(orderTasks).map((task: Task) =>
                    <StepScreenTask key={task.id} task={task} preview_mode={props.preview_mode}></StepScreenTask>
                )}
            </Steps>
        </>
    );
};


export default MySteps;