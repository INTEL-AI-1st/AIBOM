import { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { useMainContext } from "@context/MainContext";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { RightSection, ColorSection, Headers, Bodys, PerformanceBox, ShapeContainer, ColorBox, ColorWrapper, Color, ColorText, Footer, LockWrapper, LinkP, TitleWrapper, InfoIconWrapper, Tooltip } from '@styles/main/AbilityGraphStyles';
import { selectGraph } from '@services/main/AbilityService';
import { AiFillLock, AiOutlineInfoCircle } from 'react-icons/ai';

// ===== TYPES =====
interface ChartData {
  name: string;
  value: number;
}

interface PerformanceData {
  id: string;
  title: string;
  color: string;
  explan?: string;
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

interface AbilityGraphResponseItem {
  ablId: string;
  ablName: string;
  ablLab: string;
  score: string;
  avgScore: string;
  explan?: string;
}

// ===== PerformanceRadarChart Component =====
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
          <PolarGrid gridType="polygon" radialLines={false} polarRadius={polarRadius} />
          <PolarAngleAxis
            dataKey="name"
            axisLine={{ stroke: 'black', strokeWidth: 0.5 }}
            tick={(props: CustomTickProps) =>
              renderCustomAngleAxis({
                payload: props.payload,
                cx: props.cx,
                cy: props.cy,
                radius: outerRadius,
                index: props.index
              })
            }
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
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

// ===== PerformanceCardComponent =====
const PerformanceCardComponent = memo(function PerformanceCardComponent({ data }: { data: PerformanceData }) {
  const showOverlay = data.data.every(item => isNaN(item.value));

  return (
    <ColorSection backgroundColor={data.color}>
      <Headers>
        <TitleWrapper>
          <h3>{data.title}</h3>
          {data.explan && (
            <InfoIconWrapper>
              <AiOutlineInfoCircle size={20} color="#666" />
              <Tooltip>{data.explan}</Tooltip>
            </InfoIconWrapper>
          )}
        </TitleWrapper>
        <LinkP to={'/'}>더보기 →</LinkP>
      </Headers>
      <Bodys>
        <PerformanceBox>
          <ShapeContainer style={{ width: '320px', height: '320px', position: 'relative' }}>
            {showOverlay && (
              <LockWrapper>
                <AiFillLock size={50} color='#ddd' />
              </LockWrapper>
            )}
            <PerformanceRadarChart data={data.data} avgData={data.avgData} color="#ff5555" />
          </ShapeContainer>
        </PerformanceBox>
      </Bodys>
      <Footer>
        {data.id === 'A003' ? null : (
          <LinkP to={data.id === 'A002' ? '/obser' : data.id === 'A001' ? '/' : '#'}>
            측정하러 가기 →
          </LinkP>
        )}
      </Footer>
    </ColorSection>
  );
});

// ===== Main Component =====
export default function AbilityGraph() {
  const { selectedChild } = useMainContext();
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const fetchData = useCallback(async () => {
    const chartColors = ['#c1e3ff', '#ffdada', '#ffd6a5'];
    if (!selectedChild?.uid) return;
    setLoading(true);
    try {
      const response = await selectGraph(selectedChild.uid);
      console.log(response);
      
      const info = response.info;
      let data: AbilityGraphResponseItem[] = [];
      if (Array.isArray(info)) {
        data = info;
      } else {
        console.error('Unexpected data format for response.info:', info);
      }
      
      const grouped = data.reduce((acc: { [key: string]: PerformanceData }, curr: AbilityGraphResponseItem) => {
        const groupKey = curr.ablName;
        if (!acc[groupKey]) {
          acc[groupKey] = {
            id: `${curr.ablId}`,
            title: `${curr.ablName} 그래프`,
            color: '',
            explan: curr.explan || '', // explan 데이터 할당
            data: [],
            avgData: []
          };
        }
        acc[groupKey].data.push({ name: curr.ablLab, value: parseFloat(curr.score) });
        acc[groupKey].avgData.push({ name: curr.ablLab, value: parseFloat(curr.avgScore) });
        return acc;
      }, {} as { [key: string]: PerformanceData });

      const groupedArray = Object.values(grouped).map((item, index) => ({
        ...item,
        color: chartColors[index % chartColors.length]
      }));
      setPerformanceData(groupedArray);
    } catch (error) {
      console.error('Error fetching ability data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedChild?.uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <RightSection>
      {loading && <p>Loading...</p>}
      {!loading && performanceData.length === 0 && <p>데이터가 없습니다.</p>}
      {performanceData.map((item, index) => (
        <PerformanceCardComponent key={index} data={item} />
      ))}
    </RightSection>
  );
}
