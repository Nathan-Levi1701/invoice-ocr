export default interface Event {
  title: string
  id?: string
  description: string
  eventType: string
  eventSubTypes: any;
  color: string
  highlight?: {
    color: string,
    class: string
  }
  popover?: any,
  dates: { start: Date, end : Date}
  file?: { url: string, file: File} | File
}
