import React from 'react';
import styled from 'styled-components';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

// ===== TYPES =====
interface PerformanceData {
  type: 'hexagon' | 'diamond';
  title: string;
  color: string;
  data: { name: string; value: number; }[];
  rm: string;
}
const RightSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
`;

const GrayBox = styled.div`
  background-color: #f0f0f0;
  border-radius: 5px;
  display: flex;
`;

const ColorSection = styled.div<{ backgroundColor: string }>`
  background-color: ${props => props.backgroundColor};
  padding: 10px;
  height: 50%;
  `;

const Headers = styled.div`
  display: flex;
  justify-content: space-between;

  h3, p {
    margin: 10px 0px;
    white-space: nowrap;
  }
`;

const Bodys = styled.div`
  display: flex;
`

const PerformanceBox = styled.div`
  display: flex;
  width: 100%;
`;

const ShapeContainer = styled(GrayBox)`
  width: 150px;
  height: 150px;
  flex-shrink: 0;
`;

const DescriptionBox = styled(GrayBox)`
  flex-grow: 1;
  margin-left: 10px;
  justify-content: start;
  align-items: start;
  padding: 15px;
`;


const PerformanceRadarChart: React.FC<{
  data: { name: string; value: number; }[];
  color: string;
  type: 'hexagon' | 'diamond';
}> = ({ data, color, type }) => {
  const outerRadius = type === 'hexagon' ? 30 : 28;
  const polarRadius = [0, 12, 24, 30];
  
  return (
    <ResponsiveContainer width={150} height={150}>
      <RadarChart outerRadius={outerRadius} data={data}>
        <PolarGrid 
          gridType="polygon" 
          radialLines={false}
          polarRadius={polarRadius}
        />
        <PolarAngleAxis 
          dataKey="name" 
          tick={{ fontSize: 10 }}
          axisLine={{ stroke: 'black', strokeWidth: 0.5 }} 
        />
        <Radar 
          name="Performance" 
          dataKey="value" 
          stroke={color} 
          fill={color} 
          fillOpacity={0.1} 
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

const PerformanceCardComponent: React.FC<{ 
  data: PerformanceData 
}> = ({ data }) => {
  return (
    <ColorSection backgroundColor={data.color}>
      <Headers>
        <h3>
          {data.title}
        </h3>
        <p>
          더보기 →
        </p>
      </Headers>
      <Bodys>
        <PerformanceBox>
          <ShapeContainer>
            <PerformanceRadarChart 
              data={data.data} 
              color='#ff5555'
              type={data.type} 
            />
          </ShapeContainer>
          <DescriptionBox>
            {data.rm}
          </DescriptionBox>
        </PerformanceBox>
      </Bodys>
    </ColorSection>
  );
};

export default function AbilityGraph () {
  const performanceData: PerformanceData[] = [
    {
      type: 'hexagon',
      title: '행동 발달 그래프',
      color: '#c1e3ff',
      data: [
        { name: '소통', value: 80 },
        { name: '협동', value: 65 },
        { name: '리더십', value: 90 },
        { name: '창의성', value: 75 },
        { name: '감성', value: 85 },
        { name: '사고력', value: 70 }
      ],
      rm: "근육빵빵"
    },
    {
      type: 'diamond',
      title: '역량 발달 그래프',
      color: '#ffb9b9',
      data: [
        { name: '신체운동', value: 85 },
        { name: '생애학습', value: 70 },
        { name: '자기조절', value: 65 },
        { name: '사회정서', value: 90 }
      ],
      rm: "역량빵빵"
    }
  ];

  return (
    <RightSection>
      {performanceData.map((data, index) => (
        <PerformanceCardComponent key={index} data={data} />
      ))}
    </RightSection>
  );
};