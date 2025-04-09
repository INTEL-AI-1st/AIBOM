import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaAngleLeft } from "react-icons/fa";
import Profile from '@components/report/Profile';
import A001 from '@components/report/A001';
import A002 from '@components/report/A002';
import Recommendation from '@components/report/Recommendation';
import Support from '@components/report/Support';
import * as RE from '@styles/report/ReportStyles';
import { useA001Data, useProfileData, useGptSummary, useA002Data } from '@hooks/report/UseReport';

export default function Report() {
  const navigate = useNavigate();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('전체');


  // 여기서 한 번씩만 호출
  const { data: profileData, loading: profileLoading, error: profileError } = useProfileData();
  const { data: a001Data, loading: a001Loading, error: a001Error } = useA001Data();
  const { data: a002Data, loading: a002Loading, error: a002Error } = useA002Data();

  // GPT 요약 훅: 이미 받아온 profileData, a001Data, a002Data를 인자로 전달
  const { summary, a001Summary, loading: gptLoading, error: gptError } =
    useGptSummary(profileData, a001Data, a002Data);

  // 로딩/에러 처리
  if (profileLoading || a001Loading || a002Loading || gptLoading) {
    return <div>데이터 로딩 중입니다...</div>;
  }

  if (profileError || a001Error || a002Error || gptError) {
    return <div>오류가 발생했습니다...</div>;
  }

  if (!profileData || !a001Data) {
    return <div>데이터가 없습니다...</div>;
  }

  const handleDownloadPdf = async () => {
    if (!pdfRef.current) return;

    const currentSection = activeSection;
    setActiveSection('전체');

    setTimeout(async () => {
      const canvas = await html2canvas(pdfRef.current!, { 
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 20;
      pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight() - 40;
      
      while (heightLeft >= 0) {
        position = 20 - pdf.internal.pageSize.getHeight();
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight() - 40;
      }
      
      pdf.save('우리아이_통합발달_분석리포트.pdf');
      setActiveSection(currentSection);
    }, 300);
  };

  return (
    <RE.Container>
      <RE.HeaderRow>
        <RE.Title>
          <FaAngleLeft size={24} onClick={() => navigate(-1)} />
          통합발달 분석 리포트
        </RE.Title>
        <RE.SaveButton onClick={handleDownloadPdf}>리포트 저장</RE.SaveButton>
      </RE.HeaderRow>
      
      <RE.Body ref={pdfRef}>
        <RE.ReportWrapper>
          <RE.MainTitle>우리아이 통합발달 분석 리포트</RE.MainTitle>
          
          <RE.Section>
            <Profile 
              data={profileData} 
              summary={summary}
            />
          </RE.Section>
          
          <RE.Section>
            <A001 
              data={a001Data} 
              a001Summary={a001Summary} 
            />
          </RE.Section>
          
          <RE.Section>
            <A002 />
          </RE.Section>
          
          <RE.Section>
            <Recommendation />
          </RE.Section>
          
          <RE.Section>
            <Support />
          </RE.Section>
        </RE.ReportWrapper>
      </RE.Body>
    </RE.Container>
  );
}
