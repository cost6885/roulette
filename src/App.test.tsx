import React, { useState } from "react"; // useRef 제거
import { Wheel } from "react-custom-roulette";
import { Box, Button, ButtonProps, Modal, styled } from "@mui/material";
import { red } from "@mui/material/colors";
import "./App.css";

// 상품 재고 수량 (가정)
const inventory = {
  first: 2,   // 1등 상품 수량
  second: 3,  // 2등 상품 수량
  third: 5,   // 3등 상품 수량
  fourth: 10, // 4등 상품 수량
  fifth: 30,  // 5등 상품 수량
};

// 데이터 타입 정의
interface PrizeData {
  option: string;
  style: {
    backgroundColor: string;
    textColor: string;
    textShadow: string; // Optional textShadow property
  };
  probability: number;
  imageUrl: string;
}

// 데이터 배열 수정 (1~5등, 꽝으로 구성)
const data: PrizeData[] = [
  {
    option: "1등", // ms master 3s
    style: {
      backgroundColor: "#9ccefd",
      textColor: "black",
      textShadow: "2px 2px 0px white, -2px -2px 0px white, -2px 2px 0px white, 2px -2px 0px white",
    },
    probability: inventory.first > 0 ? 2 : 0,
    imageUrl: "https://blog.kakaocdn.net/dn/5Ebg7/btsGCpyUNHh/oCICWOyK9N8pKmlISc02qk/img.jpg",
  },
  {
    option: "2등", // 아트뮤 PB310 보조배터리
    style: {
      backgroundColor: "#ee024a",
      textColor: "white",
      textShadow: "2px 2px 0px white, -2px -2px 0px white, -2px 2px 0px white, 2px -2px 0px white",
    },
    probability: inventory.second > 0 ? 5 : 0,
    imageUrl: "https://img.danawa.com/prod_img/500000/818/023/img/58023818_1.jpg",
  },
  {
    option: "3등", // 로지텍 R500s 포인터
    style: {
      backgroundColor: "#b9dc88",
      textColor: "white",
      textShadow: "2px 2px 0px white, -2px -2px 0px white, -2px 2px 0px white, 2px -2px 0px white",
    },
    probability: inventory.third > 0 ? 10 : 0,
    imageUrl: "https://img.danawa.com/prod_img/500000/109/198/img/6198109_3.jpg?shrink=360:360&_v=20220926155958",
  },
  {
    option: "4등", // 필립스 LED 에디슨 데스크 램프
    style: {
      backgroundColor: "#02dccb",
      textColor: "white",
      textShadow: "2px 2px 0px white, -2px -2px 0px white, -2px 2px 0px white, 2px -2px 0px white",
    },
    probability: inventory.fourth > 0 ? 20 : 0,
    imageUrl: "https://img.danawa.com/prod_img/500000/407/365/img/19365407_1.jpg?shrink=360:360",
  },
  {
    option: "5등", // 농심 굿즈
    style: {
      backgroundColor: "#00cfff",
      textColor: "white",
      textShadow: "2px 2px 0px white, -2px -2px 0px white, -2px 2px 0px white, 2px -2px 0px white",
    },
    probability: inventory.fifth > 0 ? 30 : 0,
    imageUrl: "",
  },
  {
    option: "6등",
    style: {
      backgroundColor: "#fe8dcb",
      textColor: "white",
      textShadow: "2px 2px 0px white, -2px -2px 0px white, -2px 2px 0px white, 2px -2px 0px white",
    },
    probability: 100,
    imageUrl: "",
  },
];
  // 데이터 복사하여 룰렛을 균형있게 만듭니다.
