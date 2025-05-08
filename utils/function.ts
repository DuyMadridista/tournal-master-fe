
export const generateRange = (start: number, end: number) => {
  const length = end + 1 - start

  return Array.from({ length }, (_, id) => id + start)
}

export const removeEmptyFields = (obj: any) => {
  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      for (let i = obj.length - 1; i >= 0; i--) {
        removeEmptyFields(obj[i])
        if (Object.keys(obj[i]).length === 0) {
          obj.splice(i, 1)
        }
      }
    } else {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          removeEmptyFields(obj[key])
          if (obj[key] === '') {
            delete obj[key]
          }
        }
      }
    }
  }
}

export const isMultipleLine = (data: any) => {
  if (typeof data !== 'string') {
    return false
  }
  const elements = data.split(';')
  if (elements.length > 1) {
    return true
  }
  return false
}



export const colorChip = (data: string) => {
  let color = 'white'
  switch (data) {
    case 'NEED_INFORMATION':
      color = '#f2cac7'
      break
    case 'READY':
      color = '#fff000'
      break
    case 'IN_PROGRESS':
      color = '#ccd5ff'
      break
    case 'FINISHED':
      color = '#24c73f'
      break
    case 'DISCARDED':
      color = '#d1d1c0'
      break
    case 'DELETED':
      color = '#fa4141'
      break
    default:
      break
  }
  return color
}

export const convertFormatTime = (inputTime: string) => {
  const [hours, minutes, seconds] = inputTime.split(':')

  const dateObj = new Date()
  dateObj.setHours(parseInt(hours, 10))
  dateObj.setMinutes(parseInt(minutes, 10))
  dateObj.setSeconds(parseInt(seconds, 10))

  const ampmTime = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })
  return ampmTime
}
export const checkLengthDescription = (str: string, number: number) => {
  if (str?.length > 295) {
    return `${str.slice(0, number)}...`
  } else {
    return str
  }
}
export const checkLengthTeam = (str: string) => {
  if (str?.length > 10) {
    return `${str.slice(0, 10)}...`
  } else {
    return str
  }
}
export const checkLengthTeamOfMatch = (str: string, number: number) => {
  if (str?.length > number) {
    return `${str.slice(0, number)}...`
  } else {
    return str
  }
}

export const generatePlaceholderCard = (column: any) => {
  return {
    id: `${column.eventDateId}-placeholder-card`,
    eventDateId: column.eventDateId,
    FE_PlaceholderCard: true
  }
}
