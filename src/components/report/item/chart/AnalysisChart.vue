<script>
export default {
  props: [
    "data", // 배열, 서버에서 직접 날려준 시계열 데이터가 담김, X축과 Y축에 표시될 정보를 갖고 있음
    "color", // 스트링, 차트의 메인 컬러 정보를 HEX로 표시
    "legend", // 스트링, 차트 범례로 이 값이 바뀔 때마다 `chartOption`을 변경하여 차트 업데이트를 유도해야 함
    "backdrop", // 불리언, true일 때 차트 비활성화를 표현하는 반투명 검은색 레이어를 띄움
    "empty", // 불리언, true일 때 측정된 데이터 없음을 표현하는 투명 레이어를 띄움
    "yAxis", // 스트링, y축 단위 라벨, y축 단위가 횟수 또는 시간(분)일수도 있기 때문
  ],
};
</script>

<template>
  <div class="analysis-chart">
    <vue-chart class="analysis-chart__content" :chartData="chartData" :chartOptions="chartOptions" :width="null" :height="null" />
    <div class="analysis-chart__backdrop" v-if="backdrop"></div>
    <div class="analysis-chart__empty-layer" v-if="empty">
      <p>데이터가 없어요</p>
    </div>
  </div>
</template>
