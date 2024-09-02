import {
  Box,
  Button,
  ButtonProps,
  Modal,
  Snackbar,
  styled,
  Alert,
} from "@mui/material";
import { red } from "@mui/material/colors";
import React, { useState } from "react";
import { Wheel } from "react-custom-roulette";
import "./App.css";
import CloseIcon from "@mui/icons-material/Close";
import { saveAs } from 'file-saver';

const StartButton = styled(Button)<ButtonProps>(({ theme }) => ({
  marginTop: "20px",
  width: "100%",
  fontSize: 20,
  color: "#fff",
  backgroundColor: red[500],
  padding: "15px",
  borderRadius: "10px",
  "&:hover": {
    backgroundColor: red[700],
    color: "#fff",
  },
}));

const data = [
  { option: "1등", style: { backgroundColor: "#f44336", textColor: "white" }, probability: 3 },
  { option: "2등", style: { backgroundColor: "#2196f3", textColor: "white" }, probability: 7 },
  { option: "3등", style: { backgroundColor: "#4caf50", textColor: "white" }, probability: 15 },
  { option: "4등", style: { backgroundColor: "#ffeb3b", textColor: "black" }, probability: 25 },
  { option: "꽝", style: { backgroundColor: "#9e9e9e", textColor: "black" }, probability: 50 },
];

function App() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [isResultShow, setIsResultShow] = useState<boolean>(false);
  const [noti, setNoti] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSpinClick = () => {
    if (mustSpin) return;

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
    const resultData = {
      date: new Date().toISOString(),
      result: data[prizeNumber]?.option || "Unknown",
    };

    const blob = new Blob([JSON.stringify(resultData, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, "data.json");

    setNoti({
      type: "success",
      message: "결과가 저장되었습니다.",
    });
  };

  return (
    <>
      <div className="roulette-layout">
        <div style={{ textAlign: "center" }}>
          <h1>룰렛</h1>
          <Wheel
            mustStartSpinning={mustSpin}
            data={data}
            prizeNumber={prizeNumber}
            outerBorderWidth={2}
            innerBorderWidth={2}
            radiusLineWidth={3}
            innerRadius={0}
            backgroundColors={["#F99533", "#24CA69", "#46AEFF", "#9145B7"]}
            fontSize={20}
            onStopSpinning={() => {
              setMustSpin(false);
              setIsResultShow(true);
              saveResult();
            }}
            spinDuration={1}
          ></Wheel>
          <StartButton
            variant="outlined"
            size="large"
            onClick={handleSpinClick}
          >
            시작
          </StartButton>
        </div>
      </div>
      <Modal
        open={isResultShow}
        onClose={() => {
          setIsResultShow(false);
        }}
        style={{}}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            flexDirection: "column",
            backgroundColor: "white",
            width: "45%",
            height: "40%",
            maxWidth: "100vw",
            maxHeight: "100%",
            position: "fixed",
            top: "50%",
            left: "30%",
            transform: "translate(0, -50%)",
            overflowY: "auto",
          }}
        >
          <CloseIcon
            aria-label="close"
            onClick={() => {
              setIsResultShow(false);
            }}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          />
          <span style={{ fontSize: "60px" }}>
            {data[prizeNumber] ? data[prizeNumber].option : ""}
          </span>
        </Box>
      </Modal>

      <Snackbar
        open={!!noti}
        onClose={() => {
          setNoti(null);
        }}
        autoHideDuration={3000}
      >
        <Alert severity={noti?.type} variant="filled" sx={{ width: "100%" }}>
          {noti?.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
