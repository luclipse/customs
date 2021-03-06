<%--
  Class Name : map.jsp
  Description : 맵 화면
  Modification Information

  author   : 정호경
  since    : 2019.11.28
--%>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>


    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>MAP</title>
    <link rel="stylesheet" href="<c:url value='/resources/js/lib/ol6/ol.css'/>" type="text/css">
    <link rel="stylesheet" href="<c:url value='/resources/js/lib/tui.grid/tui-grid.css'/>" type="text/css">
    <link rel="stylesheet" href="<c:url value='/resources/js/lib/bootstrap-4.4.1/css/bootstrap.css'/>" type="text/css">
    <link rel="stylesheet" href="<c:url value='/resources/js/lib/bootstrap-4.4.1/css/sidebar.css'/>" type="text/css">
    <style>
        html, body {
            margin: 0;
            padding: 0;
        }

        #map {
            width: 100%;
            height: 100vh;
        }

        .map-container {
            width: 100%;
            height: 100% !important;
        }
        div.ol-custom-overviewmap,
        div.ol-custom-overviewmap.ol-uncollapsible {
            bottom: auto;
            left: auto;
            right: 0;
            top: 0;
        }

        div.ol-custom-overviewmap:not(.ol-collapsed)  {
            border: 1px solid black;
        }

        div.ol-custom-overviewmap div.ol-overviewmap-map {
            border: none;
            width: 300px;
        }

        div.ol-custom-overviewmap div.ol-overviewmap-box {
            border: 2px solid red;
        }

        div.ol-custom-overviewmap:not(.ol-collapsed) button{
            bottom: auto;
            left: auto;
            right: 1px;
            top: 1px;
        }

        .ol-zoom {
            top: unset;
            bottom: 8px;
            left: unset;
            right: 8px;
        }
        .sidebar.right {
            position: fixed;
            top: 0;
            left: 270px;
            bottom: 0;
            width: 180px;
            height : 100%;
            background: #51ffcf;
        }

        .dataBox {
            position: fixed;
            left: 300px;
            top: 7vh;
            width: 300px;
            height : 360px;
        }
        .downBox {
            position: fixed;
            left: 300px;
            top: 7vh;
            width: 300px;
        }
        .timeSeries {
            padding: 10px;
            position: fixed;
            left: 50%;
            bottom: 10px;
            width: 300px;
        }
        .legend {
            position: fixed;
            left: 320px;
            bottom: 20px;
            width: 150px;
        }
        .data-info {
            position: fixed;
            right: 10px;
            bottom: 10px;
            width: 300px;
        }
        .measureBox {
            position: fixed;
            left: 300px;
            top: 7vh;
            width: 300px;
        }
        .addrBox {
            position: fixed;
            left: 300px;
            top: 7vh;
            width: 450px;
        }
        .box {
            position: fixed;
            left: 300px;
            top: 7vh;
            width: 450px;
        }
        .sidebar.down {
            position: fixed;
            left: 270px;
            right: 0;
            bottom: 0;
            width: 70%;
            height : 30px;
            background: #51ffcf;
        }
        .sidebar.left {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 270px;
            height : 100%;
            background: #fff;
        }
        .tooltip {
            position: relative;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 4px;
            color: white;
            padding: 4px 8px;
            opacity: 0.7;
            white-space: nowrap;
        }
        .tooltip-measure {
            opacity: 1;
            font-weight: bold;
        }
        .tooltip-static {
            background-color: #ffcc33;
            color: black;
            border: 1px solid white;
        }
        .tooltip-measure:before,
        .tooltip-static:before {
            border-top: 6px solid rgba(0, 0, 0, 0.5);
            border-right: 6px solid transparent;
            border-left: 6px solid transparent;
            content: "";
            position: absolute;
            bottom: -6px;
            margin-left: -7px;
            left: 50%;
        }
        .tooltip-static:before {
            border-top-color: #ffcc33;
        }
        .hidden {
            display: none !important;
        }
        .mouse-select {
            background-color: #ccecff !important;
        }

         .slidecontainer {
             width: 100%;
         }

        .slider {
            -webkit-appearance: none;
            width: 100%;
            height: 25px;
            background: #d3d3d3;
            outline: none;
            opacity: 0.7;
            -webkit-transition: .2s;
            transition: opacity .2s;
        }

        .slider:hover {
            opacity: 1;
        }

        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 25px;
            height: 25px;
            background: #5b85af;
            cursor: pointer;
        }

        .slider::-moz-range-thumb {
            width: 25px;
            height: 25px;
            background: #1c41af;
            cursor: pointer;
        }

    </style>
