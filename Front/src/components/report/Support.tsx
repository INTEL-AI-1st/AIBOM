import * as RE from '@styles/report/ReportStyles';
import { FaHome, FaHandsHelping, FaBuilding } from 'react-icons/fa';
import { useMemo } from 'react';

interface SupportProps {
  summary: string | undefined;
}

interface Tip {
  item: string;
  details: string;
}

interface ParsedSummary {
  tips: Tip[];
  institution?: string;
}

export default function Support({ summary }: SupportProps) {
  const parsedSummary = useMemo(() => {
    if (!summary) return { tips: [], institution: '' };

    let trimmedText = summary.trim();

    if (trimmedText.startsWith('```json')) {
      trimmedText = trimmedText.replace(/^```json/, '').replace(/```$/, '').trim();
    }

    try {
      const parsed = JSON.parse(trimmedText) as ParsedSummary;
      return {
        tips: parsed.tips || [],
        institution: parsed.institution || ''
      };
    } catch (error) {
      console.error("JSON 파싱 에러:", error);
      return { tips: [], institution: '' };
    }
  }, [summary]);

  // 팁 데이터 포맷팅
  const homeTips = useMemo(() => {
    return parsedSummary.tips.map((tip, index) => {
      const tipDetails = tip.details.split('\n').map(detail => detail.trim().replace(/^✅\s*/, ''));
      
      return {
        title: `${index + 1}. ${tip.item}`,
        tips: tipDetails
      };
    });
  }, [parsedSummary]);

  return (
    <RE.SectionContainer>
      <RE.SectionTitle>
        <FaHandsHelping size={20} />
        발달 지원 팁
      </RE.SectionTitle>
      
      <RE.TipTitle>
        <FaHome size={20} />
        🏡 가정에서의 발달 지원 팁
      </RE.TipTitle>
      
      <RE.TipsGrid>
        {homeTips.map((tipGroup, index) => (
          <RE.TipCard key={index}>
            <h4>{tipGroup.title}</h4>
            <RE.TipList>
              {tipGroup.tips.map((tip, idx) => (
                <RE.TipItem key={idx}>{tip}</RE.TipItem>
              ))}
            </RE.TipList>
          </RE.TipCard>
        ))}
      </RE.TipsGrid>
      
      <RE.AgencyBox>
        <RE.AgencyTitle>
          <FaBuilding size={20} />
          🏢 유관기관 추천
        </RE.AgencyTitle>
        
        <RE.AgencyNote>
          💬 {parsedSummary.institution}
        </RE.AgencyNote>
      </RE.AgencyBox>
    </RE.SectionContainer>
  );
}