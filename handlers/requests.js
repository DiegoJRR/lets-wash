import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const fillProfilePicutreUri = async (employee) => {
    const uri = await storage()
        .refFromURL(
            employee.profilePicture ||
                'gs://carwash-40bc9.appspot.com/placeholder.jpg'
        )
        .getDownloadURL();

    return {
        ...employee,
        profilePictureUri: uri,
    };
};

const fillRequests = async (snapshot) => {
    const filtered = snapshot.docs.filter(
        (doc) => doc.data().payment.status === 'approved' && doc.data().washer
    );

    const requests = filtered.map((doc) => ({
        ref: doc.id,
        ...doc.data(),
    }));

    const populatedRequests = [];

    for (const request of requests) {
        const employeeSnapshot = await firestore() // TODO: Cache de empleados
            .collection('washers')
            .doc(request.washer)
            .get()
            .catch(console.log);

        const employeeData = await fillProfilePicutreUri(
            employeeSnapshot.data()
        );

        const servicesSnapshot = await firestore()
            .collection('requests')
            .doc(request.ref)
            .collection('services')
            .get()
            .catch(console.log);

        const servicesData = servicesSnapshot.docs;
        const populatedServicesData = [];

        for (const service of servicesData) {
            const serviceData = service.data();

            populatedServicesData.push({
                ref: service.id,
                ...serviceData,
            });
        }

        populatedRequests.push({
            ...request,
            employeeData,
            services: populatedServicesData,
        });
    }

    return populatedRequests;
};

export default fillRequests;
