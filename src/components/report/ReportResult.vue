<script setup>
import BarChart from "./item/chart/BarChart.vue";
import DoughnutChart from "./item/chart/DoughnutChart.vue";
import HorizenBarChart from "./item/chart/HorizenBarChart.vue";
import {ref, onMounted, onUpdated, watch} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";

const route = useRoute();

const URL = "/server";
let token = sessionStorage.getItem("accessToken");

// 부모로 부터 query로 받아오는 값들
const sidoName = route.query.sidoName;
const dealAmount = route.query.dealAmount; // 사용자 입력 전세가
const area = route.query.area;
const aptName = route.query.aptName;
const aptCode = route.query.aptCode;
const dealDeposit = route.query.dealDeposit; // 해당 아파트 매매 평균
const dealArea = route.query.dealArea; // 해당 아파트 평수 평균
// onmount 했을 때 받아올 값들 (아파트 정보)
const dongCode = ref("");
const address = ref("");
const aptInfoList = ref([]);
const monthlyAvgList = ref([]);

// 1년치 전세 거래 평균 -> 사용자 입력값과 대소 비교
const allAvg = ref(0);

// 평당 전세가 불러올 때 받아올 값들
const leaseAvgPrice = ref("");
const percentDifference = ref(0);
// 해당 지역의 최근 전세/매매 비율
const perList = ref([]); // 배열
const regionPer = ref("");

// 전세 위험률
// const percent = ref(dealAmount / area / (dealDeposit / dealArea));
const percent = ref(50);

// get 요청 파라미터
const param = ref({
  dongCode: "",
});
const getAptInfoList = () => {
  axios({
    method: "get",
    url: URL + "/report/apartInfo/" + aptCode,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      dongCode.value = res.data.data_body[0].dong_code;
      address.value = res.data.data_body[0].sigu_name + " " + res.data.data_body[0].dong_name;
      aptInfoList.value = res.data.data_body;
      // console.log(dongCode.value);
    })
    .catch((err) => {
      console.log(err.data);
    });
};

const getSidoAvgDeposit = () => {
  axios({
    method: "get",
    url: URL + "/report/avg/" + dongCode.value,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      leaseAvgPrice.value = res.data.data_body[12].leaseAvgPrice;

      console.log(Math.abs(Math.round(dealAmount / area) - leaseAvgPrice.value));
      percent.value = dealAmount / area / (dealDeposit / dealArea);
      percentDifference.value = Math.round((Math.abs(dealAmount / area - leaseAvgPrice.value) / Math.round(leaseAvgPrice.value)) * 100);
      console.log(dealArea);
    })
    .catch((err) => {
      console.log(err.data);
    });
};

const getPerDeposit = () => {
  axios({
    method: "get",
    url: URL + "/report/per/" + dongCode.value,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      perList.value = res.data.data_body[12];
      regionPer.value = perList.value.per.substring(0, perList.value.per.indexOf(".")); // 가장 최근 값
      regionPer.value = parseInt(regionPer.value) + 15;
      console.log(regionPer.value);
    })
    .catch((err) => {
      console.log(err.data);
    });
};
function calculateAvgDeposit() {
  // Initialize monthlyAvg array
  const monthlyAvg = Array(12)
    .fill(0)
    .map(() => ({value: 0}));

  aptInfoList.value.forEach((aptInfo) => {
    const monthIndex = aptInfo.deal_month - 1;
    ////
    // Check if deal_month is a valid month (1 to 12)
    if (monthIndex >= 0 && monthIndex < 12) {
      monthlyAvg[monthIndex].value += parseInt(aptInfo.deposit);
      monthlyAvg[monthIndex].count = (monthlyAvg[monthIndex].count || 0) + 1;
    }
  });

  // Calculate average for each month
  var avgList = monthlyAvg.map((avg) => {
    if (avg.count !== undefined && avg.count !== 0) {
      return parseInt(avg.value / avg.count);
    } else {
      return 0;
    }
  });
  monthlyAvgList.value = avgList.concat([parseInt(dealAmount)]);
  console.log(monthlyAvgList.value);
  allAvg.value = avgList.reduce((total, current) => total + current, 0) / avgList.length;
}
onMounted(() => {
  getAptInfoList();
});

watch(
  () => aptInfoList.value,
  () => {
    getSidoAvgDeposit();
    getPerDeposit();
    calculateAvgDeposit();
  }
);
</script>