//   {
//     option: "1등",
//     style: {
//       backgroundColor: "#9ccefd",
//       textColor: "black",
//       textShadow: "2px 2px 0px white, -2px -2px 0px white, -2px 2px 0px white, 2px -2px 0px white",
//     },
//     probability: inventory.first > 0 ? 2 : 0,
//     imageUrl: "https://cdn.funshop.co.kr//products/0000294741/vs_image800.jpg?1725245400",
//   },
//   {
//     option: "2등",
//     style: {
//       backgroundColor: "#ee024a",
//       textColor: "white",
//       textShadow: "2px 2px 0px white, -2px -2px 0px white, -2px 2px 0px white, 2px -2px 0px white",
//     },
//     probability: inventory.second > 0 ? 5 : 0,
//     imageUrl: "https://cdn.funshop.co.kr//products/0000262710/vs_image800.jpg?1725245520",
//   },
//   {
//     option: "3등",
//     style: {
//       backgroundColor: "#b9dc88",
//       textColor: "white",
//       textShadow: "2px 2px 0px white, -2px -2px 0px white, -2px 2px 0px white, 2px -2px 0px white",
//     },
//     probability: inventory.third > 0 ? 10 : 0,
//     imageUrl: "https://cdn.funshop.co.kr//products/0000204053/vs_image800.jpg?1725245580",
//   },
//   {
//     option: "4등",
//     style: {
//       backgroundColor: "#02dccb",
//       textColor: "white",
//       textShadow: "2px 2px 0px white, -2px -2px 0px white, -2px 2px 0px white, 2px -2px 0px white",
//     },
//     probability: inventory.fourth > 0 ? 20 : 0,
//     imageUrl: "https://cdn.funshop.co.kr//products/0000281263/vs_image800.jpg?1725245640",
//   },
//   {
//     option: "5등",
//     style: {
//       backgroundColor: "#00cfff",
//       textColor: "white",
//       textShadow: "2px 2px 0px white, -2px -2px 0px white, -2px 2px 0px white, 2px -2px 0px white",
//     },
//     probability: inventory.fifth > 0 ? 23 : 0,
//     imageUrl: "https://cdn.funshop.co.kr//products/0000281263/vs_image800.jpg?1725245640",
//   },
//   {
//     option: "6등",
//     style: {
//       backgroundColor: "#fe8dcb",
//       textColor: "white",
//       textShadow: "2px 2px 0px white, -2px -2px 0px white, -2px 2px 0px white, 2px -2px 0px white",
//     },
//     probability: 100,
//     imageUrl: "",
//   },
// ];


const StartButton = styled(Button)<ButtonProps>(({ theme }) => ({
  width: "200px", // 크기를 2배로 키움
  height: "200px", // 크기를 2배로 키움
  borderRadius: "50%", // 둥근 형태
  fontSize: "40px", // 폰트 크기를 40px로 설정
  color: red[500], // 글씨 색상을 빨간색으로 설정
  backgroundColor: "#fff", // 배경색을 흰색으로 설정
  position: "absolute", // 절대 위치
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)", // 중앙 정렬
  zIndex: 9999, // 충분히 높은 z-index 설정
  "&:hover": {
    backgroundColor: red[500], // 호버 시 배경색을 빨간색으로 설정
    color: "#fff", // 호버 시 글씨 색상을 흰색으로 설정
  },
}));




