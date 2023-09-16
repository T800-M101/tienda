declare const iziToast: any;
export function showAlert(title: string, message: string, color: string) {
    iziToast.show({
        title: title,
        titleColor: color,
        class: 'text-danger',
        position: 'topCenter',
        message: message,
    });
}


