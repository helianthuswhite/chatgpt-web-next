import classNames from "classnames";
import useIsMobile from "@/hooks/useIsMobile";
import MarkdownIt from "markdown-it";
import mdKatex from "@traptitech/markdown-it-katex";
import hljs from "highlight.js";
import { useMemo } from "react";
import copyToClipboard from "@/utils/copyToClipboard";
import { message } from "antd";

interface Props {
    inversion?: boolean;
    error?: boolean;
    text?: string;
    loading?: boolean;
}

function highlightBlock(str: string, lang?: string) {
    return `
        <pre class="code-block-wrapper">
            <div class="code-block-header">
                <span class="code-block-header__lang">${lang}</span>
                <span class="code-block-header__copy" id="copy-code">复制代码</span>
            </div>
            <code class="hljs code-block-body ${lang}">${str}</code>
        </pre>
    `;
}

const mdi = new MarkdownIt({
    linkify: true,
    highlight(code, language) {
        const validLang = !!(language && hljs.getLanguage(language));
        if (validLang) {
            const lang = language ?? "";
            return highlightBlock(hljs.highlight(lang, code, true).value, lang);
        }
        return highlightBlock(hljs.highlightAuto(code).value, "");
    },
});

mdi.use(mdKatex, { blockClass: "katexmath-block rounded-md p-[10px]", errorColor: " #cc0000" });

const Text: React.FC<Props> = ({ loading, inversion, text, error }) => {
    const isMobile = useIsMobile();

    const content = useMemo(() => {
        const value = text || "";
        return inversion ? value : mdi.render(value);
    }, [inversion, text]);

    const onClick = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = e.target as HTMLElement;
        if (target.id === "copy-code") {
            const code = target.parentElement?.nextElementSibling?.textContent;
            if (code) {
                await copyToClipboard(code);
                message.success("代码已复制到剪贴板");
            }
        }
    };

    return (
        <div
            className={classNames(
                "text-wrap",
                "min-w-[20px]",
                "rounded-md",
                isMobile ? "p-2" : "px-3 py-2",
                inversion
                    ? "bg-[#3050fb] text-white dark:bg-[#a1dc95]"
                    : "bg-[#f0f5ff] text-black dark:bg-[#1e1e20]",
                { "text-red-500": error }
            )}
        >
            {loading ? (
                <span className="bg-[#3050fb] dark:bg-white w-[4px] h-[20px] block blink" />
            ) : (
                <div className="leading-relaxed break-words">
                    {inversion ? (
                        <div className="whitespace-pre-wrap">{content}</div>
                    ) : (
                        <div
                            className="markdown-body"
                            dangerouslySetInnerHTML={{ __html: content }}
                            onClick={onClick}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Text;
