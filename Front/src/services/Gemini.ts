export const checkGeminiKey = async (apiKey: string) => {
    try {
        const response = await fetch('https://api.your-gemini-endpoint.com/v1/some-test-endpoint', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        });
        
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;    
    };
}
    