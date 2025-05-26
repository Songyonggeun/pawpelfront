export default function SeniorTable() {
  const cellStyle = {
    borderTop: '1px solid #cfcfcf',
    borderLeft: '1px solid #cfcfcf',
    padding: '12px 12px',
    fontSize: '14px',
    verticalAlign: 'middle',
    wordBreak: 'keep-all',
  };
  const thStyle = {
    fontWeight: 700,
    borderTop: '1px solid #cfcfcf',
    verticalAlign: 'middle',
    padding: '12px 12px',
    textAlign: 'center',
  };
  const theadStyle = {
    borderTop: '2px solid #cea7dd',
  };
  const theadThStyle = {
    backgroundColor: '#f3e6f8',
    padding: '21px 5px',
    fontWeight: 600,
    fontSize: '18px',
    textAlign: 'center',
  };

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', borderSpacing: '0' }}>
      <thead style={theadStyle}>
        <tr>
          <th style={theadThStyle}>구분</th>
          <th style={theadThStyle}>항목</th>
          <th style={theadThStyle}>검사 연령 및 주기</th>
          <th style={theadThStyle}>다빈도 · 고위험 질환</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th style={thStyle}>예방접종</th>
          <td style={cellStyle}>종합백신, 코로나 장염, 켄넬코프, 인플루엔자, 광견병</td>
          <td style={cellStyle}>1회/년</td>
          <td style={cellStyle}></td>
        </tr>

        <tr>
          <th style={thStyle}>구충 및 예방</th>
          <td style={cellStyle}>심장사상충/진드기/분변 검사<br />심장사상충 예방<br />외부기생충 예방</td>
          <td style={cellStyle}>1회/년<br />1회/월 또는 1회/년<br />1회/월 (제품에 따라 상이)</td>
          <td style={cellStyle}></td>
        </tr>

        <tr>
          <th style={thStyle}>신체 검사</th>
          <td style={cellStyle}>체온/심박수/체중/청진<br />림프절 검사</td>
          <td style={cellStyle}>1회/년 (필요 시 2회/년)</td>
          <td style={cellStyle}>유선종양</td>
        </tr>

        <tr>
          <th style={thStyle}>피부</th>
          <td style={cellStyle}>검이경, 피부/모피 검사</td>
          <td style={cellStyle}>1회/년 (필요 시 2회/년)</td>
          <td style={cellStyle}></td>
        </tr>

        <tr>
          <th style={thStyle}>혈액학</th>
          <td style={cellStyle}>전혈구, 혈청화학, 전해질<br />SDMA, 호르몬, 담즙산</td>
          <td style={cellStyle}>1회/년 (필요 시 2회/년)</td>
          <td style={cellStyle}></td>
        </tr>

        <tr>
          <th style={thStyle}>심장/호흡기</th>
          <td style={cellStyle}>흉부 방사선, 심장 초음파</td>
          <td style={cellStyle}>1회/년 (필요 시 2회/년)</td>
          <td style={cellStyle}>이첨판 질환</td>
        </tr>

        <tr>
          <th style={thStyle}>복부장기</th>
          <td style={cellStyle}>복부 방사선, 초음파</td>
          <td style={cellStyle}>1회/년 (필요 시 2회/년)</td>
          <td style={cellStyle}></td>
        </tr>

        <tr>
          <th style={thStyle}>비뇨기</th>
          <td style={cellStyle}>뇨스틱, 침사, 비중, 도말 검사</td>
          <td style={cellStyle}>1회/년 (필요 시 2회/년)</td>
          <td style={cellStyle}>요로결석</td>
        </tr>

        <tr>
          <th style={thStyle}>정형외과</th>
          <td style={cellStyle}>관절/다리 신체검사, 골관절 방사선</td>
          <td style={cellStyle}>1회/년 (필요 시 2회/년)</td>
          <td style={cellStyle}>슬개골 탈구</td>
        </tr>

        <tr>
          <th style={thStyle}>치과</th>
          <td style={cellStyle}>구강/치아 검사, 스케일링, 치과방사선</td>
          <td style={cellStyle}>1회/년 (필요 시 2회/년)</td>
          <td style={cellStyle}></td>
        </tr>

        <tr>
          <th style={thStyle}>안과</th>
          <td style={cellStyle}>눈물량/안압, 백내장, 형광염색, 안저 검사</td>
          <td style={cellStyle}>1회/년 (필요 시 2회/년)</td>
          <td style={cellStyle}>건성각결막염, 백내장</td>
        </tr>

        <tr>
          <th style={thStyle}>신경계</th>
          <td style={cellStyle}>인지기능장애 평가</td>
          <td style={cellStyle}>1회/년 (필요 시 2회/년)</td>
          <td style={cellStyle}></td>
        </tr>
      </tbody>
    </table>
  );
}