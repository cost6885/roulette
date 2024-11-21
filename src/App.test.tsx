import React, { useState, useEffect, useRef } from 'react';
import { Wheel } from 'react-custom-roulette';
import {
  Box,
  Button,
  ButtonProps,
  Modal,
  Snackbar,
  Alert,
  styled,
  Popover,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { red, grey, yellow, orange, blue } from '@mui/material/colors';
import { QrReader } from 'react-qr-reader';
import './App.css';
import RouletteBorder from './border/roulette-border';
import prize1 from './products/prize1.png';
import prize2 from './products/prize2.png';
import prize3 from './products/prize3.png';
import prize4 from './products/prize4.png';
import prize5 from './products/prize5.png';
import prize6 from './products/prize6.png';

// 데이터 타입 정의
interface PrizeData {
  option: string;
  style: {
    backgroundColor: string;
    textColor: string;
  };
  probability: number;
  // imageUrl: string;
  image: {
    uri: string;
    offsetX?: number;
    offsetY?: number;
    sizeMultiplier?: number;
    landscape?: boolean;
  };
}

type ProductList = {
  [key: string]: { name: string; quantity: number; img: string };
};

const rouletteRed = '#CD2B33';
const rouletteWhite = '#ffffff';

const productList: ProductList = {
  prize_1: { name: '로지텍 MX Master 3s 마우스', quantity: 2, img: prize1 },
  prize_2: { name: '아트뮤 PB310 보조배터리', quantity: 3, img: prize2 },
  prize_3: { name: '로지텍 R500s 포인터', quantity: 5, img: prize3 },
  prize_4: { name: '필릭스 LED 에디슨 데스크 램프', quantity: 10, img: prize4 },
  prize_5: { name: '농심 굿즈', quantity: 30, img: prize5 },
  prize_6: { name: '농심 제품 + DT FAIR 다회용백', quantity: 150, img: prize6 },
};



// 확률 변수 정의
const probability1 = 3; // 1등 확률
const probability2 = 7; // 2등 확률
const probability3 = 15; // 3등 확률
const probability4 = 25; // 4등 확률
const probability5 = 35; // 5등 확률
const probability6 = 150; // 6등 확률 (꽝)

// 데이터 배열
const data: PrizeData[] = [
  {
    option: productList.prize_1.name,
    style: { backgroundColor: rouletteRed, textColor: '#FFFFFF' },
    probability: productList.prize_1.quantity > 0 ? probability1 : 0, // 재고 수량에 따른 확률 설정
    image: {
      uri: productList.prize_1.img,
    },
  },
  {
    option: productList.prize_2.name,
    style: { backgroundColor: rouletteWhite, textColor: '#868686' },
    probability: productList.prize_2.quantity > 0 ? probability2 : 0, // 재고 수량에 따른 확률 설정
    image: { uri: productList.prize_2.img },
  },
  {
    option: productList.prize_3.name,
    style: { backgroundColor: rouletteRed, textColor: '#FFFFFF' },
    probability: productList.prize_3.quantity > 0 ? probability3 : 0, // 재고 수량에 따른 확률 설정
    image: { uri: productList.prize_3.img },
  },
  {
    option: productList.prize_4.name,
    style: { backgroundColor: rouletteWhite, textColor: '#868686' },
    probability: productList.prize_4.quantity > 0 ? probability4 : 0, // 재고 수량에 따른 확률 설정
    image: { uri: productList.prize_4.img },
  },
  {
    option: productList.prize_5.name,
    style: { backgroundColor: rouletteRed, textColor: '#ffffff' },
    probability: productList.prize_5.quantity > 0 ? probability5 : 0, // 재고 수량에 따른 확률 설정
    image: { uri: productList.prize_5.img },
  },
  {
    option: productList.prize_6.name,
    style: { backgroundColor: rouletteWhite, textColor: '#868686' },
    probability: probability6, // 꽝은 항상 확률 유지
    image: { uri: productList.prize_6.img },
  },
];

const StartButton = styled(Button)<ButtonProps>(({ theme }) => ({
  border: 'none',
  width: '12rem',
  height: '12rem',
  borderRadius: '50%',
  fontSize: '2rem',
  zIndex: '1000',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
  color: '#333',
  backgroundColor: '#ffffff',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#020b3e',
    color: '#ffffff',
    border: 'none',
  },
}));

