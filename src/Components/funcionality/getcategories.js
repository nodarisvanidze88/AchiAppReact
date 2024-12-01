export const GetData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Server error');
        }
        return await response.json();
    } catch (error) {
        console.error('Cannot get data from server:', error);
        return null;
    }
};
