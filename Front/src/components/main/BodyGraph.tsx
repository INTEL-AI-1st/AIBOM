import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import styled from "styled-components";

const ChartSection = styled.div`
  background-color: #fffbe5;
  width: 100%;
`;

const ChartContent = styled.div`
  padding: 10px;
  background-color: #fffbe5;
`;

const ViewMoreButton = styled.button`
  background: transparent;
  border: none;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

// Chart Components
const ChartContainer = styled.div`
  height: 120px;
  background-color: #f0f0f0;
  border-radius: 0;
  padding: 10px;
`;

const ChartTitle = styled.div`
  color: #888;
  margin-bottom: 10px;
  font-size: 14px;
`;

// 데이터에 역량과 행동 두 값을 추가합니다.
const data = [
    { name: '1월',  "역량 발달": 10, "유아 관찰": 10, "행동 발달": 12 },
    { name: '2월',  "역량 발달": 15, "유아 관찰": 15, "행동 발달": 18 },
    { name: '3월',  "역량 발달": 20, "유아 관찰": 25, "행동 발달": 22 },
    { name: '4월',  "역량 발달": 30, "유아 관찰": 35, "행동 발달": 28 },
    { name: '5월',  "역량 발달": 40, "유아 관찰": 45, "행동 발달": 35 },
    { name: '6월',  "역량 발달": 45, "유아 관찰": 45, "행동 발달": 40 },
    { name: '7월',  "역량 발달": 50, "유아 관찰": 55, "행동 발달": 45 },
    { name: '8월',  "역량 발달": 55, "유아 관찰": 55, "행동 발달": 50 },
    { name: '9월',  "역량 발달": 60, "유아 관찰": 65, "행동 발달": 55 },
    { name: '10월', "역량 발달": 65, "유아 관찰": 70, "행동 발달": 60 },
    { name: '11월', "역량 발달": 70, "유아 관찰": 75, "행동 발달": 65 },
    { name: '12월', "역량 발달": 75, "유아 관찰": 80, "행동 발달": 70 },
];

export default function BodyGraph(){
    return (
        <ChartSection>
            <ViewMoreButton>
            </ViewMoreButton>
            <ChartContent>
              <ChartTitle>1년 그래프</ChartTitle>
              <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                          <XAxis dataKey="name" tick={false} />
                          <YAxis hide />
                          <Tooltip />
                          <Bar dataKey="행동 발달" fill="#b9edff" radius={[2, 2, 0, 0]} />
                          <Bar dataKey="유아 관찰" fill="#ffd6a5" radius={[2, 2, 0, 0]} />
                          <Bar dataKey="역량 발달" fill="#ff8a8a" radius={[2, 2, 0, 0]} />
                      </BarChart>
                  </ResponsiveContainer>
              </ChartContainer>
            </ChartContent>
        </ChartSection>
    );
}
