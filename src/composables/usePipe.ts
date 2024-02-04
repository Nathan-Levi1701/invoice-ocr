import _ from "lodash"

export const useTitleCasePipe = (text: string) => {
  const temp = text.replaceAll('_', ' ').split(' ')

  for (let i = 0; i < temp.length; i++) {
    temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1)
  }

  return temp.join(' ')
}

export const formatToUpperCase = (text: string) => {
  return text.replaceAll('_', ' ').toUpperCase()
}

export const formatToKebabCase = (text: string) => {
  return text.replaceAll(' ', '-').toLowerCase();
}

export const formatToTitleCase = (text: string) => {
  return _.startCase(text.replaceAll('_', ' '));
}

export const formatPrice = (price: number) => {
  const formatter = new Intl.NumberFormat('en-za', { style: 'currency', currency: 'ZAR' })
  return formatter.format(price)
}

export const formatDate = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('za', { dateStyle: 'medium' })
  return formatter.format(date)
}

export const formatTime = (date: Date) => {
  const formatter = new Intl.DateTimeFormat('za', { timeStyle: 'short' })
  return formatter.format(date)
}
