import useAlert from 'shared/ui/Alert/use-alert';

const useDefibrillatorAlert = () => {
    const [, ShowAlert] = useAlert();

    const showDevicesAlert = () =>
        ShowAlert({
            open: true,
            severity: 'error',
            message: 'Пристроїв поблизу не виявлено'
        });

    const showPositionAlert = () =>
        ShowAlert({
            open: true,
            severity: 'error',
            message: 'Позиція користувача не знайдена'
        });

    return {
        showDevicesAlert,
        showPositionAlert
    };
};

export { useDefibrillatorAlert };