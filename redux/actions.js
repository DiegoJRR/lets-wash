import {
    ADD_SERVICE,
    REMOVE_SERVICE,
    ADD_VEHICLE,
    ADD_VEHICLE_BATCH,
    CLEAN_SERVICES,
    SET_VEHICLES,
    SIGN_IN,
    SIGN_OUT,
    ADD_ADDRESS,
    ADD_CACHED_ADDRESS,
    SELECT_ADDRESS,
    SET_SERVICE_TYPES,
    SET_VEHICLE_TYPES,
    ADD_REQUEST,
    SET_REQUESTS,
    POPULATE_EMPLOYEE,
    SET_REQUEST_DATA,
    SET_USER_DATA,
    ADD_EMPLOYEES,
    SET_USER_REQUESTS,
    SET_PENDING_REVIEW
} from './actionTypes';

export const signIn = (content) => ({
    type: SIGN_IN,
    user: content,
});

export const signOut = () => ({
    type: SIGN_OUT,
    user: null,
});

export const addService = (content) => ({
    type: ADD_SERVICE,
    newService: content,
});

export const cleanServices = () => ({
    type: CLEAN_SERVICES,
});

export const addVehicle = (content) => ({
    type: ADD_VEHICLE,
    newVehicle: content,
});

export const setVehicles = (content) => ({
    type: SET_VEHICLES,
    vehicles: content,
});

export const addVehicleBatch = (content) => ({
    type: ADD_VEHICLE_BATCH,
    vehicles: content,
});

export const removeService = (content) => ({
    type: REMOVE_SERVICE,
    vehicleRef: content,
});

export const addAddress = (content) => ({
    type: ADD_ADDRESS,
    address: content,
});
export const addCachedAddress = (content) => ({
    type: ADD_CACHED_ADDRESS,
    address: content,
});
export const selectAddress = (content) => ({
    type: SELECT_ADDRESS,
    address: content,
});

export const setServiceTypes = (content) => ({
    type: SET_SERVICE_TYPES,
    serviceTypes: content,
});
export const setVehicleTypes = (content) => ({
    type: SET_VEHICLE_TYPES,
    vehicleTypes: content,
});
export const addRequest = (content) => ({
    type: ADD_REQUEST,
    userRequests: content,
});
export const setRequests = (content) => ({
    type: SET_REQUESTS,
    userRequests: content,
});
export const populateEmployee = (content) => ({
    type: POPULATE_EMPLOYEE,
    employee: content,
});

export const setRequestData = (content) => ({
    type: SET_REQUEST_DATA,
    requestData: content,
});

export const setUserData = (content) => ({
    type: SET_USER_DATA,
    userData: content,
});

export const addEmployees = (content) => ({
    type: ADD_EMPLOYEES,
    employees: content,
});

export const setUserRequests = (content) => ({
    type: SET_USER_REQUESTS,
    userRequests: content,
});

export const setPendingReview = (content) => ({
    type: SET_PENDING_REVIEW,
    pendingReview: content,
});
