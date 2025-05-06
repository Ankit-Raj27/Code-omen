import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/Firebase/firebase'; // Adjust if needed
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { Card } from '../ui/card';

interface Activity {
    problemId: string;
    problemName: string;
    timestamp: string;
}

const UserActivityComponent = () => {
    const [authUser, setAuthUser] = useState<any | null>(null);
    const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setAuthUser(user);
                try {
                    const userDocRef = doc(firestore, 'users', user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        const data = userDocSnap.data();
                        setRecentActivity(data.recentActivity || []);
                    } else {
                        setError('User data not found.');
                    }
                } catch (err) {
                    setError('Error fetching user activity.');
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return <div className="p-6 text-center text-red-400">{error}</div>;
    }

    return (
        <Card className="bg-gray-900/50 text-white border-gray-800 overflow-hidden">
        <div className="divide-y divide-gray-800">
            {recentActivity.length > 0 ? (
                recentActivity.slice(0, 10).map((activity, index) => (
                    <motion.div
                        key={index}
                        className="p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
                        whileHover={{ x: 5 }}
                    >
                        <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <div className="space-y-1">
                                <p className=" font-medium leading-none">
                                    <Link
                                        href={`/problems/${activity.problemId}`}
                                        className=" hover:underline"
                                    >
                                        {activity.problemName}
                                    </Link>
                                </p>
                                <p className=" text-muted-foreground">
                                    {new Date(activity.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))
            ) : (
                <div className="p-6 text-center text-gray-400">
                    No recent activity found. Start solving problems!
                </div>
            )}
        </div>
        </Card>
    );
};

export default UserActivityComponent;
