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
        getDoctorsForDropdown: '/doctorprofile/get-all-doctors', //Get
    },
    Dashboard: {
        getDashboardSummary: '/dashboard/get-dashboard-summary', //Get
    },
    Reminder: {
        getAllReminder: '/reminder/get-all-reminder',//Get
        addReminder: '/reminder/add',//POST
        updateReminder: '/reminder/update',//PUT
        deleteReminder: '/reminder/delete/{0}', //DELETE
        getReminderById: '/reminder/get-reminder-by-id/{0}' //Get
    },
    PatientHistory: {
        getAllPatientHistory: '/patienthistory/get-patient-history-by-pagination', //Get
        getAllCategoryType: '/patienthistory/get-all-category-type', //Get
        getPatientHistoryById: '/patienthistory/get-patienthistory-by-id/{0}',  //Get
        savePatientHistory: '/patienthistory/save',  //POST 
        getDocumentFile : '/patienthistory/download', //Get
    },
}