</head>
<body onload="init()">
    <%--<header class="navbar navbar-dark bg-dark" style="height: 7vh;margin-bottom:0px">
        <div class="navbar-nav-scroll">
            <ul class="navbar-nav bd-navbar-nav flex-row">
                <li class="nav-item" style="padding-right: .5rem;padding-left: .5rem;">
                    <a class="nav-link active" href="<c:url value='/maplist/'/>">MAP</a>
                </li>
                <li class="nav-item" style="padding-right: .5rem;padding-left: .5rem;">
                    <a class="nav-link active" href="<c:url value='/data/'/>">DATA</a>
                </li>
            </ul>
        </div>
    </header>--%>
    <div class="wrapper" style="height: 100vh">
        <nav id="sidebar">
            <div class="sidebar-header text-center">
                <h3>LAYER</h3>
            </div>
            <button type="button" class="btn btn-primary btn-block" onclick="toggleDataGrid();">
                레이어 추가
            </button>
            <div id="grid" style="width:300px;"></div>
            <div id="div-layer" style="width:300px;"></div>
            <%--<ul class="list-unstyled CTAs">
                <li>
                    <a href="#" onclick="toggleDownload();" class="download">다운로드</a>
                </li>
                <li>
                    <a href="#" onclick="toggleMeasure();" class="download">면적</a>
                </li>
                <li>
                    <a href="#" onclick="toggleAddr();" class="download">주소</a>
                </li>
                <li>
                    <a href="#" onclick="toggleStyleText();" class="download">텍스트스타일</a>
                </li>
                <li>
                    <a href="#" onclick="toggleStyle();" class="download">스타일</a>
                </li>
            </ul>--%>
        </nav>
        <div class="map-container">
            <div id="map"></div>
        </div>
    </div>

    <div id="div-data-grid" class="card dataBox">
        <div class="card-header text-center">데이터 목록</div>
        <div class="card-body" style="overflow-y: auto;">
            <div id="dataGrid"></div>
        </div>
        <div class="card-footer text-center">
            <button type="button" class="btn btn-primary" onclick="addNewLayer()">레이어 추가</button>
            <button type="button" class="btn btn-secondary" onclick="$('#div-data-grid').hide(); return;">창 닫기</button>
        </div>
    </div>
    <div id="div-download" class="card downBox" style="display: none;">
        <div class="card-header text-center">다운로드</div>
        <div class="card-body">
            범위를 선택해주세요.
            <button type="button" class="btn btn-primary btn-block" onclick="draw.drawLayer('Polygon')">범위 선택</button>
        </div>
        <div class="card-footer text-center">
            <button type="button" class="btn btn-primary" onclick="download()">다운로드</button>
            <button type="button" class="btn btn-secondary" onclick="$('#div-download').hide(); return;">창 닫기</button>
        </div>
    </div>
    <div id="div-measure" class="card measureBox" style="display: none;">
        <div class="btn-group" role="group">
            <button type="button" class="btn btn-secondary" onclick="measure.measureLayer('Length')">길이</button>
            <button type="button" class="btn btn-secondary" onclick="measure.measureLayer('area')">면적</button>
            <button type="button" class="btn btn-secondary" onclick="measure.measureLayer('None'); $('#div-measure').hide();">닫기</button>
        </div>
    </div>
    <div id="div-addr" class="card addrBox" style="display: none;">
        <div class="card-body">
            <form>
                <div class="row">
                    <div class="col">
                        <label for="input-sido">시도</label><input type="text" class="form-control" id="input-sido">
                    </div>
                    <div class="col">
                        <label for="input-sigungu">시군구</label><input type="text" class="form-control" id="input-sigungu">
                    </div>
                    <div class="col">
                        <label for="input-adm">읍면동</label><input type="text" class="form-control" id="input-adm">
                    </div>
                </div>
            </form>
        </div>
        <div class="card-footer text-center">
            <button type="button" class="btn btn-primary" onclick="gotoAddrAdm(2403054)">광주 사직동으로 이동</button>
            <button type="button" class="btn btn-secondary" onclick="$('#div-addr').hide(); return;">창 닫기</button>
        </div>
    </div>
    <div id="div-style-text" class="card box" style="display: none;">
        <div class="card-body">
            <form>
                <div class="form-group">
                    <label for="input-style-text">스타일</label>
                    <textarea class="form-control" id="input-style-text" rows="20"></textarea>
                </div>
            </form>
        </div>
        <div class="card-footer text-center">
            <button type="button" class="btn btn-primary" onclick="setStyleText()">적용</button>
            <button type="button" class="btn btn-secondary" onclick="toggleStyleText();">창 닫기</button>
        </div>
    </div>
    <div id="div-style" class="card box" style="display: none;">
        <div class="card-body">
            <form>
                <div class="form-group">
                    <div>
                        <label for="input-line-size">선 크기</label><input type="text" class="form-control" id="input-line-size">
                    </div>
                    <div id="div-radius-size" >
                        <label for="input-radius-size">점 크기</label><input type="text" class="form-control" id="input-radius-size">
                    </div>
                    <section>
                        <label for="input-line-size">선 색상</label>
                        <button class="btn" id="a-line-color" style="height: 30px;width: 50px"></button>
                        <label for="input-line-size">면 색상</label>
                        <button class="btn" id="a-plane-color" style="height: 30px;width: 50px"></button>
                    </section>
                </div>
            </form>
        </div>
        <div class="card-footer text-center">
            <button type="button" class="btn btn-primary" onclick="olStyle.setStyle(currentLayer)">적용</button>
            <button type="button" class="btn btn-secondary" onclick="toggleStyle();">창 닫기</button>
        </div>
    </div>
    <div id="div-timeseries" class="card timeSeries">
        <label id="label-timeseries"></label>
        <input type="range" min="0" max="1" value="0" class="slider" id="input-timeseries" oninput="idInputTimeSeriesChangeEvent(this.value)" onchange="idInputTimeSeriesChangeEvent(this.value)">
    </div>

    <div id="div-data-info" class="card data-info" style="display: none">
    </div>

    <div id="div-legend" class="card legend" style="display: none">
        <img id="img-legend" src="" style="width: 100%;height: 100%"/>
    </div>
   <%-- <div class="sidebars">
        <div class="sidebar down">
            <button onclick="draw.drawLayer('Point')">Point</button>
            <button onclick="draw.drawLayer('LineString')">LineString</button>
            <button onclick="draw.drawLayer('Polygon')">Polygon</button>
            <button onclick="draw.drawLayer('None')">None</button>

            <label for="input-sido"></label><input id="input-sido" value="" readonly/>
            <label for="input-sigungu"></label><input id="input-sigungu" value="" readonly/>
            <label for="input-adm"></label><input id="input-adm" value="" readonly/>
            <button onclick="gotoAddrAdm(2403054)">광주 사직동으로 이동</button>

            <button onclick="getDrawLayer(mapSrid, '5181')">getDrawLayerToWKT</button>

        </div>
        <div class="sidebar left">
            <h2>레이어</h2>
            <div id="grid" style="width:270px;height: 50vh"></div>
        </div>
        <div class="sidebar dataBox">
            <div id="dataGrid" style="width:270px;"></div>
            <button onclick="addNewLayer()">추가</button>
        </div>
        <div class="sidebar downBox">

        </div>
    </div>--%>
</body>
<script>
    var serverMapHost = '${serverMapHost}';
    var serverMapCmmHost = '${serverMapCmmHost}';
    var serverFileHost = '${serverFileHost}';
    var mapSno = ${mapSno};
    var mapSrid = '3857';
    var addrSrid = '5181';
    var minResolution = 0;
    var maxResolution = 200;
</script>
<script type="text/javascript" src="<c:url value='/resources/js/lib/jquery/jquery-1.12.4.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/lib/jquery-sidebar/jquery.sidebar.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/lib/ol6/ol.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/lib/proj4/proj4.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/lib/tui.grid/tui-grid.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/lib/vanilla-picker/vanilla-picker.min.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/lib/xmlToJson/xmlToJson.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/HashMap.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/util.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/map/mapUtil.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/map/mapApi.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/file/fileApi.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/map/measure.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/map/draw.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/map/olStyle.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/map/olMap.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/cmm/cmmApi.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/view/map.js'/>"></script>
<%--<script src="resources/js/lib/geojson-vt/geojson-vt-dev.js"></script>--%>
</html>
