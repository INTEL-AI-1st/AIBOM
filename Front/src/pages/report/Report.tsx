import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList 
} from 'recharts';
import { FaAngleLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { Container } from "@styles/measure/ObservationStyles";

// 전체 레이아웃
const ReportWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

// 상단 영역: 좌측 - 사용자 정보, 우측 - 그래프 영역
const TopSection = styled.div`
  display: flex;
  flex: 1;
  margin-bottom: 20px;
`;

// 좌측 패널: 사용자 이름 및 간단한 통계 정보
const LeftPanel = styled.div`
  flex: 1;
  padding: 20px;
  border-right: 1px solid #ccc;
`;

// 우측 패널: 통계 그래프 영역
const RightPanel = styled.div`
  flex: 2;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 하단 영역: 리포트 설명 등
const BottomSection = styled.div`
  padding: 20px;
  border-top: 1px solid #ccc;
`;

// 각 도메인 섹션 스타일
const Section = styled.section`
  padding: 40px 20px;
  border-top: 1px solid #ccc;
`;

// 텍스트 스타일
const Title = styled.h1`
  display: flex;
  font-size: 24px;
  margin-bottom: 10px;
  align-items: center;
  
  svg {
    margin-bottom: 3px;
  }
`;

const Subtitle = styled.h2`
  font-size: 18px;
  margin-bottom: 8px;
  color: #555;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.5;
`;

// 네비게이션 바 스타일
export const Nav = styled.nav`
  width: 100%;
  background: #ffb9b9;
  padding: 12px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

export const NavList = styled.ul`
  display: flex;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const NavItem = styled.li`
  cursor: pointer;
  font-weight: bold;
  margin: 0 15px;
  transition: color 0.2s ease-in-out;
  &:hover {
    color: #0077cc;
  }
`;

// 예제 데이터: 각 항목은 이름, 내 점수(myScore), 평균 점수(avgScore)를 포함
const sampleData = [
  { name: '수학', myScore: 85, avgScore: 75 },
  { name: '영어', myScore: 78, avgScore: 80 },
  { name: '과학', myScore: 92, avgScore: 88 },
  { name: '역사', myScore: 70, avgScore: 65 },
  { name: '음악', myScore: 88, avgScore: 90 }
];

// 내 점수를 기준으로 내림차순 정렬된 데이터 생성
const sortedData = (data: typeof sampleData) =>
  [...data].sort((a, b) => b.myScore - a.myScore);

// 수평 막대 그래프 컴포넌트 (layout="vertical" 사용)
// 막대는 겹치도록 하고, 각 항목 위쪽에 비교 텍스트를 배치
const HorizontalBarChart: React.FC = () => {
  // useMemo를 통해 정렬된 데이터를 캐싱
  const data = useMemo(() => sortedData(sampleData), []);

  // 커스텀 라벨: 막대 중앙 위쪽에 비교 텍스트를 표시
  const renderComparisonLabel = (props: any) => {
    const { x, y, width, index } = props;
    const { myScore, avgScore } = data[index];
    const comparison =
      myScore > avgScore ? '평균보다 높음' : myScore < avgScore ? '평균보다 낮음' : '평균과 동일';

    return (
      <text
        x={x + width / 2}
        y={y - 10}  // 막대 위쪽에 위치
        fill="#000"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
      >
        {comparison}
      </text>
    );
  };

  return (
    <BarChart
      width={500}
      height={300}
      data={data}
      layout="vertical"
      margin={{ top: 40, right: 80, left: 80, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis dataKey="name" type="category" width={80} />
      <Tooltip />
      <Legend />
      {/* 평균 점수 막대 (겹치도록 barGap 음수값 설정) */}
      <Bar dataKey="avgScore" fill="#90ee90" name="평균 점수" barGap={-20} />
      {/* 내 점수 막대 + 비교 라벨 */}
      <Bar dataKey="myScore" fill="#ff5555" name="내 점수" barGap={-20}>
        <LabelList dataKey="myScore" content={renderComparisonLabel} />
      </Bar>
    </BarChart>
  );
};

export default function Report() {
    const navigate = useNavigate();
  const domainList = useMemo(
    () => ['자기조절', '사회성', '인지능력', '신체운동', '감정표현'],
    []
  );

  // 해당 도메인 섹션으로 스크롤하는 함수
  const scrollToSection = useCallback((domain: string) => {
    const element = document.getElementById(domain);
    if (element) {
      const yOffset = -50;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  return (
    <Container>
        <Container>
            <Title>
                <FaAngleLeft size={24} onClick={() => navigate(-1)} style={{cursor: 'pointer'}}/>
                분석 리포트
            </Title>
            <Nav>
                <NavList>
                {domainList.map((domain) => (
                    <NavItem key={domain} onClick={() => scrollToSection(domain)}>
                    {domain}
                    </NavItem>
                ))}
                </NavList>
            </Nav>
            <ReportWrapper>
                <TopSection>
                <LeftPanel>
                    <Title>사용자 이름</Title>
                    <Subtitle>통계 정보</Subtitle>
                    <Description>
                    이 영역에는 사용자의 기본 정보와 함께 해당 항목별 점수가 표시됩니다.
                    </Description>
                </LeftPanel>
                <RightPanel>
                    <HorizontalBarChart />
                </RightPanel>
                </TopSection>
                <BottomSection>
                <Subtitle>리포트 설명</Subtitle>
                <Description>
                    각 항목별로 내 점수와 평균 점수를 비교하여, 평균보다 높은지 낮은지를 확인할 수 있습니다.
                    점수가 높은 순으로 정렬되어 있어 우선순위를 한눈에 파악할 수 있습니다.
                </Description>
                </BottomSection>
            </ReportWrapper>
            {/* 도메인별 추가 섹션 (임의 내용) */}
            {domainList.map((domain) => (
                <Section id={domain} key={domain}>
                <Subtitle>{domain}</Subtitle>
                <Description>
                    {domain}에 대한 상세 설명 및 추가 통계 정보를 여기에 기입합니다.
                </Description>
                </Section>
            ))}
        </Container>
    </Container>
  );
}
