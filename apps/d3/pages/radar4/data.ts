export type Data = {
  name: string
  value: number
}

export type Dimensions = {
  width: number
  height: number
  margin: {
    left: number
    right: number
    top: number
    bottom: number
  }
  boundedWidth: number
  boundedHeight: number
}

export const campaign: Data[] = [
  { name: '운영체제 최신보안 패치', value: 32 },
  { name: '보안센터 서비스 실행', value: 100 },
  { name: 'Windows 방화벽 사용', value: 64 },
  { name: '윈도우 로그인 패스워드', value: 75 },
  { name: '바이러스 백신 설치 및 실행', value: 50 },
  { name: '기타', value: 24 },
]
