import http from "@/service/http";
import { AppStore } from "@/store/App";
import { ChatStore } from "@/store/Chat";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

const useChatProgress = (responding: boolean, setResponding: (e: boolean) => void) => {
    const router = useRouter();
    const { chat, updateChat } = useContext(ChatStore);
    const { token } = useContext(AppStore);
    const controller = useRef<AbortController>();
    const uuid = +(router.query.id || 0);

    const request = async (index: number, onMessageUpdate?: () => void) => {
        const conversationList = chat.find((item) => item.uuid === uuid)?.data || [];
        const currentChat = conversationList[index] || {};
        const message = currentChat.requestOptions?.prompt ?? "";
        const options = currentChat.requestOptions?.options ?? {};

        if (currentChat.text) {
            updateChat(uuid, index, {
                ...currentChat,
                dateTime: new Date().toLocaleString(),
                text: "",
                loading: true,
                error: false,
            });
        }

        setResponding(true);
        try {
            controller.current = new AbortController();
            const { signal } = controller.current;
            await http.fetchChatAPIProgress(
                {
                    prompt: message,
                    options,
                },
                {
                    signal,
                    headers: {
                        authorization: token,
                    },
                    silent: true,
                    onDownloadProgress: (
                        progressEvent: ProgressEvent<XMLHttpRequestEventTarget>
                    ) => {
                        const xhr = progressEvent.target;
                        const { responseText } = xhr as XMLHttpRequest;

                        //  if the response is image
                        if (options.isImage) {
                            const { data = [] } = JSON.parse(responseText);
                            const images = data.map((item: { url: string }) => item.url);
                            const taskIds = data.map((item: { taskId: string }) => item.taskId);
                            updateChat(uuid, index, {
                                dateTime: new Date().toLocaleString(),
                                text: images.join(","),
                                images,
                                //  temp to handle the one mj image
                                taskId: taskIds[0],
                                isImage: true,
                                inversion: false,
                                error: false,
                                loading: false,
                                model: currentChat.model,
                                conversationOptions: null,
                                requestOptions: { prompt: message, options: { ...options } },
                            });
                            onMessageUpdate?.();
                        } else {
                            // Always process the final line
                            const lastIndex = responseText.lastIndexOf("\n");
                            let chunk = responseText;
                            if (lastIndex !== -1) chunk = responseText.substring(lastIndex);
                            try {
                                const data = JSON.parse(chunk);
                                updateChat(uuid, index, {
                                    dateTime: new Date().toLocaleString(),
                                    text: data.text ?? "",
                                    inversion: false,
                                    error: false,
                                    loading: false,
                                    conversationOptions: {
                                        conversationId: data.conversationId,
                                        parentMessageId: data.id,
                                    },
                                    requestOptions: { prompt: message, options: { ...options } },
                                });
                                onMessageUpdate?.();
                            } catch (error) {
                                console.error(error);
                            }
                        }
                    },
                }
            );
        } catch (error: any) {
            if (!error && !currentChat.isImage) {
                return;
            }

            const errorMessage = error?.message ?? "好像出错误了，请稍后再试";
            updateChat(uuid, index, {
                dateTime: new Date().toLocaleString(),
                text: errorMessage,
                inversion: false,
                error: true,
                loading: false,
                isImage: currentChat.isImage,
                model: currentChat.model,
                images: [],
                conversationOptions: null,
                requestOptions: { prompt: message, options: { ...options } },
            });
            onMessageUpdate?.();
        } finally {
            setResponding(false);
        }
    };

    useEffect(() => {
        if (!responding && controller.current) {
            controller.current.abort();
        }
    }, [responding]);

    useEffect(() => {
        if (controller.current) {
            controller.current.abort();
        }
    }, [uuid]);

    return { request };
};

export default useChatProgress;
