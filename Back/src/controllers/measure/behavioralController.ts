import { Request, Response } from 'express';
import path from 'path';
import cv from '@techstark/opencv-js';

// Express Request에 Multer의 File 속성이 존재함을 가정합니다.
export interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// 간단한 선형 보간 함수: 입력된 2차원 배열 데이터를 targetLength만큼 보간하여 반환
function linearInterpolate(data: number[][], targetLength: number): number[][] {
  const originalLength = data.length;
  const interpolated: number[][] = [];
  for (let i = 0; i < targetLength; i++) {
    const t = i / (targetLength - 1);
    const pos = t * (originalLength - 1);
    const lower = Math.floor(pos);
    const upper = Math.ceil(pos);
    if (lower === upper) {
      interpolated.push(data[lower]);
    } else {
      const weight = pos - lower;
      const interpPoint = data[lower].map((val, index) => {
        return val * (1 - weight) + data[upper][index] * weight;
      });
      interpolated.push(interpPoint);
    }
  }
  return interpolated;
}

function predict(data: number[]): string {
  return 'class_1';
}

export const measureVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('measure start');
    
    const multerReq = req as MulterRequest;
    console.log(`multerReq === ${multerReq}`);
    const videoPath = multerReq.file?.path;
    console.log(`videoPath === ${videoPath}`);
    if (!videoPath) {
      res.status(400).json({ error: '영상 파일이 업로드되지 않았습니다.' });
      return;
    }

    const protoPath = path.join(__dirname, '..', '..', 'assets', 'openpose', 'pose_deploy.prototxt');
    const weightsPath = path.join(__dirname, '..', '..', 'assets', 'openpose', 'pose_iter_584000.caffemodel');
    console.log(`protoPath === ${protoPath}`);
    console.log(`weightsPath === ${weightsPath}`);
    let net;
    try {
      net = cv.readNetFromCaffe(protoPath, weightsPath);
    } catch (error) {
      console.error('DNN 모델 로드 실패:', error);
      res.status(500).json({ error: 'DNN 모델 로드 실패' });
      return;
    }

    const cap = new cv.VideoCapture(videoPath);
    const targetFrameCount = 450;
    const inWidth = 368;
    const inHeight = 368;
    const threshold = 0.1;
    const numJoints = 25;
    const poseList: number[][] = [];

    while (true) {
      const frame = new cv.Mat();
      cap.read(frame);
      if (frame.empty()) break;

      const frameWidth = frame.cols;
      const frameHeight = frame.rows;

      const blob = cv.blobFromImage(
        frame,
        1.0 / 255,
        new cv.Size(inWidth, inHeight),
        new cv.Scalar(0, 0, 0), // cv.Vec3d 대신 Scalar 사용
        false,
        false
      );

      net.setInput(blob);
      const output = net.forward();
      const H = output.sizes[2];
      const W = output.sizes[3];
      const poseCoords: number[] = [];

      // output 데이터를 4차원 배열로 변환 (타입 단언)
      const dataArray = (output.getDataAsArray() as unknown) as number[][][][];

      for (let i = 0; i < numJoints; i++) {
        const probMap: number[][] = dataArray[0][i];
        let maxVal = -Infinity;
        let maxX = 0;
        let maxY = 0;
        for (let y = 0; y < H; y++) {
          for (let x = 0; x < W; x++) {
            const val = probMap[y][x];
            if (val > maxVal) {
              maxVal = val;
              maxX = x;
              maxY = y;
            }
          }
        }
        const xCoord = (frameWidth * maxX) / W;
        const yCoord = (frameHeight * maxY) / H;
        if (maxVal > threshold) {
          poseCoords.push(xCoord, yCoord);
        } else {
          poseCoords.push(0.0, 0.0);
        }
      }
      poseList.push(poseCoords);
    }
    // opencv-js의 VideoCapture에는 delete나 release 메소드가 없으므로, 별도 해제 코드는 생략합니다.

    if (poseList.length < 2) {
      res.status(400).json({ error: '입력된 영상에서 포즈가 충분히 추출되지 않았습니다.' });
      return;
    }

    const interpPoses = linearInterpolate(poseList, targetFrameCount);

    const reshaped: number[][][][] = [
      [
        Array.from({ length: targetFrameCount }, () => new Array(25).fill(0)),
        Array.from({ length: targetFrameCount }, () => new Array(25).fill(0)),
      ],
    ];

    for (let t = 0; t < targetFrameCount; t++) {
      const framePose = interpPoses[t];
      for (let j = 0; j < 25; j++) {
        reshaped[0][0][t][j] = framePose[2 * j];
        reshaped[0][1][t][j] = framePose[2 * j + 1];
      }
    }

    const flattened: number[] = [];
    for (let c = 0; c < 2; c++) {
      for (let t = 0; t < targetFrameCount; t++) {
        for (let j = 0; j < 25; j++) {
          flattened.push(reshaped[0][c][t][j]);
        }
      }
    }

    const prediction = predict(flattened);
    res.json({ result: prediction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 에러' });
  }
};
