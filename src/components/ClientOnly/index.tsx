import { useEffect, useState } from "react";

const ClientOnly = ({ children }: { children: React.ReactElement }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return children;
};

export default ClientOnly;