function App() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isResultShow, setIsResultShow] = useState<boolean>(false);
  const [showGif, setShowGif] = useState(false);
  const [result, setResult] = useState<{ date: string; result: string }>({
    date: "",
    result: "",
  });

  const sendToGoogleSheets = (prize: string) => {
    const participationTime = new Date().toLocaleString(); // 참여 시간 생성
    const data = {
      participationId: Math.floor(Math.random() * 10000), // 임의의 참여 번호 생성
      participationTime,
      prize,
      firstStock: inventory.first,
      secondStock: inventory.second,
      thirdStock: inventory.third,
      fourthStock: inventory.fourth,
      fifthStock: inventory.fifth,
    };
  
    fetch('https://script.google.com/macros/s/AKfycbyKleMGBvgZlHHVgaITLqbZRqqDlVfTfE2t5Dian7IC9VSBQv7xX04Naqg7-G7Jf3ZfWw/exec', {
      method: 'POST',
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(data),
      mode: 'cors'
    })
    .then(response => {
      if (response.ok) {
        console.log('Google Sheets 전송 성공:', response);        
      } else {
        console.error('Google Sheets 전송 에러:', response);
        alert('이벤트 응모 중 오류가 발생했습니다.');
      }
    })
    .catch((error) => {
      console.error('Google Sheets 전송 에러:', error);
      alert('이벤트 응모 중 오류가 발생했습니다.');
    });
  };

  const handleSpinClick = () => {
    if (mustSpin) return;
    startRoulette();
  };

  const startRoulette = () => {
    const probabilities = data.map((item) => item.probability);
    const totalProbability = probabilities.reduce((acc, curr) => acc + curr, 0);
    const random = Math.random() * totalProbability;

    let cumulativeProbability = 0;
    let selectedIndex = 0;

    for (let i = 0; i < probabilities.length; i++) {
      cumulativeProbability += probabilities[i];
      if (random < cumulativeProbability) {
        selectedIndex = i;
        break;
      }
    }

    setPrizeNumber(selectedIndex);
    setMustSpin(true);
  };

  const saveResult = () => {
    const prize = data[prizeNumber]?.option || "Unknown"; // 당첨 결과
    const resultData = {
      ...result,
      date: new Date().toISOString(),
      result: prize,
    };
  
    setResult(resultData);
    updateInventory(prize); // 재고 감소 로직 호출
    sendToGoogleSheets(prize); // Google Sheets로 데이터 전송
  
    if (prize === "1등") {
      setShowGif(true);
      setTimeout(() => {
        setShowGif(false);
        setIsResultShow(true);
      }, 1000); // 1초간 GIF 표시 후 숨김
    } else {
      setIsResultShow(true);
    }
  };
  
  const updateInventory = (prize: string) => {
    switch (prize) {
      case "1등":
        if (inventory.first > 0) inventory.first--;
        break;
      case "2등":
        if (inventory.second > 0) inventory.second--;
        break;
      case "3등":
        if (inventory.third > 0) inventory.third--;
        break;
      case "4등":
        if (inventory.fourth > 0) inventory.fourth--;
        break;
      case "5등":
        if (inventory.fifth > 0) inventory.fifth--;
        break;
      default:
        break;
    }
  };




  const getResultMessage = () => {
    switch (data[prizeNumber].option) {
      case "1등":
        return "🏆1등 당첨🎉";
      case "2등":
        return "🥇2등 당첨🎁";
      case "3등":
        return "🥈3등 당첨👏";
      case "4등":
        return "🥉4등 당첨😉";
      case "5등":
        return "🎖5등 당첨🙂";
      case "6등":
        return "6등 당첨😅";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="roulette-layout">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>        
      <Wheel
        mustStartSpinning={mustSpin}
        data={data.map((item) => ({
          option: item.option,
          style: item.style,
        }))}
        prizeNumber={prizeNumber}
        outerBorderWidth={1}
        innerBorderWidth={1}
        radiusLineWidth={1}
        innerRadius={1} // 기본 설정으로 복원
        fontSize={20} // 기본 폰트 크기
        onStopSpinning={() => {
          setMustSpin(false);
          saveResult();
        }}
        spinDuration={0.2}
        backgroundColors={data.map((item) => item.style.backgroundColor)}
        textColors={data.map((item) => item.style.textColor)}
      />


          <StartButton variant="outlined" size="large" onClick={handleSpinClick}>
            Start
          </StartButton>
        </div>

        <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: "40%" }}>
          <img src="/asset/banner2.gif" alt="Slot Machine GIF" style={{ width: "100%", height: "auto" }} />
        </div>

        
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "20px",
            transform: "translateY(-50%)",
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // 그림자 추가
            width: "200px",
          }}
        >
          <h2 style={{ textAlign: "center" }}>상품 재고 수량</h2>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>등수</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>재고</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>1등</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{inventory.first}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>2등</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{inventory.second}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>3등</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{inventory.third}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>4등</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{inventory.fourth}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black', padding: '8px' }}>5등</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{inventory.fifth}</td>
              </tr>
            </tbody>
          </table>
        </div>



      {showGif && (
        <Modal
          open={true}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999, // 모달을 가장 앞에 배치
          }}
        >
          <img
            src="https://i.namu.wiki/i/aEaRClFwgm0hl2PFb7-j20_WC99GnPFUkg6njz_IckIXXx_UZDELGldWijSZw-IqYOFXeUJNF41HESd380w0Og.gif"
            alt="1등 당첨 축하 GIF"
            style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
          />
        </Modal>
      )}
      
      <Modal
        open={isResultShow}
        onClose={() => setIsResultShow(false)}
        style={{ cursor: "pointer", zIndex: 99999 }} // 모달을 가장 앞에 배치
        onClick={() => setIsResultShow(false)}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            width: "640px",
            height: "360px",
            maxWidth: "100vw",
            maxHeight: "100vh",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            overflowY: "auto",
          }}
        >
          {data[prizeNumber].imageUrl && (
            <img
              src={data[prizeNumber].imageUrl}
              alt={data[prizeNumber].option}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0.5,
                objectFit: "cover",
              }}
            />
          )}
          <span
            style={{
              fontSize: "60px",
              color: "black",
              zIndex: 2,
            }}
          >
            {getResultMessage()}
          </span>
        </Box>
      </Modal>
      </div>
    </>
  );
}

export default App;
