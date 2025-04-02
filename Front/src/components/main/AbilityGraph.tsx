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

interface CombinedChartData {
  name: string;
  performance: number;
  average: number;
}

interface PerformanceData {
  id: string;
  title: string;
  color: string;
  explan?: string;
  data: ChartData[];
  avgData: ChartData[];
  status: string;
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
  status: string;
}

// ===== ColorLegend Component =====
const ColorLegend = memo(({ onHoverChild, onHoverAvg, onHoverEnd }: { 
  onHoverChild: () => void; 
  onHoverAvg: () => void; 
  onHoverEnd: () => void; 
}) => (
  <ColorBox>
    <ColorWrapper onMouseEnter={onHoverChild} onMouseLeave={onHoverEnd}>
      <Color color="#ffb9b9" />
      <ColorText>아이 그래프</ColorText>
    </ColorWrapper>
    <ColorWrapper onMouseEnter={onHoverAvg} onMouseLeave={onHoverEnd}>
      <Color color="#90ee90" />
      <ColorText>평균 그래프</ColorText>
    </ColorWrapper>
  </ColorBox>
));

// ===== CustomAngleAxis Component =====
const CustomAngleAxis = memo(({
  payload, 
  cx, 
  cy, 
  radius, 
  index, 
  data, 
  hovered
}: CustomTickProps & { data: CombinedChartData[]; hovered: 'child' | 'avg' | null; }) => {
  const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
  const labelX = cx + (radius + 30) * Math.cos(angle);
  const labelY = cy + (radius + 30) * Math.sin(angle);
  const valueY = labelY + 20;
  const value = hovered === 'avg' ? data[index].average : data[index].performance;

  return (
    <g>
      <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="central" fontSize={15} fill="#333">
        {payload.value}
      </text>
      <text x={labelX} y={valueY} textAnchor="middle" fontSize={13} fill="#666">
        {value}
      </text>
    </g>
  );
});

// ===== PerformanceRadarChart Component =====
const PerformanceRadarChart = memo(function PerformanceRadarChart({ data, avgData, color }: PerformanceRadarChartProps) {
  const [hovered, setHovered] = useState<'child' | 'avg' | null>(null);
  const outerRadius = 80;
  const polarRadius = [0, 20, 40, 60, outerRadius];

  const combinedData = useMemo(() => 
    data.map((item, index) => ({
      name: item.name,
      performance: item.value,
      average: avgData[index]?.value ?? item.value
    })), [data, avgData]
  );

  const handleHoverChild = useCallback(() => setHovered('child'), []);
  const handleHoverAvg = useCallback(() => setHovered('avg'), []);
  const handleHoverEnd = useCallback(() => setHovered(null), []);

  const renderCustomAngleAxis = useCallback((props: CustomTickProps) => (
    <CustomAngleAxis {...props} data={combinedData} hovered={hovered} />
  ), [combinedData, hovered]);

  return (
    <>
      <ColorLegend 
        onHoverChild={handleHoverChild}
        onHoverAvg={handleHoverAvg}
        onHoverEnd={handleHoverEnd}
      />
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
});

// ===== PerformanceCard Component =====
const PerformanceCard = memo(function PerformanceCard({ data }: { data: PerformanceData }) {
  const showOverlay = useMemo(() => data.data.every(item => isNaN(item.value)), [data.data]);

  const headerLink = useMemo(() => {
    if (data.id === 'A003' || data.status === '0') return null;
    return data.id === 'A002' ? '/report' : data.id === 'A001' ? '/' : '#';
  }, [data.id, data.status]);

  const footerLink = useMemo(() => {
    if (data.id === 'A003' || data.status === '1') return null;
    return data.id === 'A002' ? '/obser' : data.id === 'A001' ? '/pose' : '#';
  }, [data.id, data.status]);

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
        {headerLink && <LinkP to={headerLink}>더보기 →</LinkP>}
      </Headers>
      <Bodys>
        <PerformanceBox>
          <ShapeContainer style={{ width: '320px', height: '320px', position: 'relative' }}>
            {showOverlay && (
              <LockWrapper>
                <AiFillLock size={50} color="#ddd" />
              </LockWrapper>
            )}
            <PerformanceRadarChart data={data.data} avgData={data.avgData} color="#ff5555" />
          </ShapeContainer>
        </PerformanceBox>
      </Bodys>
      <Footer>
        {footerLink && <LinkP to={footerLink}>측정하러 가기 →</LinkP>}
      </Footer>
    </ColorSection>
  );
});

