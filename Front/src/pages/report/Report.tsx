import { useRef, useState, useEffect } from 'react';
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
import { PuffLoader } from "react-spinners";

export default function Report() {
  const navigate = useNavigate();
  const pdfRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>('all');
  const [reportId, setReportId] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem('reportId');
    if (!storedId) {
      alert('비정상적인 접근입니다');
      navigate(-1);
      return;
    }
    setReportId(storedId);
  }, [navigate]);

  const showA001 = !reportId || reportId === 'all' || reportId === 'A001';
  const showA002 = !reportId || reportId === 'all' || reportId === 'A002';
  
  const { 
    data: profileData, 
    loading: profileLoading, 
    error: profileError 
  } = useProfileData();

  const { 
    data: a001Data, 
    loading: a001Loading, 
    error: a001Error 
  } = useA001Data();

  const { 
    data: a002Data, 
    loading: a002Loading, 
    error: a002Error 
  } = useA002Data();
  
  const {
    summary,
    a001Summary,
    a002Summary,
    reviewSummary,
    tipsSummary,
    loading: gptLoading,
    error: gptError,
  } = useGptSummary(
    reportId!,
    profileData, 
    showA001 ? a001Data : undefined, 
    showA002 ? a002Data : undefined
  );

  const isLoading = profileLoading || 
    (showA001 && a001Loading) || 
    (showA002 && a002Loading) || 
    gptLoading;

  const hasError = profileError || 
    (showA001 && a001Error) || 
    (showA002 && a002Error) || 
    gptError;

  const isMissingData = !profileData || 
    (showA001 && !a001Data) || 
    (showA002 && !a002Data);

  if (isLoading) {
    return (
      <RE.Loading>
        <PuffLoader color='#ffb9b9' /><br />
        <p>리포트를 생성중입니다...</p>
      </RE.Loading>
    );
  }

  if (hasError) {
    return <div>오류가 발생했습니다...</div>;
  }

  if (isMissingData) {
    return <div>데이터가 없습니다...</div>;
  }

  const handleDownloadPdf = async () => {
    if (!pdfRef.current) return;

    const currentSection = activeSection;
    setActiveSection('all');

    setTimeout(async () => {
      try {
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
      } catch (error) {
        console.error('PDF 생성 중 오류 발생:', error);
        alert('PDF 생성 중 오류가 발생했습니다.');
      }
      
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
          
          {showA001 && a001Data && (
            <RE.Section>
              <A001 
                data={a001Data} 
                a001Summary={a001Summary} 
              />
            </RE.Section>
          )}
          
          {showA002 && a002Data && (
            <RE.Section>
              <A002 
                data={a002Data} 
                a002Summary={a002Summary} 
              />
            </RE.Section>
          )}
          
          <RE.Section>
            <Recommendation 
              summary={reviewSummary}
            />
          </RE.Section>
          
          <RE.Section>
            <Support 
              summary={tipsSummary}
            />
          </RE.Section>
        </RE.ReportWrapper>
      </RE.Body>
    </RE.Container>
  );
}