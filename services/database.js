import { database } from "./firebaseConfig";
import { ref, set } from "firebase/database";
import * as dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

const chatId = 1;
const messagesCollection = `chats/${chatId}/messages`;

export const chatsRef = ref(database, messagesCollection);
export function writeMessageOnChat(username, message) {
  const id = uuidv4();
  set(ref(database, `${messagesCollection}/${id}`), {
    id,
    username,
    message,
    date: dayjs().format(),
  });
}
