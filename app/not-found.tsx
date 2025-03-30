'use client'

import { Button } from "@/components/ui/button"
import { Home, MoveLeft } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"



export default function NotFound() {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center min-h-screen px-6 py-12"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-9xl font-bold text-gray-200 md:text-[12rem]"
            >
                404
            </motion.div>
            
            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 text-2xl font-semibold text-gray-800 md:text-3xl dark:text-gray-200"
            >
                Page not found
            </motion.h1>
            
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-gray-500 text-center max-w-lg"
            >
                Sorry, the page you are looking for doesn't exist or has been moved.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 mt-8"
            >
                <Button asChild variant="default">
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="javascript:history.back()">
                        <MoveLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Link>
                </Button>
            </motion.div>
        </motion.div>
    )
}