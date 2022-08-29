import axios from 'axios';
import { FoodEntry, User } from './interfaces';

const adminUser = {
    id: '630b8e60d9337f80738505fd',
    token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJyb2xlIjoiYWRtaW4iLCJpZCI6IjYzMGI4ZTYwZDkzMzdmODA3Mzg1MDVmZCIsImlhdCI6MTY2MTcyMjExN30.rNOHjyuY8242Fj2gQj5P6uRBbTL0bopO8u7L6ySYkd0'
}

const regUser = {
    id: '630bda68abd176efe61fa877',
    token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inl5Iiwicm9sZSI6InVzZXIiLCJpZCI6IjYzMGJkNjRlNjcyMTQzNmU1Y2Y1NjdiNyIsImlhdCI6MTY2MTcyNDg0N30.GDHVY5kyd8-fIyzJ8MtgefhB62ZGUQKt_Y2x1I7QXi0'
}

const loginUser = adminUser

const baseUri = 'http://localhost:3001/api'

axios.defaults.baseURL = 'http://localhost:3001/api';
axios.defaults.headers.common['Authorization'] = loginUser.token;


interface ErrorResponse {
    error: string;
}

const getUser = async (): Promise<User> => {
    try {
        const response = await axios.get<User | ErrorResponse>(`${baseUri}/users/${loginUser.id}`, {
            headers: {
                'Authorization': loginUser.token
            }
        });
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
        const response = await axios.get<User[] | ErrorResponse>(`${baseUri}/users}`, {
            headers: {
                'Authorization': loginUser.token
            }
        });
        return (response.data as User[]);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error((error.response.data as ErrorResponse).error)
        }
        throw error
    }
}

const getAllEntries = async (): Promise<User[]> => {
    try {
        const response = await axios.get<User[] | ErrorResponse>(`${baseUri}/foods}`, {
            headers: {
                'Authorization': loginUser.token
            }
        });
        return (response.data as User[]);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error((error.response.data as ErrorResponse).error)
        }
        throw error
    }
}

const createEntry = async (entry: FoodEntry): Promise<User> => {
    try {
        const response = await axios.post<User | ErrorResponse>(`/foods`, entry);
        return (response.data as User);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error((error.response.data as ErrorResponse).error)
        }
        throw error
    }
}

const updateEntry = async (entry: FoodEntry): Promise<User> => {
    try {
        const response = await axios.post<User | ErrorResponse>(`${baseUri}/foods/${entry.id}`, {
            headers: {
                'Authorization': loginUser.token
            },
            data: entry
        });
        return (response.data as User);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error((error.response.data as ErrorResponse).error)
        }
        throw error
    }
}

const deleteEntry = async (entryId: string): Promise<User> => {
    try {
        const response = await axios.post<User | ErrorResponse>(`${baseUri}/foods/${entryId}`, {
            headers: {
                'Authorization': loginUser.token
            },
        });
        return (response.data as User);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error((error.response.data as ErrorResponse).error)
        }
        throw error
    }
}

const API = { getUser, getAllUser, getAllEntries, createEntry, deleteEntry, updateEntry }

export default API