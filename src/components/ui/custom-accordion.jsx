// TODO review whether to keep this accordion or the shadcn
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"
const CustomAccordion = ({ id, expanded, setExpanded, title, content, contentClass }) => {
    const isActive = id === expanded
    return (
        <article className="border-b border-[#E2E8F0] py-5 last:border-b-0 lg:px-14 lg:py-6">
            <div
                className="mb-4 flex cursor-pointer select-none items-center justify-between"
                onClick={() => setExpanded(isActive ? false : id)}
            >
                <h5 className={cn("font-bold", isActive && "text-primary")}>{title}</h5>
                <div>{isActive ? <Minus className="text-primary" /> : <Plus />}</div>
            </div>
            <AnimatePresence initial={false}>
                {isActive && (
                    <motion.section
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0 },
                        }}
                        transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                        <div
                            className={cn(
                                "leading-9 text-primary-heading lg:leading-7",
                                contentClass
                            )}
                        >
                            {content}
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </article>
    )
}

export default CustomAccordion
