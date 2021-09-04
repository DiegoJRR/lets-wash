export const signInFields = [
    {
        name: 'email',
        placeholder: 'Correo',
        missingMessage: 'Por favor introduzca un email válido.',
    },
    {
        name: 'password',
        placeholder: 'Contraseña',
        defaultCaption: 'Debe tener al menos 8 caracteres.',
        missingMessage: 'Debe tener al menos 8 caracteres.',
        secretField: true,
        captionIcon: 'alert-circle-outline',
    }
];

export const signUpFields = [
    {
        name: 'firstName',
        placeholder: 'Nombre',
    },
    {
        name: 'lastName',
        placeholder: 'Apellido',
    },
    ...signInFields,
    {
        name: 'confirmPassword',
        placeholder: 'Confirme la contraseña',
        defaultCaption: null,
        missingMessage: 'Las contraseñas no coinciden.',
        secretField: true,
        captionIcon: 'alert-circle-outline',
    },
];
