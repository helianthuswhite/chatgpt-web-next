import storage from "@/service/localStorage";
import { Chat, DEFAULT_UUID, LOCAL_NAME } from "@/store/Chat";
import { useRouter } from "next/router";
import { useEffect } from "react";

const chatStorage = storage<Chat>();

const Home = () => {
    const router = useRouter();

    useEffect(() => {
        const storageValue = chatStorage.get(LOCAL_NAME);
        const uuid = storageValue?.history?.[0].uuid || DEFAULT_UUID;
        router.push(`/chat/${uuid}`);
    }, [router]);
};

export default Home;