<template>
  <div class="report-wrapper">
    <p class="report-title">분석 레포트</p>
    <div class="report-container">
      <div class="apt-info-container">
        <p class="apt-title">{{ aptName }}</p>
        <div class="apt-info-content">
          <div class="apt-info-price"><span style="font-weight: bold">전세가</span> {{ dealAmount }} 만원 | <span style="font-weight: bold">평당가</span> {{ Math.round(dealAmount / area) }} 만원</div>
          <div class="apt-info-address"><span style="font-weight: bold">주소</span> {{ sidoName }} {{ address }}</div>
        </div>
      </div>
      <div class="chart-container">
        <div class="deal-list-container">
          <div class="chart-title-container">
            <img src="../../assets/img/icon1.png" alt="" style="width: 35px; height: 40px" />
            <p class="chart-title">실거래가 추이</p>
          </div>
          <div style="margin: 0 10%; display: flex; justify-content: center; align-items: center">
            <BarChart :monthlyAvgList="monthlyAvgList" :userAptName="aptName" :userArea="area" :userDeposit="dealAmount" />
          </div>
          <div style="text-align: center; margin-top: 30px; font-size: 16px">
            <b>{{ aptName }}</b
            >의 전세가는 최근 실거래가에 비해
            <button v-if="allAvg >= dealAmount" class="w-btn w-btn-green" type="button">낮은 편</button>
            <button v-else class="w-btn w-btn-red" type="button">높은 편</button>
            입니다.
          </div>
        </div>
        <div class="chart-sub-container">
          <div class="warning-container">
            <div class="chart-title-container">
              <img src="../../assets/img/icon2.png" alt="" style="width: 35px; height: 35px" />
              <p class="chart-title">전세 위험률 예측</p>
            </div>
            <div style="height: 150px">
              <DoughnutChart :per="regionPer" />
            </div>
            <div style="text-align: center; margin-top: 30px; font-size: 20px">
              전세 위험률은
              <span style="text-decoration: underline">{{ regionPer.toString() }}%</span>로<br />
              <button v-if="regionPer >= 90" class="w-btn w-btn-red" type="button">위험 매물</button>
              <button v-if="regionPer >= 70" class="w-btn w-btn-red" type="button">주의 매물</button>
              <button v-else class="w-btn w-btn-green" type="button">안전 매물</button>
              로 예측됩니다.
              <div style="font-size: 10px">* 90% 이상 : 위험 / 70% 이상 : 주의 / 70% 이하 : 안전</div>
            </div>
          </div>
          <div class="average-price-container">
            <div class="chart-title-container">
              <img src="../../assets/img/icon3.png" alt="" style="width: 50px; height: 40px" />
              <p class="chart-title">평수 당 전세 평균 가격</p>
            </div>
            <div style="margin: 0 10%">
              <HorizenBarChart v-if="leaseAvgPrice != 0" :sidoName="sidoName" :aptName="aptName" :leaseAvgPrice="leaseAvgPrice" :dealAmount="Math.round(dealAmount / area)" />
              <HorizenBarChart v-else :leaseAvgPrice="0" :sidoName="sidoName" :aptName="aptName" :dealAmount="Math.round(dealAmount / area)" />
            </div>
            <div style="text-align: center; margin-top: 30px; font-size: 20px">
              ㎡당 전세 가격은 <br />해당 지역 평균보다<br />
              <span v-if="Math.round(dealAmount / area) < leaseAvgPrice"
                ><button class="w-btn w-btn-green" type="button">{{ percentDifference }}%</button> 낮습니다.</span
              >

              <span v-else
                ><button class="w-btn w-btn-red" type="button">{{ percentDifference }}%</button> 높습니다.</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../../assets/css/reportResult.css";

button {
  margin: 10px;
}

.w-btn {
  position: relative;
  border: none;
  display: inline-block;
  padding: 10px 10px;
  border-radius: 15px;
  font-family: "paybooc-Light", sans-serif;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  font-weight: 600;
  transition: 0.25s;
}
.w-btn-green {
  background-color: #77af9c;
  color: #d7fff1;
}
.w-btn-red {
  background-color: #ff5f2e;
  color: white;
}
.w-btn:hover {
  letter-spacing: 2px;
  transform: scale(1.2);
  cursor: pointer;
}
.w-btn:active {
  transform: scale(1.5);
}
</style>
