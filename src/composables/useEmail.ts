import { addDoc, collection, getFirestore } from 'firebase/firestore' 

export const useSendContactEmail = async (contact: any) => {
  const db = getFirestore()

  const response = await addDoc(collection(db, 'contacts'), {
    name: contact.name,
    email: contact.email,
    subject: contact.subject,
    message: contact.message,
  })
 
  return response 
}
