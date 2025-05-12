FROM node:18

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치 (legacy-peer-deps 옵션 추가)
RUN npm install --legacy-peer-deps

# 나머지 애플리케이션 파일 복사
COPY . .

# 앱이 실행될 포트 노출
EXPOSE 8080

# 애플리케이션 실행 명령어
CMD ["npm", "start"]