// import MercadoPagoCheckout from '@blackbox-vision/react-native-mercadopago-px';
import functions from '@react-native-firebase/functions';
// import { MERCADOPAGO_PUBLIC_KEY } from 'constants';

// Payment results:
// APRO: Pago aprobado.
// CONT: Pago pendiente.
// OTHE: Rechazado por error general.
// CALL: Rechazado con validación para autorizar.
// FUND: Rechazado por monto insuficiente.
// SECU: Rechazado por código de seguridad inválido.
// EXPI: Rechazado por problema con la fecha de expiración.
// FORM: Rechazado por error en formulario.

export const getPreferenceId = async (services, payerData, tip, shipping ) => {
    const result = await functions().httpsCallable('createPaymentPreference')({
        services,
        payerData,
        tip,
        shipping
    });

    const { preferenceId } = result.data;

    return preferenceId;
};

// export const createCheckout = async (services, payerData, tip, shipping ) => {

//     const preferenceId = await getPreferenceId(services, payerData, tip, shipping );
    
//     const result = await MercadoPagoCheckout.createPayment({
//         publicKey: MERCADOPAGO_PUBLIC_KEY,
//         preferenceId,
//         language: 'es-MX',
//     });

//     return result;
// };
