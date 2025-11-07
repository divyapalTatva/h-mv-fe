export const API_ENDPOINTS = {
    Auth: {
        login: '/auth/login', //POST
        verifyOtp: '/auth/verify-otp', //POST
    },
    User: {
        userRegister: '/user/user-register', //POST
    },
    Hospital: {
        getHospitalsByPagination: '/hospital/get-hospitals-by-pagination', //POST
        getAllHospitals: '/hospital/get-all-hospitals', //Get
    },
    PatientProfile: {
        addPatientProfile: '/patientprofile/add', //POST
        updatePatientProfile: '/patientprofile/update', //PUT
    },
    DoctorProfile: {
        addDoctorProfile: '/doctorprofile/add', //POST
        updateDoctorProfile: '/doctorprofile/update', //PUT
    }
}