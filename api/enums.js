const requestType = {
 SLOT_LINKING:'slot linking',
 REPLACEMENT:'replacement',
 CHANGE_DAY_OFF:'change day off',
 ANNUAL_LEAVE:'anual leave',
 ACCIDENTAL_LEAVE:'Accidental leave',
 SICK_LEAVE:'sick leave',
 MATERNITY_LEAVE:'maternity leave',
 COMPENSATION_LEAVE:'compensation leave',
 LEAVE:'leave'

}

const requestStatus={
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  PENDING: 'pending',
  CANCELED:'canceled'
}

const slotOrder={
  FIRST: '1st',
  SECOND: '2nd',
  THIRD: '3rd',
  FOURTH:'4th',
  FIFTH:'5th'
}

const days={
  SUNDAY:'sunday',
  MONDAY:'monday',
  TUESDAY:'tuesday',
  WEDNESDAY:'wednesday',
  THURSDAY:'thursday',
  SAUTURDAY:'saturday'
}



module.exports = {
  requestType,
  requestStatus,
  slotOrder,
  days
}