// ===== ChartSelector Component =====
const ChartSelector = memo(({ options, value, onChange }: {
  options: { id: string; title: string }[];
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div style={{ 
    marginBottom: '20px', 
    width: '100%' 
  }}>
    <select 
      onChange={onChange}
      value={value}
      style={{
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '16px'
      }}
    >
      {options.map((option, index) => (
        <option key={`option-${option.id}-${index}`} value={index}>
          {option.title}
        </option>
      ))}
    </select>
  </div>
));

// ===== Main Component =====
export default function AbilityGraph() {
  const { selectedChild } = useMainContext();
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [selectedChartIndex, setSelectedChartIndex] = useState<number>(0);
  const chartColors = useMemo(() => ['#c1e3ff', '#ffdada', '#ffd6a5'], []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsCompact(window.innerWidth < 768);
    };
    
    checkScreenSize(); 
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  useEffect(() => {
    if (!isCompact) {
      setSelectedChartIndex(0);
    }
  }, [isCompact]);

  const processResponse = useCallback((data: AbilityGraphResponseItem[]) => {
    const grouped = data.reduce((acc: Record<string, PerformanceData>, curr) => {
      const groupKey = curr.ablName;
      if (!acc[groupKey]) {
        acc[groupKey] = {
          id: curr.ablId,
          title: `${curr.ablName} 그래프`,
          color: '',
          explan: curr.explan || '',
          data: [],
          avgData: [],
          status: curr.status || '0'
        };
      }
      acc[groupKey].data.push({ name: curr.ablLab, value: parseFloat(curr.score) });
      acc[groupKey].avgData.push({ name: curr.ablLab, value: parseFloat(curr.avgScore) });
      return acc;
    }, {} as Record<string, PerformanceData>);

    return Object.values(grouped).map((item, index) => ({
      ...item,
      color: chartColors[index % chartColors.length]
    }));
  }, [chartColors]);

  const fetchData = useCallback(async () => {
    if (!selectedChild?.uid) return;
    setLoading(true);
    try {
      const response = await selectGraph(selectedChild.uid);
      if (!response?.info) throw new Error('No data received');
      const info = Array.isArray(response.info) ? response.info : [];
      const processedData = processResponse(info);
      setPerformanceData(processedData);
    } catch (error) {
      console.error('Error fetching ability data:', error);
      setPerformanceData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedChild?.uid, processResponse]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChartIndex(Number(e.target.value));
  }, []);

  const selectorOptions = useMemo(() => 
    performanceData.map(item => ({ id: item.id, title: item.title })),
    [performanceData]
  );

  if (loading) {
    return (
      <RightSection>
        <p>Loading...</p>
      </RightSection>
    );
  }

  if (isCompact) {
    // 컴팩트 모드일 때 셀렉트박스와 선택된 하나의 차트만 표시
    return (
      <RightSection className="compact-mode">
        {performanceData.length > 0 && (
          <>
            <ChartSelector 
              options={selectorOptions} 
              value={selectedChartIndex} 
              onChange={handleSelectChange} 
            />
            <PerformanceCard key={`selected-${performanceData[selectedChartIndex].id}`} data={performanceData[selectedChartIndex]} />
          </>
        )}
      </RightSection>
    );
  }

  // 일반 모드일 때 모든 차트 표시
  return (
    <RightSection>
      {performanceData.map((item, index) => (
        <PerformanceCard key={`${item.id}-${index}`} data={item} />
      ))}
    </RightSection>
  );
}