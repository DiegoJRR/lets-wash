const initialState = {
    isSignedIn: false,
    user: null,
    theme: 'default',
    comission: 50, // CUOTA DE SERVICIO
    userData: {
        firstName: 'fName',
        lastName: 'lName',
        displayName: 'fName lName',
        // profilePicture: '',
        email: 'test@mail.com',
    },
    requestData: {
        employee: null,
        employeeRef: null,
        date: null,
        slots: null,
    },
    services: [],
    vehicles: [],
    serviceTypes: [],
    vehicleTypes: [],
    employees: [
        {
            lastUpdated: Date.now(),
            ref: 5,
            displayName: 'test',
            firstName: 'fname',
            lastName: 'lname',
            rating: 4.5,
            reviews: [{ ref: '', rating: 4, comment: '', request: '' }],
            services: [
                {
                    ref: '',
                },
            ],
        },
    ],
    userRequests: [],
    userAddresses: [],
    cachedAddresses: [],
    selectedAddress: null,
    pendingReview: null,
};

const appStateReducer = function (state = initialState, action) {
    // Reducers usually look at the type of action that happened
    // to decide how to update the state
    switch (action.type) {
        case 'signIn':
            return {
                ...state,
                user: action.user,
                isSignedIn: true,
            };
        case 'signOut':
            return initialState;
        case 'setVehicles':
            return {
                ...state,
                vehicles: [...action.vehicles],
            };
        case 'addVehicleBatch':
            return {
                ...state,
                vehicles: [...state.vehicles, ...action.vehicles],
            };
        case 'addVehicle':
            return {
                ...state,
                vehicles: [...state.vehicles, action.newVehicle],
            };
        case 'addService': {
            const copy = [...state.services];
            const prevIndex = copy.findIndex(
                (service) =>
                    service.vehicle.ref = action.newService.vehicle.ref
            );
            if (prevIndex !== -1) {
                copy[prevIndex] = {
                    ...action.newService,
                    active: true,
                };
            } else {
                copy.push({
                    ...action.newService,
                    active: true,
                });
            }
            return {
                ...state,
                services: copy,
            };
        }
        case 'cleanServices':
            return {
                ...state,
                services: [],
            };
        case 'removeService': // TODO: cambiar eliminacion por ref en lugar de index
            const copy = [...state.services];
            const prevIndex = copy.findIndex(
                (service) => service.vehicle.ref === action.vehicleRef
            );

            if (prevIndex !== -1) {
                copy[prevIndex].active = false;
            }
            
            return { ...state, services: copy };
        case 'addAddress': {
            let repeatedLocations = state.userAddresses.filter(
                (add) =>
                    add.location.lat === action.address.location.lat &&
                    add.location.lng === action.address.location.lng
            );
            if (repeatedLocations.length > 0) return state;
            return {
                ...state,
                userAddresses: [...state.userAddresses, action.address],
            };
        }
        case 'addCachedAddress': {
            let repeatedLocations = state.cachedAddresses.filter(
                (add) =>
                    add.location.lat === action.address.location.lat &&
                    add.location.lng === action.address.location.lng
            );
            if (repeatedLocations.length > 0) return state;
            return {
                ...state,
                cachedAddresses: [...state.cachedAddresses, action.address],
            };
        }
        case 'selectAddress':
            return {
                ...state,
                selectedAddress: action.address,
            };
        case 'setServiceTypes':
            return {
                ...state,
                serviceTypes: action.serviceTypes,
            };
        case 'setVehicleTypes':
            return {
                ...state,
                vehicleTypes: action.vehicleTypes,
            };
        case 'addRequest':
            return {
                ...state,
                userRequests: [...state.userRequests, action.request],
            };
        case 'setRequests':
            return {
                ...state,
                userRequests: action.requests,
            };
        case 'addEmployees': {
            const { employees } = action;
            const newEmployeeList = [...state.employees];
            for (employee of employees) {
                if (!state.employees.find((e) => e.ref === employee.ref)) {
                    newEmployeeList.push(employee);
                }
            }
            return {
                ...state,
                employees: newEmployeeList,
            };
        }
        case 'populateEmployee':
            const { employee } = action;
            const employees = [...state.employees];
            if (employee.filter((e) => e.ref === employee.ref) === 1) {
                employees.map((e) =>
                    e.ref === employee.ref
                        ? { ...employee, lastUpdated: Date.now() }
                        : e
                );
            } else {
                employees.push({ ...employee, lastUpdated: Date.now() });
            }
            return {
                ...state,
                employees,
            };
        case 'setUserData':
            return {
                ...state,
                userData: action.userData,
            };
        case 'setTheme':
            return {
                ...state,
                theme: action.theme,
            };
        case 'setRequestData':
            return {
                ...state,
                requestData: action.requestData,
            };
        case 'setUserRequests':
            return {
                ...state,
                userRequests: action.userRequests,
            };
        case 'setPendingReview':
            return {
                ...state,
                pendingReview: action.pendingReview,
            };
        default:
            // If the reducer doesn't care about this action type,
            // return the existing state unchanged
            return state;
    }
};

export default appStateReducer;