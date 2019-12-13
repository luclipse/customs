## 사용자 맞춤형 서비스

### 지도 가져오기

주소 


```
/geoCalc/getMap
```


파라메타 


```
layerName : 레이어 명 

bbox : minx, miny, maxx, maxy 

fromProj : 레이어의 좌표계

toProj : 지도의 좌표계
```

예제 
```
GET  http://localhost:8080/geoCalc/getMap?layerName=z_sop_bnd_sido_pg&bbox=203237.49175908798,278090.524507466,204958.03268599045,278936.0276924571&fromProj=EPSG:5181&toProj=EPSG:3857
```


<br>
<br>

### 좌표로 주소 가져오기

주소 
```
geoCalc/getAddrByPoint
```

파라메타
```
layerName : 주소를 가져올 레이어 명

valueColumnName : 주소가 들어 있는 컬럼 명

cdColumnName : 주소의 코드가 들어가 있는 컬럼명 

coord : x y 좌표 
```

예제 
```
GET http://localhost:8080/geoCalc/getAddrByPoint?layerName=z_sop_bnd_sido_pg&valueColumnName=sido_nm&cdColumnName=sido_cd&coord=199996.76018324634,278044.65122573514
```

<br>
<br>

### 주소 코드로 해당 주소 코드의 바운더리 가져오기

주소
```
geoCalc/selectAddrExtentByCd
```

파라메타
```
layerName : 주소를 가져올 레이어 명

srid : 레이어의 좌표계 

cdColumnName : 코드 컬럼 명

cdValue : 코드 값
```

예제 
```
GET http://localhost:8080/geoCalc/selectAddrExtentByCd?layerName=z_sop_bnd_adm_dong_pg&srid=3857&cdColumnName=adm_dr_cd&cdValue=2403054
```