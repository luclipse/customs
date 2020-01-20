<%--
  Class Name : data.jsp
  Description : 데이터 관리 화면
  Modification Information

  author   : 정호경
  since    : 2019.12.05
--%>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>DATA</title>
    <link rel="stylesheet" href="<c:url value='/resources/js/lib/tui.grid/tui-grid.css'/>" type="text/css">
    <link rel="stylesheet" href="<c:url value='/resources/js/lib/bootstrap-4.4.1/css/bootstrap.css'/>" type="text/css">
    <link rel="stylesheet" href="<c:url value='/resources/js/lib/bootstrap-4.4.1/css/sidebar.css'/>" type="text/css">
</head>
<body onload="init()" class="bg-light">
    <div class="navbar navbar-dark bg-dark" style="margin-bottom: 0;justify-content: flex-start;">
        <a class="navbar-brand" href="#">LXPF</a>
        <ul class="navbar-nav bd-navbar-nav flex-row">
            <li class="nav-item" style="padding-right: .5rem;padding-left: .5rem;">
                <a class="nav-link active" href="<c:url value='/maplist/'/>">지도 목록</a>
            </li>
            <li class="nav-item" style="padding-right: .5rem;padding-left: .5rem;">
                <a class="nav-link active" href="<c:url value='/data/'/>">데이터</a>
            </li>
        </ul>
    </div>

    <div class="nav-scroller bg-white box-shadow" >
        <nav class="nav nav-underline">
            <a class="nav-link" href="#" onclick="divDatListShow()">현재 데이터 목록</a>
            <a class="nav-link" href="#" onclick="divTableListShow()">연결된 데이터</a>
        </nav>
    </div>
    <div class="container" id="div-dat-list">
        <div style="padding-top: 20px"></div>
        <div class="row">
            <div class="col-9">
                <h3>현재 데이터 목록</h3>
            </div>
            <div class="col-3">
                <button type="button" class="btn btn-primary" id="btn-dat-card" onclick="toggleDatGrid('show')">새로운 데이터</button>
                <button type="button" class="btn btn-primary" id="btn-upload-card" onclick="toggleUploadGrid()">파일 업로드</button>
            </div>
        </div>

        <%--<div class="card">
            <div class="card-body">
                <div id="dataGrid"></div>
            </div>
        </div>--%>
        <div class="my-3 p-3 bg-white rounded box-shadow">
            <table class="table table-hover" >
                <colgroup>
                    <col span="1" style="width: 10%;">
                    <col span="1" style="width: 5%;">
                    <col span="1" style="width: 30%;">
                    <col span="1" style="width: 30%;">
                    <col span="1" style="width: 15%;">
                    <col span="1" style="width: 10%;">
                </colgroup>
                <thead class="thead-dark">
                <tr>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col" class="text-center">이름</th>
                    <th scope="col" class="text-center">최종수정시간</th>
                    <th scope="col" class="text-center">데이터수</th>
                    <th scope="col"></th>
                </tr>
                </thead>
                <tbody id="table-data">

                </tbody>
            </table>

            <%--<button type="button" class="btn btn-primary" id="btn-dat-delete" onclick="deleteDat()">데이터 삭제</button>--%>
        </div>
        <br>
        <%--<div id="div-dat-grid" class="card" style="display: none">
            <form>
                <div class="card-body">
                    <label for="input-datNm">데이터명</label><input type="text" class="form-control" id="input-datNm" name="datNm"/>
                    <label for="input-datDesc">데이터설명</label><input type="text" class="form-control" id="input-datDesc" name="datDesc"/>
                    <label for="input-tblNm">테이블명</label><input type="text" class="form-control" id="input-tblNm" name="tblNm"/>
                </div>
                <div class="card-footer">
                    <button id="btn-saveDat" class="btn btn-primary"  onclick="saveDat({'datNm' : 'input-datNm', 'datDesc' : 'input-datDesc', 'tblNm' : 'input-tblNm'})">
                        데이터 입력
                    </button>
                </div>
            </form>
        </div>--%>
        <div id="div-upload-grid" class="card" style="display: none">
            <form method="post" action="" enctype="multipart/form-data" id="zipFileUploadForm">
                <div class="card-body">
                <ol>
                    <li>
                        <label>
                            <span>SRID : </span>
                            <input type="text" id="input-srid" name="srid"><br>
                        </label>
                    </li>
                    <li>
                        <label>
                            <span>업로드할 파일</span>
                            <input type="file" accept="application/zip" id="zipFile" name="zipFile"><br>
                        </label>
                    </li>
                </ol>
                </div>
                <div class="card-footer">
                    <button id="btn-zipFileUpload" class="btn btn-primary"  onclick="zipFileUpload(saveFileToDat, fileApiAlert, _saveDat)">
                        파일 업로드
                    </button>
                </div>
            </form>

        </div>
    </div>
    <div class="container" id="div-table-list" style="display: none">
        <div style="padding-top: 20px"></div>
        <form>
            <div class="form-group row">
                <div class="col-10">
                    <h3>연결된 데이터</h3>
                </div>
                <%--<label class="col-1" for="exampleFormControlSelect1">카테고리</label>--%>
                <div class="col-2">
                    <select class="form-control" id="sel-datasrc-list">
                        <%--<option value="DB-BASE" selected>데이터베이스</option>
                        <option value="GEO-WFS-1">지오서버 WMS</option>
                        <option value="GEO-WMS-1">지오서버 WFS</option>--%>
                    </select>
                </div>
            </div>
        </form>
        <div class="my-3 p-3 bg-white rounded box-shadow">
            <table class="table table-hover" >
                <colgroup>
                    <col span="1" width="10%" style="width: 10%;">
                    <%--<col span="1" style="width: 5%;">--%>
                    <col span="1" style="width: 30%;">
                    <col span="1" style="width: 30%;">
                    <col span="1" style="width: 15%;">
                    <col span="1" style="width: 10%;">
                </colgroup>
                <thead class="thead-dark">
                    <tr>
                        <th scope="col"></th>
                        <%--<th scope="col"></th>--%>
                        <th scope="col" class="text-center">이름</th>
                        <th scope="col" class="text-center">srid</th>
                        <th scope="col" class="text-center">종류</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody id="table-geo-colum">

                </tbody>
            </table>
        </div>
    </div>

    <div class="modal fade" id="div-dat-grid" tabindex="-1" role="dialog" aria-labelledby="modal-map-label" aria-hidden="true">
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
                            <label for="input-datNm">데이터명</label>
                            <input type="text" class="form-control" id="input-datNm" name="datNm" placeholder="데이터명" required/>
                        </div>
                        <div class="form-group">
                            <label for="input-datDesc">데이터설명</label>
                            <input type="text" class="form-control" id="input-datDesc" name="datDesc" placeholder="지도 설명"/>
                        </div>
                        <div class="form-group">
                            <label for="input-tblNm">테이블명</label>
                            <input type="text" class="form-control" id="input-tblNm" name="tblNm" placeholder="테이블명"/>
                        </div>
                        <div class="form-group" style="display:none;">
                            <label for="input-datDesc">srid</label>
                            <input type="hidden" class="form-control" id="input-datSrid" name="srid" placeholder="srid"/>
                        </div>
                        <div class="form-group" style="display:none;">
                            <label for="input-datDesc">srid</label>
                            <input type="hidden" class="form-control" id="input-datwgs84bbox" name="wgs84bbox" placeholder="bbox"/>
                        </div>
                        <div class="form-group" style="display:none;">
                            <label for="input-datDesc">srid</label>
                            <input type="hidden" class="form-control" id="input-datbbox" name="bbox" placeholder="bbox"/>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-secondary" onclick="toggleDatGrid('hide');">닫기</button>
                    <button id="btn-saveDat" class="btn btn-primary"  onclick="saveDat({'datNm' : 'input-datNm', 'datDesc' : 'input-datDesc', 'tblNm' : 'input-tblNm', 'srid' : 'input-datSrid', 'wgs84bbox' : 'input-datwgs84bbox', 'bbox' : 'input-datbbox'})">
                        데이터 입력
                    </button>
                </div>
            </div>
        </div>
    </div>
</body>
<script>
    var serverMapHost = '${serverMapHost}';
    var serverMapCmmHost = '${serverMapCmmHost}';
    var serverFileHost = '${serverFileHost}';
</script>
<script type="text/javascript" src="<c:url value='/resources/js/lib/jquery/jquery-1.12.4.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/lib/popper/popper.min.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/lib/jquery-sidebar/jquery.sidebar.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/lib/tui.grid/tui-grid.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/lib/bootstrap-4.4.1/js/bootstrap.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/lib/ol6/ol.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/lib/proj4/proj4.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/HashMap.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/util.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/cmm/cmmApi.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/map/mapApi.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/map/mapUtil.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/file/fileApi.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/lib/zip/zip.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/lib/zip/zip-ext.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/map/olMap.js'/>"></script>
<script type="text/javascript" src="<c:url value='/resources/js/view/data.js'/>"></script>
</html>
