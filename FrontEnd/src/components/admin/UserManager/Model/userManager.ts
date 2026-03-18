import { User } from "@/types/user.types";

export interface UserManagerProps {
    users: User[];
    loading: boolean;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    updatingId: string | null;
    userToUpdate: User | null;
    setUserToUpdate: (user: User | null) => void;
    handleToggleStatus: () => Promise<void>;
    stats: {
        total: number;
        active: number;
        blocked: number;
    };
    getAuthLabel: (provider: string) => string;
    formatDate: (timestamp: any) => string;
    formatTime: (timestamp: any) => string;
}