function App() {
  const [mustSpin, setMustSpin] = useState(false); // 룰렛 회전

  const [isResultShow, setIsResultShow] = useState<boolean>(false);

  const [hasSpun, setHasSpun] = useState(false); // 스핀 여부를 추적
  
  const [updatedProducts, setUpdatedProducts] = useState<ProductList | null>(null);

  const [showGif, setShowGif] = useState(false);

  const [products, setProducts] = useState(productList);
  const [prize, setPrize] = useState<any>(null);
  const [prizeNumber, setPrizeNumber] = useState<number>(-1);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const currentAudio = useRef<HTMLAudioElement | null>(null); // 현재 재생 중인 오디오 트래킹

  const playAudio = (filePath: string, onEndedCallback?: () => void, interruptible: boolean = true) => {
    try {
      const audio = new Audio(filePath);
      currentAudio.current = audio; // 현재 재생 중인 오디오 업데이트
      if (onEndedCallback) {
        audio.onended = onEndedCallback;
      }
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    } catch (error) {
      console.log('Audio file not found or could not be played:', filePath);
    }
  };
  
  const playAudioWithDuration = (
    filePath: string,
    duration: number,
    onEndedCallback?: () => void,
    interruptible: boolean = true
  ) => {
    // 특정 파일(예: 룰렛 소리)은 중단되지 않도록 처리

    try {
      const audio = new Audio(filePath);
      currentAudio.current = audio; // 현재 재생 중인 오디오 업데이트

      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
      });

      // 주어진 duration (밀리초) 후에 오디오 중단 및 콜백 실행
      setTimeout(() => {
        if (onEndedCallback) {
          onEndedCallback();
        }
      }, duration);
    } catch (error) {
      console.log('Audio file not found or could not be played:', filePath);
    }
  };

  
  const sendToGoogleSheets = () => {
    const participationTime = new Date().toLocaleString(); // 참여 시간 생성
    const payload = {
      participationId: Math.floor(Math.random() * 10000).toString(),
      participationTime: participationTime,
      prize: data[prizeNumber].option,
      firstStock: products.prize_1.quantity.toString(),
      secondStock: products.prize_2.quantity.toString(),
      thirdStock: products.prize_3.quantity.toString(),
      fourthStock: products.prize_4.quantity.toString(),
      fifthStock: products.prize_5.quantity.toString(),
      sixthStock: products.prize_6.quantity.toString(),
    };
  
    console.log("전송할 데이터:", payload);
  
    fetch("https://script.google.com/macros/s/AKfycbza216O1LGIDWyOxz3x7LBC5ZhhooC0Z6Q0Ddi0npvWhLF87SCgGtLn4fzO83W7iNR-/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: new URLSearchParams(payload).toString(),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Google Sheets 전송 성공:", response);
        } else {
          console.error("Google Sheets 전송 에러:", response);
          // alert("이벤트 응모 중 오류가 발생했습니다.");
        }
      })
      .catch((error) => {
        console.error("Google Sheets 전송 에러:", error);
        // alert("이벤트 응모 중 오류가 발생했습니다.");
      });
  };




  const resetProducts = () => {
    const defaultProducts = {
      prize_1: { name: '로지텍 MX Master 3s 마우스', quantity: 2, img: prize1 },
      prize_2: { name: '아트뮤 PB310 보조배터리', quantity: 3, img: prize2 },
      prize_3: { name: '로지텍 R500s 포인터', quantity: 5, img: prize3 },
      prize_4: { name: '필릭스 LED 에디슨 데스크 램프', quantity: 10, img: prize4 },
      prize_5: { name: '농심 굿즈', quantity: 30, img: prize5 },
      prize_6: { name: '농심 제품 + DT FAIR 다회용백', quantity: 150, img: prize6 },
    };
  
    // 로컬 스토리지 초기화
    localStorage.setItem('products', JSON.stringify(defaultProducts));
  
    // 상태 업데이트
    setProducts(defaultProducts);
  
    console.log('상품 정보가 초기화되었습니다.');
  };

  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F4') { // F4 키를 눌렀을 때 초기화
        resetProducts();
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
 
    
  const getResultMessage = () => {
    switch (prizeNumber) {
      case 0:
        return '🏆 1등 당첨 🎉';
      case 1:
        return '🥇 2등 당첨 🎁';
      case 2:
        return '🥈 3등 당첨 👏';
      case 3:
        return '🥉 4등 당첨 😉';
      case 4:
        return '📦 4등 당첨 😉';
      case 5:
        return '📦 6등 당첨 😉';
      default:
        return '';
    }
  };

  useEffect(() => {
    // 로컬스토리지 상품 정보 불러오기
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    // 로컬 스토리지에서 updatedProducts 불러오기
    const savedUpdatedProducts = localStorage.getItem('updatedProducts');
    if (savedUpdatedProducts) {
      setUpdatedProducts(JSON.parse(savedUpdatedProducts));
    }
  }, []); // 첫 렌더링 시 한 번만 실행
  
  useEffect(() => {
    // 상품이 선택되었을 때 콘솔 출력
    if (prize) {
      console.log('선택된 상품: ${prize.name}');
    }
  }, [prize]); // prize 상태가 변경될 때 실행
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F9") {
        handleRouletteStart();
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // 



  const handleRouletteStart = () => {
    if (isButtonDisabled || mustSpin) return; // 버튼이 비활성화되었거나 이미 스핀 중이면 실행하지 않음
  
    setIsButtonDisabled(true); // 버튼 비활성화
    setMustSpin(true); // 스핀 시작
    setHasSpun(true); // 스핀 시작됨을 표시
  
    const availableProducts = Object.values(products).filter((product) => product.quantity > 0);
  
    if (availableProducts.length === 0) {
      alert('모든 상품이 소진되었습니다! 😭');
      setIsButtonDisabled(false);
      setMustSpin(false); // 스핀 중단
      return;
    }
  
    const weightedProducts = availableProducts.flatMap((product) => Array(product.quantity).fill(product));
    const randomIndex = Math.floor(Math.random() * weightedProducts.length);
    const selectedPrize = weightedProducts[randomIndex];
    
    const prizeIndex = data.findIndex(
      (item) => item.option === selectedPrize.name
    );
  
    setPrizeNumber(prizeIndex); // 당첨 상품 인덱스 설정
    setPrize(selectedPrize); // 선택된 상품 설정
  
    // 재고 업데이트를 임시 상태에 저장
    const newProducts = { ...products };
    const foundKey = Object.keys(newProducts).find(
      (key) => newProducts[key].name === selectedPrize.name
    );
  
    if (foundKey) {
      newProducts[foundKey] = {
        ...newProducts[foundKey],
        quantity: newProducts[foundKey].quantity - 1,
      };
    }
  
    // 로컬 스토리지에도 임시로 저장
    localStorage.setItem('updatedProducts', JSON.stringify(newProducts));
    setUpdatedProducts(newProducts);
  
    playAudio('/asset/wheel.mp3', undefined, false);


    setTimeout(() => {
      // 1등 당첨 시 GIF 표시
      if (prizeIndex === 0) {
        setShowGif(true);
        setTimeout(() => {
          setShowGif(false);
          setIsResultShow(true);
        }, 4000); // 4초간 GIF 표시 후 숨김
      } else {
        setIsResultShow(true);
      }

      playAudioWithDuration('/asset/win1.mp3', 3000, () => playAudio('/asset/win.mp3'));

    }, 3000);
  };

  return (
    <>
      <div className="roulette-layout">
        <div className="headerContainer">
          <img
            src="https://image.nongshim.com/groupware/DT_web_poster/image/DT_FAIR_logo.gif"
            alt="DT FAIR 2024"
            style={{ width: '400px' }}
          />
          <Card variant="outlined" sx={{ margin: '3rem', marginTop: '3rem' }}>
            <CardContent>
              <Typography sx={{ color: '#333', fontSize: 18, fontWeight: 'bold', marginBottom: '1rem' }}>
                잔여 수량
              </Typography>

              {Object.entries(products).map(([key, product]) => (
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }} key={key}>
                  {product.name}: {product.quantity}개
                </Typography>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="container">
          {/* 테두리 */}
          <RouletteBorder spin={mustSpin} />
          {/* <div className="roulette-border"><div className="dots"></div></div> */}

          <div className="innerContainer">
            <Wheel
              mustStartSpinning={mustSpin}
              data={data.map((item) => ({
                option: item.option,
                style: item.style,
                image: item.image,
              }))}
              // startingOptionIndex={0}
              prizeNumber={prizeNumber}
              outerBorderColor={grey[300]}
              outerBorderWidth={0}
              innerBorderWidth={1}
              innerBorderColor={grey[300]}
              radiusLineWidth={0}
              innerRadius={10}
              fontSize={13}
              onStopSpinning={() => {
                if (hasSpun) {
                  setMustSpin(false);
                  setIsResultShow(true);
                  sendToGoogleSheets();
                  setHasSpun(false);
                  setPrizeNumber(-1); // prizeNumber 리셋
                }
              }}
              spinDuration={0.5}
              backgroundColors={data.map((item) => item.style.backgroundColor)}
              textColors={data.map((item) => item.style.textColor)}
              pointerProps={{
                src: '', // 커서 이미지 URL
                style: { display: 'none' },
              }}
              perpendicularText={true}
              textDistance={75}
            />
            <div className="btn-container">
              <StartButton
                variant="outlined"
                size="large"
                className="startBtn"
                onClick={handleRouletteStart} // 음성 인식 시작
                disabled={isButtonDisabled}>
                Start
              </StartButton>
            </div>
          </div>
        </div>
      </div>

      {showGif && (
        <Modal open={true} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src="https://i.namu.wiki/i/aEaRClFwgm0hl2PFb7-j20_WC99GnPFUkg6njz_IckIXXx_UZDELGldWijSZw-IqYOFXeUJNF41HESd380w0Og.gif"
            alt="1등 당첨 축하 GIF"
            style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
          />
        </Modal>
      )}

      <Modal
        open={isResultShow}
        onClose={() => {
          setIsResultShow(false);
          if (updatedProducts) {
            setProducts(updatedProducts);
            localStorage.setItem('products', JSON.stringify(updatedProducts));
            setUpdatedProducts(null); // 임시 상태 초기화
          }
          setIsButtonDisabled(false); // Start 버튼 활성화
        }}
        style={{ cursor: 'pointer' }}
        onClick={() => {
          setIsResultShow(false);
          if (updatedProducts) {
            setProducts(updatedProducts);
            localStorage.setItem('products', JSON.stringify(updatedProducts));
            setUpdatedProducts(null); // 임시 상태 초기화
          }
          setIsButtonDisabled(false); // Start 버튼 활성화
        }}>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: 'rgba(255, 255, 255, 1)', // 투명도 10% (0.9)
            width: '50rem', // 크기 조정
            height: '30rem', // 크기 조정
            maxWidth: '100vw',
            maxHeight: '100vh',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            overflowY: 'auto',
            borderRadius: '1rem',
            flexDirection: 'column',
          }}>
          {prizeNumber >= 0 && data[prizeNumber]?.image?.uri && (
            <img
              src={data[prizeNumber].image.uri}
              alt={data[prizeNumber].option}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0.5,
                objectFit: 'cover',
              }}
            />
          )}
          <span
            style={{
              fontSize: '70px',
              color: 'black',
              fontWeight: 'bold',
              zIndex: 2,
              marginBottom: '2rem',
            }}>
            {getResultMessage()}
          </span>
          <span
            style={{
              fontSize: '40px',
              color: 'black',
              zIndex: 2,
              fontWeight: 'bold',
            }}>
            {prize?.name}
          </span>
        </Box>
      </Modal>

      {/* <Snackbar
        open={!!noti}
        onClose={() => {
          setNoti(null);
        }}
        autoHideDuration={3000}>
        <Alert severity={noti?.type} variant="filled" sx={{ width: '100%' }}>
          {noti?.message}
        </Alert>
      </Snackbar> */}
    </>
  );
}

export default App;
