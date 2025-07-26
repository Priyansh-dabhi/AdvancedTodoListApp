// GettingUserDetail.ts
import { getCurrentUser } from '../Service/Service';

// Pure async function (no hooks)
export const getUserName = async (): Promise<string> => {
    const user = await getCurrentUser();
    return user?.name ?? '';
};

export const getUserEmail = async (): Promise<string> => {
    const user = await getCurrentUser();
    return user?.email ?? '';
};
