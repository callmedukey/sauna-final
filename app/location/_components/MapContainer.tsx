"use client";
import React, { useEffect, useRef, useState } from "react";

const MapContainer = () => {
  const mapElement = useRef<HTMLDivElement>(null);
  const [naverMapsLoaded, setNaverMapsLoaded] = useState(false);
  useEffect(() => {
    if (window && "naver" in window && "maps" in (window as any).naver) {
      setNaverMapsLoaded(true);
    } else {
      const intervalId = setInterval(() => {
        if ((window as any).naver && (window as any).naver.maps) {
          setNaverMapsLoaded(true);
          clearInterval(intervalId);
        }
      }, 100); // 100ms마다 체크

      // 클린업 함수
      return () => clearInterval(intervalId);
    }
  }, []);

  // naverMapsLoaded가 true로 바뀌면 지도 그리기!
  useEffect(() => {
    // 지도 초기화
    if (mapElement.current && naverMapsLoaded) {
      const { naver } = window as any;
      const location = new naver.maps.LatLng(
        37.514311057764836,
        126.93939451968987
      );
      const mapOptions = {
        center: location,
        zoom: 16,
        zoomControl: false,
      };
      const map = new naver.maps.Map(mapElement.current, mapOptions);

      const content = `<div class="p-2">솔로사우나레포 노량진점</div>`;

      const marker = new naver.maps.Marker({
        position: location,
        map,
      });

      const infoWindow = new naver.maps.InfoWindow({
        content,
      });

      if (infoWindow) {
        infoWindow.open(map, marker);
      }

      const markerClickListener = naver.maps.Event.addListener(
        marker,
        "click",
        () => {
          if (infoWindow.getMap()) {
            infoWindow.close();
          } else {
            infoWindow.open(map, marker);
          }
        }
      );
      return () => {
        naver.maps.Event.removeListener(markerClickListener);
      };
    }
  }, [naverMapsLoaded]); // naverMapsLoaded가 변경될 때만 실행

  return (
    <div
      className="flex-all-center w-full bg-gray-300 ~h-[15.125rem]/[30rem]"
      ref={mapElement}
    />
  );
};

export default MapContainer;
