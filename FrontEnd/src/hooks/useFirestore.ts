"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, QueryConstraint } from "firebase/firestore";
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
            const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
            if (orderByField) {
                docs.sort((a, b) => {
                    const getVal = (v: any) => {
                        if (v === undefined || v === null) return -Infinity;
                        if (typeof v === 'object' && 'seconds' in v) {
                            return v.seconds * 1000 + (v.nanoseconds / 1000000 || 0);
                        }
                        if (v instanceof Date) return v.getTime();
                        return v;
                    };

                    const valA = getVal(a[orderByField]);
                    const valB = getVal(b[orderByField]);

                    if (orderDirection === "desc") {
                        return valB > valA ? 1 : -1;
                    }
                    return valA > valB ? 1 : -1;
                });
            }

            setData(docs as T[]);
        } catch (err: any) {
            console.error(`Error fetching ${collectionName}:`, err);
            const msg = err.message || `Failed to load ${collectionName}`;
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, [collectionName, orderByField, orderDirection, memoizedConstraints]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, setData, loading, error, refresh: fetchData };
}
