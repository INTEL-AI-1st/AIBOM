import { useState, useEffect } from "react";
import { Map, MapMarker, MapInfoWindow } from "react-kakao-maps-sdk";
import * as E from "@styles/education/EducationStyles";

interface Place {
  id?: string;
  place_name: string;
  road_address_name?: string;
  address_name?: string;
  phone?: string;
  x: string;
  y: string;
  place_url?: string;
  distance?: string;
}

export default function Education() {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number }>({
    lat: 37.5666805,
    lng: 126.9784147,
  });
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 브라우저의 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("위치 정보를 가져오는데 실패했습니다.", error);
        }
      );
    }
  }, []);

  // 지도 중심(또는 현재 위치) 기준으로 검색
  const handleSearch = (query: string) => {
    if (!window.kakao || !window.kakao.maps) return;
    const ps = new window.kakao.maps.services.Places();
    const center = map
      ? map.getCenter()
      : new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
    const options = {
      location: center,
      radius: 5000, // 5km 범위
    };

    ps.keywordSearch(
      query,
      (data: Place[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setPlaces(data);
          setSelectedPlace(null);
        } else {
          console.error("검색에 실패했습니다:", status);
          setPlaces([]);
        }
      },
      options
    );
  };

  // "내 좌표로 돌아가기" 버튼 클릭 시 처리
  const handleReturnToMyLocation = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (map) {
      const myLocation = new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
      map.setCenter(myLocation);
    }
  };

  // 사이드바 검색 결과 클릭 시 지도 이동 및 info window 열기
  const handleListClick = (place: Place) => {
    if (map) {
      const moveLatLng = new kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x));
      map.setCenter(moveLatLng);
      setSelectedPlace(place);
    }
  };

  return (
    <E.Container>
      {/* 사이드바 */}
      <E.Sidebar onClick={(e) => e.stopPropagation()}>
        <E.Header>
          <E.SidebarHeader>유아교육 시설 검색</E.SidebarHeader>
          <E.TopBarButton onClick={handleReturnToMyLocation}>
            내 좌표로 돌아가기
          </E.TopBarButton>
        </E.Header>
        {/* 사이드바 내 검색 입력창 및 버튼 */}
        <E.SearchContainer>
          <E.SearchInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색어를 입력하세요"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(searchQuery);
              }
            }}
          />
          <E.SearchButton onClick={() => handleSearch(searchQuery)}>
            검색
          </E.SearchButton>
        </E.SearchContainer>

        {/* 카테고리 버튼 */}
        <E.CategoryContainer>
          <E.CategoryButton onClick={() => handleSearch("유치원")}>
            유치원
          </E.CategoryButton>
          <E.CategoryButton onClick={() => handleSearch("어린이집")}>
            어린이집
          </E.CategoryButton>
          <E.CategoryButton onClick={() => handleSearch("유아학원")}>
            유아학원
          </E.CategoryButton>
          <E.CategoryButton onClick={() => handleSearch("소아병원")}>
            소아병원
          </E.CategoryButton>
        </E.CategoryContainer>

        {/* 검색 결과 목록 */}
        <E.SearchResultList>
          {places.length > 0 ? (
            places.map((place, index) => (
              <E.SearchResultItem
                key={place.id || index}
                selected={selectedPlace?.id === place.id}
                onClick={() => handleListClick(place)}
              >
                <strong>{place.place_name}</strong>
                <E.ResultText>
                  {place.road_address_name || place.address_name}
                </E.ResultText>
                {place.phone && <E.ResultText>{place.phone}</E.ResultText>}
              </E.SearchResultItem>
            ))
          ) : (
            <E.NoResults>검색 결과가 없습니다.</E.NoResults>
          )}
        </E.SearchResultList>
      </E.Sidebar>

      {/* 우측 컨테이너 */}
      <E.RightContainer>
        <E.MapArea>
          <Map
            center={currentLocation}
            style={{ width: "100%", height: "100%" }}
            level={3}
            onCreate={(map) => setMap(map)}
            onClick={() => setSelectedPlace(null)}
          >
            {places.map((place, index) => (
              <MapMarker
                key={place.id || index}
                position={{
                  lat: parseFloat(place.y),
                  lng: parseFloat(place.x),
                }}
                title={place.place_name}
                onClick={() => setSelectedPlace(place)}
              />
            ))}

            {selectedPlace && (
              <MapInfoWindow
                position={{
                  lat: parseFloat(selectedPlace.y),
                  lng: parseFloat(selectedPlace.x),
                }}
              >
                <E.InfoWindowContent onClick={(e) => e.stopPropagation()}>
                  <E.InfoWindowTitle>
                    {selectedPlace.place_name}
                  </E.InfoWindowTitle>
                  <E.InfoWindowText>
                    <strong>주소:</strong>{" "}
                    {selectedPlace.road_address_name ||
                      selectedPlace.address_name}
                  </E.InfoWindowText>
                  {selectedPlace.phone && (
                    <E.InfoWindowText>
                      <strong>전화:</strong> {selectedPlace.phone}
                    </E.InfoWindowText>
                  )}
                  {selectedPlace.place_url && (
                    <E.InfoWindowText style={{ marginBottom: 0 }}>
                      <E.InfoWindowLink
                        href={selectedPlace.place_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        상세보기
                      </E.InfoWindowLink>
                    </E.InfoWindowText>
                  )}
                </E.InfoWindowContent>
              </MapInfoWindow>
            )}
          </Map>
        </E.MapArea>
      </E.RightContainer>
    </E.Container>
  );
}
