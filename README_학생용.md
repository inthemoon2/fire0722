# 07단계 · 실제 센서 대시보드

## 연결 흐름

ESP32 → Apps Script → Google Sheets → 대시보드 → TensorFlow.js → A*

## 사용 순서

1. 5단계에서 내려받은 `fire_evac_models_tfjs.zip`의 압축을 풉니다.
2. 다음 폴더를 이 프로젝트의 `models` 폴더 안에 복사합니다.

```text
models/model_10s/model.json
models/model_10s/group1-shard1of1.bin
models/model_20s/model.json
models/model_20s/group1-shard1of1.bin
models/model_30s/model.json
models/model_30s/group1-shard1of1.bin
models/model_metadata.json
```

3. VS Code Live Server 또는 GitHub Pages로 `index.html`을 실행합니다.
4. 6단계에서 만든 Apps Script `/exec` 주소를 입력합니다.
5. `설정 저장` 후 `지금 데이터 받기`를 누릅니다.

## ESP32 없이 확인

`시험 데이터 실행`을 누르면 R1~R6 시험값이 2초마다 변합니다.

AI 모델이 아직 없으면 미래값은 현재값으로 대신 표시되므로 현재 위험도와 A* 경로를 먼저 확인할 수 있습니다.

## 실제 센서 위치

`js/config.js`에서 R1~R6이 대응하는 지도 위치를 바꿀 수 있습니다.

```javascript
realSensorAnchors:{R1:"S03",R2:"S08",R3:"S13",R4:"S18",R5:"S23",R6:"S28"}
```

## 주의

TensorFlow.js 모델은 `index.html`을 더블클릭하는 방식으로 불러오지 못할 수 있습니다. 반드시 웹 서버 또는 GitHub Pages에서 실행하세요.

교육용 프로토타입이며 실제 화재 안전 시스템으로 사용할 수 없습니다.
