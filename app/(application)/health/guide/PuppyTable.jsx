export default function PuppyTable() {
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
    borderTop: '2px solid #ffc695',
  };
  const theadThStyle = {
    backgroundColor: '#ffe9d7',
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
          <td style={cellStyle}>
            1차접종(종합백신+코로나 장염)<br />
            2차접종(종합백신+코로나 장염)<br />
            3차접종(종합백신+켄넬코프)<br />
            4차접종(종합백신+켄넬코프)<br />
            5차접종(종합백신+인플루엔자)<br />
            6차접종(광견병+인플루엔자)<br />
            항체가검사
          </td>
          <td style={cellStyle}>
            생후 6~8주<br />
            생후 8~10주<br />
            생후 10~12주<br />
            생후 12~14주<br />
            생후 14~16주<br />
            생후 16~18주<br />
            생후 18주
          </td>
          <td style={cellStyle}></td>
        </tr>

        <tr>
          <th style={thStyle}>구충 및 예방</th>
          <td style={cellStyle}>
            심장사상충 예방<br />
            외부기생충 예방
          </td>
          <td style={cellStyle}>
            생후 8주, 이후 1회/월<br />
            생후 8주, 이후 제품안내에 따라
          </td>
          <td style={cellStyle}></td>
        </tr>

        <tr>
          <th style={thStyle}>중성화수술</th>
          <td style={cellStyle}>수컷<br />암컷</td>
          <td style={cellStyle}>6개월령<br />5~6개월령</td>
          <td style={cellStyle}></td>
        </tr>

        <tr>
          <th style={thStyle}>신체 검사</th>
          <td style={cellStyle}>선천적 외형 이상 평가<br />체온/심박수/체중/청진</td>
          <td style={cellStyle}>예방접종 위해 내원 시</td>
          <td style={cellStyle}>잠복고환</td>
        </tr>

        <tr>
          <th style={thStyle}>혈액학</th>
          <td style={cellStyle}>전혈구<br />혈청화학 기본항목</td>
          <td style={cellStyle}>중성화 수술 시</td>
          <td style={cellStyle}></td>
        </tr>

        <tr>
          <th style={thStyle}>심장/호흡기</th>
          <td style={cellStyle}>흉부 방사선<br />심장 초음파</td>
          <td style={cellStyle}>6개월령 또는 중성화 수술시</td>
          <td style={cellStyle}>동맥관 개존증</td>
        </tr>

        <tr>
          <th style={thStyle}>복부장기</th>
          <td style={cellStyle}>복부 방사선<br />초음파</td>
          <td style={cellStyle}>6개월령 또는 중성화 수술시</td>
          <td style={cellStyle}>간문맥전신단락증</td>
        </tr>

        <tr>
          <th style={thStyle}>정형외과</th>
          <td style={cellStyle}>관절/다리 신체검사, 골관절 방사선</td>
          <td style={cellStyle}>6개월령 또는 중성화 수술시</td>
          <td style={cellStyle}>슬개골 탈구</td>
        </tr>

        <tr>
          <th style={thStyle}>치과</th>
          <td style={cellStyle}>부정교합 확인<br />잔존유치 확인</td>
          <td style={cellStyle}>예방접종 위해 내원 시<br />6개월령</td>
          <td style={cellStyle}></td>
        </tr>

        <tr>
          <th style={thStyle}>안과</th>
          <td style={cellStyle}>안구기형 및 백내장 검사</td>
          <td style={cellStyle}>6개월령</td>
          <td style={cellStyle}>백내장, 안검내번, 누점 및 관 폐쇄</td>
        </tr>
      </tbody>
    </table>
  );
}