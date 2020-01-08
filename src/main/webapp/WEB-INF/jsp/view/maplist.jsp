<%--
  Class Name : maplist.jsp
  Description : 맵 리스트 화면
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

</head>
<body onload="init()">
    <header class="navbar navbar-dark bg-dark" style="height: 7vh;margin-bottom:0px">
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
    </header>
    <div class="container">
        <div style="padding-top: 30px"></div>
        <div class="row">
            <div class="col-10">
                <h2>지도</h2>
            </div>
            <div class="col-2">
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal-map-input">
                    새로운 지도
                </button>
            </div>
        </div>
        <div style="padding-top: 30px"></div>
        <div class="row" id="div-map-list">
        </div>
    </div>
    <div class="modal fade" id="modal-map-input" tabindex="-1" role="dialog" aria-labelledby="modal-map-label" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modal-map-label">새로운 지도</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <input type="hidden" id="input-map-sno">
                        <div class="form-group">
                            <label for="input-map-name" class="col-form-label">지도명 : </label>
                            <input type="text" class="form-control" id="input-map-name" placeholder="지도명" required>
                        </div>
                        <div class="form-group">
                            <label for="input-map-desc" class="col-form-label">지도 설명 : </label>
                            <textarea class="form-control" id="input-map-desc" placeholder="지도 설명"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-secondary" onclick="closeInputModal();">닫기</button>
                    <button type="button" id="btn-input-save" class="btn btn-sm btn-primary" onclick="saveMap();">생성</button>
                </div>
            </div>
        </div>
    </div>
    <footer class="container">
    </footer>
</body>
<script>
    var serverMapHost = '${serverMapHost}';
    var serverMapCmmHost = '${serverMapCmmHost}';
    var serverFileHost = '${serverFileHost}';
    var baseUrl = '<c:url value='/'/>';
</script>
<script type="text/javascript" src="<c:url value='/resources/js/lib/jquery/jquery-1.12.4.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/lib/bootstrap-4.4.1/js/bootstrap.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/util.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/cmm/cmmApi.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/view/maplist.js'/>"></script>
<%--<script src="resources/js/lib/geojson-vt/geojson-vt-dev.js"></script>--%>
</html>
