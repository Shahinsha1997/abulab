export const MAX_DAYS_FOR_APPOINTMENT = 3;

export const MAX_TIME = 22;

const appoinmentMessages = {
    mobileNumber : {
        'info' : 'Please Provide Whatsapp Number for communication purpose.',
        'error' : 'Please check the mobile number.'
    },
    address: {
        'info': 'Please add Door no & Street name',
        'error': 'Please provide the address for home visit.'
    },
    appointmentDate:{
        'error' : `You can only able to book max of ${MAX_DAYS_FOR_APPOINTMENT} days from now.`,
        'emptyError': 'Please provide the appointment date for home visit',
        'maxTimeError' : 'Slots full for this date.Try another date or Please contact Abu lab if needed.'
    },
    name:{
        'error': 'Please provide name'
    },
    addAPI:{
        'success' : 'Appointment Scheduled Successfully.',
        'fail' : "Sorry! can't able to schedule the appointment, Please try again."
    },
    location:{
        'fail' : "Sorry! Can't able to get location"
    }
}

export const getMessage = (field, type)=>appoinmentMessages[field][type]