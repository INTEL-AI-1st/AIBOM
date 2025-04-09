import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { FaUsers, FaRunning, FaComments, FaPalette, FaMicroscope } from 'react-icons/fa';
import * as RE from '@styles/report/ReportStyles';
import * as RT from 'src/types/ReportTypes';
import React, { useMemo } from 'react';

interface A002Props {
  data: RT.A002Item | RT.A002Item[] | undefined;
  a002Summary: string | undefined;
}

export default function A002({ data, a002Summary }: A002Props) {
  // JSON 포맷과 코드 블록 마크업을 처리하여 파싱합니다.
  const parsedSummary = useMemo(() => {
    if (!a002Summary) return {};

    let trimmedText = a002Summary.trim();

    // 코드 블록 마크업 제거 (```json 와 ``` 제거)
    if (trimmedText.startsWith('```json')) {
      trimmedText = trimmedText.replace(/^```json/, '').replace(/```$/, '').trim();
    }

    // JSON 배열 형태가 아니라면 배열로 감쌉니다.
    if (!trimmedText.startsWith('[')) {
      trimmedText = `[${trimmedText}]`;
    }

    try {
      const jsonData = JSON.parse(trimmedText);
      const result: Record<string, { description: string; tip: string }> = {};
      jsonData.forEach((item: { domain: string; description: string; tip: string }) => {
        result[item.domain] = { description: item.description, tip: item.tip };
      });
      return result;
    } catch (error) {
      console.error('JSON 파싱 에러:', error);
      return {};
    }
  }, [a002Summary]);

  // 데이터가 없으면 메시지 출력
  if (!data) {
    return <div>KICCE 데이터가 없습니다.</div>;
  }

  // 도메인별 아이콘 매핑
  const iconMapping: { [key: string]: React.ReactElement } = {
    "신체운동": <FaRunning size={16} />,
    "의사소통": <FaComments size={16} />,
    "사회관계": <FaUsers size={16} />,
    "예술경험": <FaPalette size={16} />,
    "자연탐구": <FaMicroscope size={16} />
  };

  // data를 배열로 변환
  const dataArray: RT.A002Item[] = Array.isArray(data) ? data : [data];

  // KICCE 데이터 생성 (아이콘 포함)
  const kicceData = dataArray.map((item: RT.A002Item) => ({
    domain: item.domain,
    score: parseFloat(item.score),
    avg: parseFloat(item.avg),
    icon: iconMapping[item.domain] || <FaUsers size={16} />,
  }));

  // RadarChart에 필요한 데이터 포맷 (점수는 100점 만점)
  const chartData = kicceData.map(item => ({
    subject: item.domain,
    A: item.score,
    fullMark: 100,
  }));

  // 도메인별 아이콘 반환 함수
  const getDomainIcon = (domainName: string) => {
    const domain = kicceData.find(item => item.domain === domainName);
    return domain ? domain.icon : null;
  };

  return (
    <RE.SectionContainer>
      <RE.SectionTitle>
        <FaUsers size={20} />
        KICCE 유아관찰척도
      </RE.SectionTitle>
      
      <RE.KICCELayout>
        <RE.ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
              <Radar
                name="아이 점수"
                dataKey="A"
                stroke="#4a6fa5"
                fill="#4a6fa5"
                fillOpacity={0.6}
              />
              <Tooltip formatter={(value) => [`${value}/100`, '점수']} />
            </RadarChart>
          </ResponsiveContainer>
        </RE.ChartContainer>
        
        <div>
          <h3>평균 또래 대비 점수</h3>
          {kicceData.map((item, index) => (
            <RE.DomainTitle key={index}>
              {index + 1}. {item.domain} <span>평균 {item.score}/100점</span>
            </RE.DomainTitle>
          ))}
        </div>
      </RE.KICCELayout>
      
      <div style={{ marginTop: '30px' }}>
        <h3>🧒 아이 발달 리포트 요약 (KICCE 기준)</h3>
        {kicceData.map((item, index) => {
          const domainKey = item.domain;
          const summary = parsedSummary[domainKey];
          
          return (
            <RE.DomainSection key={index}>
              <RE.DomainTitle>
                {getDomainIcon(domainKey)}
                {domainKey} <span>({item.score}/100)</span>
              </RE.DomainTitle>
              <RE.DomainDescription>
                {summary?.description || `${domainKey} 영역에 대한 정보가 없습니다.`}
              </RE.DomainDescription>
              <RE.DomainTip>
                <strong>💡 가정 연계 팁:</strong> {summary?.tip || '준비된 팁이 없습니다.'}
              </RE.DomainTip>
            </RE.DomainSection>
          );
        })}
      </div>
    </RE.SectionContainer>
  );
}
