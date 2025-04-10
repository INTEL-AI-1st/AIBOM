import * as RE from '@styles/report/ReportStyles';
import { useMemo } from 'react';
import { FaComments } from 'react-icons/fa';

interface RecommendProps {
  summary: string | undefined;
}

export default function Recommendation({ summary }: RecommendProps) {
  const parsedSummary = useMemo(() => {
    if (!summary) return {};
    let trimmedText = summary.trim();

    if (trimmedText.startsWith('```json')) {
      trimmedText = trimmedText.replace(/^```json/, '').replace(/```$/, '').trim();
    }

    try {
      // JSON 데이터가 단일 객체로 넘어온다고 가정합니다.
      return JSON.parse(trimmedText);
    } catch (error) {
      console.error('JSON 파싱 에러:', error);
      return {};
    }
  }, [summary]);

  // Function to format the review text with colored increase/decrease indicators
  const formatReviewText = (text: string) => {
    if (!text) return '';
    
    // Replace increase indicators (▲) with green colored text
    let formattedText = text.replace(/(\(▲[0-9.]+\))/g, '<span style="color: #4CAF50">$1</span>');
    
    // Replace decrease indicators (▼) with red colored text
    formattedText = formattedText.replace(/(\(▼[0-9.]+\))/g, '<span style="color: #F44336">$1</span>');
    
    return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  return (
    <RE.SectionContainer>
      <RE.SectionTitle>
        <FaComments size={20} />
        전문가 총평
      </RE.SectionTitle>
      
      <RE.AssessmentBox>
        {formatReviewText(parsedSummary.review)}
      </RE.AssessmentBox>
      
      <RE.RecommendationsBox>
        <RE.SectionTitle>🔎 추천 사항</RE.SectionTitle>
        
        <RE.RecommendationItem>
          <p>
            {parsedSummary.Recommend}
          </p>
        </RE.RecommendationItem>
      </RE.RecommendationsBox>
    </RE.SectionContainer>
  );
}