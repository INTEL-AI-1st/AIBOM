export const checkOpenAiKey = async (apiKey: string) => {
    try {
        const response = await fetch('https://api.openai.com/v1/engines', {
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

// export const OpenAIWord = async (conversationText: string): Promise<string | null> => {
//     try {
//         const completion = await openai.chat.completions.create({
//             model: 'gpt-4o-mini',
//             messages: [
//                 { role: 'system', content: '당신은 리그 오브 레전드 챔피언 추천 전문가입니다.' },
//                 { role: 'user', content: `${conversationText}\n위 정보를 기반으로 추천할 챔피언을 알려줘.` },
//             ],
//         });

//         return completion.choices[0].message;
//     } catch (error) {
//         console.error('챔피언 추천 중 오류 발생:', error);
//         return null;
//     }
// };