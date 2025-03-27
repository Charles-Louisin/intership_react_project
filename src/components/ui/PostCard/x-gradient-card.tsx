import { VerifiedIcon } from "lucide-react";
import { cn } from "../../../lib/utils";

interface XCardProps {
    authorName: string;
    authorHandle: string;
    authorImage: string;
    content: string | string[];
    isVerified?: boolean;
    timestamp: string;
    tags?: string[];
    reactions?: {
        likes: number;
        dislikes: number;
    };
    views?: number;
    hideReactions?: boolean;
    className?: string;
}

function XCard({
    authorName,
    authorHandle,
    authorImage,
    content,
    isVerified = true,
    timestamp,
    tags = [],
    reactions,
    views = 0,
    hideReactions = false,
}: XCardProps) {
    return (
        <div className={cn(
            "w-full min-w-[300px] max-w-full p-1.5 rounded-2xl relative isolate overflow-hidden",
            "bg-white/5 dark:bg-black/90",
            "bg-gradient-to-br from-black/5 to-black/[0.02] dark:from-white/5 dark:to-white/[0.02]",
            "backdrop-blur-xl backdrop-saturate-[180%]",
            "border border-black/10 dark:border-white/10",
            "shadow-[0_8px_16px_rgb(0_0_0_/_0.15)] dark:shadow-[0_8px_16px_rgb(0_0_0_/_0.25)]",
            "will-change-transform translate-z-0"
        )}>
            <div className={cn(
                "w-full p-5 rounded-xl relative",
                "bg-gradient-to-br from-black/[0.05] to-transparent dark:from-white/[0.08] dark:to-transparent",
                "backdrop-blur-md backdrop-saturate-150",
                "border border-black/[0.05] dark:border-white/[0.08]",
                "text-black/90 dark:text-white",
                "shadow-sm",
                "will-change-transform translate-z-0",
                "before:absolute before:inset-0 before:bg-gradient-to-br before:from-black/[0.02] before:to-black/[0.01] dark:before:from-white/[0.03] dark:before:to-white/[0.01] before:opacity-0 before:transition-opacity before:pointer-events-none",
                "hover:before:opacity-100"
            )}>
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
                                    <span className="font-semibold text-black dark:text-white/90">
                                        {authorName}
                                    </span>
                                    {isVerified && (
                                        <VerifiedIcon className="h-4 w-4 text-blue-400" />
                                    )}
                                </div>
                                <span className="text-black/60 dark:text-white/60 text-sm">
                                    @{authorHandle}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-2">
                    {Array.isArray(content) ? (
                        content.map((item, index) => (
                            <p key={index} className="text-black dark:text-white/90 text-base">
                                {item}
                            </p>
                        ))
                    ) : (
                        <p className="text-black dark:text-white/90 text-base">
                            {content}
                        </p>
                    )}

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((tag, index) => (
                                <span key={index} className="text-sm text-blue-500 dark:text-blue-400">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-sm text-black/60 dark:text-white/60">
                        {!hideReactions && reactions && (
                            <>
                                <span>{reactions.likes} likes</span>
                                <span>{reactions.dislikes} dislikes</span>
                            </>
                        )}
                        {!hideReactions && views > 0 && <span>{views} vues</span>}
                        <span>{timestamp}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { XCard }