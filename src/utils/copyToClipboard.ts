const copyToClipboard = (textToCopy: string) => {
    // navigator clipboard needs a secure context (HTTPS)
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(textToCopy);
    } else {
        let textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        // set textArea invisible
        textArea.style.position = "absolute";
        textArea.style.opacity = "0";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise<void>((res, rej) => {
            // exec copy command and remove text area
            document.execCommand("copy") ? res() : rej();
            textArea.remove();
        });
    }
};

export default copyToClipboard;
