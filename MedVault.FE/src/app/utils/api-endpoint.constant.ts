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
        getEmergencyDetails: '/patientprofile/get-emergency-details', //Get
    },
    DoctorProfile: {
        addDoctorProfile: '/doctorprofile/add', //POST
        updateDoctorProfile: '/doctorprofile/update', //PUT
    },
    Dashboard: {
        getDashboardSummary: '/dashboard/get-dashboard-summary', //Get
    },
    Reminder: {
        getAllReminder: '/reminder/get-all-reminder',
        addReminder: '/reminder/add',
        updateReminder: '/reminder/update',
        deleteReminder: '/reminder/delete/{0}',
        getReminderById: '/reminder/get-reminder-by-id/{0}'
    }
}