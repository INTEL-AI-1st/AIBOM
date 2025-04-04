import React, { useState, useEffect } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

interface Place {
  place_name: string;
  x: string;
  y: string;
  // 필요한 다른 속성이 있다면 여기에 추가할 수 있습니다.
}

export default function Education() {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number }>({
    lat: 33.450701,
    lng: 126.570667,
  });
  const [places, setPlaces] = useState<Place[]>([]);

  // 브라우저의 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error: GeolocationPositionError) => {
          console.error("위치 정보를 가져오는데 실패했습니다.", error);
        }
      );
    } else {
      console.error("이 브라우저는 Geolocation을 지원하지 않습니다.");
    }
  }, []);

  // Kakao 장소 검색 API를 사용하여 "유치원"과 "어린이집" 검색
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    const ps = new window.kakao.maps.services.Places();
    const allPlaces: Place[] = [];

    // 콜백 함수의 매개변수에 대해 명시적 타입 지정 (status는 string으로 지정)
    const searchCallback = (data: Place[], status: string): void => {
      if (status === window.kakao.maps.services.Status.OK) {
        allPlaces.push(...data);
        setPlaces([...allPlaces]);
      } else {
        console.error("검색에 실패했습니다: ", status);
      }
    };

    ps.keywordSearch("유치원", searchCallback);
    ps.keywordSearch("어린이집", searchCallback);
  }, [currentLocation]);

  return (
    <Map
      center={currentLocation}
      style={{ width: "1000px", height: "600px" }}
      level={3}
    >
      {places.map((place, index) => (
        <MapMarker
          key={index}
          position={{ lat: parseFloat(place.y), lng: parseFloat(place.x) }}
          title={place.place_name}
        />
      ))}
    </Map>
  );
}
