
const BASE_URL = import.meta.env.VITE_API_URL;

export const employeeService = {
    getAll: async () => {
        const response = await fetch(`${BASE_URL}/employees`);
        return response.json();
    },

    create: async (employee: any) => {
        const response = await fetch(`${BASE_URL}/employees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee)
        });
        return response.json();
    },

    update: async (id: number, employee: any) => {
        const response = await fetch(`${BASE_URL}/employees/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee)
        });
        return response.json();
    },

    delete: async (id: number) => {
        const response = await fetch(`${BASE_URL}/employees/${id}`, {
            method: 'DELETE'
        });
        return response.json();
    }
};