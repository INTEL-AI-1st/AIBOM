import { Request, Response } from 'express';
import path from 'path';
import cv from 'opencv4nodejs';
import fs from 'fs';

// Express Request with Multer File
export interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Linear interpolation function for pose data
function linearInterpolate(data: number[][], targetLength: number): number[][] {
  const originalLength = data.length;
  const interpolated: number[][] = [];
  
  for (let i = 0; i < targetLength; i++) {
    const t = i / (targetLength - 1);
    const pos = t * (originalLength - 1);
    const lower = Math.floor(pos);
    const upper = Math.ceil(pos);
    
    if (lower === upper) {
      interpolated.push([...data[lower]]);
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

// Placeholder model prediction function
function predict(data: number[]): string {
  // Replace with actual model prediction
  return 'class_1';
}

// Load OpenPose model safely
function loadOpenPoseModel(protoPath: string, weightsPath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      // Verify files exist and are readable
      if (!fs.existsSync(protoPath)) {
        return reject(new Error(`Proto file not found: ${protoPath}`));
      }
      if (!fs.existsSync(weightsPath)) {
        return reject(new Error(`Weights file not found: ${weightsPath}`));
      }
      
      console.log(`Loading DNN from: ${protoPath} and ${weightsPath}`);
      
      try {
        const net = cv.readNetFromCaffe(protoPath, weightsPath);
        console.log("Model loaded successfully");
        resolve(net);
      } catch (innerError) {
        console.error("Inner error loading model:", innerError);
        reject(new Error(`Failed to read model: ${innerError}`));
      }
    } catch (error) {
      reject(new Error(`Error loading model: ${error}`));
    }
  });
}

export const measureVideo = async (req: Request, res: Response): Promise<void> => {
  console.log('Video measurement process started');
  
  try {
    const multerReq = req as MulterRequest;
    const videoPath = multerReq.file?.path;
    
    if (!videoPath) {
      res.status(400).json({ error: 'No video file uploaded' });
      return;
    }
    
    console.log(`Processing video: ${videoPath}`);
    
    if (!fs.existsSync(videoPath)) {
      res.status(400).json({ error: 'Video file not found on server' });
      return;
    }
    
    // Set up absolute paths for model files
    const protoPath = path.resolve(__dirname, '..', '..', '..', 'assets', 'openpose', 'pose_deploy.prototxt');
    const weightsPath = path.resolve(__dirname, '..', '..', '..', 'assets', 'openpose', 'pose_iter_584000.caffemodel');
    
    console.log(`Model files: 
      - Proto: ${protoPath} (exists: ${fs.existsSync(protoPath)})
      - Weights: ${weightsPath} (exists: ${fs.existsSync(weightsPath)})
    `);
    
    const protoSize = fs.statSync(protoPath).size;
    const weightsSize = fs.statSync(weightsPath).size;
    console.log(`Proto file size: ${protoSize} bytes`);
    console.log(`Weights file size: ${weightsSize} bytes`);
    
    if (protoSize === 0 || weightsSize === 0) {
      res.status(500).json({ error: 'Model files are empty' });
      return;
    }
    
    // Load model
    let net;
    try {
      net = await loadOpenPoseModel(protoPath, weightsPath);
    } catch (error) {
      console.error('Failed to load OpenPose model:', error);
      res.status(500).json({ 
        error: 'Failed to load DNN model', 
        details: error instanceof Error ? error.message : String(error) 
      });
      return;
    }
    
    const targetFrameCount = 450;
    const inWidth = 368;
    const inHeight = 368;
    const threshold = 0.1;
    const numJoints = 25;
    const poseList: number[][] = [];
    
    console.log("Opening video capture");
    let cap;
    try {
      cap = new cv.VideoCapture(videoPath);
    } catch (error) {
      console.error('Failed to open video:', error);
      res.status(500).json({ error: 'Failed to open video file' });
      return;
    }
    
    console.log("Processing video frames");
    let frameCount = 0;
    
    while (true) {
      try {
        // Read frame directly from capture
        const frame = cap.read();
        
        // Check if frame is empty (using property, not a method)
        if (!frame || frame.empty) {
          console.log(`End of video or empty frame after ${frameCount} frames`);
          break;
        }
        
        frameCount++;
        if (frameCount % 10 === 0) {
          console.log(`Processed ${frameCount} frames`);
        }
        
        const frameWidth = frame.cols;
        const frameHeight = frame.rows;
        
        // Create cv.Size instance (cast to any if needed)
        const size = new (cv.Size as any)(inWidth, inHeight);
        
        // Create blob from image; replace new cv.Scalar(0,0,0) with [0,0,0]
        const blob = cv.blobFromImage(
          frame,
          1.0 / 255,
          size,
          new cv.Vec3(0, 0, 0),
          false,
          false
        );
        
        net.setInput(blob);
        const output = net.forward();
        
        const H = output.sizes[2];
        const W = output.sizes[3];
        const poseCoords: number[] = [];
        
        // Get output data as array
        const dataArray = output.getDataAsArray() as unknown as number[][][][];

        // Extract joint positions from probability maps
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
        
        poseList.push([...poseCoords]);
        
        // No manual deletion required
        
      } catch (frameError) {
        console.error('Error processing frame:', frameError);
        break;
      }
    }
    
    console.log(`Total frames processed: ${frameCount}`);
    console.log(`Poses extracted: ${poseList.length}`);
    
    if (poseList.length < 2) {
      res.status(400).json({ 
        error: 'Not enough poses extracted from video',
        frames_processed: frameCount
      });
      return;
    }
    
    console.log("Interpolating poses");
    const interpPoses = linearInterpolate(poseList, targetFrameCount);
    
    console.log("Reshaping data");
    const reshaped: number[][][][] = [
      [
        Array.from({ length: targetFrameCount }, () => new Array(25).fill(0)),
        Array.from({ length: targetFrameCount }, () => new Array(25).fill(0)),
      ],
    ];
    
    for (let t = 0; t < targetFrameCount; t++) {
      const framePose = interpPoses[t];
      for (let j = 0; j < 25; j++) {
        reshaped[0][0][t][j] = framePose[2 * j];     // x coordinates
        reshaped[0][1][t][j] = framePose[2 * j + 1]; // y coordinates
      }
    }
    
    console.log("Flattening data for prediction");
    const flattened: number[] = [];
    for (let c = 0; c < 2; c++) {
      for (let t = 0; t < targetFrameCount; t++) {
        for (let j = 0; j < 25; j++) {
          flattened.push(reshaped[0][c][t][j]);
        }
      }
    }
    
    console.log("Making prediction");
    const prediction = predict(flattened);
    
    res.json({ 
      result: prediction,
      frames_processed: frameCount,
      poses_extracted: poseList.length
    });
    
  } catch (err) {
    console.error('Unhandled error in measureVideo:', err);
    res.status(500).json({ 
      error: 'Server error',
      message: err instanceof Error ? err.message : String(err)
    });
  }
};
