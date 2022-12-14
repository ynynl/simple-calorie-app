import axios from 'axios';
import { FoodEntry, User } from './interfaces';

const adminUser = {
    id: '630b8e60d9337f80738505fd',
    token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJyb2xlIjoiYWRtaW4iLCJpZCI6IjYzMGI4ZTYwZDkzMzdmODA3Mzg1MDVmZCIsImlhdCI6MTY2MTcyMjExN30.rNOHjyuY8242Fj2gQj5P6uRBbTL0bopO8u7L6ySYkd0'
}

const regUser = {
    id: '630bd64e6721436e5cf567b7',
    token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inl5Iiwicm9sZSI6InVzZXIiLCJpZCI6IjYzMGJkNjRlNjcyMTQzNmU1Y2Y1NjdiNyIsImlhdCI6MTY2MTcyNDg0N30.GDHVY5kyd8-fIyzJ8MtgefhB62ZGUQKt_Y2x1I7QXi0'
}

let loginUser = adminUser

// loginUser = regUser

const baseUri = 'http://localhost:3001/api'

axios.defaults.baseURL = 'http://localhost:3001/api';
axios.defaults.headers.common['Authorization'] = loginUser.token;


interface ErrorResponse {
    error: string;
}

const getUser = async (): Promise<User> => {
    try {
        const response = await axios.get<User | ErrorResponse>(`/users/${loginUser.id}`);
        return (response.data as User);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error((error.response.data as ErrorResponse).error)
        }
        throw error
    }
}

const getUserAdmin = async (id: string): Promise<User> => {
    try {
        const response = await axios.get<User | ErrorResponse>(`/users/${id}`);
        return (response.data as User);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error((error.response.data as ErrorResponse).error)
        }
        throw error
    }
}

const getAllUser = async (): Promise<User[]> => {
    try {
        const response = await axios.get<User[] | ErrorResponse>(`/users`);
        return (response.data as User[]);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 403 || error.response.status === 401) {
                console.log(error);
                
                throw new Error("No Permission")
            }
            throw new Error((error.response.data as ErrorResponse).error)
        }
        throw error
    }
}

const getAllEntries = async (): Promise<FoodEntry[]> => {
    try {
        const response = await axios.get<FoodEntry[] | ErrorResponse>(`/foods`);
        return (response.data as FoodEntry[]);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 403 || error.response.status === 401) {
                console.log(error);
                throw new Error("No Permission")
            }
            throw new Error((error.response.data as ErrorResponse).error)
        }
        throw error
    }
}

const createEntry = async (entry: Partial<FoodEntry>): Promise<FoodEntry> => {
    try {
        const response = await axios.post<FoodEntry | ErrorResponse>(`/foods`, entry);
        return (response.data as FoodEntry);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error((error.response.data as ErrorResponse).error)
        }
        throw error
    }
}

const createEntryAdmin = async (entry: Partial<FoodEntry> & { user: string }): Promise<FoodEntry> => {
    try {
        const response = await axios.post<FoodEntry | ErrorResponse>(`/foods`, entry);
        return (response.data as FoodEntry);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error((error.response.data as ErrorResponse).error)
        }
        throw error
    }
}

const updateEntry = async (entry: Partial<FoodEntry>): Promise<FoodEntry> => {
    try {
        const response = await axios.put<FoodEntry | ErrorResponse>(`/foods/${entry.id}`, entry);
        return (response.data as FoodEntry);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error((error.response.data as ErrorResponse).error)
        }
        throw error
    }
}

const deleteEntry = async (entryId: string): Promise<FoodEntry> => {
    try {
        const response = await axios.delete<FoodEntry | ErrorResponse>(`/foods/${entryId}`, {
        });
        return (response.data as FoodEntry);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error((error.response.data as ErrorResponse).error)
        }
        throw error
    }
}

const API = { getUser, getAllUser, getAllEntries, createEntry, deleteEntry, updateEntry, createEntryAdmin, getUserAdmin }

export default API