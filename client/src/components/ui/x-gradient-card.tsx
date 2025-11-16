import { VerifiedIcon } from "lucide-react";
import { cn } from "@/lib/util";
import { Link } from "react-router-dom";

interface ReplyProps {
    authorName: string;
    authorHandle: string;
    authorImage: string;
    content: string;
    isVerified?: boolean;
    timestamp: string;
}

interface XCardProps {
    link: string;
    authorName: string;
    authorHandle: string;
    authorImage: string;
    content: string[];
    isVerified?: boolean;
    timestamp: string;
    reply?: ReplyProps;
}

function XCard({
    link = "https://x.com/dorian_baffier/status/1880291036410572934",
    authorName = "Dorian",
    authorHandle = "dorian_baffier",
    authorImage = "https://pbs.twimg.com/profile_images/1854916060807675904/KtBJsyWr_400x400.jpg",
    content = [
        "All components from KokonutUI can now be open in @v0 🎉",
        "1. Click on 'Open in V0'",
        "2. Customize with prompts",
        "3. Deploy to your app",
    ],
    isVerified = true,
    timestamp = "Jan 18, 2025",
    reply = {
        authorName: "shadcn",
        authorHandle: "shadcn",
        authorImage:
            "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
        content: "Awesome.",
        isVerified: true,
        timestamp: "Jan 18",
    },
}: XCardProps) {
    return (
        <Link
            href={link}
            target="_blank"
        >
            <div
                className={cn(
                    "w-full min-w-[400px] md:min-w-[500px] max-w-xl p-1.5 rounded-2xl relative isolate overflow-hidden",
                    "bg-gray-900/80 backdrop-blur-md",
                    "border border-gray-700/50",
                    "shadow-[0_4px_12px_rgb(0_0_0_/_0.25)]",
                    "hover:border-gray-600/70 transition-colors duration-200",
                    "will-change-transform translate-z-0"
                )}
            >
                <div
                    className={cn(
                        "w-full p-5 rounded-xl relative",
                        "bg-gray-800/60 backdrop-blur-sm",
                        "border border-gray-700/50",
                        "text-white",
                        "transition-all duration-200"
                    )}
                >
                    <div className="flex gap-3">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full overflow-hidden">
                                <img
                                    src={authorImage}
                                    alt={authorName}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium text-white hover:underline cursor-pointer">
                                            {authorName}
                                        </span>
                                        {isVerified && (
                                            <VerifiedIcon className="h-4 w-4 text-blue-400 ml-0.5" />
                                        )}
                                    </div>
                                    <span className="text-black dark:text-white/60 text-sm">
                                        @{authorHandle}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="h-8 w-8 text-black dark:text-white/80 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg p-1 flex items-center justify-center"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1200"
                                        height="1227"
                                        fill="none"
                                        viewBox="0 0 1200 1227"
                                        className="w-4 h-4"
                                    >
                                        <title>X</title>
                                        <path
                                            fill="currentColor"
                                            d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 space-y-2">
                        {content.map((item, index) => (
                            <p
                                key={index}
                                className="text-gray-200 text-sm leading-relaxed"
                            >
                                {item}
                            </p>
                        ))}
                        <span className="text-gray-400 text-xs mt-3 block">
                            {timestamp}
                        </span>
                    </div>

                    {reply && (
                        <div className="mt-4 pt-4 border-t border-black/[0.08] dark:border-white/[0.08]">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full overflow-hidden">
                                        <img
                                            src={reply.authorImage}
                                            alt={reply.authorName}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold text-black dark:text-white/90 hover:underline cursor-pointer">
                                            {reply.authorName}
                                        </span>
                                        {reply.isVerified && (
                                            <VerifiedIcon className="h-4 w-4 text-blue-400" />
                                        )}
                                        <span className="text-black dark:text-white/60 text-sm">
                                            @{reply.authorHandle}
                                        </span>
                                        <span className="text-black dark:text-white/60 text-sm">
                                            ·
                                        </span>
                                        <span className="text-black dark:text-white/60 text-sm">
                                            {reply.timestamp}
                                        </span>
                                    </div>
                                    <p className="text-black dark:text-white/80 text-sm mt-1">
                                        {reply.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}


export { XCard }