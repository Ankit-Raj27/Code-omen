import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Code, Database, Sparkles, Trophy, Users } from 'lucide-react'
import Link from 'next/link'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { authModalState } from '@/atoms/authModalAtom'

const TrophySection = () => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }
    const setModalState = useSetRecoilState(authModalState);
    const modalState = useRecoilValue(authModalState); // <-- read modal state

    const handleClick = () => {
        setModalState((prev) => ({ ...prev, isOpen: true }));
    };
    return (<>
        <section className='py-20 px-4 md:px-8 bg-gradient-to-b from-black to-gray-900'>
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Platform</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Designed to help you excel in technical interviews and competitive programming</p>
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    {[
                        {
                            icon: <Code className="w-10 h-10 text-purple-400" />,
                            title: "Curated Problem Sets",
                            description: "Carefully selected problems from NeetCode, Striver, and GFG to build your skills systematically"
                        },
                        {
                            icon: <Trophy className="w-10 h-10 text-amber-400" />,
                            title: "Track Your Progress",
                            description: "Monitor your improvement with detailed statistics and completion rates"
                        },
                        {
                            icon: <Database className="w-10 h-10 text-blue-400" />,
                            title: "Comprehensive Solutions",
                            description: "Access detailed explanations and multiple approaches to each problem"
                        },
                        {
                            icon: <Users className="w-10 h-10 text-green-400" />,
                            title: "Community Support",
                            description: "Connect with fellow coders to discuss strategies and solutions"
                        },
                        {
                            icon: <Sparkles className="w-10 h-10 text-pink-400" />,
                            title: "Interactive Learning",
                            description: "Engage with interactive visualizations to understand algorithms better"
                        },
                        {
                            icon: <ArrowRight className="w-10 h-10 text-cyan-400" />,
                            title: "Interview Preparation",
                            description: "Prepare for technical interviews with company-specific problem sets"
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all"
                            variants={fadeInUp}
                            whileHover={{ y: -5, boxShadow: '0 10px 30px -15px rgba(138, 75, 255, 0.2)' }}
                        >
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>

        {/* Stats Section */}

        <section className="py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                >
                    {[
                        { number: "400+", label: "Coding Problems" },
                        { number: "3", label: "Problem Sets" },
                        { number: "50K+", label: "Active Users" },
                        { number: "95%", label: "Success Rate" }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            className="bg-gray-900/30 backdrop-blur-sm p-6 rounded-xl border border-gray-800"
                            variants={fadeInUp}
                        >
                            <motion.div
                                className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{
                                    opacity: 1,
                                    scale: 1,
                                    transition: {
                                        type: "spring",
                                        stiffness: 100,
                                        delay: 0.1 * index
                                    }
                                }}
                                viewport={{ once: true }}
                            >
                                {stat.number}
                            </motion.div>
                            <p className="text-gray-400 mt-2">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
        {/* Final CTA Section */}
        <section className="py-20 px-4 md:px-8 relative">
            <div className="absolute inset-0 z-0 opacity-30">
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-20"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20"></div>
            </div>

            <motion.div
                className="max-w-4xl mx-auto text-center relative z-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
            >
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Level Up Your Coding Skills?</h2>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                    Join thousands of developers who have transformed their problem-solving abilities with our platform
                </p>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block"
                >
                    <button className='px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-medium text-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all' onClick={handleClick}>
                        Start Coding Now
                    </button>
                </motion.div>
            </motion.div>
        </section>
    </>
    )
}

export default TrophySection
