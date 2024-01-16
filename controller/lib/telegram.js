const { getAxiosInstance } = require("./axios");
const { errorHandler } = require("./helpers");

const MY_TOKEN = process.env.BOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${MY_TOKEN}`;
const axiosInstance = getAxiosInstance(BASE_URL);

function sendMessage(chatId, messageText) {
    return axiosInstance
    .get("sendMessage", {
        chat_id: chatId,
        text: messageText,
     })
    .catch((ex) => {
        errorHandler(ex, "sendMessage", "axios");
    });
}

function deleteMessage(chatId, messageId){
    return axiosInstance
        .get("deleteMessage", {
            chat_id: chatId,
            message_id: messageId,
        })
        .catch((ex) => {
            errorHandler(ex, "deleteMessage", "axios");
        });
}

async function handleMessage(messageObj) {
    const messageText = messageObj.text || "";

    if (!messageText) {
        errorHandler("No message text", "handleMessage");
        return "";
    }

    try {
        const chatId = messageObj.chat.id;
        const messageId = messageObj.message_id;
        const anonText = messageText.split(' ').slice(1).join(' ');

        if (messageText.charAt(0) === "/") {
            const command = messageText.substr(1);

            if (command.startsWith("say ")) {
                await deleteMessage(chatId, messageId);
                await sendMessage(chatId, anonText);
            } else {
                switch (command) {
                    case "start":
                        await sendMessage(
                            chatId,
                            "Hi! I'm an Anonymous message group chat bot. I can help you send anonymous chat messages in your groups."
                        );
                        break;
                    default:
                        await sendMessage(chatId, "I don't know that command, yo.");
                        break;
                }
            }
        } else {
            // Handle non-command messages if needed
            // await sendMessage(chatId, messageText);
        }

    } catch (error) {
        errorHandler(error, "handleMessage");
    }
}







module.exports = { handleMessage };