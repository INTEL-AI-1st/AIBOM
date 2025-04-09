import { useCallback, useRef, useState } from 'react';
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

// 메인 컴포넌트
export default function DevelopmentReport() {
  const navigate = useNavigate();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('전체');

  // PDF 저장 핸들러
  const handleDownloadPdf = async () => {
    if (!pdfRef.current) return;

    // 전체 섹션이 보이도록 임시 상태 변경
    const currentSection = activeSection;
    setActiveSection('전체');
    
    // 약간의 지연 후 캡처 (DOM 업데이트 기다림)
    setTimeout(async () => {
      const canvas = await html2canvas(pdfRef.current!, { 
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth - 40; // 여백 주기
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // 이미지가 너무 길 경우 여러 페이지로 나누기
      let heightLeft = imgHeight;
      let position = 20; // 상단 여백
      
      // 첫 페이지 추가
      pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight() - 40; // 여백 고려
      
      // 추가 페이지가 필요한 경우
      while (heightLeft >= 0) {
        position = 20 - pdf.internal.pageSize.getHeight();
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 20, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight() - 40;
      }
      
      pdf.save('우리아이_통합발달_분석리포트.pdf');
      
      // 원래 섹션으로 복원
      setActiveSection(currentSection);
    }, 300);
  };

  // 섹션 표시 여부 체크 함수
  // const isSectionVisible = useCallback((sectionId: string) => {
  //   return activeSection === '전체' || activeSection === sectionId;
  // }, [activeSection]);

  return (
    <RE.Container>
      <RE.HeaderRow>
        <RE.Title>
          <FaAngleLeft
            size={24}
            onClick={() => navigate(-1)}
          />
          통합발달 분석 리포트
        </RE.Title>
        <RE.SaveButton onClick={handleDownloadPdf}>리포트 저장</RE.SaveButton>
      </RE.HeaderRow>
      
      <RE.Body ref={pdfRef}>
        <RE.ReportWrapper>
          <RE.MainTitle>우리아이 통합발달 분석 리포트</RE.MainTitle>
          
          <RE.Section>
            <Profile />
          </RE.Section>
          
          {/* <Section visible={isSectionVisible('kdst')}> */}
          <RE.Section>
            <A001 />
          </RE.Section>
          
          {/* <Section visible={isSectionVisible('kicce')}> */}
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