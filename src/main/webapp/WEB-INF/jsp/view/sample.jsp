<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page isELIgnored="false"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <link rel="stylesheet" href="<c:url value='/resources/js/lib/ol6/ol.css'/>" type="text/css">
    <link rel="stylesheet" href="<c:url value='/resources/js/lib/bootstrap-4.4.1/css/bootstrap.css'/>" type="text/css">
    <link rel="stylesheet" href="<c:url value='/resources/js/lib/bootstrap-4.4.1/css/bootstrap-colorpicker.css'/>" type="text/css">
    <link rel="stylesheet" href="<c:url value='/resources/js/lib/bootstrap-4.4.1/css/bootstrap-slider.css'/>" type="text/css">

    <script type="text/javascript" src="<c:url value='/resources/js/lib/jquery/jquery-1.12.4.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/resources/js/lib/bootstrap-4.4.1/js/bootstrap.bundle.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/resources/js/lib/bootstrap-4.4.1/js/bootstrap-colorpicker.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/resources/js/lib/bootstrap-4.4.1/js/bootstrap-slider.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/resources/js/map/olStyle.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/resources/js/lib/ol6/ol.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/resources/js/lib/proj4/proj4.js'/>"></script>
    <script type="text/javascript" src="<c:url value='/resources/js/view/mainMap.js'/>"></script>


    <title>DATA</title>
</head>
<style type="text/css">
    .ol-zoom {
        right: 8px;
        left: auto;
    }
    .ol-costom-maincontrol {
        width: 24%;
    }

</style>
<script type="text/javascript">
    if (proj4 != undefined) {
        proj4.defs("EPSG:2096", "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43"); //Bassel East
        proj4.defs("EPSG:2097", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43"); //Bassel Middle
        proj4.defs("EPSG:2098", "+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43"); //Bassel West
        proj4.defs("EPSG:4004", "+proj=longlat +ellps=bessel +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43"); //Bassel 1841
        proj4.defs("EPSG:4019", "+proj=longlat +ellps=GRS80 +no_defs"); //GRS80
        proj4.defs("EPSG:5174", "+proj=+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs");
        proj4.defs("EPSG:5179", "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"); //UTM-K
        proj4.defs("EPSG:5185", "+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs"); //GRS80 West y:60000
        proj4.defs("EPSG:5186", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs"); //GRS80 Middle y:60000
        proj4.defs("EPSG:5187", "+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs"); //GRS80 East y:60000
        proj4.defs("EPSG:5188", "+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs"); //GRS80 EastSea y:60000
        proj4.defs("EPSG:5181", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs"); //GRS80 EastSea y:60000
        proj4.defs("EPSG:900918", "+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43"); //GRS80 EastSea y:60000
        proj4.defs("NGI60:MIDDLE", "+proj=tmerc +title=KOREA_CENTER_TM_3PARAM +lat_0=38.0 +lon_0=127.0028902777777777776 +x_0=200000.0 +y_0=600000.0 +k=1.0 +a=6377397.155 +b=6356078.9633422494 +towgs84=-146.43,507.89,681.46,0,0,0,0");
        ol.proj.proj4.register(proj4)
    } else {
        console.log("[Error] not define openlayers 'proj4' Object.");
    }
    ;

    var serverMapHost = '${serverMapHost}';
    var serverMapCmmHost = '${serverMapCmmHost}';
    var serverFileHost = '${serverFileHost}';
    var mapSrid = '3857';
    var addrSrid = '5181';
    var mMap;

    var src = {
        target : 'map',
        view : {
            zoom : 12,
            center : [14116813.367401998, 4548276.000215814],
            projection: 'EPSG:3857',
        }
    }

    $(document).ready(function(){
        $.ajax({
            url: serverMapCmmHost + "/tcfLay/getTcfLayList2",
            data : {mapSno : 1},
            success: function (res) {
                mMap = new LXMap(src, res, 'test');
                console.log(res);
            }
        });

    })

</script>
<body>
    <div id="map"/>
</body>

</html>
