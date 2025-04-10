import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  Tooltip, BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend, LabelList
} from 'recharts';
import { FaUsers, FaRunning, FaComments, FaPalette, FaMicroscope } from 'react-icons/fa';
import * as RE from '@styles/report/ReportStyles';
import * as RT from 'src/types/ReportTypes';
import React, { useMemo } from 'react';

interface A002Props {
  data: RT.A002Item | RT.A002Item[] | undefined;
  a002Summary: string | undefined;
}

// Tick 렌더링에 사용할 타입
interface CustomTickProps {
  payload: { value: string };
  x: number;
  y: number;
  cx: number;
  cy: number;
}

export default function A002({ data, a002Summary }: A002Props) {
  // 1) JSON 파싱
  const parsedSummary = useMemo(() => {
    if (!a002Summary) return {};

    let trimmedText = a002Summary.trim();
    if (trimmedText.startsWith('```json')) {
      trimmedText = trimmedText.replace(/^```json/, '').replace(/```$/, '').trim();
    }
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

  if (!data) {
    return <div>KICCE 데이터가 없습니다.</div>;
  }

  // 2) 데이터 전처리
  const iconMapping: { [key: string]: React.ReactElement } = {
    "신체운동": <FaRunning size={16} />,
    "의사소통": <FaComments size={16} />,
    "사회관계": <FaUsers size={16} />,
    "예술경험": <FaPalette size={16} />,
    "자연탐구": <FaMicroscope size={16} />
  };

  const dataArray: RT.A002Item[] = Array.isArray(data) ? data : [data];
  const kicceData = dataArray.map((item: RT.A002Item) => ({
    domain: item.domain,
    score: parseFloat(item.score),
    avg: parseFloat(item.avg),
    icon: iconMapping[item.domain] || <FaUsers size={16} />,
  }));

  // 레이더 차트에 사용할 데이터
  const radarChartData = kicceData.map(item => ({
    subject: item.domain,
    A: item.score,
    fullMark: 100,
  }));

  /**
   * 꼭지점(기본 좌표)에서 특정 거리만큼 떨어뜨려 라벨을 표시하기 위한 커스텀 Tick 함수
   * @param props CustomTickProps
   */
  const renderPolarAngleAxisTick = (props: CustomTickProps) => {
    const { payload, x, y, cx, cy } = props;
    const dataItem = radarChartData.find(item => item.subject === payload.value);
    const scoreText = dataItem ? `${dataItem.A}` : '';

    // 차트 중심(cx, cy)에서 현재 tick 좌표(x, y)까지의 벡터를 구한 뒤,
    // 원하는 offset을 더해서 좌표를 다시 계산
    const offset = 12; // 원하는 만큼 띄울 거리(px 단위)
    const dx = x - cx;
    const dy = y - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // distance + offset만큼 원래의 라벨 위치에서 더 바깥(또는 안쪽)으로 이동
    const newX = cx + (distance + offset) * (dx / distance);
    const newY = cy + (distance + offset) * (dy / distance);

    return (
      <g transform={`translate(${newX}, ${newY})`}>
        <text textAnchor="middle" fill="#333">
          {/* 도메인 이름 */}
          {payload.value}
          {/* tspan으로 다음 줄에 점수를 표시 (혹은 원하시는 대로 구조 변경 가능) */}
          <tspan x="0" dy="1.6em" fontSize="12">{scoreText}</tspan>
        </text>
      </g>
    );
  };

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
        <div>
          <h3>아이 점수</h3>
          <RE.ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="70%"
                startAngle={90}
                endAngle={-270}
                data={radarChartData}
              >
                <Radar
                  name="아이 점수"
                  dataKey="A"
                  stroke="#4a6fa5"
                  fill="#4a6fa5"
                  fillOpacity={0.6}
                />
                <PolarGrid />
                {/* 커스텀 Tick 함수를 사용해 꼭지점에서 라벨을 띄웁니다 */}
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={renderPolarAngleAxisTick} 
                  tickLine={false}
                />
                <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}/100`, '점수']} />
              </RadarChart>
            </ResponsiveContainer>
          </RE.ChartContainer>
        </div>

        {/* 바 차트 부분 */}
        <div>
          <h3>평균 또래 대비 점수 비교</h3>
          <RE.ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kicceData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="domain" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}/100`, '점수']} />
                <Legend />
                <Bar dataKey="score" fill="#4a6fa5" name="아이 점수">
                  <LabelList dataKey="score" position="top" fill="#333" />
                </Bar>
                <Bar dataKey="avg" fill="#82ca9d" name="또래 평균">
                  <LabelList dataKey="avg" position="top" fill="#333" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </RE.ChartContainer>
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
