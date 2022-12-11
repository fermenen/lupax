import { createStandaloneToast } from '@chakra-ui/react'

export const alertService = {
    successAlert,
    errorAlert,
    infoAlert,
    warn,
    alert,
    clear
};

export const alertType = {
    success: 'success',
    error: 'error',
    info: 'info',
    warning: 'warning'
}



// convenience methods

export function errorAlert(title: string, message: string) {
    alert({ type: alertType.error, message, title });
}

export function successAlert(title: string, message: string) {
    alert({ type: alertType.success, message, title });
}

export function infoAlert(title: string, message: string) {
    alert({ type: alertType.info, message, title });
}


export function warn(title: string, message: string, options: { title: string; message: string; type: any; }) {
    alert({ ...options, type: alertType.warning, message, title });
}

export function clear() {

}


// core alert method
function alert(alert: { title: string; message: string; type: any; }) {
    const toast = createStandaloneToast()
    toast({
        title: alert.title,
        description: alert.message,
        status: alert.type,
        duration: 9000,
        isClosable: true,
    })

}