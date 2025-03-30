'use client';


import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';


export default function Loading() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                className="flex flex-col items-center gap-4"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <Loader2 className="h-12 w-12 text-blue-500" />
                </motion.div>
                <motion.p
                    animate={{ opacity: [0.5, 1] }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    className="text-gray-600 font-medium"
                >
                    Loading...
                </motion.p>
            </motion.div>
        </div>
    );
}