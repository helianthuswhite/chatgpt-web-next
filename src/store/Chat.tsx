import storage from "@/service/localStorage";
import { useRouter } from "next/router";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";

export interface ConversationRequest {
    conversationId?: string;
    parentMessageId?: string;
    isImage?: boolean;
    model?: Model;
}

export interface History {
    title: string;
    uuid: number;
}

export type Model = "chat$gpt-3.5-turbo" | "image$dall-e2" | "image$stable-diffusion";

export interface ChatData {
    dateTime: string;
    text: string;
    inversion?: boolean;
    error?: boolean;
    loading?: boolean;
    isImage?: boolean;
    images?: string[];
    conversationOptions?: ConversationRequest | null;
    requestOptions: { prompt: string; options?: ConversationRequest | null };
}

export interface Chat {
    active: number | null;
    history: History[];
    chat: { uuid: number; data: ChatData[] }[];
    model: Model;
    setModel: Dispatch<SetStateAction<Model>>;
    addHistory: (history: History) => void;
    deleteHistory: (uuid: number) => void;
    updateHistory: (history: History) => void;
    addChat: (uuid: number, chat: ChatData) => void;
    clearChat: (uuid: number) => void;
    updateChat: (uuid: number, index: number, chat: ChatData) => void;
    deleteChat: (uuid: number, index: number) => void;
}

export const ChatStore = createContext<Chat>({} as Chat);

export const DEFAULT_UUID = 1002;
export const LOCAL_NAME = "chatStorage";
export const DEFAULT_TITLE = "New Chat";
const DEFAULT_CHAT = {
    active: DEFAULT_UUID,
    history: [
        {
            uuid: DEFAULT_UUID,
            title: DEFAULT_TITLE,
        },
    ],
    chat: [{ uuid: DEFAULT_UUID, data: [] as ChatData[] }],
};

const chatStorage = storage<Chat>();
const defaultValue = chatStorage.get(LOCAL_NAME) || DEFAULT_CHAT;

const Chat: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const [active, setActive] = useState(defaultValue.active);
    const [history, setHistory] = useState(defaultValue.history);
    const [chat, setChat] = useState(defaultValue.chat);
    const [model, setModel] = useState<Model>("chat$gpt-3.5-turbo");

    const addHistory = (h: History) => {
        history.push(h);
        setHistory([...history]);
    };

    const deleteHistory = (uuid: number) => {
        const newHistory = history.filter((item) => item.uuid !== uuid);
        setHistory(newHistory);
    };

    const updateHistory = (h: History) => {
        const newHistory = history.map((item) => (item.uuid === h.uuid ? h : item));
        setHistory(newHistory);
    };

    const addChat = (uuid: number, c: ChatData) => {
        if (!uuid || uuid === 0) {
            return;
        }

        const isNotExists = chat.findIndex((item) => item.uuid === uuid) === -1;
        if (isNotExists) {
            chat.push({ uuid, data: [c] });
        } else {
            chat.forEach((item) => {
                if (item.uuid === uuid) {
                    item.data.push(c);
                }
            });
        }

        setChat([...chat]);
    };

    const updateChat = (uuid: number, index: number, c: ChatData) => {
        if (!uuid || uuid === 0) {
            return;
        }

        chat.forEach((item) => {
            if (item.uuid === uuid) {
                item.data[index] = c;
            }
        });

        setChat([...chat]);
    };

    const deleteChat = (uuid: number, index: number) => {
        if (!uuid || uuid === 0) {
            return;
        }

        chat.forEach((item) => {
            if (item.uuid === uuid) {
                item.data.splice(index, 1);
            }
        });

        setChat([...chat]);
    };

    const clearChat = (uuid: number) => {
        chat.forEach((item) => {
            if (item.uuid === uuid) {
                item.data = [];
            }
        });

        setChat([...chat]);
    };

    useEffect(() => {
        setActive(Number(router.query.id));
    }, [router.query]);

    useEffect(() => {
        chatStorage.set(LOCAL_NAME, { active, history, chat } as Chat);
    }, [active, history, chat]);

    return (
        <ChatStore.Provider
            value={{
                active,
                history,
                chat,
                model,
                setModel,
                addHistory,
                deleteHistory,
                updateHistory,
                addChat,
                clearChat,
                updateChat,
                deleteChat,
            }}
        >
            {children}
        </ChatStore.Provider>
    );
};

export default Chat;
