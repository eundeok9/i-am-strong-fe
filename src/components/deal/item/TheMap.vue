<template>
  <div id="map"></div>
</template>

<script setup>
import {defineProps, ref, onMounted, onUpdated, toRaw} from "vue";

const map = ref(null);

const props = defineProps({
  aptList: Array,
  selectedAptId: String,
  isAptSelected: Boolean,
});

function initMap() {
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 5,
  };

  map.value = new kakao.maps.Map(container, options);
}

const findSelectedApt = (apartId, apartList) => {
  console.log("findSelectedApt");
  console.log("apartId: ", apartId);
  console.log("apartList", apartList);
  let lat = null;
  let lng = null;

  // console.log("aptId", props.selectedAptId);
  // console.log("aptId", apartId);
  apartList.forEach((apartment) => {
    // console.log(apartment);
    if (apartment.apt_id == apartId) {
      lat = apartment.lat;
      lng = apartment.lng;
    }
  });

  return [lat, lng];
};

onUpdated(() => {
  initMap();

  if (props.isAptSelected) {
    const latlng = findSelectedApt(props.selectedAptId, props.aptList);
    // console.log("latlng : ", latlng);
    console.log("아래는 latlng[0], latlng[1] 좌표");
    console.log(latlng[0], latlng[1]);

    // 마커가 표시될 위치
    var markerPosition = new kakao.maps.LatLng(Number(latlng[0]), Number(latlng[1]));

    // // 마커를 생성
    var marker = new kakao.maps.Marker({
      position: markerPosition,
    });

    // console.log("marker");
    // console.log(marker);

    // console.log("map value");
    // console.log(map.value);
    // console.log(map);

    // 마커가 지도 위에 표시되도록 설정
    marker.setMap(toRaw(map.value));
    map.value.panTo(markerPosition);
  } else {
    for (let apt of props.aptList) {
      let markerPosition = new kakao.maps.LatLng(Number(apt.lat), Number(apt.lng));

      // // 마커를 생성합니다
      const marker = new kakao.maps.Marker({
        position: markerPosition,
      });

      // console.log("marker");
      // console.log(marker);

      // console.log("map value");
      // console.log(map.value);
      // console.log(map);

      // // 마커가 지도 위에 표시되도록 설정합니다
      marker.setMap(toRaw(map.value));
      map.value.panTo(markerPosition);
    }
  }
});

onMounted(() => {
  //여기서 kakao 맵을 화면에 반영합니다.
  //카카오 라이브러리 정보 및 map을 확인
  if (window.kakao && window.kakao.maps) {
    kakao.maps.load(() => initMap()); //지도 초기화 - 상단에 function 선언해 있습니다.
  }
});
</script>

<style scoped>
#map {
  width: 100%;
  height: 90%;
}
</style>
