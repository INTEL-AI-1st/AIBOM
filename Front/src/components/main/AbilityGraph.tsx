import { useState, useMemo, useCallback, memo } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import {
  RightSection, ColorSection, Headers, Bodys, PerformanceBox, ShapeContainer, ColorBox, ColorWrapper, Color, ColorText,
  Footer
} from '@styles/main/AbilityGraphStyles';

// ===== TYPES =====
interface ChartData {
  name: string;
  value: number;
}

interface PerformanceData {
  title: string;
  color: string;
  data: ChartData[];
  avgData: ChartData[];
}

interface CustomTickProps {
  payload: { value: string };
  cx: number;
  cy: number;
  radius: number;
  index: number;
}

interface PerformanceRadarChartProps {
  data: ChartData[];
  avgData: ChartData[];
  color: string;
}

// ===== STATIC DATA =====
const performanceData: PerformanceData[] = [
  {
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
    avgData: [
      { name: '소통', value: 70 },
      { name: '협동', value: 60 },
      { name: '리더십', value: 80 },
      { name: '창의성', value: 65 },
      { name: '감성', value: 75 },
      { name: '사고력', value: 68 }
    ]
  },
  {
    title: '유아 관찰 그래프',
    color: '#ffdada',
    data: [
      { name: '신체운동', value: 85 },
      { name: '의사소통', value: 70 },
      { name: '사회관계', value: 65 },
      { name: '예술경험', value: 90 },
      { name: '자연탐구', value: 90 }
    ],
    avgData: [
      { name: '신체운동', value: 80 },
      { name: '의사소통', value: 65 },
      { name: '사회관계', value: 60 },
      { name: '예술경험', value: 85 },
      { name: '자연탐구', value: 88 }
    ]
  },
  {
    title: '역량 발달 그래프',
    color: '#ffd6a5',
    data: [
      { name: '신체운동', value: 85 },
      { name: '생애학습', value: 70 },
      { name: '자기조절', value: 65 },
      { name: '사회정서', value: 90 }
    ],
    avgData: [
      { name: '신체운동', value: 82 },
      { name: '생애학습', value: 68 },
      { name: '자기조절', value: 70 },
      { name: '사회정서', value: 88 }
    ]
  }
];

// ===== RadarChart Component (일반 함수) =====
function PerformanceRadarChart({ data, avgData, color }: PerformanceRadarChartProps) {
  const [hovered, setHovered] = useState<'child' | 'avg' | null>(null);

  // 차트 크기 조정
  const outerRadius = 80;
  const polarRadius = [0, 20, 40, 60, outerRadius];

  // 데이터 통합
  const combinedData = useMemo(() => {
    return data.map((item, index) => ({
      name: item.name,
      performance: item.value,
      average: avgData[index]?.value ?? item.value
    }));
  }, [data, avgData]);

  const renderCustomAngleAxis = useCallback(
    (props: CustomTickProps) => {
      const { payload, cx, cy, radius, index } = props;
      const angle = (Math.PI * 2 * index) / combinedData.length - Math.PI / 2;
      const labelX = cx + (radius + 20) * Math.cos(angle);
      const labelY = cy + (radius + 20) * Math.sin(angle);
      const valueY = labelY + 14;
      const value =
        hovered === 'avg'
          ? combinedData[index].average
          : combinedData[index].performance;

      return (
        <g>
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fill="#333"
          >
            {payload.value}
          </text>
          <text
            x={labelX}
            y={valueY}
            textAnchor="middle"
            fontSize={10}
            fill="#666"
          >
            {value}
          </text>
        </g>
      );
    },
    [combinedData, hovered]
  );

  return (
    <>
      <ColorBox>
        <ColorWrapper
          onMouseEnter={() => setHovered('child')}
          onMouseLeave={() => setHovered(null)}
        >
          <Color color="#ffb9b9" />
          <ColorText>아이 그래프</ColorText>
        </ColorWrapper>
        <ColorWrapper
          onMouseEnter={() => setHovered('avg')}
          onMouseLeave={() => setHovered(null)}
        >
          <Color color="#90ee90" />
          <ColorText>평균 그래프</ColorText>
        </ColorWrapper>
      </ColorBox>

      <ResponsiveContainer width={300} height={300}>
        <RadarChart
          outerRadius={outerRadius}
          data={combinedData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <PolarGrid
            gridType="polygon"
            radialLines={false}
            polarRadius={polarRadius}
          />
          <PolarAngleAxis
            dataKey="name"
            axisLine={{ stroke: 'black', strokeWidth: 0.5 }}
            tick={(props: CustomTickProps) =>
              renderCustomAngleAxis({
                ...props,
                radius: outerRadius,
                index: props.index
              })
            }
          />
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Average"
            dataKey="average"
            stroke="#90ee90"
            fill="#90ee90"
            fillOpacity={hovered === 'avg' ? 0.5 : hovered === 'child' ? 0.1 : 0.3}
            strokeWidth={hovered === 'avg' ? 4 : hovered === 'child' ? 0.1 : 3}
          />
          <Radar
            name="Performance"
            dataKey="performance"
            stroke={color}
            fill={color}
            fillOpacity={hovered === 'child' ? 0.5 : hovered === 'avg' ? 0.1 : 0.3}
            strokeWidth={hovered === 'child' ? 4 : hovered === 'avg' ? 0.1 : 3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </>
  );
}

// ===== Card Component =====
const PerformanceCardComponent = memo(function PerformanceCardComponent({ data }: { data: PerformanceData }) {
  return (
    <ColorSection backgroundColor={data.color}>
      <Headers>
        <h3>{data.title}</h3>
        <p>더보기 →</p>
      </Headers>
      <Bodys>
        <PerformanceBox>
          <ShapeContainer style={{ width: '320px', height: '320px' }}>
            <PerformanceRadarChart data={data.data} avgData={data.avgData} color="#ff5555" />
          </ShapeContainer>
        </PerformanceBox>
      </Bodys>
      <Footer>
        <p>측정하러 가기 →</p>
      </Footer>
    </ColorSection>
  );
});

// ===== Main Component =====
export default function AbilityGraph() {
  return (
    <RightSection>
      {performanceData.map((item, index) => (
        <PerformanceCardComponent key={index} data={item} />
      ))}
    </RightSection>
  );
}
