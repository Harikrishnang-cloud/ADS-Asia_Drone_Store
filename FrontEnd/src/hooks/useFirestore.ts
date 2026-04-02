"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { collection, query, getDocs, QueryConstraint } from "firebase/firestore";
import toast from "react-hot-toast";

interface UseFirestoreCollectionProps {
    collectionName: string;
    orderByField?: string;
    orderDirection?: "asc" | "desc";
    constraints?: QueryConstraint[];
}

export function useFirestoreCollection<T>({
    collectionName,
    orderByField,
    orderDirection = "desc",
    constraints
}: UseFirestoreCollectionProps) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const memoizedConstraints = useMemo(() => constraints || [], [constraints]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const q = query(collection(db, collectionName), ...memoizedConstraints);
            const querySnapshot = await getDocs(q);
            const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T & { id: string }));
            if (orderByField) {
                docs.sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
                    const getVal = (v: unknown) => {
                        if (v === undefined || v === null) return -Infinity;
                        if (typeof v === 'object' && v !== null && 'seconds' in v) {
                            const timeObj = v as { seconds: number; nanoseconds?: number };
                            return timeObj.seconds * 1000 + (timeObj.nanoseconds || 0) / 1000000;
                        }
                        if (v instanceof Date) return v.getTime();
                        return v as number | string;
                    };

                    const valA = getVal(a[orderByField]);
                    const valB = getVal(b[orderByField]);

                    if (orderDirection === "desc") {
                        return (valB as number | string) > (valA as number | string) ? 1 : -1;
                    }
                    return (valA as number | string) > (valB as number | string) ? 1 : -1;
                });
            }

            setData(docs as T[]);
        } catch (err: unknown) {
            console.error(`Error fetching ${collectionName}:`, err);
            const errorObj = err as { message?: string };
            const msg = errorObj.message || `Failed to load ${collectionName}`;
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, [collectionName, orderByField, orderDirection, memoizedConstraints]);

    const { isInitialized } = useAuth();

    useEffect(() => {
        if (isInitialized) {
            fetchData();
        }
    }, [fetchData, isInitialized]);

    return { data, setData, loading, error, refresh: fetchData };
}
